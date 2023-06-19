import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import css from "./clock-animation.module.scss";
import { TimerControl } from "./timer-control";
import { StopWatchLayer, StopWatchLayerHandler } from "./stop-watch-layer";
import { Clock } from "./clock";
import Results from "./results";
import { getRanks, LapColors } from "./helper.ts";
import { useCreateAtom } from "../../../../lib/atom/hooks/useCreateAtom.ts";
import anime from "animejs/lib/anime.es.js";
import { useMouseMove } from "./useMouseMove.ts";

type Props = PropsWithChildren<any>;

export function ClockAnimation(props: Props) {
  const currentTime = new Date();
  currentTime.setSeconds(0, 0);
  const [timerState, setTimerState] =
    useState<React.ComponentProps<typeof TimerControl>["state"]>("stopped");
  const clockBoxRef = useRef<HTMLDivElement>(null);
  const [swLapStartTimes, setSwLapStartTimes] = useState<Array<Date>>([]);
  const [swEndTime, setSwEndTime] = useState<Date | null>(null);

  const laps = useMemo(() => {
    return swLapStartTimes.map((lap, i) => ({
      endTime:
        i === swLapStartTimes.length - 1 ? swEndTime : swLapStartTimes[i + 1],
      startTime: lap,
    }));
  }, [swLapStartTimes, swEndTime]);

  // region sync rank
  const ranksAtom = useCreateAtom(getRanks(laps));
  useEffect(() => {
    if (swLapStartTimes.length === 0 || !!swEndTime) return;
    const intervalId = setInterval(() => {
      const ranks = ranksAtom?.get();
      const newRanks = getRanks(laps);
      if (!newRanks.every((newRank, i) => newRank === ranks[i])) {
        console.log("set new ranks", ranks, newRanks);
        ranksAtom?.set(newRanks);
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, [laps]);
  // endregion

  // region animate clock on mouse move
  useMouseMove(
    clockBoxRef,
    {
      onMouseMoveCB: ({ deltaX, deltaY, element }) => {
        const MaxAngle = 15; // the maximum angle the clock can rotate to
        const x = deltaX / (element.offsetWidth / 2);
        const y = -deltaY / (element.offsetHeight / 2);
        const newX = y * MaxAngle;
        const newY = x * MaxAngle;
        const newZ = 50;
        anime({
          targets: element,
          rotateX: newX,
          rotateY: newY,
          translateZ: newZ,
          duration: 300,
        });
      },
      onMouseLeaveCB: (element) => {
        anime({
          targets: element,
          rotateX: 0,
          rotateY: 0,
          translateZ: 0,
          duration: 1500,
        });
      },
    },
    []
  );
  // endregion

  return (
    <div
      className={
        "flex w-full h-full flex-col flex-1 max-[849px]:overflow-y-auto min-[900px]:overflow-y-hidden overflow-x-hidden"
      }
    >
      <div className={`page-title self-center flex-none mt-4 ${css.title}`}>
        S<span className={"animate-pulse"}>T</span>OPWATCH
      </div>
      <div className={"page-body flex-none"}>
        <div
          className={
            "flex flex-col items-center min-[900px]:flex-row min-[900px]:flex-wrap min-[900px]:items-start min-[900px]:justify-center mt-4"
          }
        >
          <div
            className={`${
              swLapStartTimes.length > 0
                ? "min-[900px]:translate-x-[-160px]"
                : "translate-x-0"
            } transition-transform flex flex-col items-center justify-center z-10`}
          >
            <div className={css.clock3DBox}>
              <div ref={clockBoxRef} className={css.clockBox}>
                <Clock
                  rainbow={timerState === "playing"}
                  theme={"neon"}
                  run={true}
                />
                {swLapStartTimes.length > 0 && (
                  <StopWatchLayer
                    ranksAtom={ranksAtom}
                    lapStartTimes={swLapStartTimes}
                    endTime={swEndTime}
                  />
                )}
              </div>
            </div>
            <TimerControl
              state={timerState}
              onStateChanged={(state) => {
                setTimerState(state);
                switch (state) {
                  case "playing":
                    if (timerState === "stopped") {
                      setSwLapStartTimes([new Date()]);
                      setSwEndTime(null);
                    } else setSwLapStartTimes([...swLapStartTimes, new Date()]);
                    break;
                  case "stopped":
                    setSwEndTime(new Date());
                    break;
                }
              }}
              onLapPressed={() => {
                setSwLapStartTimes([...swLapStartTimes, new Date()]);
              }}
            />
          </div>
          <Results
            ranksAtom={ranksAtom}
            results={
              swLapStartTimes
                .map((lapStartTime, index) => {
                  const endTime =
                    index === swLapStartTimes.length - 1
                      ? swEndTime
                      : swLapStartTimes[index + 1];

                  return {
                    startTime: lapStartTime,
                    endTime,
                    color: LapColors[index],
                    rank: 1,
                  };
                })
                .filter((result) => result !== null) as Array<any>
            }
          />
        </div>
      </div>
    </div>
  );
}
