import { RefObject, useEffect } from "react";
import anime from "animejs/lib/anime.es";

// hook mouse move event from an element and notify the consumer
type TOnMouseMove = (data: {
  centerElementX: number;
  centerElementY: number;
  mouseX: number;
  mouseY: number;
  deltaX: number; // mouse distance from center
  deltaY: number;
  element: HTMLElement;
}) => void;

export const useMouseMove = (
  elementRef: RefObject<HTMLElement | null>,
  {
    onMouseMoveCB,
    onMouseLeaveCB,
  }: {
    onMouseMoveCB: TOnMouseMove;
    onMouseLeaveCB?: (element: HTMLElement) => void;
  },
  deps: any[] = []
) => {
  useEffect(() => {
    // useEffect run after dom mutation so element ref should be already assigned at this point
    // not assigned -> ref not assigned to element / the element is not rendered yet(user should add dep to ensure re-setup event on render)
    if (!elementRef.current) return;
    const element = elementRef.current;

    const onMouseMove = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      const rect = element.getBoundingClientRect();
      const centerElementX = element.clientWidth / 2;
      const centerElementY = element.clientHeight / 2;

      let clientX, clientY;

      if ("touches" in e) {
        const touch = e.touches[0];
        clientX = touch?.clientX;
        clientY = touch.clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // get relative coordinate of mouse cursor in clock area
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      // calculate how far the cursor from the clock center
      const dx = mouseX - centerElementX;
      const dy = mouseY - centerElementY;

      onMouseMoveCB({
        mouseX,
        mouseY,
        centerElementX,
        centerElementY,
        deltaX: dx,
        deltaY: dy,
        element,
      });
    };

    const onMouseLeave = () => {
      onMouseLeaveCB?.(element);
    };

    element.addEventListener("touchstart", onMouseMove);
    element.addEventListener("touchmove", onMouseMove);
    element.addEventListener("mousemove", onMouseMove);
    element.addEventListener("mouseleave", onMouseLeave);
    element.addEventListener("touchend", onMouseLeave);

    return () => {
      element.removeEventListener("touchstart", onMouseMove);
      element.removeEventListener("touchmove", onMouseMove);
      element.removeEventListener("mousemove", onMouseMove);
      element.removeEventListener("mouseleave", onMouseLeave);
      element.removeEventListener("touchend", onMouseLeave);
    };
  }, deps);
};
