import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userEmail, setUserEmail] = useState(null);

  const signIn = useCallback((email) => {
    setUserEmail(String(email).trim());
  }, []);

  const signOut = useCallback(() => {
    setUserEmail(null);
  }, []);

  const value = useMemo(
    () => ({ userEmail, signIn, signOut }),
    [userEmail, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return context;
}
