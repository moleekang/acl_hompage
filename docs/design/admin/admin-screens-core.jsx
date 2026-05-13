/* eslint-disable */
// AICONLAB Admin — core screens: Dashboard / Members / Wiki / Revisions

/* ============================================================
   DASHBOARD
   ============================================================ */
const Dashboard = ({ go }) => {
  const recentWikiEditors = ["u01", "u06", "u02"];
  const next = MOCK_EVENTS.find(e => e.status === "open") || MOCK_EVENTS[0];
  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="grid-2">
        {/* 1. 신규 가입 */}
        <div className="card elevated">
          <div className="between">
            <div>
              <div className="micro">신규 가입 · 최근 7일</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
                <span className="mono" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1 }}>16</span>
                <span className="mono" style={{ fontSize: 13, color: "var(--text-mint)" }}>+5 어제</span>
              </div>
            </div>
            <span className="sticker mint" style={{ transform: "rotate(3deg)" }}>지난 주보다 ↑</span>
          </div>
          <div style={{ marginTop: 14 }}>
            <Sparkline data={SPARK_SIGNUPS} />
            <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)", display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span>5/07</span><span>5/08</span><span>5/09</span><span>5/10</span><span>5/11</span><span>5/12</span><span>오늘</span>
            </div>
          </div>
        </div>

        {/* 2. 위키 멤버 신청 대기 */}
        <div className="card elevated">
          <div className="micro">위키 멤버 승급 대기</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
            <span className="mono" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1 }}>3</span>
            <span style={{ fontSize: 13, color: "var(--fg-3)" }}>명이 검토 대기 중</span>
          </div>
          <div className="stack" style={{ gap: 8, marginTop: 14 }}>
            {["u04", "u05", "u08"].map(uid => {
              const m = findMember(uid);
              return (
                <div key={uid} className="row" style={{ justifyContent: "space-between", padding: "8px 12px", background: "var(--surface-2)", borderRadius: 8 }}>
                  <div className="row" style={{ gap: 10 }}>
                    <Avatar name={m.name} size="sm" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{m.name}</div>
                      <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)" }}>가입 {m.joinedAt}</div>
                    </div>
                  </div>
                  <RoleBadge role="guest" />
                </div>
              );
            })}
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 12, width: "100%" }} onClick={() => go("members")}>
            검토하러 가기 <Icon name="arrow-right" size={14} />
          </button>
        </div>

        {/* 3. 활성 위키 페이지 */}
        <div className="card elevated">
          <div className="micro">활성 위키 페이지</div>
          <div className="row" style={{ gap: 18, alignItems: "flex-end", marginTop: 6 }}>
            <div>
              <span className="mono" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1 }}>{MOCK_WIKI.filter(w => !w.deleted).length}</span>
              <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>활성 페이지</div>
            </div>
            <div>
              <span className="mono" style={{ fontSize: 24, fontWeight: 700, color: "var(--text-mint)" }}>2</span>
              <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>오늘 수정</div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div className="micro" style={{ marginBottom: 8 }}>최근 수정자</div>
            <div className="row">
              {recentWikiEditors.map((uid, i) => {
                const m = findMember(uid);
                return <span key={uid} style={{ marginLeft: i === 0 ? 0 : -8 }}><Avatar name={m.name} size="sm" style={{ border: "2px solid var(--surface-1)" }} /></span>;
              })}
              <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)", marginLeft: 10 }}>
                {recentWikiEditors.map(u => findMember(u).name).join(" · ")}
              </span>
            </div>
          </div>
        </div>

        {/* 4. 다가오는 공유회 */}
        <div className="card elevated">
          <div className="between">
            <div className="micro">다가오는 공유회</div>
            <Status kind="open" label={STATUS_LABELS[next.status]} />
          </div>
          <h3 style={{ fontSize: 22, marginTop: 8 }}>{next.title}</h3>
          <div className="mono" style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 6 }}>{next.when} · {next.where}</div>
          <div className="row" style={{ gap: 14, marginTop: 14 }}>
            <div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 700 }}>{next.invited}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)" }}>초대됨</div>
            </div>
            <div style={{ width: 1, alignSelf: "stretch", background: "var(--border-1)" }} />
            <div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--text-mint)" }}>{next.going}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)" }}>참석</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--fg-3)" }}>{next.pending}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)" }}>대기</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--text-hot)" }}>{next.declined}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)" }}>거절</div>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="card elevated">
        <SectionHead title="빠른 액션" sub="자주 쓰는 글쓰기와 발행 작업" />
        <div className="grid-4">
          <button className="btn btn-primary btn-lg" onClick={() => go("posts")}>
            <Icon name="plus" size={14} /> 새 글
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => go("products")}>
            <Icon name="plus" size={14} /> 새 제품
          </button>
          <button className="btn btn-secondary btn-lg">
            <Icon name="plus" size={14} /> 새 공지
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => go("events")}>
            <Icon name="plus" size={14} /> 새 공유회
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MEMBERS  (priority 1)
   ============================================================ */
