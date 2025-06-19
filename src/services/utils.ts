type NatsConnectionInfo = {
  url: string;
  username?: string;
  password?: string;
  token?: string;
};

export function parseNatsUrl(natsUrl: string): NatsConnectionInfo {
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
}
