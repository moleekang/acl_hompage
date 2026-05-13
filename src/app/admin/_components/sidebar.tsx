"use client";

// admin 좌측 사이드바. usePathname()으로 active 표시.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/admin/icons";

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
          <div className="avatar">C</div>
          <div className="who">
            <div className="lbl">운영자</div>
            <div style={{ fontWeight: 700 }}>caden</div>
          </div>
        </div>
        <button type="button" className="out">로그아웃</button>
      </div>
    </nav>
  );
}
