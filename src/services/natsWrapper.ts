import { invoke } from '@tauri-apps/api/core';
import Logger from '@/services/logging';

export async function sendNatsMessage(
    server: string,
    topic: string,
    message: string
) {
    Logger.info("sendNatsMessage", "Sending message to NATS server", { server, topic, message });
    const response = await invoke("send_nats_request", {
        server,
        topic,
        message,
    });

    Logger.info("sendNatsMessage", "Received response from NATS server", response);

    return response;
}
