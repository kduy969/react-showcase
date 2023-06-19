import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { ProgressCircle, ProgressCircleHandler } from "../progress-circle";
import css from "./stop-watch-layer.module.scss";
import useWindowFocus from "../../../../../hooks/useWindowFocusChange.tsx";
import { LapIndicator } from "./lap-indicator.tsx";
import { getRanks, LapColors } from "../helper.ts";
import { Atom } from "../../../../../lib/atom/core/atom.ts";
import { useAtom } from "../../../../../lib/atom/hooks/useAtom.ts";

export type StopWatchLayerHandler = {
  start: (startTime: Date) => void;
};

// uncontrolled component via ref
export const StopWatchLayer = forwardRef<
  StopWatchLayerHandler,
  {
    lapStartTimes: Array<Date>;
    endTime?: Date | null;
    ranksAtom: Atom<number[]>;
  }
>(({ lapStartTimes = [], endTime, ranksAtom }, ref) => {
  const secProgressRef = useRef<ProgressCircleHandler>(null);

  const calculateProgress = (startTime: Date) => {
    const currentTime = new Date();

    const progressMS = currentTime.getTime() - startTime.getTime();
    const secProgress = progressMS % 60000;
    const minProgress = (progressMS - secProgress) / 60000;

    return {
      secProgress,
      minProgress,
      progressMS,
    };
  };

  /**
   * Animates the sec progressbar based on the start time.
   *
   * @param {Date} startTime - the start time of the progress bar animation.
   */
  const syncSecAnimation = (startTime: Date) => {
    // start animating sec progressbar
    const { secProgress, minProgress, progressMS } =
      calculateProgress(startTime);
    secProgressRef.current?.autoRun(60000, (secProgress / 60000) * 100);
  };

  const lastLapTime = lapStartTimes[lapStartTimes.length - 1];
  const runningLap = endTime ? null : lastLapTime;

  // region sync sec progress animation
  useEffect(() => {
    console.log("syncSecEffect", runningLap);
    if (!runningLap) return;
    syncSecAnimation(runningLap);
    return () => {
      // clear animation ???
    };
  }, [runningLap]);
  // endregion

  const laps = useMemo(() => {
    return lapStartTimes.map((lap, i) => ({
      endTime: i === lapStartTimes.length - 1 ? endTime : lapStartTimes[i + 1],
      startTime: lap,
    }));
  }, [lapStartTimes, endTime]);

  // const [ranks, setRanks] = useState(getRanks(laps));
  // // region sync rank
  // useEffect(() => {
  //   if (lapStartTimes.length === 0 || !!endTime) return;
  //   const intervalId = setInterval(() => {
  //     const newRanks = getRanks(laps);
  //     if (!newRanks.every((newRank, i) => newRank === ranks[i])) {
  //       console.log('set new ranks', ranks, newRanks);
  //       setRanks(newRanks);
  //     }
  //   }, 100);
  //   return () => clearInterval(intervalId);
  // }, [laps, ranks]);
  // // endregion

  const [ranks, setRanks] = useAtom(ranksAtom);
  useWindowFocus({
    onFocus: () => {
      const currentLap = lapStartTimes[lapStartTimes.length - 1];
      if (runningLap) {
        syncSecAnimation(runningLap);
      }
    },
    deps: [runningLap],
  });

  const { minProgress = 0 } =
    (runningLap && calculateProgress(runningLap)) || {};
  const startSec = runningLap
    ? runningLap?.getSeconds() + runningLap.getMilliseconds() / 1000
    : 0;

  const lastRunningColor = LapColors[lapStartTimes.length - 1];
  return (
    <>
      {/*{lapStartTimes.map((lapStartTime, i) => (
        <LapIndicator
          key={i}
          rank={ranks[i]}
          index={i + 1}
          color={LapColors[i]}
          startTime={lapStartTime}
          endTime={laps[i].endTime}
          //showTimer={i >= lapStartTimes.length - 2}
          //highlightedTimer={i === lapStartTimes.length - 1 && !endTime}
          showTimer={false}
          highlightedTimer={false}
        />
      ))}*/}

      {!endTime && (
        <LapIndicator
          rank={ranks[lapStartTimes.length - 1]}
          index={lapStartTimes.length}
          key={lapStartTimes.length}
          color={LapColors[lapStartTimes.length - 1]}
          startTime={lapStartTimes[lapStartTimes.length - 1]}
          endTime={laps[lapStartTimes.length - 1].endTime}
          //showTimer={i >= lapStartTimes.length - 2}
          //highlightedTimer={i === lapStartTimes.length - 1 && !endTime}
          showTimer={false}
          highlightedTimer={false}
        />
      )}

      {!endTime && (
        <ProgressCircle
          style={{
            transform: `rotate(${startSec * 6}deg)`,
            alignSelf: "center",
            justifySelf: "center",
          }}
          ref={secProgressRef}
          size={276}
          initialProgress={0}
          opacity={0.6}
          color={lastRunningColor}
          background={"transparent"}
          className={"absolute"}
        />
      )}
    </>
  );
});
