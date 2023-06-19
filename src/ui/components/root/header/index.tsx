import React, { useCallback, useState } from "react";
import css from "./header.module.scss";
import { useNavigate } from "react-router-dom";
import { items, TMenuItem } from "./items.ts";
import PopupMenu from "./popup-menu";

export function Header() {
  const navigate = useNavigate();
  const [showingMenu, setShowingMenu] = useState<{
    items: TMenuItem[];
    position: {
      x: number;
      y: number;
    };
  }>();
  const hideMenu = useCallback(() => {
    setShowingMenu(undefined);
  }, []);
  return (
    <div className="py-4 flex flex-row justify-center items-center border-b-4 border-b-blue-500">
      {items.map((item) =>
        "path" in item ? (
          <div
            onClick={() => {
              navigate(item.path);
            }}
            className={css.menuText}
          >
            {item.text}
          </div>
        ) : (
          <div
            onClick={(e) => {
              //get button pos
              //get mouse position
              const rect = e.currentTarget.getBoundingClientRect();
              const size = rect.width;
              setShowingMenu({
                items: item.items,
                position: { x: rect.left + size / 2, y: rect.bottom },
              });
            }}
            className={css.menuText}
          >
            {item.text}
          </div>
        )
      )}
      {showingMenu && (
        <PopupMenu
          preferAnchor={"top-middle"}
          onClose={hideMenu}
          items={showingMenu.items}
          position={showingMenu.position}
        />
      )}
      {/*      <div
        onClick={() => {
          navigate("/react-example");
        }}
        className={css.menuText}
      >
        React
      </div>
      <div
        onClick={() => {
          navigate("/animation");
        }}
        className={css.menuText}
      >
        Stop Watch
      </div>
      <div
        onClick={() => {
          navigate("/dice");
        }}
        className={css.menuText}
      >
        3D Dice
      </div>*/}
    </div>
  );
}
