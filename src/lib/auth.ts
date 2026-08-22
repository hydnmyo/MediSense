import { useSyncExternalStore } from "react";

/*
 * Mock frontend-only auth for the prototype.
 * Accounts and session live in localStorage; no real backend is involved.
 */

export interface User {
  name: string;
  email: string;
}

interface StoredAccount extends User {
  password: string;
}

const USERS_KEY = "medisense:users";
const SESSION_KEY = "medisense:session";
const AUTH_EVENT = "medisense-auth";

function readUsers(): Record<string, StoredAccount> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function readSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function notify() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  return readSession();
}

export function signUp(
  name: string,
  email: string,
  password: string,
): { ok: true } | { ok: false; error: string } {
  const users = readUsers();
  const key = email.toLowerCase();
  if (users[key]) return { ok: false, error: "An account with this email already exists." };
  users[key] = { name, email: key, password };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email: key }));
  notify();
  return { ok: true };
}

export function logIn(
  email: string,
  password: string,
): { ok: true } | { ok: false; error: string } {
  const users = readUsers();
  const account = users[email.toLowerCase()];
  if (!account || account.password !== password) {
    return { ok: false, error: "Invalid email or password." };
  }
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ name: account.name, email: account.email }),
  );
  notify();
  return { ok: true };
}

export function logOut() {
  localStorage.removeItem(SESSION_KEY);
  notify();
}

function subscribe(callback: () => void) {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useUser(): User | null {
  return useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(SESSION_KEY),
    () => null,
  ) ? readSession() : null;
}
