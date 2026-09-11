"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError("Invalid username or password");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm border border-ink/10 bg-white p-8"
      >
        <p className="font-display text-xs tracking-brand uppercase text-ink-muted">
          Lummina Aura
        </p>
        <h1 className="mt-2 font-display text-2xl">Admin sign in</h1>
        <div className="mt-8 space-y-4">
          <div>
            <label className="text-xs tracking-wide uppercase text-ink-muted">
              Username
            </label>
            <input
              className="mt-1.5 w-full border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-ink"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-xs tracking-wide uppercase text-ink-muted">
              Password
            </label>
            <input
              type="password"
              className="mt-1.5 w-full border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-ink"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-ink py-3 text-xs tracking-widest uppercase text-paper hover:bg-flame disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-4 text-center text-[11px] text-ink-muted">
          Default: admin / lummina2024
        </p>
      </form>
    </div>
  );
}
