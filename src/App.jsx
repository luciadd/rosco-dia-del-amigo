import { useState, useEffect, useRef } from "react";
import { ROSCO } from "./roscoData";
import LetterCircle from "./LetterCircle";

const TOTAL_TIME = 150; // seconds

function getInitialStatus() {
  return ROSCO.map((q) => ({
    letter: q.letter,
    state: "pending", // "correct", "wrong"
  }));
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState(getInitialStatus());
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [pending, setPending] = useState([]); // holds indexes of skipped questions
  const [round, setRound] = useState(1); // 1: initial, 2+: pending rounds
  const intervalRef = useRef();

  useEffect(() => {
    if (gameOver) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [gameOver]);

  function getCurrentIndex() {
    // In first round, use current as index into ROSCO
    // In subsequent rounds, use pending[current] as index into ROSCO
    if (round === 1) return current;
    return pending[current];
  }

  function handleGuess(e) {
    e.preventDefault();
    if (gameOver) return;
    const idx = getCurrentIndex();
    const correct =
      ROSCO[idx].answer.trim().toLowerCase() === guess.trim().toLowerCase();
    const newStatus = [...status];
    if (correct) {
      newStatus[idx].state = "correct";
      setStatus(newStatus);
    } else {
      newStatus[idx].state = "wrong";
      setStatus(newStatus);
      setGameOver(true);
      clearInterval(intervalRef.current);
      return;
    }
    setGuess("");
    goToNextLetter(idx, true);
  }

  function handlePasapalabra(e) {
    e.preventDefault();
    if (gameOver) return;
    const idx = getCurrentIndex();
    // Only add to pending if not already skipped and not already answered
    if (
      status[idx].state === "pending" &&
      !pending.includes(idx)
    ) {
      setPending([...pending, idx]);
    }
    setGuess("");
    goToNextLetter(idx, false);
  }

  function goToNextLetter(prevIdx, answered) {
    if (round === 1) {
      // Going through original ROSCO
      if (current < ROSCO.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        // At the end of round 1, start pending if any
        if (pending.length > 0) {
          setRound(2);
          setCurrent(0);
        } else {
          setGameOver(true);
          clearInterval(intervalRef.current);
        }
      }
    } else {
      // Going through pending
      if (current < pending.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        // Remove all answered or now marked as "correct"/"wrong"
        const newPending = pending.filter(
          (i) => status[i].state === "pending"
        );
        if (newPending.length > 0) {
          setPending(newPending);
          setCurrent(0);
          setRound((r) => r + 1);
        } else {
          setGameOver(true);
          clearInterval(intervalRef.current);
        }
      }
    }
  }

  function restart() {
    setCurrent(0);
    setGuess("");
    setStatus(getInitialStatus());
    setTimeLeft(TOTAL_TIME);
    setGameOver(false);
    setPending([]);
    setRound(1);
  }

  const idx = getCurrentIndex();
  const question = ROSCO[idx];

  return (
    <div className="app-container">
      <h1>El Rosco</h1>
      <LetterCircle status={status} current={idx} />
      <div className="timer">
        Tiempo restante: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </div>
      {!gameOver ? (
        <form onSubmit={handleGuess}>
          <div className="clue">
            <strong>{question.letter}</strong>: {question.clue}
          </div>
          <input
            autoFocus
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Tu respuesta"
            disabled={gameOver}
          />
          <button type="submit">Enviar</button>
          <button type="button" onClick={handlePasapalabra}>
            Pasapalabra
          </button>
        </form>
      ) : (
        <div className="gameover">
          {status.some((s) => s.state === "wrong") || timeLeft === 0 ? (
            <span>
              ¡Game Over! <button onClick={restart}>Reiniciar</button>
            </span>
          ) : (
            <span>
              ¡Felicidades! <button onClick={restart}>Jugar de nuevo</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
