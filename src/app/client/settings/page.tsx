"use client";

import OptionWrapper from "@/components/settings/optionWrapper";
import { Switch } from "@/components/ui/switch";
import { setClientSettings } from "@/redux/slices/windowProperties";
import { clearPersistedData, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const packageJSON = require("../../../../package.json");

export default function Page() {
  const content = useSelector((state: RootState) => state.windowProperties);
  const dispatch = useDispatch();

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <h1 className="text-3xl font-bold">Settings</h1>

          <hr className="border border-clientColors-card-border" />

          <div className="space-y-4 pb-8">
            <OptionWrapper
              title="Hide Update Notifications"
              description="Hide the update notifications that appear when a new version of Nuts is available."
            >
              <div className="mt-2">
                <Switch
                  checked={content.clientSettings.hideUpdateNotifications}
                  onCheckedChange={(state) => {
                    dispatch(setClientSettings({
                      ...content.clientSettings,
                      hideUpdateNotifications: state
                    }))
                  }}
                />
              </div>
            </OptionWrapper>

            <OptionWrapper
              title="Default NATS URL"
              description="The default NATS URL that will be used when creating a new connection."
            >
              <input
                type="text"
                value={content.clientSettings.defaultNATSURL}
                onChange={(e) => {
                  dispatch(setClientSettings({
                    ...content.clientSettings,
                    defaultNATSURL: e.target.value
                  }))
                }}
                className="mt-2 bg-clientColors-card-background border border-clientColors-card-border p-3 rounded-lg w-full"
              />
            </OptionWrapper>

            <hr className="border border-clientColors-card-border" />

            <h2 className="text-2xl font-bold">Developer Tools</h2>

            <OptionWrapper
              title="Show Redux Dev Tools"
              description="Show the Redux Dev Tools in the bottom right corner of the screen."
            >
              <div className="mt-2">
                <Switch
                  checked={content.clientSettings.showReduxDevTools}
                  onCheckedChange={(state) => {
                    dispatch(setClientSettings({
                      ...content.clientSettings,
                      showReduxDevTools: state
                    }))
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

            <OptionWrapper
              title="Thank you for using NATS"
              description="NATS is a free and open-source project. If you enjoy using NATS, please consider supporting the project by donating."
            >
              <div className="mt-2 space-y-2">
                <p>Nuts Version {packageJSON.version}</p>
                <a
                  href={packageJSON.repository.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors inline-block"
                >
                  View on GitHub
                </a>
              </div>
            </OptionWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}