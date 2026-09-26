import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/pricing";

const nav = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/billings", label: "Billings" },
  { href: "/admin/hampers", label: "Gift hampers" },
  { href: "/admin/content", label: "Site content" },
];

export function AdminShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  async function logout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-ink/10 bg-ink text-paper md:flex md:flex-col">
          <div className="border-b border-paper/10 px-6 py-8">
            <Link to="/" className="font-display text-xs tracking-brand uppercase">
              Lummina Aura
            </Link>
            <p className="mt-2 text-[11px] text-paper/40">Admin</p>
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
            {nav.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-paper/10 text-paper"
                      : "text-paper/50 hover:text-paper"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-paper/10 p-4">
            <button
              type="button"
              onClick={logout}
              className="w-full px-3 py-2 text-left text-sm text-paper/50 hover:text-paper"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-ink/10 px-4 py-4 md:px-8">
            <div className="flex items-center gap-4 overflow-x-auto md:hidden">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="whitespace-nowrap text-xs tracking-wide text-ink-muted"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="hidden font-display text-sm tracking-tight md:block">
              Dashboard
            </p>
            <Link to="/" className="text-xs text-ink-muted hover:text-ink">
              View site
            </Link>
          </header>
          <div className="flex-1 px-4 py-8 md:px-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
