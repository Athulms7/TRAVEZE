

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addAuthenticationExpiredListener,
  AuthUser,
  clearStoredAuthSession,
  getStoredAuthSession,
  StoredAuthSession,
  storeAuthSession,
  AUTH_API_BASE_URL,
} from '@/lib/api';

type User = AuthUser;

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User, rememberMe?: boolean) => void;
  updateUser: (user: User) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const storedSession = getStoredAuthSession();
    if (!storedSession) {
      setIsLoading(false);
      return;
    }

    setToken(storedSession.token);
    setUser(storedSession.user);
    setRememberMe(storedSession.rememberMe);

    async function validateSession(session: StoredAuthSession): Promise<void> {
      try {
        const response = await fetch(`${AUTH_API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${session.token}` },
        });
        if (response.status === 401) {
          clearStoredAuthSession();
          if (active) {
            setToken(null);
            setUser(null);
            setRememberMe(false);
          }
          return;
        }
        if (!response.ok) {
          throw new Error(`Session validation failed with status ${response.status}.`);
        }
        const profile: User = await response.json();
        if (active) {
          storeAuthSession(session.token, profile, session.rememberMe);
          setUser(profile);
        }
      } catch (error) {
        console.error('Unable to validate the saved sign-in session:', error);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void validateSession(storedSession);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => addAuthenticationExpiredListener(() => {
    clearStoredAuthSession();
    setToken(null);
    setUser(null);
    setRememberMe(false);
    navigate('/login', { replace: true });
  }), [navigate]);

  useEffect(() => {
    const synchronizeSession = () => {
      const session = getStoredAuthSession();
      setToken(session?.token ?? null);
      setUser(session?.user ?? null);
      setRememberMe(session?.rememberMe ?? false);
      if (!session) navigate('/login', { replace: true });
    };
    window.addEventListener('storage', synchronizeSession);
    return () => window.removeEventListener('storage', synchronizeSession);
  }, [navigate]);

  useEffect(() => {
    if (!token) return;
    const session = getStoredAuthSession();
    if (!session) return;
    let timeout = 0;
    const expireSession = () => {
      clearStoredAuthSession();
      setToken(null);
      setUser(null);
      setRememberMe(false);
      navigate('/login', { replace: true });
    };
    const scheduleExpiry = () => {
      const remaining = session.expiresAt - Date.now();
      if (remaining <= 0) {
        expireSession();
        return;
      }
      timeout = window.setTimeout(scheduleExpiry, Math.min(remaining, 2_147_000_000));
    };
    scheduleExpiry();
    return () => window.clearTimeout(timeout);
  }, [token, navigate]);

  const login = (newToken: string, newUser: User, persistSession = false) => {
    storeAuthSession(newToken, newUser, persistSession);
    setToken(newToken);
    setUser(newUser);
    setRememberMe(persistSession);
    setIsLoading(false);
  };

  const updateUser = (newUser: User) => {
    if (!token) throw new Error('You must be signed in to update your profile.');
    storeAuthSession(token, newUser, rememberMe);
    setUser(newUser);
  };

  const logout = useCallback(async () => {
    let signOutError: Error | null = null;
    const activeToken = token ?? getStoredAuthSession()?.token;
    if (activeToken) {
      try {
        const response = await fetch(`${AUTH_API_BASE_URL}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (!response.ok && response.status !== 401) {
          signOutError = new Error('The server could not revoke this session.');
        }
      } catch {
        signOutError = new Error('The server could not be reached to revoke this session.');
      }
    }

    clearStoredAuthSession();
    setToken(null);
    setUser(null);
    setRememberMe(false);
    navigate('/login', { replace: true });
    if (signOutError) throw signOutError;
  }, [navigate, token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        updateUser,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
