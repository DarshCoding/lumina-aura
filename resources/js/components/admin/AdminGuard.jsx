import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function AdminGuard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.status === 401) {
          navigate("/admin/login", { replace: true });
          return;
        }
        if (!cancelled) setReady(true);
      } catch {
        navigate("/admin/login", { replace: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-sm text-ink-muted">
        Loading…
      </div>
    );
  }

  return <Outlet />;
}
