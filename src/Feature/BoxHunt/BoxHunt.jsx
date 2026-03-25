import { useEffect, useRef, useState } from "react";

/*
game states
    -idle
    -waiting
    -playing
    -pause
*/

export default function BoxHunt() {
  const [gameState, setGameState] = useState("idle");
  const [userTime, setUserTime] = useState("");
  const [scores, setScores] = useState([]);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const timerRef = useRef(0);
  const stopwatchRef = useRef(0);
  const MouseClickRef = useRef(1);

  //Start of the game
    const handleStart = () => 
    clearTimeout(timerRef.current);
    setGameState("waiting");
    if (!userTime) {
      alert("Enter box seconds");
      return;
    }
    spawnBox("new");
    setGameState("playing");
  };

  // intent here used to update or not upadte stopwatch time when user doesnt click the box
  const spawnBox = (intent) => {
    if (intent === "new") {
      stopwatchRef.current = Date.now();
    }
    let top = Math.random() * 80;
    let left = Math.random() * 80;
    setPos({ top, left });
    console.log(Number(userTime) * 1000);
    timerRef.current = setTimeout(
      () => spawnBox("old"),
      Number(userTime) * 1000,
    );
  };

  const handleClick = () => {
    const reaction = Date.now() - stopwatchRef.current;
    const clickCount = MouseClickRef.current;
    setScores((prev) => [...prev, { clickCount, reaction }]);
    MouseClickRef.current++;
    clearTimeout(timerRef.current);
    spawnBox("new");
  };

  const handlePause = () => {
    clearTimeout(timerRef.current);
    setGameState("idle");
  };

  const handleReset = () => {
    clearTimeout(timerRef.current);
    MouseClickRef.current = 1;
    setGameState("idle");
    setScores([]);
    setUserTime("");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* top Action pannel */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <p>Game State : {gameState}</p>
        <button onClick={handleStart}>Start</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleReset}>Reset</button>
        <div>
          <input
            type="text"
            placeholder="Enter time in seconds"
            value={userTime}
            onChange={(e) => setUserTime(e.target.value)}
          />
        </div>
      </div>

      {/* game pannel */}

      <div
        style={{
          border: "1px solid black",
          width: "80vw",
          height: "40vh",
          position: "relative",
        }}
      >
        {gameState === "playing" && (
          <button
            style={{
              position: "absolute",
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              width: 40,
              height: 40,
              background: "red",
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleClick}
          ></button>
        )}
      </div>

      {/* score pannel */}

      <div style={{ border: "1px solid black", width: "80vw" }}>
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "space-around",
            borderBottom: "1px solid black",
            padding: 6,
          }}
        >
          <div>Mouse Click Number</div>
          <div>Reaction Time</div>
        </div>

        {scores.map((score, index) => {
          const s = score.reaction / 1000;
          return (
            <div
              style={{
                display: "flex",
                gap: 20,
                justifyContent: "space-around",
                borderBottom:
                  index < scores.length - 1 ? "1px solid black" : "",
                padding: 6,
              }}
              key={index}
            >
              <div>{score.clickCount}</div>
              <div>{String(s).slice(0, 4)}s</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
