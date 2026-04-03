// Shared cooldown state across all AI components
type CooldownCallback = (secondsLeft: number) => void;

let globalCooldownEnd = 0;
let cooldownInterval: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<CooldownCallback>();

function notifyListeners(seconds: number) {
  listeners.forEach(cb => cb(seconds));
}

export function getCooldownSeconds(): number {
  const now = Date.now();
  if (globalCooldownEnd > now) {
    return Math.ceil((globalCooldownEnd - now) / 1000);
  }
  return 0;
}

export function setCooldown(seconds: number) {
  globalCooldownEnd = Date.now() + seconds * 1000;
  if (cooldownInterval) clearInterval(cooldownInterval);
  cooldownInterval = setInterval(() => {
    const remaining = getCooldownSeconds();
    if (remaining <= 0) {
      if (cooldownInterval) clearInterval(cooldownInterval);
      cooldownInterval = null;
      notifyListeners(0);
    } else {
      notifyListeners(remaining);
    }
  }, 1000);
  notifyListeners(seconds);
}

export function useCooldownState() {
  return { getCooldownSeconds, setCooldown, subscribe: (cb: CooldownCallback) => {
    listeners.add(cb);
    // Immediately notify of current state
    cb(getCooldownSeconds());
    return () => { listeners.delete(cb); };
  }};
}
