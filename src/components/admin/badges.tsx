import type { ReactNode } from "react";
import type { Role } from "@/lib/admin/types";

export function RoleBadge({ role }: { role: Role | "suspended" }) {
  if (role === "admin") return <span className="badge badge-admin">★ admin</span>;
  if (role === "member") return <span className="badge badge-member"><span className="dot" />member</span>;
  if (role === "suspended") return <span className="badge badge-suspended"><span className="dot" />suspended</span>;
  return (
    <span className="badge badge-guest">
      <span className="dot" style={{ background: "var(--fg-3)" }} />
      guest
    </span>
  );
}

export type StatusKind =
  | "live" | "draft" | "closed" | "open" | "done"
  | "beta" | "coming" | "retired";

export function Status({ kind, label }: { kind: StatusKind; label: string }) {
  return (
    <span className={"status status-" + kind}>
      <span className="pt" />
      {label}
    </span>
  );
}

export function SectionHead({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="between" style={{ marginBottom: 14 }}>
      <div>
        <div className="card-title">{title}</div>
        {sub && <div className="card-sub">{sub}</div>}
      </div>
      {right}
    </div>
  );
}
