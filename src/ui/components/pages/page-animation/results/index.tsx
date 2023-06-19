import React, { useEffect } from "react";
import moment from "moment";
import { animLoop } from "../helper.ts";
import { useRefs } from "../../../../../hooks/useRefs.tsx";
import css from "./results.module.css";
import classNames from "classnames";
import goldMedal from "../../../../../assets/gold-medal.png";
import silverMedal from "../../../../../assets/silver-medal.png";
import bronzeMedal from "../../../../../assets/bronze-medal.png";
import { Atom } from "../../../../../lib/atom/core/atom.ts";
import { useAtom } from "../../../../../lib/atom/hooks/useAtom.ts";

type Props = {
  results: Array<{
    startTime: Date;
    endTime?: Date;
    color: string;
    rank: number;
  }>;
  ranksAtom: Atom<number[]>;
  show?: boolean;
};

const Results = ({ results, ranksAtom, show }: Props) => {
  const haveRunningLap = results.some((result) => !result.endTime);
  const resRefs = useRefs<HTMLDivElement>(results.length);
  const [ranks] = useAtom(ranksAtom);

  // sync inprogress laps with current time
  useEffect(() => {
    if (!haveRunningLap) return;
    let animating = true;
    animLoop((frame, lastFrame) => {
      if (!animating) return false;
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (!result.endTime) {
          resRefs[i].current.innerText =
            `(${i + 1})` +
            moment(new Date().getTime() - result.startTime.getTime()).format(
              "mm:ss.SS"
            );
        }
      }
      return true;
    });
    return () => {
      animating = false;
    };
  }, [haveRunningLap, results.length]);

  return (
    <div
      className={`${
        results.length > 0
          ? "min-[900px]:translate-x-[230px] opacity-100"
          : "min-[900px]:translate-x-[150px] opacity-0"
      } transition-[opacity,transform] duration-300 ease-linear flex flex-col content-start justify-start items-center mt-8 min-[900px]:flex-wrap min-[900px]:absolute min-[900px]:h-[300px] w-[440px] min-[900px]:overflow-x-auto min-[900px]:ml-10`}
    >
      {results.map((result, index) => {
        const rank = ranks[index];
        const medalIcon =
          rank === 1
            ? silverMedal
            : rank === 2
            ? bronzeMedal
            : rank === 0
            ? goldMedal
            : null;
        return (
          <div className={css.textRow}>
            <div
              style={{
                textShadow: `0 0 7px ${result.color}`,
                color: result.color,
              }}
              ref={resRefs[index]}
              className={classNames(
                "flex text-2xl font-bold my-2 ml-4",
                css.text
              )}
            >
              ({index + 1})
              {moment(
                (result.endTime || new Date()).getTime() -
                  result.startTime.getTime()
              ).format("mm:ss.SS")}
            </div>
            {medalIcon && <img className={css.trophyIcon} src={medalIcon} />}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(Results);
