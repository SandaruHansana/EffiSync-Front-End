import React, { useState, useEffect } from 'react';

function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [countdownDate, setCountdownDate] = useState(null);
  const [expired, setExpired] = useState(false);
  const [countdownRunning, setCountdownRunning] = useState(false);
  const [showSummaryButton, setShowSummaryButton] = useState(false); // State to control the visibility of the summary button
  let interval;

  const timeOptions = [
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '60 minutes', value: 60 }
  ];

  const startCountdown = () => {
    // Fetch request and setting countdown date
    const now = new Date().getTime();
    const countdownTime = now + (hours * 3600 + minutes * 60 + seconds) * 1000;
    setCountdownDate(countdownTime);
    setCountdownRunning(true);
    setShowSummaryButton(false); // Hide the summary button when countdown starts
  };

  const stopCountdown = () => {
    // Fetch request and stopping countdown
    clearInterval(interval);
    setCountdownRunning(false);
    setShowSummaryButton(true); // Show the summary button when countdown stops
  };

  const handleSummaryClick = () => {
    console.log('Summary button clicked');
  };

  useEffect(() => {
    if (countdownDate !== null && countdownRunning) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        if (distance <= 0) {
          setExpired(true);
          clearInterval(interval);
          setCountdownRunning(false);
          setShowSummaryButton(true); // Show the summary button when countdown expires
        } else {
          const hoursRemaining = Math.floor(distance / (1000 * 60 * 60));
          const minutesRemaining = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const secondsRemaining = Math.floor((distance % (1000 * 60)) / 1000);
          setHours(hoursRemaining);
          setMinutes(minutesRemaining);
          setSeconds(secondsRemaining);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [countdownDate, countdownRunning]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#02041C' }}>
      <div style={{ boxShadow: '0px 4px 28px 3px rgba(1,1,1,1.00)', borderRadius: '43px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', minWidth: '300px', minHeight: '300px', width: '400px', height: '500px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', marginTop: '8px', marginBottom: '24px' }}>Session</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="form-group" style={{ marginTop: '70px' }}>
            <label htmlFor="minutes" style={{ marginBottom: '12px' }}>Minutes: </label>
            <select
              style={{ width: '50%', padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
              id="minutes"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value))}
            >
              {timeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          {countdownRunning ? (
            <button style={{ width: '50%', padding: '10px', fontSize: '1rem', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', marginTop: '30px' }} onClick={stopCountdown}>
              Stop Countdown
            </button>
          ) : (
            <button style={{ width: '50%', padding: '10px', fontSize: '1rem', borderRadius: '4px', backgroundColor: '#008CBA', color: 'white', border: 'none', cursor: 'pointer', marginTop: '30px' }} onClick={startCountdown}>
              Start Countdown
            </button>
          )}
          <div className="countdown mt-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {expired ? (
              <span style={{ fontSize: '4rem', fontWeight: 'bold', color: 'red' }}>EXPIRED</span>
            ) : (
              <>
                <span style={{ fontSize: '4rem', fontWeight: 'bold' }}>{hours.toString().padStart(2, '0')}</span> :
                <span style={{ fontSize: '4rem', fontWeight: 'bold' }}>{minutes.toString().padStart(2, '0')}</span> :
                <span style={{ fontSize: '4rem', fontWeight: 'bold' }}>{seconds.toString().padStart(2, '0')}</span>
              </>
            )}
          </div>
          {showSummaryButton && (
            <button
              type="submit"
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm md:text-base px-5 py-2.5 md:py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-blue-800"
              onClick={handleSummaryClick}
            >
              Summary
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
