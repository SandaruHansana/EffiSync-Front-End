import cv2
import numpy as np
import pandas as pd
import mediapipe as mp
import time
import csv
from flask import Flask
from flask_socketio import SocketIO
from flask import request
from flask import jsonify

# Inintialize Flask app
app = Flask(__name__)
socketio = SocketIO(app)

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

# Initialize the video capture
capture = cv2.VideoCapture(0)  # 0 represents the default camera

# Initialize Mediapipe face mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils
drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)

# Initialize counters and other variables
# (These variables will be shared among different functions)
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
total_phone_detected_count = 0
phone_detected_count = 0
Look_away_count = 0
look_away_threshold = 10
total_face_not_detected_count = 0  

# Create a DataFrame to store counts
df = pd.DataFrame(columns=['Face_Not_Detected_Count', 'Phone_Detected_Count', 'Look_away_count'])

@app.route('/',methods=['GET'])
def print_statement():
    name="Hello world"
    return name

# Main function to start detection
@app.route('/process_image',methods=['GET'])
def start_detection():
    global capture
    output=" " # Initialize an empty string to accumulate the output
    while capture.isOpened():
        start = time.time()  # Initialize start time
        ret, frame = capture.read()
        if frame is None:
            print("--(!) No captured frame -- Break!")
            break
        output += detect_and_send_output(frame)
        #if stop_detection():  # Check if it's time to stop detection
            #print("step 1")
            #break
    return output # Return the accumulated output

# Function to detect and send output
def detect_and_send_output(frame):
    global face_detected, eyes_detected, face_not_detected_count, eyes_not_detected_count
    global face_not_detected_over_10_count, eyes_not_detected_over_100_count, face_count
    global phone_detected, phone_not_detected_count, phone_not_detected_over_100_count, total_phone_detected_count
    global phone_detected_count, Look_away_count, iteration_counter, total_face_not_detected_count

    output = "" # Initialize an empty string to accumulate the output

    # Put your detection logic here
    # Apply the face and eyes cascade classifiers
    frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    frame_gray = cv2.equalizeHist(frame_gray)

    # Detect faces
    faces = face_cascade.detectMultiScale(frame_gray)

    # Inside the loop, only update the specific row
    if len(faces) == 0:
        face_detected = False
        face_not_detected_count += 1
        if face_not_detected_count >= 10:
            output += "Face Not Detected Count reached over 10!\n"
            face_not_detected_over_10_count += 1
            face_not_detected_count = 0  # Reset the counter
            # Increment the total count of face not detected only when it reaches over 10
            total_face_not_detected_count += 1  
            print("Face Not Detected Count reached over 10!")

        eyes_not_detected_count = 0  # Reset eyes counter when no face is detected
        cv2.putText(frame,f"No face detected ({face_not_detected_count}times)",(10,30),cv2.FONT_HERSHEY_SIMPLEX, 1,(0,0,255),2)
    else:
        if not face_detected:
            face_detected = True
            face_not_detected_count = 0  # Reset the counter
            face_count += 1

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
            else:
                if not eyes_detected:
                    eyes_detected = True
                    eyes_not_detected_count = 0  # Reset the counter
                face_not_detected_count = 0  # Reset face counter when eyes are detected

    # Apply object detection
    ClassIndex, confidence, bbox = model.detect(frame, confThreshold=0.55)
    if len(ClassIndex) != 0:
        for ClassInd, conf, boxes in zip(ClassIndex.flatten(), confidence.flatten(), bbox):
            if ClassInd <= 80:
                label = class_labels.get(ClassInd - 1, 'Mobile phone')
                if label == 'Mobile phone':
                    phone_detected = True
                    phone_detected_count += 1  # Increment phone detected count
                    cv2.rectangle(frame,boxes,(255,0,0),2)
                    cv2.putText(frame,label, (boxes[0]+10,boxes[1]+40),cv2.FONT_HERSHEY_SIMPLEX, fontScale=1, color=(0,255,0), thickness=2)
                    # Increment the phone count if phone detection confidence is above 0.55
                    if conf > 0.55:
                        output += "Mobile phone detected!\n"
                        print("Mobile phone detected!")

                else:
                    phone_detected = False
                    phone_not_detected_count += 1
                    if phone_not_detected_count >= 100:
                        phone_not_detected_over_100_count += 1
                        phone_not_detected_count = 0  # Reset the counter
                        #print("Mobile phone Not Detected Count reached over 100!")

    else:
        phone_detected = False
        phone_not_detected_count += 1
        if phone_not_detected_count >= 100:
            phone_not_detected_over_100_count += 1
            phone_not_detected_count = 0  # Reset the counter

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
                Look_away_count += 1  # Increment count for looking left
            elif y > 10:
                direction = "looking Right"
                Look_away_count += 1  # Increment count for looking right
            else:
                direction = "Forward"
                Look_away_count = 0  # Reset count if looking forward

            # Check if look_away_count exceeds the threshold
            if Look_away_count >= look_away_threshold:
                output += "Look away detected! \n"
                print("Look away detected!")
                Look_away_count += 1
            prev_direction = direction  # Update the previous direction

            nose_3d_projection, jacobian = cv2.projectPoints(nose_3d, rot_vec, trans_vec, cam_matrix, dist_matrix)

            p1 = (int(nose_2d[0]), int(nose_2d[1]))
            p2 = (int(nose_2d[0] + y * 10), int(nose_2d[1] - x * 10))

            cv2.line(image, p1, p2, (255, 0, 0), 3)

            cv2.putText(image, direction, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 2)
            cv2.putText(image, "x: " + str(np.round(x, 2)), (500, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255))
            cv2.putText(image, "y: " + str(np.round(y, 2)), (500, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255))
            cv2.putText(image, "z: " + str(np.round(z, 2)), (500, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255))

    # Send the required outputs to the server
    # You can use Flask-SocketIO to emit events to the server
    socketio.emit('detection_output', {
    'face_not_detected_count': face_not_detected_count,
    'eyes_detected': eyes_detected,
    'phone_detected': phone_detected,
    'look_away_detected': Look_away_count >= look_away_threshold
})


    # Display the processed frame
    cv2.imshow("Processed Frame1", image)

    cv2.imshow("Process Frame2",frame)
    cv2.waitKey(1)  # Wait for a key event

    return output # Return the accumulated

@app.route('/stop_detection', methods=['GET', 'POST'])
def stop_detection():
    capture.release()
    cv2.destroyAllWindows()
    return "Detection stopped"

# Define the route for starting detection
@app.route('/start_detection', methods=['POST'])
def start_detection_route():
    start_detection()
    return "Detection stopped."

if __name__ == "__main__":
    app.run(debug=True)