const Members = () => {
  const [filter, setFilter] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [openUid, setOpenUid] = React.useState(null);

  const filters = [
    { k: "all",       label: "전체",      n: MOCK_MEMBERS.length },
    { k: "guest",     label: "guest",     n: MOCK_MEMBERS.filter(m => m.role === "guest").length },
    { k: "member",    label: "member",    n: MOCK_MEMBERS.filter(m => m.role === "member").length },
    { k: "admin",     label: "admin",     n: MOCK_MEMBERS.filter(m => m.role === "admin").length },
    { k: "suspended", label: "suspended", n: MOCK_MEMBERS.filter(m => m.role === "suspended").length },
  ];
  const rows = MOCK_MEMBERS.filter(m => filter === "all" || m.role === filter)
    .filter(m => !query || m.name.includes(query) || m.email.toLowerCase().includes(query.toLowerCase()));

  const rowActions = (role) => {
    const items = [];
    if (role === "guest")     items.push({ id: "promote",   label: "★ 위키 멤버로 승급", primary: true });
    if (role === "member")    items.push({ id: "demote",    label: "위키 멤버 회수" });
    if (role !== "suspended") items.push({ id: "suspend",   label: "정지" });
    if (role === "suspended") items.push({ id: "unsuspend", label: "정지 해제", primary: true });
    items.push({ divider: true });
    items.push({ id: "profile", label: "공개 프로필 보기" });
    return items;
  };

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="row wrap" style={{ gap: 12 }}>
        <div className="search" style={{ flex: "1 1 320px", maxWidth: 420 }}>
          <Icon name="search" size={16} />
          <input className="input" placeholder="닉네임 또는 이메일로 검색하세요" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="row wrap" style={{ gap: 6 }}>
          {filters.map(f => (
            <button key={f.k} className={"chip " + (filter === f.k ? "active" : "")} onClick={() => setFilter(f.k)}>
              {f.label}<span className="n">{f.n}</span>
            </button>
          ))}
        </div>
        <div className="grow" />
        <button className="btn btn-primary"><Icon name="plus" size={14} /> 멤버 초대</button>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "26%" }}>닉네임</th>
              <th>이메일</th>
              <th style={{ width: 120 }}>역할</th>
              <th style={{ width: 110 }}>가입일</th>
              <th style={{ width: 150 }}>마지막 로그인</th>
              <th style={{ width: 60 }} className="actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6}><div className="empty"><div className="h">조건에 맞는 멤버가 없어요</div><div>검색어나 필터를 바꿔 보세요.</div></div></td></tr>
            ) : rows.map(m => (
              <tr key={m.id} className={openUid === m.id ? "selected" : ""} onClick={() => setOpenUid(m.id)}>
                <td>
                  <div className="user-cell">
                    <Avatar name={m.name} />
                    <div style={{ minWidth: 0 }}>
                      <div className="nm">{m.name}</div>
                      <div className="handle">@{m.id}</div>
                    </div>
                  </div>
                </td>
                <td><span className="mono" style={{ fontSize: 12, color: "var(--fg-2)" }}>{m.email}</span></td>
                <td><RoleBadge role={m.role} /></td>
                <td className="num">{m.joinedAt}</td>
                <td className="num">{m.lastLogin}</td>
                <td className="actions">
                  <RowMenu items={rowActions(m.role)} onSelect={() => {}} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openUid && <MemberDrawer uid={openUid} onClose={() => setOpenUid(null)} />}
    </div>
  );
};

