import { useState, useEffect } from "react";

const hasFocus = () => typeof document !== "undefined" && document.hasFocus();

const useWindowFocus = ({onFocus, onBlur, deps}: {onFocus: () => void, onBlur?: () => void, deps?: Array<any>}) => {
  useEffect(() => {
    window.addEventListener("focus", onFocus);
    if (onBlur) window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("focus", onFocus);
      if (onBlur) window.removeEventListener("blur", onBlur);
    };
  }, deps || []);
};

export default useWindowFocus;
