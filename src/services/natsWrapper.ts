import { invoke } from '@tauri-apps/api/core';
import Logger from '@/services/logging';
import { AuthTypes } from '@/types/Auth';

export type NatsAuth =
    | { authType: AuthTypes.NONE }
    | { authType: AuthTypes.TOKEN; token: string }
    | { authType: AuthTypes.USERPASSWORD; username: string; password: string }
    | { authType: AuthTypes.NKEYS; jwt: string; seed: string };

export async function sendNatsMessage(
    server: string,
    topic: string,
    message: string,
    auth: NatsAuth
) {
    Logger.info("sendNatsMessage", "Sending message to NATS server", { server, topic, message, auth });
    const response = await invoke("send_nats_request", {
        server,
        topic,
        message,
    });

    Logger.info("sendNatsMessage", "Received response from NATS server", response);

    return response;
}