const MemberDrawer = ({ uid, onClose }) => {
  const m = findMember(uid);
  if (!m) return null;
  return (
    <React.Fragment>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer">
        <div className="drawer-head">
          <Avatar name={m.name} size="lg" />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="row" style={{ gap: 8 }}>
              <h2 style={{ fontSize: 26 }}>{m.name}</h2>
              <RoleBadge role={m.role} />
            </div>
            <div className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>{m.email}</div>
          </div>
          <button className="close-x" onClick={onClose}><Icon name="close" size={16} /></button>
        </div>

        <div className="drawer-body stack" style={{ gap: 22 }}>
          <div>
            <div className="micro" style={{ marginBottom: 8 }}>소개</div>
            <p style={{ color: "var(--fg-2)" }}>{m.bio || "—"}</p>
          </div>

          <div className="grid-2" style={{ gap: 14 }}>
            <div className="card flat" style={{ background: "var(--surface-2)", padding: 14 }}>
              <div className="micro" style={{ marginBottom: 6 }}>가입일</div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{m.joinedAt}</div>
            </div>
            <div className="card flat" style={{ background: "var(--surface-2)", padding: 14 }}>
              <div className="micro" style={{ marginBottom: 6 }}>마지막 로그인</div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{m.lastLogin}</div>
            </div>
          </div>

          <div>
            <div className="micro" style={{ marginBottom: 12 }}>역할 변경 이력</div>
            <div className="tline">
              {m.history.slice().reverse().map((h, i) => (
                <div key={i} className={"tline-item " + (i === 0 ? "cur" : "")}>
                  <div className="row" style={{ gap: 8, marginBottom: 2 }}>
                    <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>{h.at}</span>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    {h.from ? (
                      <>
                        <RoleBadge role={h.from} /> <span style={{ color: "var(--fg-3)", margin: "0 4px" }}>→</span> <RoleBadge role={h.to} />
                      </>
                    ) : (
                      <><span style={{ color: "var(--fg-3)" }}>가입</span> <span style={{ color: "var(--fg-3)", margin: "0 4px" }}>→</span> <RoleBadge role={h.to} /></>
                    )}
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>
                    by {h.by === "system" ? "system" : h.by} {h.reason ? "· " + h.reason : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="drawer-foot">
          {m.role === "guest" && <button className="btn btn-primary">★ 위키 멤버로 승급</button>}
          {m.role === "member" && <button className="btn btn-secondary">위키 멤버 회수</button>}
          {m.role !== "suspended" && <button className="btn btn-danger">정지</button>}
          {m.role === "suspended" && <button className="btn btn-primary">정지 해제</button>}
          <button className="btn btn-ghost" onClick={onClose}>닫기</button>
        </div>
      </aside>
    </React.Fragment>
  );
};

/* ============================================================
   WIKI
   ============================================================ */
const Wiki = ({ openRevisions }) => {
  const [tab, setTab] = React.useState("active");
  const rows = MOCK_WIKI.filter(w => tab === "active" ? !w.deleted : w.deleted);
  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="row wrap" style={{ gap: 12 }}>
        <div className="row" style={{ gap: 6, padding: 4, background: "var(--surface-1)", border: "1px solid var(--border-1)", borderRadius: "var(--r-pill)" }}>
          <button className={"chip " + (tab === "active" ? "active" : "")} style={{ border: 0 }} onClick={() => setTab("active")}>
            활성 페이지<span className="n">{MOCK_WIKI.filter(w => !w.deleted).length}</span>
          </button>
          <button className={"chip " + (tab === "trash" ? "active" : "")} style={{ border: 0 }} onClick={() => setTab("trash")}>
            휴지통<span className="n">{MOCK_WIKI.filter(w => w.deleted).length}</span>
          </button>
        </div>
        <div className="grow" />
        <button className="btn btn-primary"><Icon name="plus" size={14} /> 새 페이지</button>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "32%" }}>제목</th>
              <th>슬러그</th>
              <th style={{ width: 200 }}>최종 수정자</th>
              <th style={{ width: 150 }}>수정일</th>
              <th style={{ width: 100 }}>revisions</th>
              <th style={{ width: 60 }} className="actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6}><div className="empty"><div className="h">{tab === "trash" ? "휴지통이 비어 있어요" : "활성 페이지가 없어요"}</div><div>{tab === "trash" ? "삭제한 페이지는 30일 동안 여기에 머물러요." : "위에서 새 페이지를 만들어 보세요."}</div></div></td></tr>
            ) : rows.map(w => {
              const ed = findMember(w.editor) || { name: "—" };
              return (
                <tr key={w.id} onClick={() => openRevisions && openRevisions(w.id)}>
                  <td><div style={{ fontWeight: 700 }}>{w.title}</div></td>
                  <td><code className="mono" style={{ fontSize: 11.5, background: "var(--surface-2)", padding: "2px 6px", borderRadius: 4 }}>/{w.slug}</code></td>
                  <td>
                    <div className="user-cell">
                      <Avatar name={ed.name} size="sm" />
                      <span style={{ fontSize: 13 }}>{ed.name}</span>
                    </div>
                  </td>
                  <td className="num">{w.editedAt}</td>
                  <td className="num">{w.revs}회</td>
                  <td className="actions">
                    <RowMenu
                      items={tab === "active" ? [
                        { id: "rev",     label: "수정 이력 보기", primary: true },
                        { id: "open",    label: "새 탭에서 열기" },
                        { divider: true },
                        { id: "delete",  label: "휴지통으로", danger: true },
                      ] : [
                        { id: "restore", label: "복원", primary: true },
                        { divider: true },
                        { id: "purge",   label: "완전 삭제", danger: true },
                      ]}
                      onSelect={(id) => { if (id === "rev") openRevisions(w.id); }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ============================================================
   WIKI REVISIONS
   ============================================================ */
const Revisions = ({ pageId, back }) => {
  const page = MOCK_WIKI.find(w => w.id === pageId) || MOCK_WIKI[0];
  const [cur, setCur] = React.useState(MOCK_REVISIONS[0].id);

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn btn-secondary btn-sm" onClick={back}><Icon name="chevron-left" size={14} /> 위키로</button>
        <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>/admin/wiki/{page.id}/revisions</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 18 }}>
        <div className="card flat" style={{ padding: 16 }}>
          <div className="micro" style={{ marginBottom: 12 }}>revision 타임라인</div>
          <div className="stack" style={{ gap: 4 }}>
            {MOCK_REVISIONS.map((r, i) => {
              const u = findMember(r.by);
              const active = cur === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setCur(r.id)}
                  style={{
                    textAlign: "left", padding: "10px 12px",
                    background: active ? "var(--ink-900)" : "transparent",
                    color: active ? "var(--paper)" : "var(--fg-1)",
                    border: 0, borderRadius: 8, cursor: "pointer",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <div className="row" style={{ gap: 6, justifyContent: "space-between" }}>
                    <span className="mono" style={{ fontSize: 11, color: active ? "var(--mint-300)" : "var(--fg-3)" }}>
                      {r.id} {i === 0 && "· 현재"}
                    </span>
                    <span className="mono" style={{ fontSize: 11, color: active ? "var(--mint-300)" : "var(--fg-3)" }}>
                      {r.at.slice(5, 10)}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>{r.note}</div>
                  <div className="mono" style={{ fontSize: 10, color: active ? "var(--mint-300)" : "var(--fg-3)", marginTop: 4 }}>
                    by {u ? u.name : r.by}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="stack" style={{ gap: 14 }}>
          <div className="between">
            <div>
              <h2 style={{ fontSize: 30 }}>{page.title}</h2>
              <div className="mono" style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 4 }}>
                비교: <b style={{ color: "var(--fg-1)" }}>{MOCK_REVISIONS.find(r => r.id === cur).id}</b>
                <span style={{ margin: "0 6px" }}>→</span>
                <b style={{ color: "var(--text-mint)" }}>r5 (현재)</b>
              </div>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <button className="btn btn-secondary">새 탭에서 열기 <Icon name="external" size={12} /></button>
              <button className="btn btn-primary" disabled={cur === "r5"} style={cur === "r5" ? { opacity: .5, cursor: "not-allowed" } : {}}>
                이 버전으로 복원
              </button>
            </div>
          </div>

          <div className="diff">
            {MOCK_DIFF.map((d, i) => (
              <div key={i} className={"diff-row " + d.kind}>
                <div className="ln">{d.n}</div>
                <div className="ct">{d.text}</div>
              </div>
            ))}
          </div>

          <div className="row" style={{ gap: 16, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>
            <span style={{ color: "var(--text-mint)" }}>+ 3 추가</span>
            <span style={{ color: "var(--text-hot)" }}>− 2 삭제</span>
            <span>· 컨텍스트 5줄</span>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Dashboard, Members, Wiki, Revisions });
