import React from "react";
import "./styles.css"; // Ensure styles for the circle are included

export default function LetterCircle({ status, current }) {
  const N = status.length;
  const radius = 130; // Adjust for size

  return (
    <div className="rosco-circle" style={{ position: "relative", width: 2 * (radius + 30), height: 2 * (radius + 30) }}>
      {status.map((letterObj, i) => {
        const angle = (2 * Math.PI * i) / N - Math.PI / 2; // Start at top
        const x = Math.cos(angle) * radius + radius + 30;
        const y = Math.sin(angle) * radius + radius + 30;
        let className = "rosco-letter";
        if (i === current) className += " current";
        if (letterObj.state === "correct") className += " correct";
        if (letterObj.state === "wrong") className += " wrong";
        if (letterObj.state === "pending") className += " pending";
        return (
          <div
            key={letterObj.letter}
            className={className}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: 18,
              userSelect: "none",
              boxShadow: i === current ? "0 0 10px 2px #222" : undefined,
              border: "2px solid #222",
              transition: "background 0.2s, color 0.2s, box-shadow 0.2s"
            }}
          >
            {letterObj.letter.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}
