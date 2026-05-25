"use client";

// admin 좌측 사이드바. usePathname()으로 active 표시.
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/admin/icons";
import { createClient } from "@/lib/supabase/client";

type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  count?: number;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "대시보드", icon: "dashboard" },
  { href: "/admin/members", label: "멤버 관리", icon: "users" },
  { href: "/admin/wiki", label: "위키 운영", icon: "wiki" },
  { href: "/admin/events", label: "공유회 관리", icon: "calendar" },
  { href: "/admin/posts", label: "블로그", icon: "edit" },
  { href: "/admin/products", label: "자동화앱", icon: "box" },
];
const NAV_FOOT: NavItem[] = [
  { href: "/admin/settings", label: "설정", icon: "settings" },
];

function useIsActive(href: string) {
  const path = usePathname();
  if (href === "/admin") return path === "/admin";
  return path === href || path?.startsWith(href + "/") || false;
}

function SidebarLink({ item }: { item: NavItem }) {
  const active = useIsActive(item.href);
  return (
    <Link
      href={item.href}
      className={"sb-item" + (active ? " active" : "")}
      style={{ textDecoration: "none" }}
    >
      <Icon name={item.icon} size={18} style={{ flexShrink: 0 }} />
      <span>{item.label}</span>
      {item.count != null && item.count > 0 && (
        <span className="count mono">{item.count}</span>
      )}
    </Link>
  );
}

export function AdminSidebar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  // 표시용: 이메일의 @ 앞부분 또는 이니셜
  const displayName = email ? email.split("@")[0] : "—";
  const initial = displayName.charAt(0).toUpperCase() || "?";

  return (
    <nav className="sb">
      <div className="sb-brand">
        <span className="mark">A</span>
        <div>
          <div className="name">AICONLAB</div>
          <div className="sub">ADMIN · v2</div>
        </div>
      </div>
      <div className="sb-divider" />

      <div className="sb-group-label">운영</div>
      {NAV.map((n) => <SidebarLink key={n.href} item={n} />)}

      <div className="sb-divider" />
      <div className="sb-group-label">시스템</div>
      {NAV_FOOT.map((n) => <SidebarLink key={n.href} item={n} />)}

      <div className="sb-footer">
        <div className="row">
          <div className="avatar">{initial}</div>
          <div className="who">
            <div className="lbl">운영자</div>
            <div style={{ fontWeight: 700 }} title={email ?? ""}>{displayName}</div>
          </div>
        </div>
        <button type="button" className="out" onClick={signOut}>
          로그아웃
        </button>
      </div>
    </nav>
  );
}
