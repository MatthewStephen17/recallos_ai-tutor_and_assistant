import { Link, useLocation } from "@tanstack/react-router";
import { Brain, LayoutDashboard, Upload, MessageSquare, Sparkles, Moon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Capture", icon: Upload },
  { to: "/tutor", label: "AI Tutor", icon: MessageSquare },
  { to: "/reflect", label: "Reflect", icon: Moon },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col glass-strong border-r border-border/50 p-4 gap-2 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center glow-primary">
            <Brain className="size-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none">RecallOS</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Second Brain</div>
          </div>
        </Link>

        <div className="mt-4 flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-primary text-primary-foreground glow-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto glass rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="size-3 text-primary" />
            Streak
          </div>
          <div className="mt-2 text-2xl font-display font-bold text-gradient">12 days</div>
          <div className="mt-1 text-xs text-muted-foreground">Keep your brain fed.</div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
