import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import css from "./stop-watch-layer.module.scss";
import moment from "moment";
import classNames from "classnames";
// get diff time between two dates in mm:ss.ss format

type Props = {
  index: number;
  rank: number | null;
  startTime: Date;
  endTime?: Date | null;
  color: string;
  showTimer?: boolean;
  highlightedTimer?: boolean;
};

export type LapIndicatorHandler = {
  updateProgress: () => void;
};
export const LapIndicator = forwardRef<LapIndicatorHandler, Props>(
  (props, ref) => {
    const [hovering, setHovering] = useState(false);
    const counterRef = useRef<HTMLDivElement>(null);
    const popDurationRef = useRef<HTMLDivElement>(null);
    const startSec =
      props.startTime.getSeconds() + props.startTime.getMilliseconds() / 1000;

    const getDuration = () => {
      return (
        moment(
          moment(props.endTime ? props.endTime : new Date()).diff(
            props.startTime
          )
        ).format("mm:ss.SS") + ""
      );
    };

    const duration = useMemo(getDuration, [props.startTime, props.endTime]);

    // region sync counter element
    useEffect(() => {
      if (!props.showTimer) return;

      if (props.endTime) {
        if (!counterRef.current) return;
        counterRef.current.innerText = `(${props.index}) ${getDuration()}`;
        return;
      }

      const intervalId = setInterval(() => {
        if (!counterRef.current) return;
        counterRef.current.innerText = `(${props.index}) ${getDuration()}`;
      }, 50);

      return () => {
        clearInterval(intervalId);
      };
    }, [props.startTime, props.endTime, props.showTimer]);
    // endregion

    // region sync popover timer
    useEffect(() => {
      if (props.endTime) return;

      const intervalId = setInterval(() => {
        if (!popDurationRef.current) return;
        popDurationRef.current.innerText = `(${props.index}) ${getDuration()}`;
      }, 50);

      return () => {
        clearInterval(intervalId);
      };
    }, [props.startTime, props.endTime]);
    // endregion

    return (
      <div
        className={css.rotateBox}
        style={{
          transform: `rotate(${startSec * 6}deg)`,
        }}
      >
        <div className={css.container}>
          {
            <div
              className={classNames(
                css.popover,
                startSec > 15 && startSec < 45 && css.upsideDown
              )}
            >
              <div
                style={{
                  color: props.color,
                  textShadow: `0 0 2px ${props.color}`,
                }}
                ref={popDurationRef}
                className={css.popoverDuration}
              >
                {`(${props.index}) ${duration}`}
              </div>
              {
                <div
                  style={{
                    color: props.color,
                    textShadow: `0 0 2px ${props.color}`,
                  }}
                  className={css.popoverRank}
                >
                  Rank {typeof props.rank === "number" ? props.rank + 1 : "..."}
                </div>
              }
            </div>
          }
          <div
            // onMouseEnter={() => {
            //   setHovering(true);
            // }}
            // onMouseLeave={() => {
            //   setHovering(false);
            // }}
            className={css.hoverBox}
          >
            {/*<div
              style={{
                color: props.color,
                textShadow: `0 0 2px ${props.color}`,
              }}
              className={classNames(
                css.progress,
                props.highlightedTimer && css.highlight
              )}
              ref={counterRef}
            >
              {props.showTimer
                ? `(${props.index}) ${duration}`
                : `(${props.index})`}
            </div>*/}
            <div className={css.indicatorShadow}>
              <div
                style={{
                  background: props.color,
                  boxShadow: `0 0 2px ${props.color}`,
                }}
                className={css.indicator}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
