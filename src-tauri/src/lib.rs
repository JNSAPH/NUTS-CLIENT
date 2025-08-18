use async_nats;
use serde::Deserialize;
use async_nats::ConnectOptions;
// Removed the unused `nkeys::KeyPair` import

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

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn send_nats_request(
    server: &str,
    topic: &str,
    message: &str,
    auth: NatsAuth, // This is the new parameter
) -> Result<String, String> {
    // 1. Convert string references to owned Strings
    let server_url = server.to_string();
    let topic_name = topic.to_string();
    let message_payload = message.to_string();

    // 2. Configure NATS connection options based on the `auth` enum
    let options = match auth {
        NatsAuth::None => {
            // No authentication options
            ConnectOptions::new()
        }
        NatsAuth::Token { token } => {
            // Authenticate with a token
            ConnectOptions::with_token(token)
        }
        NatsAuth::UserPassword { username, password } => {
            // Authenticate with username and password
            ConnectOptions::with_user_and_password(username, password)
        }
        NatsAuth::NKeys { jwt, seed } => {
            // Authenticate with NKeys (seed)
            ConnectOptions::with_nkey(seed)
        }
    };

    // 3. Connect to NATS using the configured options
    let client = options
        .connect(&server_url)
        .await
        .map_err(|e| format!("Error connecting to NATS: {}", e))?;

    // 4. Send the request and handle the response
    let request = async_nats::Request::new()
        .payload(message_payload.into())
        .timeout(Some(std::time::Duration::from_secs(10)));

    let response = client
        .send_request(topic_name, request) // Passing the owned String
        .await
        .map_err(|e| format!("Error sending request: {}", e))?;

    // 5. Convert the response payload to a string
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
        .invoke_handler(tauri::generate_handler![greet, send_nats_request]) // Add `send_nats_request` here
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}