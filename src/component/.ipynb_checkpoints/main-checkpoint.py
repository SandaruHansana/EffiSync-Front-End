import cv2
import numpy as np
import pandas as pd
import mediapipe as mp
import time
import csv

# Load the pre-trained face and eyes cascade classifiers
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt.xml')
eyes_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye_tree_eyeglasses.xml')

# Load the object detection model
config_file = 'ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt'
frozen_model = 'frozen_inference_graph.pb'
model = cv2.dnn_DetectionModel(frozen_model, config_file)
class_labels = {}
file_name = 'labels.txt'
with open(file_name, 'rt') as fpt:
    for idx, label in enumerate(fpt.read().splitlines()):
        class_labels[idx] = label
model.setInputSize(320, 320)
model.setInputScale(1.0 / 127.5)
model.setInputMean((127.5, 127, 5, 127.5))
model.setInputSwapRB(True)


# Define the path for the Excel file
excel_file_path = 'data_sheet_checkpoint.xlsx'

# Load the existing Excel file if it exists, or create a new DataFrame
try:
    existing_data = pd.read_excel(excel_file_path)
except FileNotFoundError:
    existing_data = pd.DataFrame()

# Initialize the video capture
capture = cv2.VideoCapture(0)  # 0 represents the default camera

# Initialize counters
face_detected = False
eyes_detected = False
face_not_detected_count = 0
eyes_not_detected_count = 0
face_not_detected_over_10_count = 0
eyes_not_detected_over_100_count = 0
face_count = 0
phone_detected = False
phone_not_detected_count = 0
phone_not_detected_over_100_count = 0
total_phone_detected_count=0
phone_detected_count=0

# Create a DataFrame to store counts
df = pd.DataFrame(columns=['Face_Not_Detected_Count', 'Phone_Detected_Count','Look_away_count'])

# Initialize Mediapipe face mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils
drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)

# Variable to store the previous direction
prev_direction = None
# Initialize the total count variables
total_face_not_detected_count = 0
Phone_Detected_Count = 0
Look_away_count = 0
look_away_threshold = 10
iteration_counter = 0  # Initialize the iteration counter


