import React, { useState, useEffect } from 'react';
import Logo1T from '../icons/Logo1T.png';
import './Splash.css'; // CSS file for styling

const Splash = () => {
  const [text, setText] = useState('');
  const word = 'EfffiSync';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(prevText => {
        if (index < word.length) {
          return prevText + word[index];
        }
        clearInterval(interval); // Clear interval once all letters are displayed
        return prevText;
      });
      index++;
    }, 200); // Adjust the speed of typing here (milliseconds)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="welcome" style={{ background: '#512da8', overflow: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      <div className="splash" style={{ height: '0px', padding: '0px', border: '130em solid #039be5', position: 'fixed', left: '50%', top: '100%', display: 'block', boxSizing: 'initial', overflow: 'hidden', borderRadius: '50%', transform: 'translate(-50%, -50%)', animation: 'puff 0.5s 1.8s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards, borderRadius 0.2s 2.3s linear forwards' }}></div>
      <div id="welcome" style={{ background: '#311b92', width: '56px', height: '56px', position: 'absolute', left: '50%', top: '50%', overflow: 'hidden', opacity: '0', transform: 'translate(-50%, -50%)', borderRadius: '50%', animation: 'init 0.5s 0.2s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards, moveDown 1s 0.8s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards, moveUp 1s 1.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, materia 0.5s 2.7s cubic-bezier(0.86, 0, 0.07, 1) forwards, hide 2s 2.9s ease forwards' }}></div>
      <header style={{ opacity: '0', animation: 'moveIn 2s 3.1s ease forwards' }}>
        <div className="text">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={Logo1T} alt="Logo"  />
          </div>
        </div>
      </header>
    </div>
  );
}

export default Splash;
