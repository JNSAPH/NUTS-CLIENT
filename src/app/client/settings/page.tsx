"use client";

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
    <div className="p-4 h-full w-full space-y-2">
      <p className="text-3xl font-bold">Settings</p>
      <p>Nuts Version {packageJSON.version}</p>
      <hr className="border border-clientColors-card-border" />
      <div className="space-y-4">

        <div className="flex flex-col space-y-2">
          <Label htmlFor="airplane-mode">Hide Update Notifications</Label>
          <Switch id="airplane-mode" checked={content.clientSettings.hideUpdateNotifications} onCheckedChange={(state) => {
            dispatch(setClientSettings({
              ...content.clientSettings,
              hideUpdateNotifications: state
            }))
          }} />
        </div>


        <div className="flex flex-col space-y-2">
          <Label>Default NATS URL</Label>
          <input type="text" value={content.clientSettings.defaultNATSURL} onChange={(e) => {
            dispatch(setClientSettings({
              ...content.clientSettings,
              defaultNATSURL: e.target.value
            }))
          }} className="bg-clientColors-card-background border border-clientColors-card-border p-3 rounded-lg w-full" />
        </div>




        <hr className="border border-clientColors-card-border" />

        <p className="text-2xl font-bold">Developer Tools</p>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="airplane-mode">Show Redux Dev Tools</Label>
          <Switch id="airplane-mode"  checked={content.clientSettings.showReduxDevTools} onCheckedChange={(state) => {
            dispatch(setClientSettings({
              ...content.clientSettings,
              showReduxDevTools: state
            }))
          }} />
        </div>

        <div className="flex items-center space-x-2">
          <Label onClick={async () => { clearPersistedData(); window.location.reload(); }} className="text-red-500 cursor-pointer">Clear Persistant Data</Label>
        </div>

      </div>
    </div>
  );
}
