import React, { useState } from "react";
import { ROSCO } from "./roscoData";
// ...other imports

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]); // For answered letters
  // ...other state

  // Get the list of questions in current round
  const currentRosco = pending.length > 0 ? pending : ROSCO;

  function handlePasapalabra() {
    // If we're in a second round, move to next pending
    if (pending.length > 0) {
      setPending((prev) => [...prev.slice(1), prev[0]]);
    } else {
      // First round: add to pending, move to next
      setPending((prev) => [...prev, currentIndex]);
      goToNext();
    }
  }

  function goToNext() {
    // If at end of round, start pending round
    if (currentIndex + 1 >= ROSCO.length) {
      if (pending.length > 0) {
        setCurrentIndex(pending[0]);
        setPending((prev) => prev.slice(1));
      } else {
        // Game over
      }
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  // When a letter is answered correctly or incorrectly
  function handleAnswer(isCorrect) {
    setCompleted((prev) => [...prev, currentIndex]);
    goToNext();
  }

  // Render current question
  const question = ROSCO[currentIndex];

  return (
    <div>
      <h1>{question.letter}</h1>
      <p>{question.question}</p>
      {/* ...answer input/buttons */}
      <button onClick={handlePasapalabra}>Pasapalabra</button>
    </div>
  );
}
