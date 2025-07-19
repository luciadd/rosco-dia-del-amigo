import { useState, useRef, useEffect } from "react";

const TOTAL_TIME = 150;

export default function App() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning]);

  return (
    <div>
      <div style={{
        textAlign: "center",
        fontSize: "3rem",
        fontWeight: "bold",
        margin: "16px 0 14px 0",
        color: timeLeft <= 10 ? "#f44336" : "#222",
      }}>
        TIMER: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
      </div>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <button onClick={() => setTimerRunning(true)}>Start</button>
        <button onClick={() => setTimerRunning(false)}>Pause</button>
        <button onClick={() => setTimeLeft(TOTAL_TIME)}>Reset</button>
      </div>
    </div>
  );
}
