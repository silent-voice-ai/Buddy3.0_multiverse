'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from './types';
import { getCurrentUserId, setCurrentUserId, clearCurrentUser } from './storage';

const USERS_KEY = 'buddy_users';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (fullName: string, email: string, password: string) => { error?: string };
  signIn: (email: string, password: string) => { error?: string };
  logout: () => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + password.length;
}

function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getCurrentUserId();
    if (id) {
      const users = getUsers();
      const found = users.find(u => u.id === id);
      if (found) setUser(found);
    }
    setLoading(false);
  }, []);

  const signUp = useCallback((fullName: string, email: string, password: string): { error?: string } => {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'An account with this email already exists.' };
    }
    const newUser: User = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
      fullName,
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    setCurrentUserId(newUser.id);
    setUser(newUser);
    return {};
  }, []);

  const signIn = useCallback((email: string, password: string): { error?: string } => {
    const users = getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { error: 'No account found with this email.' };
    }
    if (found.passwordHash !== hashPassword(password)) {
      return { error: 'Incorrect password.' };
    }
    setCurrentUserId(found.id);
    setUser(found);
    return {};
  }, []);

  const logout = useCallback(() => {
    clearCurrentUser();
    setUser(null);
  }, []);

  const deleteAccount = useCallback(() => {
    if (user) {
      const users = getUsers().filter(u => u.id !== user.id);
      saveUsers(users);
    }
    clearCurrentUser();
    localStorage.removeItem('buddy_app_data');
    setUser(null);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
