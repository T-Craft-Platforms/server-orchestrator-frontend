import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface UserPreferences {
  namespaceBackdropEnabled: boolean;
}

interface UserPreferencesContextValue {
  preferences: UserPreferences;
  setNamespaceBackdropEnabled: (enabled: boolean) => void;
}

const STORAGE_KEY = 'server-orchestrator:user-preferences';

const defaultPreferences: UserPreferences = {
  namespaceBackdropEnabled: true,
};

const UserPreferencesContext = createContext<UserPreferencesContextValue | undefined>(undefined);

function loadStoredPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return defaultPreferences;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultPreferences;
    }
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return {
      ...defaultPreferences,
      ...parsed,
    };
  } catch {
    return defaultPreferences;
  }
}

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadStoredPreferences());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const setNamespaceBackdropEnabled = (enabled: boolean) => {
    setPreferences((previous) => ({
      ...previous,
      namespaceBackdropEnabled: enabled,
    }));
  };

  const value = useMemo<UserPreferencesContextValue>(
    () => ({
      preferences,
      setNamespaceBackdropEnabled,
    }),
    [preferences],
  );

  return <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>;
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}
