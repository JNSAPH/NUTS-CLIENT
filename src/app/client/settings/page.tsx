"use client";

import OptionWrapper from "@/components/settings/optionWrapper";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { setClientSettings } from "@/redux/slices/windowProperties";
import { clearPersistedData, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const packageJSON = require("../../../../package.json");

export default function Page() {
  const content = useSelector((state: RootState) => state.windowProperties);
  const dispatch = useDispatch();

  return (
    <div className="p-4 h-full w-full space-y-2  overflow-auto">
      <div>
        <p className="text-3xl font-bold">Settings</p>
        <p>Nuts Version {packageJSON.version}</p>
      </div>
      <hr className="border border-clientColors-card-border" />
      <div className="space-y-4 pb-16">
        <OptionWrapper className="flex flex-col space-y-2" title="Hide Update Notifications" description="Hide the update notifications that appear when a new version of Nuts is available.">
          <Switch id="airplane-mode" checked={content.clientSettings.hideUpdateNotifications} onCheckedChange={(state) => {
            dispatch(setClientSettings({
              ...content.clientSettings,
              hideUpdateNotifications: state
            }))
          }} />
        </OptionWrapper>

        <OptionWrapper className="flex flex-col space-y-2" title="Default NATS URL" description="The default NATS URL that will be used when creating a new connection.">
          <input type="text" value={content.clientSettings.defaultNATSURL} onChange={(e) => {
            dispatch(setClientSettings({
              ...content.clientSettings,
              defaultNATSURL: e.target.value
            }))
          }} className="bg-clientColors-card-background border border-clientColors-card-border p-3 rounded-lg w-full" />
        </OptionWrapper>

        <hr className="border border-clientColors-card-border" />

        <p className="text-2xl font-bold">Developer Tools</p>

        <OptionWrapper className="flex flex-col space-y-2" title="Show Redux Dev Tools" description="Show the Redux Dev Tools in the bottom right corner of the screen.">
          <Switch id="airplane-mode" checked={content.clientSettings.showReduxDevTools} onCheckedChange={(state) => {
            dispatch(setClientSettings({
              ...content.clientSettings,
              showReduxDevTools: state
            }))
          }} />
        </OptionWrapper>

        <OptionWrapper className="flex flex-col space-y-2" title="Show Redux Dev Tools" description="Show the Redux Dev Tools in the bottom right corner of the screen.">
          <Label onClick={async () => { clearPersistedData(); window.location.reload(); }} className="text-red-500 cursor-pointer">Clear Persistant Data</Label>
        </OptionWrapper>
      </div>
    </div>
  );
}
