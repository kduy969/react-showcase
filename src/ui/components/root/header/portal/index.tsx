import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type Props = PropsWithChildren<{
  id: string;
}>;

const Portal = ({ id, children }: Props) => {
  return createPortal(children, document.getElementById(id)!, id);
};

export default Portal;
