import {useRef} from "react";
import {Atom} from "../core/atom.ts";

export function useCreateAtom<T>(initialValue: T){
  const atomRef = useRef<Atom<T>>();

  if(!atomRef.current)
    atomRef.current = new Atom<T>(initialValue);

  return atomRef.current;
}
