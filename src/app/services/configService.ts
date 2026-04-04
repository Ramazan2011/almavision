// Runtime configuration - now pulled from environment variables
// Note: These must be prefixed with VITE_ to be accessible in the browser

interface RuntimeConfig {
  openrouterApiKey: string;
}

// In Vite, environment variables are available on import.meta.env
const config: RuntimeConfig = {
  openrouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
};

/**
 * Returns the configuration object. 
 * Kept as async to maintain compatibility with your existing code,
 * though it now resolves instantly.
 */
export async function loadConfig(): Promise<RuntimeConfig> {
  return config;
}

/**
 * Retrieves the OpenRouter API Key from the environment.
 */
export async function getOpenRouterApiKey(): Promise<string> {
  return config.openrouterApiKey;
}
