import React, { useEffect } from "react";
import { IcoLock } from "./Icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { AuthTypes } from "@/types/Auth";
import { useDispatch } from "react-redux";
import { setAuthenticationType, setNATSToken, setUsernamePassword as setUsernamePasswordAction } from "@/redux/slices/projectFile";
import Logger from "@/services/logging";
import { Request } from "@/types/ProjectFile";

interface AuthDialogProps {
    selectedRequest: Request | null;
}

export default function AuthDialog({ selectedRequest }: AuthDialogProps) {
    const [defaultTab, setDefaultTab] = React.useState("debug");
    const [natsToken, setNatsToken] = React.useState("");
    const [usernamePassword, setUsernamePassword] = React.useState({ username: "", password: "" });

    const dispatch = useDispatch();

    function setAuthMethod(method: AuthTypes) {
        Logger.info("AuthDialog", "Setting authentication method to: " + method);
        dispatch(
            setAuthenticationType(method)
        );
    }

    // Initialize the dialog with the selected request's authentication details
    useEffect(() => {
        if (!selectedRequest) return;

        setNatsToken(selectedRequest.authentication?.token || "");
        setDefaultTab(selectedRequest.authentication?.type || "NONE");
        setUsernamePassword({
            username: selectedRequest.authentication?.usernamepassword?.username || "",
            password: selectedRequest.authentication?.usernamepassword?.password || ""
        });
    }, [selectedRequest]);



    // Update NATS token if it changes
    useEffect(() => {
        if (defaultTab === "TOKEN" && selectedRequest?.authentication?.token !== natsToken) {
            dispatch(setNATSToken(natsToken));
        }
    }, [natsToken]);

    // Update username/password if it changes
    useEffect(() => {
        if (defaultTab === "USERPASSWORD") {
            const old = selectedRequest?.authentication?.usernamepassword;
            if (!old || old.username !== usernamePassword.username || old.password !== usernamePassword.password) {
                dispatch(setUsernamePasswordAction(usernamePassword));
            }
        }
    }, [usernamePassword]);

    // Set the default authentication method based on the selected tab
    useEffect(() => {
        switch (defaultTab) {
            case "TOKEN":
                setAuthMethod(AuthTypes.TOKEN);
                break;
            case "USERPASSWORD":
                setAuthMethod(AuthTypes.USERPASSWORD);
                break;
            case "NONE":
                setAuthMethod(AuthTypes.NONE);
                break;
        }
    }, [defaultTab]);



    return (
        <Dialog>
            <DialogTrigger className="bg-clientColors-button-background h-full aspect-square rounded-lg border border-clientColors-card-border hover:border-clientColors-scrollbarThumb-hover active:bg-clientColors-card-border flex items-center justify-center">
                <IcoLock size={16} />
            </DialogTrigger>
            <DialogContent className="min-h-[400px] max-h-[80vh] flex flex-col items-start justify-start ">
                <DialogHeader className="space-y-0">
                    <DialogTitle className="text-2xl font-bold">NATS Authentication</DialogTitle>
                </DialogHeader>
                <div className="h-full w-full overflow-auto">
                    <Tabs defaultValue={defaultTab} onValueChange={(value) => {
                        setDefaultTab(value)
                        if (value === "TOKEN") setAuthMethod(AuthTypes.TOKEN);
                        else if (value === "USERPASSWORD") setAuthMethod(AuthTypes.USERPASSWORD);
                        else setAuthMethod(AuthTypes.NONE);
                    }}>
                        <TabsList>
                            <TabsTrigger value="NONE">None</TabsTrigger>
                            <TabsTrigger value="TOKEN">Token</TabsTrigger>
                            <TabsTrigger value="USERPASSWORD">Username / Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="TOKEN">
                            <input
                                type="text"
                                value={natsToken}
                                placeholder="(e.g. SUPER_SECRET_TOKEN)"
                                onChange={(e) => setNatsToken(e.target.value)}
                                className="bg-clientColors-card-background border border-clientColors-card-border p-3 rounded-lg w-full"
                            />
                        </TabsContent>
                        <TabsContent value="USERPASSWORD">
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    value={usernamePassword.username}
                                    placeholder="Username"
                                    onChange={(e) => setUsernamePassword({ ...usernamePassword, username: e.target.value })}
                                    className="bg-clientColors-card-background border border-clientColors-card-border p-3 rounded-lg w-full"
                                />
                                <input
                                    type="password"
                                    value={usernamePassword.password}
                                    placeholder="Password"
                                    onChange={(e) => setUsernamePassword({ ...usernamePassword, password: e.target.value })}
                                    className="bg-clientColors-card-background border border-clientColors-card-border p-3 rounded-lg w-full"
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="NONE" className="flex items-center justify-center h-full mt-8">
                            <pre>ᕦ(ò_óˇ)ᕤ No authentication selected</pre>
                        </TabsContent>
                    </Tabs>
                </div>
                {selectedRequest?.authentication?.type !== AuthTypes.NONE && (
                <DialogFooter className="flex flex-col items-end justify-end w-full mt-4">
                    <p className="text-xs text-red-500">
                    <b>Warning:</b> Auth details are saved to the Project File and may appear in source control. Avoid committing sensitive info. A privacy option is coming soon.
                    </p>
                </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
