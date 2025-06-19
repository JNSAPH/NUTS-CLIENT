import React from "react";
import { IcoLock } from "./Icons";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

interface AuthDialogProps {
    selectedRequest: any | null;
}

export default function AuthDialog({ selectedRequest }: AuthDialogProps) {
    const [defaultTab, setDefaultTab] = React.useState("debug");

    return (
        <Dialog>
            <DialogTrigger className="bg-clientColors-button-background h-full aspect-square rounded-lg border border-clientColors-card-border hover:border-clientColors-scrollbarThumb-hover active:bg-clientColors-card-border flex items-center justify-center">
                <IcoLock size={16} />
            </DialogTrigger>
            <DialogContent className="min-h-[400px] max-h-[80vh] w-full max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">NATS Authentication</DialogTitle>
                    <DialogDescription>
                        <div className="flex w-full max-w-sm flex-col gap-6">
                            <Tabs defaultValue={defaultTab} onValueChange={(value) => setDefaultTab(value)}>
                                <TabsList>
                                    <TabsTrigger value="token">Token</TabsTrigger>
                                    <TabsTrigger value="debug">Debug</TabsTrigger>
                                </TabsList>
                                <TabsContent value="token">

                                </TabsContent>
                                <TabsContent value="debug">
                                    <pre>
                                        {JSON.stringify(selectedRequest || {}, null, 2)}
                                    </pre>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
