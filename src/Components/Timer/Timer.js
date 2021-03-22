import React from "react";
import { fromEvent } from "rxjs";
import { map, buffer, debounceTime, filter } from "rxjs/operators";

export const Timer = () => {
  const [time, setTime] = React.useState(0);
  const [timerOn, setTimerOn] = React.useState(false);
  const doubleClickButton = React.useRef(null);

  React.useEffect(() => {
    let interval = null;
    const click = fromEvent(doubleClickButton.current, "click");

    if (timerOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!timerOn) {
      clearInterval(interval);
    }

    const doubleClick = click.pipe(
      buffer(click.pipe(debounceTime(300))),
      map((clicks) => clicks.length),
      filter((clicksLength) => clicksLength >= 2)
    );
    doubleClick.subscribe((_) => {
      setTimerOn(false);
    });

    return () => clearInterval(interval) && click.unsubscribe();
  }, [timerOn]);

  const stop = () => {
    setTime(0);
    setTimerOn(false);
  };

  return (
    <div className="timers">
      <div className="timers__container">
        <div className="time">
          <span>{("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:</span>
          <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
          <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
        </div>
        <div className="timers__buttons">
          {timerOn ? (
            <div className="btn" onClick={() => stop()}>
              Stop
            </div>
          ) : (
            <div className="btn" onClick={() => setTimerOn(true)}>
              Start
            </div>
          )}
          <div className="btn" onClick={() => setTime(0)}>
            Reset
          </div>
          <div className="btn" ref={doubleClickButton}>
            Wait
          </div>
        </div>
      </div>
    </div>
  );
};
