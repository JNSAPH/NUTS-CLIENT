use async_nats;
use bytes::Bytes;
use futures::StreamExt;
use std::error::Error;  // Import the Error trait

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn send_nats_request(server: &str, topic: &str, message: &str) -> Result<String, String> {
    // Convert string references to owned Strings
    let server = server.to_string();
    let topic = topic.to_string();
    let message = message.to_string();

    match async_nats::connect(&server).await {
        Ok(client) => {
            let request = async_nats::Request::new()
                .payload(message.into())
                .timeout(Some(std::time::Duration::from_secs(10)));

            match client.send_request(topic, request).await {
                Ok(response) => {
                    match String::from_utf8(response.payload.to_vec()) {
                        Ok(response_str) => Ok(response_str),
                        Err(e) => Err(format!("Error converting response to string: {}", e))
                    }
                },
                Err(e) => Err(format!("Error sending request: {}", e))
            }
        },
        Err(e) => Err(format!("Error connecting to NATS: {}", e))
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, send_nats_request])  // Add `send_nats_request` here
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
