import { useSelector } from "react-redux";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { RootState } from "@/redux/store";

export default function ReduxDevTool() {

    var state = useSelector((state: RootState) => state);


    if (!state.windowProperties.clientSettings.showReduxDevTools) return null;

    return (
        <div className="w-full h-full top-0 left-0 absolute z-50 pointer-events-none">
            <ResizablePanelGroup direction="horizontal" className="w-full" >
                <ResizablePanel minSize={10} className=""/>
                <ResizableHandle className="border border-clientColors-accentColor" />

                <ResizablePanel minSize={1} defaultSize={25} maxSize={99} className="bg-slate-800 pointer-events-auto h-full">
                    <div className="overflow-auto p-4 h-full">
                    <pre>{JSON.stringify(state, null, 2)}</pre>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
