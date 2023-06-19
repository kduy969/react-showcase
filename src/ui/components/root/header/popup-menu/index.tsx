import { ViewStyle } from "../../../../base-types/view-style.tsx";
import { TMenuItem } from "../items.ts";
import React, { useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import css from "./popup-items.module.scss";
import classNames from "classnames";

type Props = ViewStyle & {
  items: TMenuItem[];
  preferAnchor: "top-middle" | "top-left" | "top-right";
  position: {
    x: number;
    y: number;
  };
  size?: number;
  onClose: () => void;
};

const PopupMenu = ({
  items,
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
  return createPortal(
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
            "flex flex-col py-2 rounded-lg bg-white absolute w-auto align-start justify-start backdrop-blur",
            css.menu
          )}
        >
          {items.map((item, index) => {
            return (
              <div
                key={index}
                onClick={(event) => {}}
                className={
                  "flex flex-row justify-start items-center py-2 px-4 text-black " +
                  "cursor-pointer hover:opacity-80 hover:scale-1.05 hover:text-accent"
                }
              >
                {item.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.getElementById("modal-layer")!,
    "popup-menu"
  );
};

export default React.memo(PopupMenu);
