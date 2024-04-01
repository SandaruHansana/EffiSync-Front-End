import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './Firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';


export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 

  const dbRef = collection(db, "Auth");

  useEffect(() => {
    // Retrieve 'isLoggedIn' state from localStorage when the component mounts
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (savedIsLoggedIn) {
      setIsLoggedIn(JSON.parse(savedIsLoggedIn));
    }
  }, []);

  const login = async (e) => {
    e.preventDefault();
    try {
      const q = query(dbRef, where("Name", "==", username), where("Password", "==", password));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
          window.alert("Invalid username or password");
          return;
      }

      window.alert("Login successful!");
      setIsLoggedIn(true); // Update login status
      // Update localStorage whenever 'isLoggedIn' state changes
      localStorage.setItem('isLoggedIn', JSON.stringify(true));
      // Redirect to home page
      navigate('/Home');
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  }

  const logout = () => {
    setIsLoggedIn(false); // Update login status
    localStorage.removeItem('isLoggedIn'); // Clear login status from localStorage
    // Redirect to home page
    navigate('/Home');
  };

  return (
    <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#02041C' }}> 
      <div className="shadow-[0px_4px_28px_3px_rgba(1,1,1,1.00)] rounded-[43px] bg-white flex flex-col md:flex-row">
        <div className="w-[300px] h-[300px] md:w-[400px] md:h-[500px]">
          <h2 className="text-2xl font-bold text-center mt-8 md:mt-24">Hello!</h2>
          <h4 className="text-sm md:text-lg text-center">Sign into your account!</h4>

          <div className="flex justify-center">
            <form className="max-w-sm mx-auto mt-5" onSubmit={login}>
              <div className="mb-5">
                <input type='text' id='name' style={{ width: '250px' }} className='bg-gray-400 border text-sm md:text-base rounded-lg block p-2.5 md:p-3 dark:placeholder-gray-500 dark:text-white' placeholder='Name' required onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="mb-5">
                <input type="password" id="password" style={{ width: '250px' }} className="bg-gray-400 border text-sm md:text-base rounded-lg block p-2.5 md:p-3 dark:placeholder-gray-500 dark:text-white" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="flex justify-center">
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm md:text-base px-5 py-2.5 md:py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">SignIn</button>
              </div>
              <p>Don't have an account?   <Link to='/SignUp' style={{ fontFamily: 'Bazooka' }}>  Sign Up</Link></p> 
            </form>
          </div>
          {isLoggedIn && (
            <button onClick={logout} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm md:text-base px-5 py-2.5 md:py-3 text-center mt-4" style={{ marginLeft: '145px' }} >Sign Out</button>
          )}
        </div>
      </div>
      <Sidebar isLoggedIn={isLoggedIn} /> {/* Pass isLoggedIn as a prop to Sidebar component */}
    </div>
  );
}
