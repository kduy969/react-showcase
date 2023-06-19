import React, { PropsWithChildren } from "react";
import css from './timer-control.module.css';
import classNames from "classnames";

type Props = PropsWithChildren<{
  state: "playing" | "stopped";
  onStateChanged: (state: "playing" | "stopped") => void;
  onLapPressed: () => void;
  startTime?: Date;
  endTime?: Date | null;
}>;

export function TimerControl(props: Props) {
  return (
    <div
      className={
        classNames(css.container,  "flex flex-row items-center bg-transparent rounded-2xl self-start mt-12 relative overflow-visible")
      }
    >
      <div
        data-content={'PLAY'}
        className={`px-5 py-4 text-2xl ${
          props.state === "stopped"
            ? "opacity-100 cursor-pointer pointer-events-auto"
            : "opacity-30 pointer-events-none"
        } text-white font-black ${css.text}`}
        onClick={() => {
          props.onStateChanged("playing");
        }}
      >
        START
      </div>
      <div
        data-content={'LAP'}
        className={`px-5 py-4 text-2xl font-black ${
          props.state === "playing"
            ? `opacity-100 cursor-pointer pointer-events-auto`
            : `opacity-30 pointer-events-none`
        } ${css.text}`}
        onClick={props.onLapPressed}
      >
        LAP
      </div>
      <div
        data-content={'STOP'}
        className={`px-5 py-4 text-2xl font-black ${
          props.state === "playing"
            ? `opacity-100 cursor-pointer pointer-events-auto hover:text-shadow-lg`
            : `opacity-30 pointer-events-none`
        } ${css.text}`}
        onClick={() => {
          props.onStateChanged("stopped");
        }}
      >
        STOP
      </div>
      {props.state === "playing" && <div className={css.border}/>}

    </div>
  );
}
