import { useSyncExternalStore } from "react";
import type { Session } from "@supabase/supabase-js";
import { requireSupabaseConfig, supabase } from "./supabase";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthSnapshot {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AUTH_EVENT = "medisense-auth";

let snapshot: AuthSnapshot = {
  session: null,
  user: null,
  loading: typeof window !== "undefined",
};
let initialized = false;

function userFromSession(session: Session | null): User | null {
  const authUser = session?.user;
  if (!authUser?.email) return null;
  const metadata = authUser.user_metadata;
  const name =
    typeof metadata["name"] === "string"
      ? metadata["name"]
      : typeof metadata["full_name"] === "string"
        ? metadata["full_name"]
        : authUser.email.split("@")[0] || "User";
  return { id: authUser.id, name, email: authUser.email };
}

function emit(next: Partial<AuthSnapshot>) {
  snapshot = { ...snapshot, ...next };
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function initializeAuth() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  supabase.auth
    .getSession()
    .then(({ data }) => {
      emit({
        session: data.session,
        user: userFromSession(data.session),
        loading: false,
      });
    })
    .catch(() => emit({ session: null, user: null, loading: false }));

  supabase.auth.onAuthStateChange((_event, session) => {
    emit({ session, user: userFromSession(session), loading: false });
  });
}

function subscribe(callback: () => void) {
  initializeAuth();
  window.addEventListener(AUTH_EVENT, callback);
  return () => window.removeEventListener(AUTH_EVENT, callback);
}

function getSnapshot() {
  initializeAuth();
  return snapshot;
}

const serverSnapshot: AuthSnapshot = { session: null, user: null, loading: false };

export function useAuth(): AuthSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}

export function useUser(): User | null {
  return useAuth().user;
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;
  requireSupabaseConfig();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user.email) return null;
  return userFromSession({
    access_token: "",
    refresh_token: "",
    expires_in: 0,
    token_type: "bearer",
    user: data.user,
  } as Session);
}

export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    requireSupabaseConfig();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, full_name: name } },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Sign up failed." };
  }
}

export async function logIn(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    requireSupabaseConfig();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Log in failed." };
  }
}

export async function logOut() {
  requireSupabaseConfig();
  await supabase.auth.signOut();
}
