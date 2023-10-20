import { useState, useRef } from "react";
import "./App.css";
import * as Icon from "react-bootstrap-icons";

function App() {
  const [breakState, setBreakState] = useState(5);
  const [sessionState, setSessionState] = useState(25);
  const [clockState, setClockState] = useState("25:00");
  const timerRef = useRef(25 * 60);
  const intervalRef = useRef(0);

  function handleBreakConfig(mod) {
    if (mod === "-") {
      if (breakState === 1) return;
      setBreakState(breakState - 1);
      return;
    }
    if (breakState === 60) return;
    setBreakState(breakState + 1);
    return;
  }

  function handleSessionConfig(mod) {
    if (mod === "-") {
      if (sessionState === 1) return;
      const newMinutes = sessionState - 1;
      setSessionState(newMinutes);
      timerRef.current = newMinutes * 60;
      return;
    }
    if (sessionState === 60) return;
    const newMinutes = sessionState + 1;
    setSessionState(newMinutes);
    timerRef.current = newMinutes * 60;
    return;
  }

  function handleBreakStart() {
    if (!intervalRef.current) {
      document.getElementById("timer-label").textContent = "Break";
      timerRef.current = breakState * 60;
      const timer = timerRef.current;
      setClockState(
        `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}`
      );
    }
    const intervalId = setInterval(() => {
      const timer = --timerRef.current;
      setClockState(
        `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}`
      );

      if (timer < 0) {
        document.getElementById("beep").play();
        clearInterval(intervalId);
        intervalRef.current = 0;
        timerRef.current = sessionState * 60;
        document.getElementById("timer-label").textContent = "Session";
        const timer = timerRef.current;
        setClockState(
          `${Math.floor(timer / 60)}:${(timer % 60)
            .toString()
            .padStart(2, "0")}`
        );
        handleStartStopClick();
      }
    }, 1000);
    intervalRef.current = intervalId;
  }

  function handleStartStopClick() {
    if (intervalRef.current) {
      const intervalId = intervalRef.current;
      clearInterval(intervalId);
      intervalRef.current = 0;
      return;
    }
    const intervalId = setInterval(() => {
      const timer = --timerRef.current;
      setClockState(
        `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}`
      );

      if (timer < 1495) {
        document.getElementById("beep").play();
        clearInterval(intervalId);
        intervalRef.current = 0;
        handleBreakStart();
      }
    }, 1000);
    intervalRef.current = intervalId;
  }

  function handleResetClick() {
    const intervalId = intervalRef.current;
    clearInterval(intervalId);
    document.getElementById("timer-label").textContent = "Session";
    intervalRef.current = 0;
    timerRef.current = 25 * 60;
    setBreakState(5);
    setSessionState(25);
    setClockState("25:00");
  }

  return (
    <div className="App">
      <header>
        <h1>25 + 5 Clock</h1>
      </header>
      <main>
        <section className="row" id="config">
          <div className="col-6" id="break">
            <h2 id="break-label">Break Length</h2>
            <button
              type="button"
              className="btn border border-secondary rounded-0 fw-bold"
              style={{ aspectRatio: 1 }}
              onClick={() => handleBreakConfig("-")}
              id="break-decrement"
            >
              <Icon.Dash color="black" size={24} />
            </button>
            <span
              className="d-inline-block fs-5"
              style={{ minWidth: 50 }}
              id="break-length"
            >
              {breakState}
            </span>
            <button
              type="button"
              className="btn border border-secondary rounded-0 fw-bold"
              style={{ aspectRatio: 1 }}
              onClick={() => handleBreakConfig("+")}
              id="break-increment"
            >
              <Icon.Plus color="black" size={24} />
            </button>
          </div>
          <div className="col-6" id="session">
            <h2 id="session-label">Session Length</h2>
            <button
              type="button"
              className="btn border border-secondary rounded-0 fw-bold"
              style={{ aspectRatio: 1 }}
              onClick={() => handleSessionConfig("-")}
              id="session-decrement"
            >
              <Icon.Dash color="black" size={24} />
            </button>
            <span
              className="d-inline-block fs-5"
              style={{ minWidth: 50 }}
              id="session-length"
            >
              {sessionState}
            </span>
            <button
              type="button"
              className="btn border border-secondary rounded-0 fw-bold"
              style={{ aspectRatio: 1 }}
              onClick={() => handleSessionConfig("+")}
              id="session-increment"
            >
              <Icon.Plus color="black" size={24} />
            </button>
          </div>
        </section>
        <section id="clock">
          <h2 id="timer-label">Session</h2>
          <span className="fs-1" id="time-left">
            {clockState}
          </span>
        </section>
        <section id="controls">
          <button
            type="button"
            className="btn fs-2"
            onClick={() => handleStartStopClick()}
            id="start_stop"
          >
            <Icon.Play color="black" size={48} />/
            <Icon.Pause color="black" size={48} />
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => handleResetClick()}
            id="reset"
          >
            <Icon.Repeat color="black" size={48} />
          </button>
        </section>
        <audio
          id="beep"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        ></audio>
      </main>
    </div>
  );
}

export default App;
