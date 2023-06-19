import React, {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import css from "./clock.module.scss";
import {animLoop, rotateDiv, round} from "../helper.ts";
import classNames from "classnames";

type Props = PropsWithChildren<{
  run?: boolean;
  theme: "neon" | "realistic";
  rainbow?: boolean;
}>;

export const Clock = (props: Props) => {
  const secRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const updateFirstTime = useRef(false);
  const secCounterRef = useRef<HTMLDivElement>(null);

  const runSecAnimate = useRef(false);
  const runSecItv = useRef<ReturnType<typeof setInterval>>();
  const updateMinHourItv = useRef<ReturnType<typeof setInterval>>();
  const updateSecCounterItv = useRef<ReturnType<typeof setInterval>>();

  const updateMinHour = () => {
    const currentTime = new Date();
    const sec = currentTime.getSeconds();
    const min = currentTime.getMinutes() + sec / 60;
    const hour = currentTime.getHours() + min / 60;
    if (minuteRef.current && hourRef.current) {
      if (currentTime.getSeconds() % 10 === 0 || !updateFirstTime.current)
        rotateDiv(minuteRef.current, 6 * min, 0);

      if (currentTime.getSeconds() % 100 === 0 || !updateFirstTime.current)
        rotateDiv(hourRef.current, (360 / 12) * hour, 0);
    }
  };

  const updateSecCounter = () => {
    const currentTime = new Date();
    if (secCounterRef.current) {
      const secMS =
        currentTime.getSeconds() + currentTime.getMilliseconds() / 1000;
      secCounterRef.current.innerText = round(secMS);
    }
  };

  const start = () => {
    updateMinHour();

    runSecAnimate.current = true;
    animLoop((frame, lastFrame) => {
      if (!runSecAnimate.current) return false;
      if (!secRef.current) return true;
      const currentTime = new Date();
      const currentSec =
        currentTime.getSeconds() + currentTime.getMilliseconds() / 1000;
      rotateDiv(secRef.current, currentSec * 6, 0);
      return true;
    });

    updateMinHourItv.current = setInterval(() => {
      updateMinHour();
    }, 5000);

    updateSecCounterItv.current = setInterval(() => {
      updateSecCounter();
    }, 100);
  };

  useEffect(() => {
    if (!props.run) return;

    console.log("start clock");
    start();
    return () => {
      console.log("Clean up clock");
      runSecAnimate.current = false;
      clearInterval(runSecItv.current);
      clearInterval(updateMinHourItv.current);
      clearInterval(updateSecCounterItv.current);
    };
  }, [props.run]);

  return (
    <div className={css.clockBox}>

      <div className={classNames(css.clock, props.theme === "neon" && css.neon)}>
        <div className={css.hourContainer} ref={hourRef}>
          <div className={classNames(css.hour, props.theme === "neon" && css.neon)}/>
        </div>
        <div className={css.minuteContainer} ref={minuteRef}>
          <div className={classNames(css.minute, props.theme === "neon" && css.neon)}/>
        </div>
        <div className={css.secContainer} ref={secRef}>
          <div className={classNames(css.sec, props.theme === "neon" && css.neon)}/>
          {/*<div className={css.counter}>
          <div className={css.text} ref={secCounterRef}>
            0
          </div>
        </div>*/}
        </div>
        <div className={classNames(css.centerDot, props.theme === "neon" && css.neon)}></div>
        <div data-neon={props.theme === "neon"} className={css.idc0}/>
        <div data-neon={props.theme === "neon"} className={css.idc3}/>
        <div data-neon={props.theme === "neon"} className={css.idc6}/>
        <div data-neon={props.theme === "neon"} className={css.idc9}/>
      </div>
      {props.rainbow && <div className={css.clockRainbowBorder}/>}
      {/*<div className={css.rainBowMask}/>*/}
    </div>

  );
};
