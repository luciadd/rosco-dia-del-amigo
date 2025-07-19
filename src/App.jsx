import { useState, useRef, useEffect } from "react";
import { ROSCO } from "./roscoData";
import LetterCircle from "./LetterCircle";

const TOTAL_TIME = 150;

function getInitialStatus() {
  return ROSCO.map((q) => ({
    letter: q.letter,
    state: "pending",
  }));
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState(getInitialStatus());
  const [pending, setPending] = useState([]);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef();

  // TIMER EFFECT
  useEffect(() => {
    if (timerRunning && !gameOver) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setGameOver(true);
            setTimerRunning(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning, gameOver]);

  function getCurrentIndex() {
    return round === 1 ? current : pending[current];
  }

  function goToNextLetter(pauseTimer = false) {
    if (pauseTimer) setTimerRunning(false);

    if (round === 1) {
      if (current < ROSCO.length - 1) {
        setCurrent((c) => c + 1);
      } else if (pending.length > 0) {
        setRound(2);
        setCurrent(0);
      } else {
        setGameOver(true);
        setTimerRunning(false);
      }
    } else {
      if (current < pending.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        const stillPending = pending.filter(i => status[i].state === "pending");
        if (stillPending.length > 0) {
          setPending(stillPending);
          setCurrent(0);
          setRound(r => r + 1);
        } else {
          setGameOver(true);
          setTimerRunning(false);
        }
      }
    }
  }

  function handleCorrect() {
    const idx = getCurrentIndex();
    const newStatus = [...status];
    newStatus[idx].state = "correct";
    setStatus(newStatus);
    if (!gameOver) setTimerRunning(true); // Resume timer
    goToNextLetter(false);
  }

  function handleWrong() {
    const idx = getCurrentIndex();
    const newStatus = [...status];
    newStatus[idx].state = "wrong";
    setStatus(newStatus);
    goToNextLetter(true); // Pause timer
  }

  function handlePasapalabra() {
    const idx = getCurrentIndex();
    if (status[idx].state === "pending" && !pending.includes(idx)) {
      setPending([...pending, idx]);
    }
    goToNextLetter(true); // Pause timer
  }

  function restart() {
    setCurrent(0);
    setStatus(getInitialStatus());
    setPending([]);
    setRound(1);
    setGameOver(false);
    setTimeLeft(TOTAL_TIME);
    setTimerRunning(false);
  }

  function handleStart() {
    if (timeLeft === 0) setTimeLeft(TOTAL_TIME); // If timer is at 0, reset first
    setTimerRunning(true);
    if (gameOver) setGameOver(false);
  }

  const idx = getCurrentIndex();
  const question = ROSCO[idx] || { letter: '', clue: '' };

  return (
    <div className="app-container">
      <h1>El Rosco</h1>
      {/* TIMER always visible */}
      <div style={{
        textAlign: "center",
        fontSize: "2.7rem",
        fontWeight: "bold",
        margin: "16px 0 14px 0",
        color: timeLeft <= 10 ? "#f44336" : "#222"
      }}>
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
      </div>
      {/* START always visible */}
      <div style={{textAlign: "center", marginBottom: 10}}>
        <button
          onClick={handleStart}
          style={{
            fontSize: "2rem",
            padding: "16px 48px",
            borderRadius: 12,
            background: "#2196f3",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            boxShadow: "0 2px 18px #2196f366",
            cursor: "pointer"
          }}
        >
          Start
        </button>
        <button
          onClick={restart}
          style={{
            fontSize: "1.2rem",
            padding: "10px 24px",
            borderRadius: 8,
            marginLeft: 16,
            background: "#eee",
            color: "#333",
            border: "1.5px solid #aaa",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Reiniciar
        </button>
      </div>
      {/* GAME OVER */}
      {gameOver ? (
        <div className="gameover" style={{textAlign: "center", fontSize: "2rem", marginTop: 60}}>
          <span style={{color: "#e53935"}}>¡Fin del juego!</span>
        </div>
      ) : (
        <>
          <LetterCircle status={status} current={idx} />
          <div className="clue" style={{textAlign: "center", fontSize: "2rem", margin: "32px auto 12px auto", maxWidth: 650}}>
            <strong>{question.letter}</strong>: {question.clue}
          </div>
          <div className="host-buttons">
            <button onClick={handleCorrect}>Correcto</button>
            <button onClick={handleWrong}>Incorrecto</button>
            <button onClick={handlePasapalabra}>Pasapalabra</button>
          </div>
        </>
      )}
    </div>
  );
}
