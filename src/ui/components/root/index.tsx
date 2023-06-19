import React from "react";
import { Outlet } from "react-router-dom";

import { Header } from "./header";
import "../../css/app.css";
import "../../css/layer-component.css";
import "react-datepicker/dist/react-datepicker.css";
import css from "./root.module.css";

export default function Root() {
  return (
    <div
      className={"flex-col flex h-screen w-screen bg-white dark:bg-gray-900"}
    >
      <Header />
      <div className="flex flex-col flex-1 overflow-y-hidden overflow-x-hidden">
        <div className={"w-full h-full"}>
          <Outlet />
        </div>
      </div>
      <div
        className={
          "w-full h-full flex items-start justify-start absolute pointer-events-none"
        }
        id={"modal-layer"}
      />
    </div>
  );
}
