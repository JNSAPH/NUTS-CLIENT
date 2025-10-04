import { closeWindow, maximizeWindow, minimizeWindow } from "../utils";
import Image from "next/image";

export default function WinLikeIcons() {
  return (
    <>
      <div
        className="h-full w-[50px] flex items-center justify-center hover:bg-orbit-window-btnHover active:bg-orbit-window-btnHover/90"
        onClick={minimizeWindow}
      >
        <Image
          src="/buttons/btn_minimize.svg"
          alt="Minimize Button"
          width={10}
          height={10}
          className=""
        />
      </div>
      <div
        className="h-full w-[50px] flex items-center justify-center hover:bg-orbit-window-btnHover active:bg-orbit-window-btnHover/90"
        onClick={maximizeWindow}
      >
        <Image
          src="/buttons/btn_maximize.svg"
          alt="Maximize Button"
          width={10}
          height={10}
          className=""
        />
      </div>
      <div
        className="h-full w-[50px] flex items-center justify-center hover:bg-orbit-window-btnClose"
        onClick={closeWindow}
      >
        <Image
          src="/buttons/btn_close.svg"
          alt="Close Button"
          width={10}
          height={10}
          className=""
        />
      </div>
    </>
  );
}
