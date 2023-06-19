import React, { createRef, MutableRefObject } from "react";

export function useRefs<T = any>(
  arrayLength: number
): Array<MutableRefObject<T>> {
  const elRefs = React.useRef([]);

  if (elRefs.current.length !== arrayLength) {
    // add or remove refs
    elRefs.current = Array(arrayLength)
      .fill(null)
      .map((_, i) => elRefs.current[i] || createRef());
  }
  return elRefs.current;
}
