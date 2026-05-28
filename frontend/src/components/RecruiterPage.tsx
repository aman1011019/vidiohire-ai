import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type Stat = { label: string; value: string | number; hint?: string };

export default function RecruiterPage({
  title,
  subtitle,
  badge,
  stats,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  stats?: Stat[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {badge && (
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-primary/40 text-primary">
                  {badge}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>

        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((s) => (
              <Card key={s.label} className="glass p-4">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="text-2xl font-bold mt-1 gradient-text">{s.value}</div>
                {s.hint && <div className="text-[11px] text-muted-foreground mt-1">{s.hint}</div>}
              </Card>
            ))}
          </div>
        )}

        {children}
      </div>
    </AppShell>
  );
}
