import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/*
 * Supabase-backed authentication for MediSense.
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

function toUser(session: { user: { id: string; email?: string; user_metadata?: Record<string, unknown> } } | null): User | null {
  if (!session?.user) return null;
  const meta = session.user.user_metadata ?? {};
  const name = (typeof meta['name'] === "string" && meta['name']) || session.user.email?.split("@")[0] || "User";
  return { id: session.user.id, name, email: session.user.email ?? "" };
}

export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${window.location.origin}/`,
    },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function logIn(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function logOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  return toUser(data.session);
}

export function useAuth(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session));
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(toUser(data.session));
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export function useUser(): User | null {
  return useAuth().user;
}
