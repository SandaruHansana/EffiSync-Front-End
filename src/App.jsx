import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import SignIn from './component/SignIn';
import SignUp from './component/SignUp';
import Sidebar from './component/Sidebar';
import Home from './component/Home';
import Premium from './component/Premium';
import AboutUs from './component/AboutUs';
import Dashboard from './component/Dashboard';
import Splash from './component/Splash';
// import Progress from './component/Progress';
import AccountDetails from './component/AccountDetails';

function App() {
  // Initialize state with data retrieved from localStorage, if available
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a delay for the splash screen
    const splashTimeout = setTimeout(() => {
      setLoading(false);
    }, 7000); // 3000 milliseconds (3 seconds) delay

    // Clean up the timeout to prevent memory leaks
    return () => clearTimeout(splashTimeout);
  }, []);

  // Update localStorage whenever data changes (in this case, 'loading' state)
  useEffect(() => {
    localStorage.setItem('loading', JSON.stringify(loading));
  }, [loading]);

  // Retrieve 'loading' state from localStorage when the component mounts
  useEffect(() => {
    const savedLoading = localStorage.getItem('loading');
    if (savedLoading) {
      setLoading(JSON.parse(savedLoading));
    }
  }, []);

  return (
    <Router>
      <div className="App bg-indigo-600 w-full h-screen overflow-hidden">
        {loading ? (
          <Splash />
        ) : (
          <>
            <Sidebar />
            <Routes>
              <Route path="/" element={<Navigate to="/Home" />} />
              <Route exact path="/Home" element={<Home />} />
              <Route exact path="/Dashboard" element={<Dashboard />} />
              <Route exact path='/account' element={<SignIn />} />
              <Route exact path='/SignUp' element={<SignUp />} />
              <Route exact path='/premium' element={<Premium />} />
              <Route exact path='/aboutUs' element={<AboutUs />} />
              {/* <Route exact path='/Progress' element={<Progress />} /> */}
              <Route exact path='/AccountDetails' element={<AccountDetails />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
