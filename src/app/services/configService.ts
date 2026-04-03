// Runtime configuration - loaded from public/config.json at runtime
// This prevents API keys from being bundled into the dist folder

interface RuntimeConfig {
  openrouterApiKey: string;
}

let config: RuntimeConfig | null = null;
let configPromise: Promise<RuntimeConfig> | null = null;

export async function loadConfig(): Promise<RuntimeConfig> {
  if (config) {
    return config;
  }

  if (!configPromise) {
    configPromise = fetch('/config.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load config.json');
        }
        return response.json();
      })
      .then(data => {
        config = data as RuntimeConfig;
        return config;
      })
      .catch(error => {
        console.warn('[Config] Failed to load config.json:', error);
        config = { openrouterApiKey: '' };
        return config;
      });
  }

  return configPromise;
}

export async function getOpenRouterApiKey(): Promise<string> {
  const cfg = await loadConfig();
  return cfg.openrouterApiKey || '';
}
