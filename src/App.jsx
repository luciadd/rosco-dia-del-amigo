import { useState } from "react";
import { ROSCO } from "./roscoData";
import LetterCircle from "./LetterCircle";

function getInitialStatus() {
  return ROSCO.map((q) => ({
    letter: q.letter,
    state: "pending", // "correct", "wrong", "pending"
  }));
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState(getInitialStatus());
  const [pending, setPending] = useState([]);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  function getCurrentIndex() {
    return round === 1 ? current : pending[current];
  }

  function goToNextLetter() {
    if (round === 1) {
      if (current < ROSCO.length - 1) {
        setCurrent((c) => c + 1);
      } else if (pending.length > 0) {
        setRound(2);
        setCurrent(0);
      } else {
        setGameOver(true);
      }
    } else {
      if (current < pending.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        // Remove all letters that are no longer pending
        const stillPending = pending.filter(i => status[i].state === "pending");
        if (stillPending.length > 0) {
          setPending(stillPending);
          setCurrent(0);
          setRound(r => r + 1);
        } else {
          setGameOver(true);
        }
      }
    }
  }

  function handleCorrect() {
    const idx = getCurrentIndex();
    const newStatus = [...status];
    newStatus[idx].state = "correct";
    setStatus(newStatus);
    goToNextLetter();
  }

  function handleWrong() {
    const idx = getCurrentIndex();
    const newStatus = [...status];
    newStatus[idx].state = "wrong";
    setStatus(newStatus);
    goToNextLetter();
  }

  function handlePasapalabra() {
    const idx = getCurrentIndex();
    if (status[idx].state === "pending" && !pending.includes(idx)) {
      setPending([...pending, idx]);
    }
    goToNextLetter();
  }

  function restart() {
    setCurrent(0);
    setStatus(getInitialStatus());
    setPending([]);
    setRound(1);
    setGameOver(false);
  }

  const idx = getCurrentIndex();
  const question = ROSCO[idx];

  return (
    <div className="app-container">
      <h1>El Rosco</h1>
      <LetterCircle status={status} current={idx} />
      {!gameOver ? (
        <div>
          <div className="clue">
            <strong>{question.letter}</strong>: {question.clue}
          </div>
          {/* No answer input, only buttons */}
          <div className="host-buttons">
            <button onClick={handleCorrect} style={{background: "#4CAF50", color: "white"}}>Correcto</button>
            <button onClick={handleWrong} style={{background: "#f44336", color: "white"}}>Incorrecto</button>
            <button onClick={handlePasapalabra} style={{background: "#FFC107", color: "black"}}>Pasapalabra</button>
          </div>
        </div>
      ) : (
        <div className="gameover">
          <span>
            ¡Fin del juego! <button onClick={restart}>Reiniciar</button>
          </span>
        </div>
      )}
    </div>
  );
}
