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
      <hr className="border border-clientColors-card-border"/>
      <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" onCheckedChange={(state) => {
          dispatch(setClientSettings({
            ...content.clientSettings,
            hideUpdateNotifications: state
          }))
        }}/>
        <Label htmlFor="airplane-mode">Hide Update Notifications</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Label onClick={async () => { clearPersistedData(); window.location.reload(); }}>Clear Persistant Data</Label>
      </div>

      </div>
    </div>
  );
}
