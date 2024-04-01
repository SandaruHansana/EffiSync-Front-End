import React, { useState } from 'react';
import BP3 from '../icons/BP3.jpg';

function Premium() {
  const [subscribed, setSubscribed] = useState(false);

  const sectionStyle = {
    backgroundImage: `url(${BP3})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '50px', // Adjust the padding to decrease the space between sections
    display: 'flex',
    flexDirection: 'column', // Change the flex direction to column
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    marginBottom: '50px', // Add margin bottom to create space between sections
    overflowY: 'auto', // Make the section scrollable vertically
    maxHeight: '80vh', // Set a maximum height for the section
  };

  const handleClick = () => {
    if (subscribed) {
      const unsubscribeConfirmed = window.confirm('Are you sure you want to unsubscribe?');
      if (unsubscribeConfirmed) {
        setSubscribed(false);
      }
    } else {
      setSubscribed(true);
    }
  };

  return (
    <div style={sectionStyle} className="text-white min-h-screen">
      <h1 className="text-3xl mb-4">Premium Access</h1>
      <p className="text-lg mb-2 text-center">Our premium access is still under development. <br/> You can click the subscribe button to get notified as soon as premium access is available.</p>
      <button 
        className={`bg-${subscribed ? 'green' : 'blue'}-500 hover:bg-${subscribed ? 'green' : 'yellow'}-700 text-white font-bold py-2 px-4 rounded`}
        onClick={handleClick}
      >
        {subscribed ? 'Subscribed' : 'Subscribe Now'}
      </button>
    </div>
  );
}

export default Premium;
