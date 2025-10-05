"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { RootState } from "@/redux/store";
import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFileContent,
  setLastResponse,
  setNatsServerURL,
} from "@/redux/slices/projectFile";
import { setTitle } from "@/redux/slices/windowProperties";
import { Badge } from "@/components/ui/badge";
import { AuthTypes } from "@/types/Auth";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  handleNewProject,
  handleOpenProject,
} from "@/components/titlebar/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AuthDialog from "@/components/AuthDialog";
import * as utils from "@/services/utils";
import { NatsAuth, sendNatsMessage } from "@/services/natsWrapper";
import Logger from "@/services/logging";

export default function Page() {
  const content = useSelector((state: RootState) => state.projectFile);
  const selectedRequest = useSelector(
    (state: RootState) =>
      state.projectFile.fileContent?.requests[
        state.projectFile.selectedRequestIndex
      ]
  );
  const settings = useSelector(
    (state: RootState) => state.windowProperties.clientSettings
  );
  const dispatch = useDispatch();

  const [natsUrl, setNatsUrl] = useState(
    content.fileContent?.requests[content.selectedRequestIndex]?.url || ""
  );
  const [disableAuthPoupup, setDisableAuthPopup] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const saveId = "explorercontent";
  const ExplorerContent = useMemo(
    () => ({
      getItem(name: string): string | null {
        return typeof window !== "undefined"
          ? localStorage.getItem(name)
          : null;
      },
      setItem(name: string, value: string) {
        if (typeof window !== "undefined") localStorage.setItem(name, value);
      },
    }),
    []
  );

  // Keep the window title in sync
  useEffect(() => {
    dispatch(setTitle("Orbit - " + (content.fileContent?.name ?? "Untitled")));
  }, [dispatch, content.fileContent?.name, content.selectedRequestIndex]);

  // Format JSON nicely if possible
  const formatJson = useCallback((jsonString: string) => {
    try {
      if (jsonString === "") return "";
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch {
      return jsonString;
    }
  }, []);

  // Unified onChange handler for inputs/textarea/editor
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      key: string
    ) => {
      if (!selectedRequest || !content.fileContent) return;

      const lastResponse = selectedRequest.lastResponse;
      dispatch(
        setFileContent({
          ...content.fileContent,
          requests: content.fileContent.requests.map(
            (request: any, index: number) =>
              index === content.selectedRequestIndex
                ? {
                    ...selectedRequest,
                    [key]: e.target.value || "",
                  }
                : request
          ),
        })
      );

      // preserve existing lastResponse
      dispatch(setLastResponse(lastResponse || ""));
    },
    [
      dispatch,
      content.fileContent,
      selectedRequest,
      content.selectedRequestIndex,
    ]
  );

  // Auto-resize plain <Textarea>
  const handleAutoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    handleAutoResize();
  }, [handleAutoResize, selectedRequest?.data]);

  // Sync local NATS URL state when request changes
  useEffect(() => {
    if (selectedRequest) {
      const initialUrl = selectedRequest.url || "";
      setNatsUrl(initialUrl);
      dispatch(setNatsServerURL(initialUrl));
    }
  }, [selectedRequest, dispatch]);

  // Toggle auth dialog availability based on URL
  useEffect(() => {
    const url = utils.parseNatsUrl(natsUrl);
    const isDisabled = !!(url.token || (url.username && url.password));
    if (isDisabled) {
      // If URL embeds credentials, force auth type to NONE to avoid conflicts
      dispatch({
        type: "projectFile/setAuthenticationType",
        payload: AuthTypes.NONE,
      });
    }
    setDisableAuthPopup(isDisabled);
  }, [natsUrl, dispatch]);

  // Send the request (memoized so the keyboard handler is stable)
  const handleSendRequest = useCallback(async () => {
    if (!selectedRequest) return;

    let auth: NatsAuth = { authType: AuthTypes.NONE };

    try {
      switch (selectedRequest.authentication?.type) {
        case AuthTypes.TOKEN:
          auth = {
            authType: AuthTypes.TOKEN,
            token: selectedRequest.authentication.token || "NO-TOKEN-PROVIDED",
          };
          break;

        case AuthTypes.USERPASSWORD:
          auth = {
            authType: AuthTypes.USERPASSWORD,
            username:
              selectedRequest.authentication.usernamepassword?.username ||
              "NO-USERNAME-PROVIDED",
            password:
              selectedRequest.authentication.usernamepassword?.password ||
              "NO-PASSWORD-PROVIDED",
          };
          break;

        case AuthTypes.NKEYS:
          auth = {
            authType: AuthTypes.NKEYS,
            jwt: selectedRequest.authentication.nkeys?.jwt || "NO-JWT-PROVIDED",
            seed:
              selectedRequest.authentication.nkeys?.seed || "NO-SEED-PROVIDED",
          };
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
        auth,
        settings.defaultTimeout
      );

      dispatch(setLastResponse(JSON.stringify(response, null, 2)));
    } catch (error) {
      Logger.error("Failed to send request", error);
      dispatch(
        setLastResponse(
          `The following Message was produced by Orbit: \n\nWhile sending this Message, the NATS Client encountered an error:\n${JSON.stringify(
            error,
            null,
            2
          )}`
        )
      );
    }
  }, [dispatch, selectedRequest, settings.defaultTimeout]);

  // Keyboard shortcut (Ctrl+Enter)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleSendRequest();
      }
    },
    [handleSendRequest]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ---------- Render ----------
  const noProjectOpen = !content.fileContent;
  const noRequestSelected = !selectedRequest || !content.fileContent;

  if (noProjectOpen) {
    return (
      <div className="p-4 flex flex-col h-full items-center justify-center space-y-4">
        <div className="flex items-center flex-col space-y-1">
          <p className="text-2xl">(・_・;)</p>
          <p>No Project Opened</p>
        </div>
        <div className="flex space-x-4">
          <Button
            className="text-base rounded-md"
            onClick={async () => {
              await handleNewProject(dispatch);
            }}
          >
            New Project
          </Button>
          <Button
            className="text-base rounded-md"
            onClick={async () => {
              await handleOpenProject(dispatch);
            }}
          >
            Open existing Project
          </Button>
        </div>
      </div>
    );
  }

  if (noRequestSelected) {
    return (
      <div className="p-4 flex flex-col h-full items-center justify-center space-y-4">
        <div className="flex items-center flex-col space-y-1">
          <p className="text-2xl">(・_・;)</p>
          <p>No Request Selected</p>
          <p className="text-sm text-gray-500">
            Select or create a request from the sidebar
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="vertical"
      storage={ExplorerContent}
      autoSaveId={saveId + "_parent"}
    >
      <ResizablePanel
        collapsible
        collapsedSize={0}
        minSize={10}
        defaultSize={15}
        className="flex flex-col justify-center mx-4"
      >
        {/* NATS URL Input and Auth Button */}
        <div className="flex space-x-3 py-1">
          <p className="font-bold text-sm">NATS Server</p>
          {selectedRequest.authentication?.type !== "NONE" && (
            <Badge variant="outline">
              Auth: {selectedRequest.authentication?.type}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2 w-full">
          <Input
            type="text"
            value={natsUrl}
            onChange={(e) => {
              setNatsUrl(e.target.value);
              handleChange(e, "url");
              dispatch(setNatsServerURL(e.target.value));
            }}
            className="bg-orbit-carbon"
          />
          <AuthDialog
            selectedRequest={selectedRequest}
            disabled={disableAuthPoupup}
          />
        </div>
      </ResizablePanel>

      <ResizableHandle className="border-1 border-orbit-carbon" />

      <ResizablePanel
        collapsible
        collapsedSize={0}
        minSize={10}
        defaultSize={85}
      >
        {/* Topic, Payload, and Response Sections */}
        <ResizablePanelGroup
          direction="horizontal"
          storage={ExplorerContent}
          autoSaveId={saveId + "_child"}
        >
          <ResizablePanel
            collapsible
            collapsedSize={0}
            minSize={10}
            defaultSize={25}
          >
            <div className="p-4 h-full w-full space-y-8 overflow-auto">
              <div className="space-y-2">
                <p className="font-bold text-xl">Topic</p>
                <Input
                  type="text"
                  value={selectedRequest?.topic || ""}
                  onChange={(e) => handleChange(e, "topic")}
                  className="bg-orbit-carbon"
                />
              </div>

              <div className="space-y-2">
                <p className="font-bold text-xl">Payload</p>
                {settings.useMonacoEditor ? (
                  <Editor
                    className="p-3"
                    height="350px"
                    defaultLanguage={
                      settings.monacoEditorLanguage || "plaintext"
                    }
                    value={selectedRequest?.data || ""}
                    onChange={(value) => {
                      const syntheticEvent = {
                        target: { value: value ?? "" },
                      } as unknown as React.ChangeEvent<HTMLInputElement>;
                      handleChange(syntheticEvent, "data");
                    }}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      lineNumbers: "on",
                      lineNumbersMinChars: 2,
                      fontSize: 14,
                      automaticLayout: true,
                    }}
                  />
                ) : (
                  <Textarea
                    ref={textareaRef}
                    className="bg-orbit-carbon"
                    value={formatJson(selectedRequest?.data || "")}
                    onChange={(e) => handleChange(e, "data")}
                    onInput={handleAutoResize}
                  />
                )}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleSendRequest}
              >
                Send Request (Ctrl+Enter)
              </Button>
            </div>
          </ResizablePanel>

          <ResizableHandle className="border-1 border-orbit-carbon" />

          <ResizablePanel
            collapsible
            collapsedSize={0}
            minSize={10}
            defaultSize={25}
          >
            <div className="p-4 space-y-2 flex flex-col h-full">
              <p className="font-bold text-xl flex-shrink-0">Response</p>
              <Textarea
                readOnly
                className="bg-orbit-carbon flex-grow resize-none"
                value={(() => {
                  try {
                    const raw = selectedRequest?.lastResponse ?? "";
                    return JSON.parse(raw);
                  } catch (err) {
                    return selectedRequest?.lastResponse ?? "";
                  }
                })()}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
