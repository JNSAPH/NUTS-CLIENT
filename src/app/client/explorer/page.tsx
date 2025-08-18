"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { RootState } from "@/redux/store";
import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticationType, setFileContent, setLastResponse, setNatsServerURL, setNATSToken, setUsernamePassword } from "@/redux/slices/projectFile";
import { setClientSettings } from "@/redux/slices/windowProperties";
import { NatsAuth, sendNatsMessage } from "@/services/natsWrapper";
import Logger from "@/services/logging";
import { setTitle } from "@/redux/slices/windowProperties";
import { IcoPlusBorder } from "@/components/Icons";
import AuthDialog from "@/components/AuthDialog";
import * as utils from "@/services/utils";
import { Badge } from "@/components/ui/badge"
import { AuthTypes } from "@/types/Auth";
import Editor, { useMonaco } from "@monaco-editor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { monacoEditorLanguages, monacoEditorLanguageType } from "@/types/Settings";

export default function Page() {
  const content = useSelector((state: RootState) => state.projectFile);
  const selectedRequest = useSelector((state: RootState) => state.projectFile.fileContent?.requests[state.projectFile.selectedRequestIndex]);
  const settings = useSelector((state: RootState) => state.windowProperties.clientSettings);
  const dispatch = useDispatch();
  const [natsUrl, setNatsUrl] = useState(content.fileContent?.requests[content.selectedRequestIndex]?.url || "");
  const [disableAuthPoupup, setDisableAuthPopup] = useState(false);
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
            requests: content.fileContent.requests.map((request: any, index: any) => {
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

  useEffect(() => {
    // Set the initial NATS URL from the selected request
    if (selectedRequest) {
      const initialUrl = selectedRequest.url || "";
      setNatsUrl(initialUrl);
      dispatch(setNatsServerURL(initialUrl));
    }
  }, [selectedRequest, dispatch]);

  useEffect(() => {
    const url = utils.parseNatsUrl(natsUrl);
    const isDisabled = !!(url.token || (url.username && url.password));

    // 
    if (isDisabled) {
      dispatch(setAuthenticationType(AuthTypes.NONE));
    }

    setDisableAuthPopup(isDisabled);
  }, [natsUrl]);

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
      <div className="p-4 flex flex-col h-full">
        <pre className="whitespace-pre-wrap">
          Ready to get started? (ง •̀_•́)ง
        </pre>
        <pre className="whitespace-pre-wrap">
          Select a request from the sidebar or create a new one by clicking <span className="inline-flex align-sub"><IcoPlusBorder size={16} />.</span>
        </pre>

      </div>
    );
  }

  async function handleSendRequest() {
    if (!selectedRequest) return;
    let auth: NatsAuth = { authType: AuthTypes.NONE };

    try {
      switch (selectedRequest.authentication?.type) {
        case AuthTypes.TOKEN:
          auth = {
            authType: AuthTypes.TOKEN,
            token: selectedRequest.authentication.token || "NO-TOKEN-PROVIDED",
          }
          break;

        case AuthTypes.USERPASSWORD:
          auth = {
            authType: AuthTypes.USERPASSWORD,
            username: selectedRequest.authentication.usernamepassword?.username || "NO-USERNAME-PROVIDED",
            password: selectedRequest.authentication.usernamepassword?.password || "NO-PASSWORD-PROVIDED",
          }
          break;

        case AuthTypes.NKEYS:
          auth = {
            authType: AuthTypes.NKEYS,
            jwt: selectedRequest.authentication.nkeys?.jwt || "NO-JWT-PROVIDED",
            seed: selectedRequest.authentication.nkeys?.seed || "NO-SEED-PROVIDED",
          }
          break;
        case AuthTypes.NONE:
        default:
          auth = { authType: AuthTypes.NONE };
          break;
      }

      const response = await sendNatsMessage(
        selectedRequest.url,
        selectedRequest.topic,
        selectedRequest.data,
        auth
      );

      dispatch(setLastResponse(JSON.stringify(response, null, 2)));
    } catch (error) {
      Logger.error("Failed to send request", error);
      dispatch(setLastResponse(JSON.stringify(error, null, 2)));
    }
  }

  return (
    <ResizablePanelGroup direction="vertical" storage={ExplorerContent} autoSaveId={saveId + "_parent"}>
      <ResizablePanel collapsible={true} collapsedSize={0} minSize={10} defaultSize={15} className="flex flex-col justify-center mx-4">
        <div className="flex space-x-3 py-1">
          <p className="font-bold text-sm">NATS Server</p>
          {selectedRequest.authentication?.type !== "NONE" && (
            <Badge variant="outline">Auth: {selectedRequest.authentication?.type}</Badge>
          )}
        </div>
        <div className="flex items-center space-x-2 w-full">
          <input
            type="text"
            value={natsUrl}
            onChange={(e) => {
              setNatsUrl(e.target.value);
              handleChange(e, "url");
              dispatch(setNatsServerURL(e.target.value));
            }}
            className="bg-clientColors-card-background border border-clientColors-card-border p-3 rounded-lg w-full"
          />
          <AuthDialog
            selectedRequest={selectedRequest}
            disabled={disableAuthPoupup}
          />

        </div>
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
                {settings.useMonacoEditor ? (
                  <Editor
                  className="p-3"
                  height="350px"
                  defaultLanguage={settings.monacoEditorLanguage || "plain"}
                  defaultValue={selectedRequest?.data || ""}
                  onChange={(value) => {
                    const syntheticEvent = {
                      target: { value: value ?? "" }
                    } as React.ChangeEvent<HTMLInputElement>;
                    handleChange(syntheticEvent, "data");
                  }}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    lineNumbers: "on",
                    lineNumbersMinChars: 2,
                    fontSize: 14,
                    automaticLayout: true,
                  }}/>
                ) : (
                  <textarea
                    ref={textareaRef}
                    className="bg-clientColors-card-background border border-clientColors-card-border p-3 rounded-lg w-full"
                    value={formatJson(selectedRequest?.data || "")} // Format JSON before rendering
                    onChange={(e) => handleChange(e, "data")} // Raw input on change
                    onInput={handleAutoResize} // Auto resize on input
                  />
                )}
              </div>
              <button className="bg-clientColors-button-background w-full p-4 rounded-md border border-clientColors-card-border hover:border-clientColors-scrollbarThumb-hover active:bg-clientColors-card-border" onClick={
                handleSendRequest
              }>Send Request</button>
            </div>
          </ResizablePanel>
          <ResizableHandle className="border border-clientColors-windowBorder" />
          <ResizablePanel collapsible={true} collapsedSize={0} minSize={10} defaultSize={25}>
            <div className="p-4 space-y-2 flex flex-col h-full">
              <p className="font-bold text-xl flex-shrink-0">Response</p>
              <textarea
                readOnly
                className="bg-clientColors-card-background border border-clientColors-card-border p-3 rounded-lg flex-grow resize-none "
                value={formatJson(selectedRequest.lastResponse ? JSON.parse(selectedRequest.lastResponse) : "")}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
