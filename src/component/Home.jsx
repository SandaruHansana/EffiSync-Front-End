import React from 'react';
import BP from '../icons/pr1.jpg';
import student from '../icons/student.png'


function Home() {
  const pageStyle = {
    backgroundColor: '#02041C', // Set the background color to grey
    height: '100%', // Set the height of the page to fill the viewport
    overflowY: 'auto' // Make the page scrollable
  };

  const sectionStyle = {
    backgroundImage: `url(${BP})`,
    backgroundSize: 'cover', // Change 'cover' to 'contain' or other values as needed
    backgroundPosition: 'center',
    padding: '150px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '50px',
    overflowY: 'auto',
    maxHeight: '1500px',
    width: 'auto', // Set the width of the background image
  };

  const logoStyle = {
    width: '450px', // Adjust the width of the logo
    height: 'auto', // Maintain aspect ratio
    marginTop: '50px', // Adjust margin top to move the logo downwards
    marginRight: '10px'
  };

  const buttonStyle = {
    fontSize: '30px', // Adjust the font size of the button
    padding: '20px 40px', // Adjust the padding of the button
    display: 'flex', // Make the button a flex container
    alignItems: 'center', // Center the content vertically
    justifyContent: 'center' // Center the content horizontally
  };

  const studentContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px' // Add margin bottom to create space below the student photo
  };

  const containerStyle = {
    textAlign: 'center', // Center the content horizontally within the container
    marginBottom: '20px' // Add margin bottom to create space below the container
  };

  const textBoxStyle = {
    backgroundColor: 'rgb(224, 224, 209, 0.7)', // Set the background color with opacity
    padding: '20px', // Adjust padding as needed
    borderRadius: '5px', // Add border radius for rounded corners
    marginTop: '20px',
    width:'400px',
    marginLeft: '200px' // Adjust margin top to create space above the text box
  };

  return (
    <div style={pageStyle}>
      <section className="banner-area relative blog-home-banner d-flex align-items-center justify-content-center" id="home" style={sectionStyle}>
        <div className="overlay overlay-bg"></div>
        <div className="container">
          <div className="row d-flex align-items-center justify-content-center">
            <div className="about-content blog-header-content col-lg-12 text-center" style={textBoxStyle}>
              <h1 style={{ fontSize: '30px' }}>Insightful <br/> Productivity-Boosting <br/> Distraction-Aware </h1>
              <h2 className="text-uppercase text-white" style={{ fontSize: '18px',color:'black'}}>
                Elevate your Focus, Predict distractions <br/>  and boost productivity in your study sessions <br/>  with cutting-edge machine learning insights.
              </h2>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center" style={{ marginRight: '50px' }}> 
          {/* <img src={Logo1WT} alt="Logo" style={logoStyle} />  */}
        </div>
      </section>
      <div className="overlay overlay-bg"></div>
      <div className="container" style={containerStyle}>
        <div className="row d-flex align-items-center justify-content-center">
          <div className="about-content blog-header-content col-lg-12 text-center">
            <div> {/* Apply textBoxStyle here */}
              <h2 className="text-uppercase text-white " style={{ fontSize: '40px' , marginLeft:'250px'}}>
              Maximize Your Academic Success with EffiSync !!
              </h2>
              <h3 style={{color:'white' , marginLeft:'230px'}}>Boost Productivity: Stay focused and accomplish more in less time.<br></br>
                  Improve Time Management: Allocate time efficiently for studying, extracurricular activities, and personal life.<br></br>
                  Reduce Stress: Stay organized and on top of deadlines, leading to less stress and anxiety.<br></br>
                  Enhance Academic Performance: Achieve better grades by staying motivated and on track with academic goals.</h3>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center" style={{ marginRight: '-120px' }}> 
          <div style={studentContainerStyle}>
            <img src={student} alt="Student" style={logoStyle} /> 
          </div>
        </div>
      </div>
      <div><br/><br/></div>
    </div>
  );
}

export default Home;
