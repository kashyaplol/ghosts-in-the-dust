import { useCallback, useEffect, useState } from 'react';
import {
  ONBOARDING_VERSION,
  readOnboardingState,
  writeOnboardingState,
} from '@/utils/onboarding';

export default function useOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasResolved, setHasResolved] = useState(false);

  useEffect(() => {
    const state = readOnboardingState(window.localStorage);
    setIsOpen(!state || state.version !== ONBOARDING_VERSION);
    setHasResolved(true);
  }, []);

  const finish = useCallback((status) => {
    writeOnboardingState(window.localStorage, status);
    setIsOpen(false);
  }, []);

  const replay = useCallback(() => setIsOpen(true), []);

  return {
    isOpen: hasResolved && isOpen,
    finish,
    replay,
  };
}
