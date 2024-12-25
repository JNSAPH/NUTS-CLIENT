import { closeWindow, maximizeWindow, minimizeWindow } from "../utils";

export default function WinLikeIcons() {
    return (
        <>
            <button className="w-8 h-8 bg-clientColors-windowSpecfic-titleBarOtherBtn hover:bg-clientColors-windowSpecfic-titleBarOtherBtnHover active:bg-clientColors-windowSpecfic-titleBarOtherBtnActive" onClick={minimizeWindow} value={"asd"}>
                _
            </button>
            <button className="w-8 h-8 bg-clientColors-windowSpecfic-titleBarOtherBtn hover:bg-clientColors-windowSpecfic-titleBarOtherBtnHover active:bg-clientColors-windowSpecfic-titleBarOtherBtnActive" onClick={maximizeWindow}>
                o
            </button>
            <button className="w-8 h-8 bg-clientColors-windowSpecfic-titleBarCloseBtn hover:bg-clientColors-windowSpecfic-titleBarCloseBtnHover active:bg-clientColors-windowSpecfic-titleBarCloseBtnActive" onClick={closeWindow}>
                x
            </button>
        </>
    )
}

