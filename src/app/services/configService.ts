// Runtime configuration for Langdock
// Note: Prefix with VITE_ for Vite to bundle them into the frontend build

interface RuntimeConfig {
  langdockApiKey: string;
}

const config: RuntimeConfig = {
  // Use the new Langdock-specific environment variable
  langdockApiKey: import.meta.env.VITE_LANGDOCK_API_KEY || '',
};

/**
 * Returns the configuration object.
 */
export async function loadConfig(): Promise<RuntimeConfig> {
  return config;
}

/**
 * Retrieves the Langdock API Key from the environment.
 * (Used as a fallback or for client-side logging/debugging)
 */
export async function getLangdockApiKey(): Promise<string> {
  return config.langdockApiKey;
}

// Keep this alias if your existing components still call getOpenRouterApiKey
export const getOpenRouterApiKey = getLangdockApiKey;
