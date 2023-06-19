import React, {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import anime from "animejs/lib/anime.es.js";
import { AnimeInstance, AnimeTimelineInstance, timeline } from "animejs";

type Props = PropsWithChildren<{
  initialProgress: number; // 0 - 100
  color: string;
  opacity?: number;
  background: string;
  className?: string;
  style?: Partial<HTMLDivElement["style"]>;
  size: number;
}>;

export type ProgressCircleHandler = {
  autoRun: (fullCircleDurationMS: number, startProgress: number) => void;
};
export const ProgressCircle = forwardRef<ProgressCircleHandler, Props>(
  (props: Props, ref) => {
    const progress1Ref = useRef<HTMLDivElement>(null);
    const progress2Ref = useRef<HTMLDivElement>(null);
    const timeline = useRef<AnimeTimelineInstance | null>(null);

    const ensureSetupTimeline = () => {
      if (timeline.current) return timeline.current;

      timeline.current = anime.timeline({
        direction: "normal",
        loop: true,
        duration: 30000,
        easing: "linear",
      });

      timeline.current
        .add({
          targets: progress1Ref.current,
          rotate: "180deg",
        })
        .add({
          targets: progress2Ref.current,
          rotate: "180deg",
        });

      return timeline.current;
    };

    useEffect(() => {
      return () => {
        timeline.current?.pause();
      };
    }, []);

    useImperativeHandle(ref, () => {
      return {
        autoRun: (fullProgressMS, startProgress) => {
          // auto run the progress bar from start -> end and loop infinitely

          // ensure timeline is setup
          const timeline = ensureSetupTimeline();
          // update timeline duration
          // timeline.duration = fullProgressMS; // 2 is number of item in timeline
          // seek timeline to start progress
          // timeline?.seek((timeline?.duration * 150) / 100);
          console.log("Start progress", startProgress, timeline);
          timeline?.pause();
          timeline?.seek(timeline.duration * (startProgress / 100));
          // start running timeline
          // start running timeline
          //
          timeline?.play();
          setTimeout(() => {
            timeline?.play();
          }, 0); // workaround sometimes the play() function not working
        },
      };
    });

    return (
      <div
        style={{
          width: props.size,
          height: props.size,
          opacity: props.opacity || 1,
          ...((props.style || {}) as any),
        }}
        className={"flex rounded-full overflow-hidden " + props.className || ""}
      >
        <div
          style={{
            transform: "translateX(-0.5px)"
          }}
          className={
            "h-full w-[50%] bg-transparent absolute right-0 overflow-hidden"
          }
        >
          <div
            ref={progress1Ref}
            className={"flex absolute"}
            style={{
              background: `conic-gradient(transparent 180deg, ${props.color} 180deg)`,
              boxShadow: `0 0 10px ${props.color}`,
              height: props.size,
              width: props.size,
              top: 0,
              bottom: 0,
              right: 0,
            }}
          />
        </div>
        <div
          className={
            "h-full w-[50%] bg-transparent absolute left-0 overflow-hidden"
          }
        >
          <div
            ref={progress2Ref}
            className={"flex absolute"}
            style={{
              background: `conic-gradient(${props.color} 180deg, transparent 180deg)`,
              boxShadow: `0 0 10px ${props.color}`,
              height: props.size,
              width: props.size,
              top: 0,
              bottom: 0,
              left: 0.5,
            }}
          />
        </div>
      </div>
    );
  }
);
