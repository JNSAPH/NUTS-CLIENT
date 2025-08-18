use async_nats;
use serde::Deserialize;
use async_nats::ConnectOptions;
use nkeys::KeyPair;
use std::sync::Arc;
use async_nats::AuthError; // Import AuthError

#[derive(Debug, Deserialize)]
#[serde(tag = "authType")]
pub enum NatsAuth {
    #[serde(rename = "NONE")]
    None,
    #[serde(rename = "TOKEN")]
    Token { token: String },
    #[serde(rename = "USERPASSWORD")]
    UserPassword { username: String, password: String },
    #[serde(rename = "NKEYS")]
    NKeys { jwt: String, seed: String },
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn send_nats_request(
    server: &str,
    topic: &str,
    message: &str,
    auth: NatsAuth,
) -> Result<String, String> {
    let server_url = server.to_string();
    let topic_name = topic.to_string();
    let message_payload = message.to_string();

    let mut options = ConnectOptions::new();

    match auth {
        NatsAuth::None => {
            // No changes needed
        }
        NatsAuth::Token { token } => {
            options = options.token(token);
        }
        NatsAuth::UserPassword { username, password } => {
            options = options.user_and_password(username, password);
        }
        NatsAuth::NKeys { jwt, seed } => {
            let key_pair = nkeys::KeyPair::from_seed(&seed)
                .map_err(|e| format!("Invalid NKeys seed: {}", e))?;
            let key_pair = Arc::new(key_pair);

            options = options.jwt(jwt, move |nonce| {
                let key_pair = key_pair.clone();
                async move {
                    key_pair.sign(&nonce).map_err(async_nats::AuthError::new)
                }
            });
        }
    };

    let client = options
        .connect(&server_url)
        .await
        .map_err(|e| format!("Error connecting to NATS: {}", e))?;

    let request = async_nats::Request::new()
        .payload(message_payload.into())
        .timeout(Some(std::time::Duration::from_secs(10)));

    let response = client
        .send_request(topic_name, request)
        .await
        .map_err(|e| format!("Error sending request: {}", e))?;

    String::from_utf8(response.payload.to_vec())
        .map_err(|e| format!("Error converting response to string: {}", e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, send_nats_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}