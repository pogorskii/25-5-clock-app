import { useState, useRef } from "react";
import "./App.css";
import * as Icon from "react-bootstrap-icons";

function App() {
  const [breakState, setBreakState] = useState(5);
  const [sessionState, setSessionState] = useState(23);
  const [clockState, setClockState] = useState(
    `${sessionState.toString().padStart(2, "0")}:00`
  );
  const timerRef = useRef(sessionState * 60);
  const intervalRef = useRef(0);

  function handleBreakConfig(mod) {
    if (intervalRef.current) return;

    let newTime = 0;

    if (mod === "-") {
      if (breakState === 1) return;

      newTime = breakState - 1;
      setBreakState(newTime);
    } else {
      if (breakState === 60) return;

      newTime = breakState + 1;
      setBreakState(newTime);
    }

    if (document.getElementById("timer-label").textContent === "Break") {
      timerRef.current = newTime * 60;
      refreshClock();
    }
    return;
  }

  function handleSessionConfig(mod) {
    if (intervalRef.current) return;

    let newTime = 0;

    if (mod === "-") {
      if (sessionState === 1) return;

      newTime = sessionState - 1;
      setSessionState(sessionState - 1);
    } else {
      if (sessionState === 60) return;

      newTime = sessionState + 1;
      setSessionState(newTime);
    }

    if (document.getElementById("timer-label").textContent === "Session") {
      timerRef.current = newTime * 60;
      refreshClock();
    }
    return;
  }

  function setBreakDuration() {
    timerRef.current = breakState * 60;
    refreshClock();
  }

  function setSessionDuration() {
    timerRef.current = sessionState * 60;
    refreshClock();
  }

  function refreshClock() {
    setClockState(
      `${Math.floor(timerRef.current / 60)
        .toString()
        .padStart(2, "0")}:${(timerRef.current % 60)
        .toString()
        .padStart(2, "0")}`
    );
  }

  function timerSwitch() {
    const label = document.getElementById("timer-label");
    if (label.textContent === "Session") {
      label.textContent = "Break";
      setBreakDuration();
    } else {
      label.textContent = "Session";
      setSessionDuration();
    }
    refreshClock();
    startTimer();
  }

  function startTimer() {
    const intervalId = setInterval(() => {
      --timerRef.current;
      refreshClock();

      if (timerRef.current < 0) {
        document.getElementById("beep").play();
        clearInterval(intervalId);
        intervalRef.current = 0;
        timerSwitch();
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
    refreshClock();
    startTimer();
  }

  function handleResetClick() {
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;

    const intervalId = intervalRef.current;
    clearInterval(intervalId);
    document.getElementById("timer-label").textContent = "Session";
    intervalRef.current = 0;
    timerRef.current = 25 * 60;
    setBreakState(5);
    setSessionState(25);
    refreshClock();
  }

  return (
    <div className="App">
      <header>
        <h1 className="mt-5 mb-3 fw-bold">25 + 5 Clock</h1>
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
