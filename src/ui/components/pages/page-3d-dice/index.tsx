import React, { useRef } from "react";
import css from "./page-3d-dice.module.scss";
import classNames from "classnames";
import anime from "animejs/lib/anime.es.js";
import { Base3DRotate, rollDice } from "./helper.ts";

type Props = {};

const Page3DDice = ({}: Props) => {
  const box = useRef<HTMLDivElement>(null);
  const translateBox = useRef<HTMLDivElement>(null);
  const currentRotate = useRef({ rotateX: 0, rotateY: 0, rotateZ: 0 });
  const roll = () => {
    translateBox.current &&
      box.current &&
      (currentRotate.current = rollDice(
        translateBox.current,
        box.current,
        currentRotate.current
      ));
  };
  return (
    <div className={"page h-full"}>
      <div
        className={
          "page-body overflow-visible flex flex-col items-center justify-center"
        }
      >
        <div className={"flex flex-row "}>
          <div
            onClick={roll}
            className={
              "transition-opacity-transform duration-300 px-6 py-4 rounded-full hover:opacity-80 hover:scale-105 cursor-pointer bg-transparent flex mx-2 font-bold border-blue-500 border-2 text-blue-500"
            }
          >
            ROLL NOW !
          </div>
        </div>

        <div className={css.scene}>
          <div ref={translateBox} className={css.translateBox}>
            <div ref={box} className={css.box}>
              <div className={classNames(css.up, css.side)}>
                <div />
              </div>
              <div className={classNames(css.down, css.side)}>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
              </div>
              <div className={classNames(css.left, css.side)}>
                <div />
                <div />
                <div />
                <div />
              </div>
              <div className={classNames(css.right, css.side)}>
                <div />
                <div />
                <div />
              </div>
              <div className={classNames(css.front, css.side)}>
                <div /> <div />
              </div>
              <div className={classNames(css.back, css.side)}>
                <div />
                <div />
                <div />
                <div />
                <div />
              </div>

              <div className={classNames(css.hoz, css.inside)} />
              <div className={classNames(css.ver1, css.inside)} />
              <div className={classNames(css.ver2, css.inside)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Page3DDice);