while capture.isOpened():
    start = time.time()  # Initialize start time

    ret, frame = capture.read()

    if frame is None:
        print("--(!) No captured frame -- Break!")
        break

    # Apply the face and eyes cascade classifiers
    frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    frame_gray = cv2.equalizeHist(frame_gray)

    # Detect faces
    faces = face_cascade.detectMultiScale(frame_gray)

    # Initialize df_total_count outside the loop
    df_total_count = pd.DataFrame(columns=['Face_Not_Detected_Count', 'Phone_Detected_Count', 'Look_Away_Count'])


   # Inside the loop, only update the specific row
    if len(faces) == 0:
        face_detected = False
        face_not_detected_count += 1
        if face_not_detected_count >= 10:
            face_not_detected_over_10_count += 1
            face_not_detected_count = 0  # Reset the counter
            # Increment the total count of face not detected only when it reaches over 10
            total_face_not_detected_count += 1  
            print("Face Not Detected Count reached over 10!")
        # Append the new data to the DataFrame
        df.loc[len(df)] = {'Face_Not_Detected_Count': face_not_detected_over_10_count,
                           'Phone_Detected_Count': total_phone_detected_count,
                           'Look_Away_Count': Look_away_count}

        # Save the DataFrame to the CSV file
        df.to_csv('E:/2nd year/1st_semester/1_SUBJECTS/SDGP/2_Implementation_CW/All/data_sheet.csv', index=False)
    
        eyes_not_detected_count = 0  # Reset eyes counter when no face is detected
        cv2.putText(frame, f"No face detected ({face_not_detected_count} times)", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        if face_not_detected_count >= 10:
            df.loc[len(df)] = {'Face_Not_Detected_Count': 10, 'Eyes_Not_Detected_Count': 0}
            face_not_detected_count = 0
    else:
        if not face_detected:
            face_detected = True
            face_not_detected_count = 0  # Reset the counter
            face_count += 1
            #print("Face Detected")
            
        for (x, y, w, h) in faces:
            center = (x + w // 2, y + h // 2)
            cv2.ellipse(frame, center, (w // 2, h // 2), 0, 0, 360, (255, 0, 255), 4)
            face_roi = frame_gray[y:y + h, x:x + w]

            # In each face, detect eyes
            eyes = eyes_cascade.detectMultiScale(face_roi)
            if len(eyes) == 0:
                eyes_detected = False
                eyes_not_detected_count += 1
                if eyes_not_detected_count >= 100:
                    eyes_not_detected_over_100_count += 1
                    eyes_not_detected_count = 0  # Reset the counter
                    #print("Eyes Not Detected Count reached over 100!")
                cv2.putText(frame, f"No eyes detected ({eyes_not_detected_count} times)", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                if eyes_not_detected_count >= 100:
                    df.loc[len(df)] = {'Face_Not_Detected_Count': 10, 'Eyes_Not_Detected_Count': 0}
                    eyes_not_detected_count = 0
            else:
                if not eyes_detected:
                    eyes_detected = True
                    eyes_not_detected_count = 0  # Reset the counter
                face_not_detected_count = 0  # Reset face counter when eyes are detected
                for (ex, ey, ew, eh) in eyes:
                    eye_center = (x + ex + ew // 2, y + ey + eh // 2)
                    radius = round((ew + eh) * 0.25)
                    cv2.circle(frame, eye_center, radius, (255, 0, 0), 4)

    # Apply object detection
    ClassIndex, confidence, bbox = model.detect(frame, confThreshold=0.55)
    if len(ClassIndex) != 0:
        for ClassInd, conf, boxes in zip(ClassIndex.flatten(), confidence.flatten(), bbox):
            if ClassInd <= 80:
                label = class_labels.get(ClassInd - 1, 'Mobile phone')
                if label == 'Mobile phone':
                    phone_detected = True
                    phone_detected_count += 1  # Increment phone detected count
                    cv2.rectangle(frame, boxes, (255, 0, 0), 2)
                    cv2.putText(frame, label, (boxes[0] + 10, boxes[1] + 40), cv2.FONT_HERSHEY_SIMPLEX, fontScale=1, color=(0, 255, 0), thickness=2)
                    # Increment the phone count if phone detection confidence is above 0.55
                    if conf > 0.55:
                        print("Mobile phone detected!")
                        phone_detect = "Mobile phone detected"


                else:
                    phone_detected = False
                    phone_not_detected_count += 1
                    if phone_not_detected_count >= 100:
                        phone_not_detected_over_100_count += 1
                        phone_not_detected_count = 0  # Reset the counter
                        #print("Mobile phone Not Detected Count reached over 100!")
                    phone_detect = "Mobile phone not detected"
    else:
        phone_detected = False
        phone_not_detected_count += 1
        if phone_not_detected_count >= 100:
            phone_not_detected_over_100_count += 1
            phone_not_detected_count = 0  # Reset the counter
            #print("Mobile phone Not Detected Count reached over 100!")


    # Apply Mediapipe face mesh
    image = cv2.cvtColor(cv2.flip(frame, 1), cv2.COLOR_BGR2RGB)
    image.flags.writeable = False
    results = face_mesh.process(image)
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    # Initialize the variables for face mesh
    face_2d = []
    face_3d = []
    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            face_2d.clear()  # Clear the list for each face
            face_3d.clear()  # Clear the list for each face
            
            for idx, lm in enumerate(face_landmarks.landmark):
                if idx == 33 or idx == 263 or idx == 1 or idx == 61 or idx == 291 or idx == 199:
                    if idx == 1:
                        nose_2d = (lm.x * image.shape[1], lm.y * image.shape[0])
                        nose_3d = (lm.x * image.shape[1], lm.y * image.shape[0], lm.z * 3000)

                    x, y = int(lm.x * image.shape[1]), int(lm.y * image.shape[0])

                    face_2d.append([x, y])

                    face_3d.append([x, y, lm.z])

            face_2d = np.array(face_2d, dtype=np.float64)

            face_3d = np.array(face_3d, dtype=np.float64)

            focal_length = 1 * image.shape[1]

            cam_matrix = np.array([[focal_length, 0, image.shape[0] / 2],
                                   [0, focal_length, image.shape[1] / 2],
                                   [0, 0, 1]])

            dist_matrix = np.zeros((4, 1), dtype=np.float64)

            success, rot_vec, trans_vec = cv2.solvePnP(face_3d, face_2d, cam_matrix, dist_matrix)

            rmat, jac = cv2.Rodrigues(rot_vec)

            angles, mtxR, mtxQ, Qx, Qy, Qz = cv2.RQDecomp3x3(rmat)

            x = angles[0] * 360
            y = angles[1] * 360
            z = angles[2] * 360

            direction = None  # Variable to store the current direction

            if y < -10:
                direction = "looking Left"
                look_away_count += 1  # Increment count for looking left
            elif y > 10:
                direction = "looking Right"
                look_away_count += 1  # Increment count for looking right
            else:
                direction = "Forward"
                look_away_count = 0  # Reset count if looking forward

            # Check if look_away_count exceeds the threshold
            if look_away_count >= look_away_threshold:
                Look_away_count += 1
                print("Look away detected!")
            prev_direction = direction  # Update the previous direction

            nose_3d_projection, jacobian = cv2.projectPoints(nose_3d, rot_vec, trans_vec, cam_matrix, dist_matrix)

            p1 = (int(nose_2d[0]), int(nose_2d[1]))
            p2 = (int(nose_2d[0] + y * 10), int(nose_2d[1] - x * 10))

            cv2.line(image, p1, p2, (255, 0, 0), 3)

            cv2.putText(image, direction, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 2)
            cv2.putText(image, "x: " + str(np.round(x, 2)), (500, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255))
            cv2.putText(image, "y: " + str(np.round(y, 2)), (500, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255))
            cv2.putText(image, "z: " + str(np.round(z, 2)), (500, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255))

        end = time.time()
        totaltime = end - start

        mp_drawing.draw_landmarks(
            image=image,
            landmark_list=face_landmarks,
            connections=mp_face_mesh.FACEMESH_TESSELATION,
            landmark_drawing_spec=drawing_spec,
            connection_drawing_spec=drawing_spec
        )

    # Increment the total count variables in each iteration
    total_face_not_detected_count += face_not_detected_count
    total_phone_detected_count += phone_not_detected_count

    # cv2.namedWindow('Combined Module')l
    # cv2.namedWindow('Mobile Phone Detection')
    

    # Show the result
    cv2.imshow("Combined Module", image)

    # Show the result
    cv2.imshow("Mobile Phone Detection", frame)

    iteration_counter += 1  # Increment the iteration counter

    # Check if 100 iterations have been completed
    if iteration_counter % 100 == 0:
        # Ask the user if they want to continue after every 100 iterations
        run_again = input("Do you want to continue? (Enter '1' for Yes, '0' for No): ")
        if run_again != '1':
            break

    # Wait for a key event for 1 millisecond
    key = cv2.waitKey(1)

    # If the 'q' key is pressed, break from the loop
    if key == ord('q'):
        break

# Update the DataFrame with the latest counts
new_data = pd.DataFrame({'Face_Not_Detected_Count': [face_not_detected_over_10_count],
                            'Phone_Detected_Count': [total_phone_detected_count],
                            'Look_Away_Count': [Look_away_count]})



df_total_count.to_csv('data_sheet.csv', index=False)