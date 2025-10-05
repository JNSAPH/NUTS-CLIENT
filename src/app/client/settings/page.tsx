"use client";

import {
  OptionSection,
  OptionWrapper,
} from "@/components/settings/optionWrapper";
import { Button } from "@/components/ui/button";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { setClientSettings } from "@/redux/slices/windowProperties";
import { clearPersistedData, RootState } from "@/redux/store";
import Logger from "@/services/logging";
import {
  monacoEditorLanguages,
  monacoEditorLanguageType,
} from "@/types/Settings";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const packageJSON = require("../../../../package.json");

export default function Page() {
  const content = useSelector((state: RootState) => state.windowProperties);
  const { theme, systemTheme, setTheme, resolvedTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>(theme || "system");
  
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedTheme(theme || "system");
  }, [theme]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1">
        <div className="p-4 space-y-8">
          <OptionSection
            title="General Settings"
            description="Configure the general behavior of the Orbit client."
          >
            <OptionWrapper
              title="Hide Update Notifications"
              description="Hide the update notifications that appear when a new version of Orbit is available."
            >
              <div className="mt-2">
                <Switch
                  checked={content.clientSettings.hideUpdateNotifications}
                  onCheckedChange={(state) => {
                    dispatch(
                      setClientSettings({
                        ...content.clientSettings,
                        hideUpdateNotifications: state,
                      })
                    );
                  }}
                />
              </div>
            </OptionWrapper>

            <OptionWrapper
              title="Default NATS URL"
              description="The default NATS URL that will be used when creating a new connection."
            >
              <Input className="mt-2" placeholder="nats://localhost:4222" />
            </OptionWrapper>

            <OptionWrapper
              title="NATS Request Timeout"
              description="Set the tiemout duration (in seconds) for NATS requests. Default is 5 seconds."
            >
              <Input
                type="number"
                value={content.clientSettings.defaultTimeout}
                onChange={(e) => {
                  dispatch(
                    setClientSettings({
                      ...content.clientSettings,
                      defaultTimeout: Number(e.target.value) || 5,
                    })
                  );
                }}
                className=""
              />
            </OptionWrapper>

            <OptionWrapper
              title="Use Monaco Editor"
              description="Switch between the default Textarea and the Monaco Editor for editing NATS Payloads."
            >
              <Switch
                checked={content.clientSettings.useMonacoEditor}
                onCheckedChange={(state) => {
                  dispatch(
                    setClientSettings({
                      ...content.clientSettings,
                      useMonacoEditor: state,
                    })
                  );
                }}
              />
            </OptionWrapper>

            {content.clientSettings.useMonacoEditor && (
              <OptionWrapper
                title="Monaco Editor Language"
                description="Select the default language for the Monaco Editor. This will change the syntax highlighting and formatting."
              >
                <Select
                  onValueChange={(value) => {
                    dispatch(
                      setClientSettings({
                        ...content.clientSettings,
                        monacoEditorLanguage: value as monacoEditorLanguageType,
                      })
                    );
                  }}
                  defaultValue={content.clientSettings.monacoEditorLanguage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {monacoEditorLanguages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </OptionWrapper>
            )}
          </OptionSection>

          <OptionSection
            title="Accessibility"
            description="Settings to improve accessibility and usability.">
            <OptionWrapper
              title="Appearance"
              description="Set the appearance of the application. Choose between Light, Dark, or System default."
            >
              <Select
                onValueChange={(value) => {
                  console.log(value);
                  setTheme(value);
                }}
                defaultValue={selectedTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Appearance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              </OptionWrapper>
          </OptionSection>

          <OptionSection
            title="Developer Tools"
            description="Settings for developers and advanced users."
          >
            <OptionWrapper
              title="Show Redux Dev Tools"
              description="Show the Redux Dev Tools in the bottom right corner of the screen."
            >
              <div className="mt-2">
                <Switch
                  checked={content.clientSettings.showReduxDevTools}
                  onCheckedChange={(state) => {
                    dispatch(
                      setClientSettings({
                        ...content.clientSettings,
                        showReduxDevTools: state,
                      })
                    );
                  }}
                />
              </div>
            </OptionWrapper>

            <OptionWrapper
              title="Clear Persistent Data"
              description="Reset all stored data and reload the application."
            >
              <button
                onClick={async () => {
                  clearPersistedData();
                  window.location.reload();
                }}
                className="mt-2 text-red-500 hover:text-red-600 transition-colors"
              >
                Clear Persistent Data
              </button>
            </OptionWrapper>
          </OptionSection>
          <OptionWrapper
            title="Thank you for using Orbit!"
            description={`Built with ❤️ by aph — Orbit is part of oOVOLabs.`}
          >
            <Button
              variant={"secondary"}
              className="mt-2"
              onClick={() => {
                const w = new WebviewWindow("my-new-window", {
                  url: "/changelog",
                  width: 800,
                  height: 600,
                  title: "Orbit - Changelog",
                });

                // you can listen to creation or errors
                w.once("tauri://created", () => {
                  Logger.info("changelog window created");
                });
                w.once("tauri://error", (e) => {
                  Logger.error("error creating window:", e);
                });
              }}
            >
              Version {packageJSON.version}
            </Button>
          </OptionWrapper>
        </div>
      </div>
    </div>
  );
}
