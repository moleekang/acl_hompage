/* eslint-disable */
// AICONLAB Admin — App shell + Sidebar + router

const NAV = [
  { id: "dashboard", label: "대시보드",     path: "/admin",          icon: "dashboard" },
  { id: "members",   label: "멤버 관리",    path: "/admin/members",  icon: "users", count: 8 },
  { id: "wiki",      label: "위키 운영",    path: "/admin/wiki",     icon: "wiki" },
  { id: "events",    label: "공유회 관리",  path: "/admin/events",   icon: "calendar" },
  { id: "posts",     label: "블로그",        path: "/admin/posts",    icon: "edit" },
  { id: "products",  label: "자동화앱",      path: "/admin/products", icon: "box" },
];
const NAV_FOOT = [
  { id: "settings",  label: "설정",         path: "/admin/settings", icon: "settings" },
];

const PAGE_TITLES = {
  dashboard: { title: "대시보드",      crumb: "/admin",          sub: "오늘 운영 한눈에" },
  members:   { title: "멤버 관리",     crumb: "/admin/members",  sub: "guest · member · admin · suspended" },
  wiki:      { title: "위키 운영",     crumb: "/admin/wiki",     sub: "활성 페이지와 휴지통" },
  revisions: { title: "수정 이력",     crumb: "/admin/wiki/[id]/revisions", sub: "버전 비교 · 복원" },
  events:    { title: "공유회 관리",   crumb: "/admin/events",   sub: "초대 · RSVP · 발행" },
  eventDetail:{title: "공유회 상세",   crumb: "/admin/events/[id]", sub: "메타 · 본문 · 초대" },
  posts:     { title: "블로그",        crumb: "/admin/posts",    sub: "MDX · 임시저장 · 발행" },
  products:  { title: "자동화앱",      crumb: "/admin/products", sub: "진열 · 상태 · 출시 일정" },
  settings:  { title: "설정",          crumb: "/admin/settings", sub: "사이트 · 운영자 · 권한" },
};

const Sidebar = ({ page, go }) => {
  const isOn = (id) => {
    if (id === "wiki")   return page === "wiki" || page === "revisions";
    if (id === "events") return page === "events" || page === "eventDetail";
    return page === id;
  };
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
      {NAV.map(n => (
        <div key={n.id} className={"sb-item " + (isOn(n.id) ? "active" : "")} onClick={() => go(n.id)}>
          <Icon name={n.icon} size={18} style={{ flexShrink: 0 }} />
          <span>{n.label}</span>
          {n.count != null && <span className="count mono">{n.count}</span>}
        </div>
      ))}

      <div className="sb-divider" />
      <div className="sb-group-label">시스템</div>
      {NAV_FOOT.map(n => (
        <div key={n.id} className={"sb-item " + (isOn(n.id) ? "active" : "")} onClick={() => go(n.id)}>
          <Icon name={n.icon} size={18} style={{ flexShrink: 0 }} />
          <span>{n.label}</span>
        </div>
      ))}

      <div className="sb-footer">
        <div className="row">
          <div className="avatar">C</div>
          <div className="who">
            <div className="lbl">운영자</div>
            <div style={{ fontWeight: 700 }}>caden</div>
          </div>
        </div>
        <button className="out">로그아웃</button>
      </div>
    </nav>
  );
};

const App = () => {
  const [page, setPage] = React.useState("members");  // start on priority 1
  const [revPageId, setRevPageId] = React.useState(null);
  const [evDetailId, setEvDetailId] = React.useState(null);

  const go = (id) => {
    setPage(id);
    setRevPageId(null);
    setEvDetailId(null);
    // scroll top within main pane
    document.querySelector(".main")?.scrollTo?.({ top: 0 });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const meta = PAGE_TITLES[page];

  let body = null;
  if (page === "dashboard")        body = <Dashboard go={go} />;
  else if (page === "members")     body = <Members />;
  else if (page === "wiki")        body = <Wiki openRevisions={(id) => { setRevPageId(id); setPage("revisions"); }} />;
  else if (page === "revisions")   body = <Revisions pageId={revPageId} back={() => setPage("wiki")} />;
  else if (page === "events")      body = <Events openDetail={(id) => { setEvDetailId(id); setPage("eventDetail"); }} />;
  else if (page === "eventDetail") body = <EventDetail eventId={evDetailId} back={() => setPage("events")} />;
  else if (page === "posts")       body = <Posts />;
  else if (page === "products")    body = <Products />;
  else if (page === "settings")    body = <Settings />;

  return (
    <div className="admin-shell">
      <Sidebar page={page} go={go} />
      <main className="main">
        <header className="topbar">
          <div>
            <div className="crumb">{meta.crumb}</div>
            <h1>{meta.title}</h1>
          </div>
          <span className="hand" style={{
            color: "var(--fg-3)", fontSize: 18,
            transform: "rotate(-2deg)", marginLeft: 8,
          }}>
            — {meta.sub}
          </span>
          <div className="spacer" />
          <div className="meta">
            오늘 <b className="mono">2026.05.13</b> · 운영자 <b>caden</b>
          </div>
        </header>
        {body}
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
