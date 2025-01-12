"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { RootState } from "@/redux/store";
import { useMemo, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFileContent, setLastResponse } from "@/redux/slices/projectFile";
import { sendNatsMessage } from "@/services/natsWrapper";
import Logger from "@/services/logging";
import { setTitle } from "@/redux/slices/windowProperties";

export default function Page() {
  const content = useSelector((state: RootState) => state.projectFile);
  const selectedRequest = useSelector((state: RootState) => state.projectFile.fileContent?.requests[state.projectFile.selectedRequestIndex]);
  const dispatch = useDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveId = "explorercontent";
  const ExplorerContent = useMemo(
    () => ({
      getItem(name: string): string | null {
        return localStorage.getItem(name);
      },
      setItem(name: string, value: string) {
        localStorage.setItem(name, value);
      },
    }),
    []
  );

  useEffect(() => {
    dispatch(setTitle("NUTS - " + content.fileContent?.name));
  }, [content.selectedRequestIndex]);


  // Function to format JSON
  const formatJson = (jsonString: string) => {
    try {
      if (jsonString === "") return ""; // Return empty string if null
      return JSON.stringify(JSON.parse(jsonString), null, 2); // Format with indentation
    } catch (e) {
      Logger.error("Failed to format JSON", e);
      return jsonString; // Return raw string if it's not valid JSON
    }
  };

  // Memoized onChange handler
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
      if (selectedRequest && content.fileContent) {
        const lastResponse = selectedRequest.lastResponse;
        dispatch(
          setFileContent({
            ...content.fileContent,
            requests: content.fileContent.requests.map((request, index) => {
              if (index === content.selectedRequestIndex) {
                return {
                  ...selectedRequest,
                  [key]: e.target.value || "",
                };
              }
              return request;
            }),
          })
        );

        dispatch(setLastResponse(lastResponse || "")); // More of a hack, but it works and i don't care enough to fix it - it's 2:43am
      }
    },
    [dispatch, content.fileContent, selectedRequest, content.selectedRequestIndex]
  );

  const handleAutoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleAutoResize();
  }, [selectedRequest?.data]);

  // If no file is opened, show the message
  if (!content.fileContent) {
    return (
      <div className="p-4">
        <pre>Please open a file to view its contents</pre>
      </div>
    );
  }

  // If no request is selected, show the message
  if (!selectedRequest || !content.fileContent) {
    return (
      <div className="p-4">
        <pre>No request selected</pre>
      </div>
    );
  }

  async function handleSendRequest() {
    if (!selectedRequest) return;

    try {
      const response = await sendNatsMessage(selectedRequest?.url, selectedRequest?.topic, selectedRequest?.data);
      dispatch(setLastResponse(JSON.stringify(response, null, 2)));
    } catch (error) {    
      Logger.error("Failed to send request", error);
      dispatch(setLastResponse(JSON.stringify(error, null, 2)));
    }
  }

  return (
    <ResizablePanelGroup direction="vertical" storage={ExplorerContent} autoSaveId={saveId + "_parent"}>
      <ResizablePanel collapsible={true} collapsedSize={0} minSize={10} defaultSize={15} className="flex flex-col justify-center mx-4">
        <p className="font-bold text-sm">NATS Server</p>
        <input
          type="text"
          value={selectedRequest?.url}
          onChange={(e) => handleChange(e, "url")}
          className="bg-clientColors-card-background border border-clientColors-card-border p-3 rounded-lg"
        />
      </ResizablePanel>
      <ResizableHandle className="border border-clientColors-windowBorder" />
      <ResizablePanel collapsible={true} collapsedSize={0} minSize={10} defaultSize={85}>
        <ResizablePanelGroup direction="horizontal" storage={ExplorerContent} autoSaveId={saveId + "_child"}>
          <ResizablePanel collapsible={true} collapsedSize={0} minSize={10} defaultSize={25} className="">
            <div className="p-4 h-full w-full space-y-8 overflow-auto">
              <div>
                <p className="font-bold text-xl">Topic</p>
                <input
                  type="text"
                  value={selectedRequest?.topic}
                  onChange={(e) => handleChange(e, "topic")}
                  className="bg-clientColors-card-background border border-clientColors-card-border p-3 rounded-lg w-full"
                />
              </div>
              <div>
                <p className="font-bold text-xl">Payload</p>
                <textarea
                  ref={textareaRef}
                  className="bg-clientColors-card-background border border-clientColors-card-border p-3 rounded-lg w-full"
                  value={formatJson(selectedRequest?.data || "")} // Format JSON before rendering
                  onChange={(e) => handleChange(e, "data")} // Raw input on change
                  onInput={handleAutoResize} // Auto resize on input
                />
              </div>
              <button className="bg-clientColors-button-background w-full p-4 rounded-md border border-clientColors-card-border hover:border-clientColors-scrollbarThumb-hover active:bg-clientColors-card-border" onClick={
                handleSendRequest
              }>Send Request</button>
            </div>
          </ResizablePanel>
          <ResizableHandle className="border border-clientColors-windowBorder" />
          <ResizablePanel collapsible={true} collapsedSize={0} minSize={10} defaultSize={25}>
            <div className="p-4 w-full h-full space-y-2">
              <p className="font-bold text-xl">Response</p>
              <textarea
                readOnly
                className="bg-clientColors-card-background border border-clientColors-card-border p-3 rounded-lg h-full w-full"
                value={formatJson(selectedRequest.lastResponse ? JSON.parse(selectedRequest.lastResponse) : "")}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
