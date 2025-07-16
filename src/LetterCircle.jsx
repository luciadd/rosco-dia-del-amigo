import "./styles.css";

export default function LetterCircle({ status, current }) {
  return (
    <div className="letter-circle">
      {status.map(({ letter, state }, idx) => (
        <span
          key={letter}
          className={`circle ${state} ${current === idx ? "active" : ""}`}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
