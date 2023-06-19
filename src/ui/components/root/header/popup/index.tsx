import React, { PropsWithChildren, useCallback, useMemo } from "react";
import css from "./popup-items.module.scss";
import classNames from "classnames";
import Portal from "../portal";

type Props = PropsWithChildren<{
  preferAnchor: "top-middle" | "top-left" | "top-right";
  position: {
    x: number;
    y: number;
  };
  size?: number;
  onClose: () => void;
}>;

const Popup = ({
  children,
  onClose,
  position,
  preferAnchor,
  size = 200,
}: Props) => {
  const { x, y } = useMemo(() => {
    // get prefer menu position base on anchor
    let anchored;
    switch (preferAnchor) {
      case "top-left":
        anchored = position;
        break;
      case "top-middle":
        anchored = { x: position.x - size / 2, y: position.y };
        break;
      case "top-right":
        anchored = { x: position.x + size / 2, y: position.y };
        break;
      default:
        anchored = position;
    }
    // adjust menu position to avoid screen's edge
    // get screen size
    const { innerWidth, innerHeight } = window;
    const padding = 10;
    const maxR = innerWidth + padding;
    const minR = 0 - padding;
    let delta = 0;
    const rMenu = anchored.x + size;
    const lMenu = anchored.x;
    if (rMenu > maxR) {
      delta = -rMenu + maxR;
    } else if (lMenu < minR) {
      delta = minR - lMenu;
    }

    return {
      x: anchored.x + delta,
      y: anchored.y,
    };
  }, [position, preferAnchor, size]);
  return (
    <Portal id={"model-layer"}>
      <div
        onClick={onClose}
        className={
          "absolute left-0 right-0 bottom-0 top-0 bg-red-100 bg-opacity-5 pointer-events-auto"
        }
      >
        <div
          className={
            "relative w-full h-full flex items-start justify-end flex-col"
          }
        >
          <div
            style={{
              top: y,
              left: x,
              width: size,
            }}
            className={classNames(
              "flex flex-col absolute align-start justify-start",
              css.menu
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Popup;
