import React, { useState, useRef, useEffect } from "react";

const TOTAL_TIME = 150;

export default function App() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning]);

  return (
    <div>
      <div style={{ textAlign: "center", fontSize: "2.2rem", fontWeight: "bold", margin: "16px 0 10px 0" }}>
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
      </div>
      <div style={{textAlign: "center"}}>
        <button onClick={() => setTimerRunning(true)}>Start Timer</button>
        <button onClick={() => setTimerRunning(false)}>Pause Timer</button>
        <button onClick={() => setTimeLeft(TOTAL_TIME)}>Reset</button>
      </div>
    </div>
  );
}
