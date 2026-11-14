export const ONBOARDING_VERSION = 'v1';
export const ONBOARDING_STORAGE_KEY = 'ghosts-in-the-dust:onboarding';

export function readOnboardingState(storage) {
  try {
    const raw = storage?.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw);
    return state.version === ONBOARDING_VERSION ? state : null;
  } catch {
    return null;
  }
}

export function writeOnboardingState(storage, status) {
  try {
    storage?.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({
      version: ONBOARDING_VERSION,
      status,
    }));
  } catch {
    // Onboarding is optional; private browsing may deny storage access.
  }
}
