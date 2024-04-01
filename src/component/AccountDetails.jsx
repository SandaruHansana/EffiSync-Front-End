import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './Firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Sidebar from './Sidebar'; // Import Sidebar component

export default function AccountDetails() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add isLoggedIn state

  useEffect(() => {
    // Retrieve 'isLoggedIn' state from localStorage when the component mounts
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (savedIsLoggedIn) {
      setIsLoggedIn(JSON.parse(savedIsLoggedIn));
    }
  }, []);

  const logout = () => {
    setIsLoggedIn(false); // Update login status
    localStorage.removeItem('isLoggedIn'); // Remove 'isLoggedIn' from localStorage
  };

  return (
    <div>
      <h2>Account Details</h2>
      {isLoggedIn ? (
        <div>
          <p>User is logged in</p>
          <button onClick={logout}>Sign Out</button>
        </div>
      ) : (
        <p>User is not logged in</p>
      )}
    </div>
  );
}
