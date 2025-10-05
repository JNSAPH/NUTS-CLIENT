import { IcoClose, IcoMaximize, IcoMinimize } from "@/components/Icons";
import { closeWindow, maximizeWindow, minimizeWindow } from "../utils";
import Image from "next/image";

export default function WinLikeIcons() {
  return (
    <>
      <div
        className="h-full w-[50px] flex items-center justify-center hover:bg-orbit-window-btnHover active:bg-orbit-window-btnHover/90"
        onClick={minimizeWindow}
      >
        <IcoMinimize className="text-black dark:text-white" size={10} />
      </div>
      <div
        className="h-full w-[50px] flex items-center justify-center hover:bg-orbit-window-btnHover active:bg-orbit-window-btnHover/90"
        onClick={maximizeWindow}
      >
        <IcoMaximize className="text-black dark:text-white" size={10} />
      </div>
      <div
        className="h-full w-[50px] flex items-center justify-center hover:bg-orbit-window-btnClose"
        onClick={closeWindow}
      >
        <IcoClose className="text-black dark:text-white" size={10} />
      </div>
    </>
  );
}
