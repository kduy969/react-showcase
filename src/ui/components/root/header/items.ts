type TMenuItemNoChild = {
  text: string;
  path: string;
};

type TMenuItemWithChildren = {
  text: string;
  items: TMenuItem[];
};

export type TMenuItem = TMenuItemNoChild | TMenuItemWithChildren;

export const items: TMenuItem[] = [
  {
    text: "Stop Watch",
    path: "/clock",
  },
  {
    text: "3D Dice",
    path: "/dice",
  },
];
