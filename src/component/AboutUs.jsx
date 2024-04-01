import React, { useEffect, useState } from 'react';
import backgroundImage1 from '../icons/BP2.jpg';
import Ishini from '../icons/Ishini.jpg';
import Hesha from '../icons/Hesha.jpg';
import Senuri from '../icons/Senuri.jpg';
import Ashely from '../icons/Ashely.jpg';
import Sandaru from '../icons/Sandaru.jpg';

function AboutUs() {
  const teamMembers = [
    {
      name: 'Ishini Himaya',
      role: 'Team Leader',
      email: 'ishini.20222389@iit.ac.lk',
      image: Ishini
    },
    {
      name: 'Hesha Edmon',
      role: '',
      email: 'hesha.20220552@iit.ac.lk',
      image: Hesha
    },
    {
      name: 'Senuri Weerasooriya',
      role: '',
      email: 'senuri.20220269@iit.ac.lk',
      image: Senuri
    },
    {
      name: 'Ashely Perera',
      role: '',
      email: 'ashley.20221899@iit.ac.lk',
      image: Ashely
    },
    {
      name: 'Sandaru Hansana',
      role: '',
      email: 'sandaru.20211314@iit.ac.lk',
      image: Sandaru
    }
  ];

  const [backgroundImage, setBackgroundImage] = useState(backgroundImage1);

  useEffect(() => {
    const backgroundImages = [backgroundImage1];
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImage(backgroundImages[randomIndex]);
  }, []);

  return (
    <div
      id="container"
      style={{
        marginLeft:'100px',
        overflowY: 'auto',
        height: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div style={{ textAlign: 'center', backgroundColor: '#02041C', color: '#fff', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>About Us</h1>
      </div>

      <div style={{ textAlign: 'left', marginLeft:'200px', marginTop: '1rem' ,color:'rgb(204, 204, 255)', fontWeight:'bolder'}}>
        <h1 style={{ fontSize: '1.5rem' }}>Our Team</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'rem' }}>
        {teamMembers.map((member, index) => (
          <div key={index} style={{ maxWidth: '400px', margin: '0.5rem 0', display: 'flex', alignItems: 'center', backgroundColor: 'rgb(204, 230, 255,0.8)', padding: '20px', borderRadius: '40px' }}>
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #333' }}>
              <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="container" style={{ marginLeft: '1rem', textAlign: 'left', flex: 1, fontWeight: 'bold', color: 'black' }}>
              <p className="title" style={{ marginTop: '0.5rem' }}>{member.name}</p>
              <p style={{ marginBottom: '0.5rem' }}>{member.role}</p>
              <p style={{ marginBottom: '0.5rem' }}>{member.email}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-center items-center min-h-screen mt-0' style={{ marginTop: '-5rem', marginBottom: '0rem' , marginLeft:'-100px'}}>
        <div className='shadow-[0px_4px_28px_3px_rgba(1,1,1,1.00)] rounded-[43px] bg-#02041C flex flex-col md:flex-row' style={{ backgroundColor: '#02041C', justifyContent: 'center', marginTop: "300px", margin: '5rem', padding: '1rem', marginLeft: "400px" }}>
          <div className='w-[300px] h-[300px] md:w-[900px] md:h-[350px]'>
            <h4 className="text-sm md:text-lg text-center mt-4 md:mt-12 text-white" >
              Hello!! We are a group of Level 5 Undergraduates at Informatics Institute of Technology, a leading institution affiliated with the prestigious University of Westminster. Currently, we are engaged in an exciting Software Development Group Project as part of our academic curriculum. This project presents us with a valuable opportunity to apply the knowledge and skills we've acquired throughout our studies in a real-world setting. As a diverse team with varied backgrounds and interests, we're committed to collaborating effectively to deliver a high-quality software solution. We're enthusiastic about tackling challenges, exploring innovative approaches, and ultimately, making a meaningful impact through our project.
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
