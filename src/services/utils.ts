type NatsConnectionInfo = {
  url: string;
  username?: string;
  password?: string;
  token?: string;
};

export function parseNatsUrl(natsUrl: string): NatsConnectionInfo {
  try {
    const parsed = new URL(natsUrl);

    const info: NatsConnectionInfo = {
      url: `${parsed.protocol}//${parsed.hostname}:${parsed.port}`,
    };

    // If both username and password are set, it's basic auth
    if (parsed.username && parsed.password) {
      info.username = decodeURIComponent(parsed.username);
      info.password = decodeURIComponent(parsed.password);
    }
    // If only username is set, treat it as token-based auth
    else if (parsed.username && !parsed.password) {
      info.token = decodeURIComponent(parsed.username);
    }

    return info;
  } catch (error) {
    return {
      url: natsUrl, // Return the original URL if parsing fails
      username: undefined,
      password: undefined,
      token: undefined,
    };
  }
}

export function addTokenToNatsUrl(natsUrl: string, token: string): string {
  try {
    const parsed = new URL(natsUrl);
    parsed.username = encodeURIComponent(token);
    parsed.password = ""; // Clear password if any
    return parsed.toString();
  } catch (error) {
    console.error("Invalid NATS URL format:", natsUrl, error);
    return natsUrl; // Return the original URL if parsing fails
  }
}

export function addUserPassToNatsUrl(natsUrl: string, username: string, password: string): string {
  try {
    const parsed = new URL(natsUrl);
    parsed.username = encodeURIComponent(username);
    parsed.password = encodeURIComponent(password);
    return parsed.toString();
  } catch (error) {
    console.error("Invalid NATS URL format:", natsUrl, error);
    return natsUrl; // Return the original URL if parsing fails
  }
}