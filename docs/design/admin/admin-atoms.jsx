/* eslint-disable */
// AICONLAB Admin — atoms: line icons (no emoji), avatar palette, mini bits

const Icon = ({ name, size = 18, stroke = 1.6, style }) => {
  const common = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor",
    strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round",
    style,
  };
  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3"  width="7" height="9" rx="1.2" />
          <rect x="14" y="3" width="7" height="5" rx="1.2" />
          <rect x="14" y="11" width="7" height="10" rx="1.2" />
          <rect x="3" y="15" width="7" height="6" rx="1.2" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3 20c0-3.2 2.7-5.5 6-5.5s6 2.3 6 5.5" />
          <circle cx="17" cy="6.5" r="2.6" />
          <path d="M15.5 13c2.5.3 4.5 2.2 4.5 4.7" />
        </svg>
      );
    case "wiki":
      return (
        <svg {...common}>
          <path d="M4 4.5C4 4 4.4 3.5 5 3.5h6.5v17H5c-.6 0-1-.5-1-1V4.5z" />
          <path d="M20 4.5c0-.5-.4-1-1-1h-6.5v17H19c.6 0 1-.5 1-1V4.5z" />
          <path d="M7.5 8h2M7.5 11h2M14.5 8h2M14.5 11h2" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
          <path d="M3.5 9.5h17" />
          <path d="M8 3v4M16 3v4" />
          <rect x="7" y="13" width="3" height="3" rx=".5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "edit":
      return (
        <svg {...common}>
          <path d="M4 20.5h4l10-10-4-4-10 10v4z" />
          <path d="M14 6.5l4 4" />
        </svg>
      );
    case "box":
      return (
        <svg {...common}>
          <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5v-9z" />
          <path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.2 5.2l1.8 1.8M17 17l1.8 1.8M5.2 18.8L7 17M17 7l1.8-1.8" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "more":
      return (
        <svg {...common}>
          <circle cx="5"  cy="12" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6l-12 12" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg {...common}>
          <path d="M9 5l7 7-7 7" />
        </svg>
      );
    case "chevron-left":
      return (
        <svg {...common}>
          <path d="M15 5l-7 7 7 7" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common}>
          <path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      );
    case "restore":
      return (
        <svg {...common}>
          <path d="M4 11A8 8 0 0 1 19 9" />
          <path d="M19 4v5h-5" />
          <path d="M20 13a8 8 0 0 1-15 2" />
          <path d="M5 20v-5h5" />
        </svg>
      );
    case "external":
      return (
        <svg {...common}>
          <path d="M14 4h6v6" />
          <path d="M20 4l-9 9" />
          <path d="M19 13v6.5c0 .3-.2.5-.5.5H4.5c-.3 0-.5-.2-.5-.5v-14c0-.3.2-.5.5-.5H11" />
        </svg>
      );
    case "drag":
      return (
        <svg {...common}>
          <circle cx="9"  cy="6" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="6" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="9"  cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="9"  cy="18" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="18" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M5 12.5l4.5 4.5L19 7" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
          <circle cx="9" cy="10" r="1.6" />
          <path d="M4 18l5-5 4 4 3-3 4 4" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v5l3.2 2" />
        </svg>
      );
    default: return null;
  }
};

// Avatar — deterministic colored circle from name initials
const AVATAR_PALETTE = [
  { bg: "#FFD23F", fg: "#0E1116" },  // sun
  { bg: "#4DE0A6", fg: "#0E1116" },  // mint
  { bg: "#FF8E72", fg: "#0E1116" },  // hot
  { bg: "#9CEBC8", fg: "#0E1116" },
  { bg: "#5A7CFF", fg: "#FFFFFF" },  // electric
  { bg: "#EAE5D6", fg: "#1A1813" },  // paper-dim
  { bg: "#FFF4C4", fg: "#8A6A00" },
  { bg: "#FCE6DF", fg: "#C13E1F" },
];
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
const Avatar = ({ name, size = "md", style }) => {
  const initials = (name || "?").replace(/\s+/g, "").slice(0, 1).toUpperCase();
  const p = AVATAR_PALETTE[hashStr(name || "x") % AVATAR_PALETTE.length];
  const cls = "av " + (size === "sm" ? "av-sm" : size === "lg" ? "av-lg" : "");
  return (
    <span className={cls} style={{ background: p.bg, color: p.fg, ...style }}>
      {initials}
    </span>
  );
};

const Sparkline = ({ data, color = "var(--text-mint)", fill = "rgba(10,122,79,.10)" }) => {
  const w = 200, h = 44, pad = 4;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const stepX = (w - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => [pad + i * stepX, h - pad - ((v - min) / range) * (h - pad * 2)]);
  const path = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const fillPath = path + ` L${pts[pts.length - 1][0].toFixed(1)},${h} L${pts[0][0].toFixed(1)},${h} Z`;
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={fillPath} fill={fill} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 2.6 : 0} fill={color} />
      ))}
    </svg>
  );
};

// Tiny popover menu for row actions
const RowMenu = ({ items, onSelect }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        className="btn btn-ghost btn-sm"
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
        style={{ padding: 4, color: "var(--fg-2)" }}
        title="액션"
      >
        <Icon name="more" size={16} />
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute", right: 0, top: "calc(100% + 4px)",
            background: "var(--surface-1)",
            border: "1px solid var(--border-2)",
            borderRadius: "var(--r-input)",
            boxShadow: "var(--shadow-card)",
            minWidth: 180, zIndex: 20, padding: 4,
          }}
        >
          {items.map((it, i) => {
            if (it.divider) return <div key={i} style={{ height: 1, background: "var(--border-1)", margin: "4px 6px" }} />;
            return (
              <button
                key={i}
                onClick={() => { setOpen(false); onSelect && onSelect(it.id); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  width: "100%", textAlign: "left",
                  padding: "8px 10px", borderRadius: 6,
                  background: "transparent", border: 0, cursor: "pointer",
                  color: it.danger ? "var(--text-hot)" : it.primary ? "var(--text-mint)" : "var(--fg-1)",
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: it.primary ? 700 : 400,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--paper-dim)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                {it.label}
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
};

// Role badge
const RoleBadge = ({ role }) => {
  if (role === "admin")     return <span className="badge badge-admin">★ admin</span>;
  if (role === "member")    return <span className="badge badge-member"><span className="dot" />member</span>;
  if (role === "suspended") return <span className="badge badge-suspended"><span className="dot" />suspended</span>;
  return <span className="badge badge-guest"><span className="dot" style={{ background: "var(--fg-3)" }} />guest</span>;
};

// Status indicator (●)
const Status = ({ kind, label }) => (
  <span className={"status status-" + kind}>
    <span className="pt" />{label}
  </span>
);

// Card heading row
const SectionHead = ({ title, sub, right }) => (
  <div className="between" style={{ marginBottom: 14 }}>
    <div>
      <div className="card-title">{title}</div>
      {sub && <div className="card-sub">{sub}</div>}
    </div>
    {right}
  </div>
);

Object.assign(window, {
  Icon, Avatar, Sparkline, RowMenu, RoleBadge, Status, SectionHead,
});
