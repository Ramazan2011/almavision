interface RuntimeConfig {
  openrouterApiKey: string;
}

const config: RuntimeConfig = {
  // Pulls the key for the frontend
  openrouterApiKey: import.meta.env.VITE_LANGDOCK_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY || '',
};

export async function loadConfig(): Promise<RuntimeConfig> {
  return config;
}

export async function getOpenRouterApiKey(): Promise<string> {
  return config.openrouterApiKey;
}
