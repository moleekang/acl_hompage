/* eslint-disable */
// AICONLAB Admin — rest screens: Events / EventDetail / Posts / Products / Settings

/* ============================================================
   EVENTS LIST
   ============================================================ */
const Events = ({ openDetail }) => {
  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="row wrap" style={{ gap: 12 }}>
        <div className="search" style={{ flex: "1 1 320px", maxWidth: 420 }}>
          <Icon name="search" size={16} />
          <input className="input" placeholder="이벤트 제목으로 검색하세요" />
        </div>
        <div className="grow" />
        <button className="btn btn-primary"><Icon name="plus" size={14} /> 새 공유회</button>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>제목</th>
              <th style={{ width: 160 }}>일시</th>
              <th>위치</th>
              <th style={{ width: 110 }}>초대됨</th>
              <th style={{ width: 220 }}>RSVP</th>
              <th style={{ width: 100 }}>상태</th>
              <th style={{ width: 60 }} className="actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_EVENTS.map(e => {
              const total = e.going + e.declined + e.pending || 1;
              return (
                <tr key={e.id} onClick={() => openDetail(e.id)}>
                  <td><div style={{ fontWeight: 700 }}>{e.title}</div></td>
                  <td className="num">{e.when}</td>
                  <td><span style={{ fontSize: 13, color: "var(--fg-2)" }}>{e.where}</span></td>
                  <td>
                    <span className="mono" style={{ fontSize: 13 }}>{e.invited}</span>
                    <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}> / {e.capacity}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", background: "var(--paper-dim)" }}>
                      <div style={{ width: (e.going / total * 100) + "%", background: "var(--mint-400)" }} />
                      <div style={{ width: (e.pending / total * 100) + "%", background: "var(--ink-300)" }} />
                      <div style={{ width: (e.declined / total * 100) + "%", background: "var(--hot-400)" }} />
                    </div>
                    <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>
                      <span style={{ color: "var(--text-mint)" }}>참석 {e.going}</span>
                      <span> · 대기 {e.pending}</span>
                      <span style={{ color: "var(--text-hot)" }}> · 거절 {e.declined}</span>
                    </div>
                  </td>
                  <td><Status kind={e.status} label={STATUS_LABELS[e.status]} /></td>
                  <td className="actions">
                    <RowMenu items={[
                      { id: "view", label: "상세 보기", primary: true },
                      { id: "edit", label: "편집" },
                      { id: "dup",  label: "복제" },
                      { divider: true },
                      { id: "delete", label: "삭제", danger: true },
                    ]} onSelect={(id) => { if (id === "view") openDetail(e.id); }} />
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
   EVENT DETAIL — with invite manager
   ============================================================ */
const EventDetail = ({ eventId, back }) => {
  const ev = MOCK_EVENTS.find(e => e.id === eventId) || MOCK_EVENTS[0];
  const [picked, setPicked] = React.useState({});
  const [q, setQ] = React.useState("");

  const invitedUids = MOCK_RSVP.map(r => r.uid);
  const candidates = MOCK_MEMBERS.filter(m =>
    m.role !== "suspended" &&
    m.role !== "admin" &&
    !invitedUids.includes(m.id) &&
    (!q || m.name.includes(q) || m.email.toLowerCase().includes(q.toLowerCase()))
  );

  const pickedCount = Object.values(picked).filter(Boolean).length;
  const toggle = (uid) => setPicked(p => ({ ...p, [uid]: !p[uid] }));

  return (
    <div className="stack" style={{ gap: 22 }}>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn btn-secondary btn-sm" onClick={back}><Icon name="chevron-left" size={14} /> 공유회 목록</button>
        <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>/admin/events/{ev.id}</span>
      </div>

      {/* meta + body */}
      <div className="card elevated">
        <div className="between" style={{ alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <Status kind={ev.status} label={STATUS_LABELS[ev.status]} />
            <h2 style={{ fontSize: 34, marginTop: 8 }}>{ev.title}</h2>
            <div className="row wrap" style={{ gap: 18, marginTop: 12 }}>
              <span className="row" style={{ gap: 6 }}>
                <Icon name="clock" size={14} style={{ color: "var(--fg-3)" }} />
                <span className="mono" style={{ fontSize: 13 }}>{ev.when}</span>
              </span>
              <span className="row" style={{ gap: 6 }}>
                <Icon name="calendar" size={14} style={{ color: "var(--fg-3)" }} />
                <span style={{ fontSize: 13 }}>{ev.where}</span>
              </span>
              <span className="row" style={{ gap: 6 }}>
                <Icon name="users" size={14} style={{ color: "var(--fg-3)" }} />
                <span className="mono" style={{ fontSize: 13 }}>정원 {ev.capacity}명</span>
              </span>
            </div>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn btn-secondary"><Icon name="edit" size={14} /> 편집</button>
            <button className="btn btn-dark">발행</button>
          </div>
        </div>

        <div className="divider" style={{ margin: "20px 0" }} />

        <div className="micro" style={{ marginBottom: 8 }}>본문 미리보기</div>
        <p style={{ color: "var(--fg-2)", maxWidth: 700 }}>{ev.body}</p>
      </div>

      {/* RSVP table */}
      <div>
        <SectionHead
          title="초대된 멤버"
          sub={`이미 ${MOCK_RSVP.length}명을 초대했어요`}
        />
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: "32%" }}>닉네임</th>
                <th>이메일</th>
                <th style={{ width: 130 }}>RSVP</th>
                <th style={{ width: 60 }} className="actions">액션</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RSVP.map(r => {
                const m = findMember(r.uid);
                if (!m) return null;
                const kind = r.rsvp === "going" ? "live" : r.rsvp === "declined" ? "retired" : "draft";
                const label = r.rsvp === "going" ? "✓ 참석" : r.rsvp === "declined" ? "거절" : "대기";
                return (
                  <tr key={r.uid}>
                    <td>
                      <div className="user-cell">
                        <Avatar name={m.name} size="sm" />
                        <div className="nm">{m.name}</div>
                      </div>
                    </td>
                    <td><span className="mono" style={{ fontSize: 12, color: "var(--fg-2)" }}>{m.email}</span></td>
                    <td><Status kind={kind} label={label} /></td>
                    <td className="actions">
                      <RowMenu items={[
                        { id: "remind", label: "리마인드 보내기" },
                        { divider: true },
                        { id: "remove", label: "초대 취소", danger: true },
                      ]} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite manager */}
      <div className="card elevated">
        <SectionHead
          title="초대 관리"
          sub="아래에서 멤버를 골라 한 번에 초대할 수 있어요"
        />

        <div className="search" style={{ marginBottom: 14 }}>
          <Icon name="search" size={16} />
          <input className="input" placeholder="이름으로 멤버 검색" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {candidates.length === 0 ? (
          <div className="empty">
            <div className="h">초대할 수 있는 멤버가 없어요</div>
            <div>이미 모두 초대했거나 검색 결과가 없습니다.</div>
          </div>
        ) : (
          <div className="grid-4">
            {candidates.map(m => {
              const on = !!picked[m.id];
              return (
                <button
                  key={m.id}
                  onClick={() => toggle(m.id)}
                  style={{
                    textAlign: "left", padding: 14,
                    background: on ? "var(--mint-soft)" : "var(--surface-1)",
                    border: "1px solid " + (on ? "var(--text-mint)" : "var(--border-1)"),
                    borderRadius: "var(--r-card)",
                    cursor: "pointer", position: "relative",
                    transition: "all var(--t-fast) var(--ease-snap)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {on && (
                    <span style={{
                      position: "absolute", top: 10, right: 10,
                      width: 22, height: 22, borderRadius: 999,
                      background: "var(--mint-400)", border: "1.5px solid var(--ink-900)",
                      display: "grid", placeItems: "center", color: "var(--ink-900)",
                    }}>
                      <Icon name="check" size={12} stroke={2.4} />
                    </span>
                  )}
                  <Avatar name={m.name} size="lg" style={{ marginBottom: 10 }} />
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2, marginBottom: 8 }}>{m.email}</div>
                  <RoleBadge role={m.role} />
                </button>
              );
            })}
          </div>
        )}

        <div className="divider" style={{ margin: "18px 0 14px" }} />
        <div className="between">
          <div className="mono" style={{ fontSize: 13, color: "var(--fg-2)" }}>
            선택된 멤버 <b style={{ color: "var(--fg-1)", fontSize: 18 }}>{pickedCount}</b>명
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn btn-ghost" onClick={() => setPicked({})}>선택 해제</button>
            <button className="btn btn-primary" disabled={pickedCount === 0} style={pickedCount === 0 ? { opacity: .5, cursor: "not-allowed" } : {}}>
              선택된 {pickedCount}명 초대
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   POSTS — list + editor preview
   ============================================================ */
const Posts = () => {
  const [mode, setMode] = React.useState("list");  // list | edit
  if (mode === "edit") return <PostEditor back={() => setMode("list")} />;

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="row wrap" style={{ gap: 12 }}>
        <div className="search" style={{ flex: "1 1 320px", maxWidth: 420 }}>
          <Icon name="search" size={16} />
          <input className="input" placeholder="제목으로 검색" />
        </div>
        <div className="row" style={{ gap: 6 }}>
          {["전체", "사고방식", "자동화", "회사", "실패담", "logs"].map((c, i) => (
            <button key={c} className={"chip " + (i === 0 ? "active" : "")}>{c}</button>
          ))}
        </div>
        <div className="grow" />
        <button className="btn btn-primary" onClick={() => setMode("edit")}><Icon name="plus" size={14} /> 새 글</button>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "44%" }}>제목</th>
              <th style={{ width: 110 }}>카테고리</th>
              <th style={{ width: 120 }}>발행일</th>
              <th style={{ width: 80 }}>읽기</th>
              <th style={{ width: 150 }}>작성자</th>
              <th style={{ width: 110 }}>상태</th>
              <th style={{ width: 60 }} className="actions">액션</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_POSTS.map(p => {
              const a = findMember(p.author);
              return (
                <tr key={p.id} onClick={() => setMode("edit")}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{p.title}</div>
                    {p.subtitle && <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{p.subtitle}</div>}
                  </td>
                  <td><span className="chip" style={{ padding: "3px 9px", fontSize: 11 }}>{p.category}</span></td>
                  <td className="num">{p.date}</td>
                  <td className="num">{p.read}분</td>
                  <td>
                    <div className="user-cell">
                      <Avatar name={a.name} size="sm" />
                      <span style={{ fontSize: 13 }}>{a.name}</span>
                    </div>
                  </td>
                  <td>
                    {p.status === "published"
                      ? <Status kind="live" label="발행됨" />
                      : <Status kind="draft" label="초안" />}
                  </td>
                  <td className="actions">
                    <RowMenu items={[
                      { id: "edit", label: "편집", primary: true },
                      { id: "view", label: "새 탭에서 열기" },
                      { divider: true },
                      { id: "del",  label: "삭제", danger: true },
                    ]} />
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

const PostEditor = ({ back }) => {
  const [title, setTitle] = React.useState("프롬프트 너머의 컨텍스트");
  const [subtitle, setSubtitle] = React.useState("AI를 잘 쓰는 게 아니라, 컨텍스트를 잘 깔아주는 일");
  const [cat, setCat] = React.useState("사고방식");
  const [read, setRead] = React.useState(6);
  const [body, setBody] = React.useState(
`# 프롬프트 너머의 컨텍스트

저도 처음엔 *프롬프트만 잘 쓰면 된다*고 생각했어요.
6개월 헤맨 다음에야 알게 된 게 있습니다.

## 1. AI는 컨텍스트 위에서만 동작합니다

같은 프롬프트라도 \`회사 정체성\` · \`페르소나\` · \`톤 가이드\` 같은
주변 문서가 있으면 결과가 완전히 달라져요.

> 도구가 먼저 오면 도구에 끌려갑니다.
> 결과물이 먼저 오면 노이즈만 만듭니다.

## 2. 그래서 위키를 먼저 만들었습니다

- 5대 가치
- 페르소나 3종
- 결과물 정의

이걸 \`AI가 읽을 수 있는 형식\`으로 정리해 두면,
프롬프트는 짧아지고 결과는 두툼해집니다.`
  );

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn btn-secondary btn-sm" onClick={back}><Icon name="chevron-left" size={14} /> 글 목록</button>
        <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>/admin/posts/p01/edit</span>
        <div className="grow" />
        <button className="btn btn-secondary">임시저장</button>
        <button className="btn btn-primary">★ 발행</button>
      </div>

      <div className="card elevated">
        <div className="grid-4" style={{ gap: 14 }}>
          <div style={{ gridColumn: "span 2" }}>
            <label className="field-label">제목</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} style={{ fontSize: 16, fontWeight: 700 }} />
          </div>
          <div>
            <label className="field-label">카테고리</label>
            <select className="select" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option>사고방식</option><option>자동화</option><option>회사</option><option>실패담</option><option>logs</option>
            </select>
          </div>
          <div>
            <label className="field-label">읽기 시간 (분)</label>
            <input className="input mono" value={read} onChange={(e) => setRead(e.target.value)} />
          </div>
          <div style={{ gridColumn: "span 4" }}>
            <label className="field-label">부제</label>
            <input className="input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 18 }}>
        <div>
          <div className="micro" style={{ marginBottom: 8 }}>MDX 에디터</div>
          <textarea className="input textarea mdx" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div>
          <div className="micro" style={{ marginBottom: 8 }}>실시간 미리보기</div>
          <div className="preview-pane">
            <MDXMockPreview title={title} subtitle={subtitle} body={body} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Very small MD-ish renderer for preview
const MDXMockPreview = ({ title, subtitle, body }) => {
  const lines = body.split("\n");
  const out = [];
  let inList = false;
  let listBuf = [];
  const flushList = () => {
    if (listBuf.length) {
      out.push(<ul key={out.length} style={{ paddingLeft: 20, marginBottom: 12 }}>{listBuf.map((t, i) => <li key={i}>{t}</li>)}</ul>);
      listBuf = [];
    }
    inList = false;
  };
  const inline = (s) => {
    // bold + code
    const parts = [];
    const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
    let last = 0, m;
    while ((m = re.exec(s)) !== null) {
      if (m.index > last) parts.push(s.slice(last, m.index));
      const tok = m[0];
      if (tok.startsWith("**")) parts.push(<b key={parts.length}>{tok.slice(2, -2)}</b>);
      else if (tok.startsWith("`")) parts.push(<code key={parts.length}>{tok.slice(1, -1)}</code>);
      else parts.push(<i key={parts.length}>{tok.slice(1, -1)}</i>);
      last = m.index + tok.length;
    }
    if (last < s.length) parts.push(s.slice(last));
    return parts;
  };
  lines.forEach((l, i) => {
    if (/^#\s/.test(l)) { flushList(); /* skip H1 — title shown separately */ return; }
    if (/^##\s/.test(l))  { flushList(); out.push(<h3 key={"h" + i}>{l.replace(/^##\s/, "")}</h3>); return; }
    if (/^>\s/.test(l))   { flushList(); out.push(<blockquote key={"q" + i} style={{ borderLeft: "3px solid var(--text-mint)", paddingLeft: 12, margin: "12px 0", color: "var(--fg-2)" }}>{inline(l.replace(/^>\s/, ""))}</blockquote>); return; }
    if (/^-\s/.test(l))   { inList = true; listBuf.push(inline(l.replace(/^-\s/, ""))); return; }
    if (l.trim() === "")  { flushList(); return; }
    flushList();
    out.push(<p key={"p" + i}>{inline(l)}</p>);
  });
  flushList();
  return (
    <React.Fragment>
      <h2 style={{ marginBottom: 4 }}>{title}</h2>
      <div style={{ fontSize: 14, color: "var(--fg-3)", marginBottom: 18 }}>{subtitle}</div>
      {out}
    </React.Fragment>
  );
};

/* ============================================================
   PRODUCTS
   ============================================================ */
const Products = () => {
  const statusKind = { live: "live", beta: "beta", coming: "coming", retired: "retired" };
  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="row" style={{ gap: 12 }}>
        <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>드래그로 진열 순서를 바꿀 수 있어요</span>
        <div className="grow" />
        <button className="btn btn-primary"><Icon name="plus" size={14} /> 새 제품</button>
      </div>

      <div className="grid-3">
        {MOCK_PRODUCTS.map(p => (
          <div key={p.id} className="card elevated" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{
              position: "relative", height: 160,
              background: `linear-gradient(135deg, ${p.hero[0]} 0%, ${p.hero[1]} 100%)`,
              borderBottom: "1px solid var(--border-1)",
            }}>
              <div style={{ position: "absolute", top: 10, left: 10, cursor: "grab" }}>
                <span style={{ padding: 4, background: "rgba(255,255,255,.6)", borderRadius: 6, display: "inline-flex" }}>
                  <Icon name="drag" size={16} style={{ color: "var(--ink-700)" }} />
                </span>
              </div>
              <div style={{ position: "absolute", top: 10, right: 10 }}>
                <Status kind={statusKind[p.status]} label={STATUS_LABELS[p.status]} />
              </div>
              <div style={{
                position: "absolute", bottom: 14, left: 16,
                fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700,
                color: "var(--ink-900)",
              }}>
                {p.name}
              </div>
            </div>

            <div style={{ padding: 16 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginBottom: 6 }}>/{p.slug}</div>
              <p style={{ fontSize: 14, color: "var(--fg-2)", minHeight: 42 }}>{p.pitch}</p>

              <div className="divider" style={{ margin: "12px 0" }} />

              <div className="between">
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{p.releaseAt}</span>
                <div className="row" style={{ gap: 4 }}>
                  <button className="btn btn-ghost btn-sm"><Icon name="edit" size={14} /> 편집</button>
                  <RowMenu items={[
                    { id: "pub", label: p.status === "live" ? "비공개로 전환" : "발행" },
                    { id: "dup", label: "복제" },
                    { divider: true },
                    { id: "del", label: "삭제", danger: true },
                  ]} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add tile */}
        <button style={{
          background: "transparent", cursor: "pointer",
          border: "1.5px dashed var(--border-2)",
          borderRadius: "var(--r-card)",
          padding: 28, minHeight: 280,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
          color: "var(--fg-3)", fontFamily: "var(--font-body)",
        }}>
          <Icon name="plus" size={28} />
          <div className="hand" style={{ fontSize: 20, color: "var(--fg-2)" }}>여기에 새 제품을 추가</div>
          <div className="mono" style={{ fontSize: 11 }}>슬러그 · 이름 · pitch · hero</div>
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   SETTINGS
   ============================================================ */
const Settings = () => {
  return (
    <div className="stack" style={{ gap: 22, maxWidth: 900 }}>
      <div className="card elevated">
        <SectionHead title="사이트 메타" sub="검색 결과·소셜 공유 카드에 노출되는 정보입니다" />
        <div className="grid-2" style={{ gap: 16 }}>
          <div>
            <label className="field-label">사이트 제목</label>
            <input className="input" defaultValue="AICONLAB" />
          </div>
          <div>
            <label className="field-label">기본 도메인</label>
            <input className="input mono" defaultValue="aiconlab.kr" />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label className="field-label">사이트 설명</label>
            <textarea className="input textarea" defaultValue="AI로 1인 기업을 만들어가는 라이브 다큐멘터리. 정체성 → 결과물 → 자동화 순서를 지킵니다." style={{ minHeight: 90 }} />
          </div>
        </div>
        <div className="row" style={{ justifyContent: "flex-end", marginTop: 14 }}>
          <button className="btn btn-primary">저장</button>
        </div>
      </div>

      <div className="card elevated">
        <SectionHead title="운영자 프로필" sub="여러분에게 보이는 운영자 정보입니다" />
        <div className="row" style={{ gap: 18 }}>
          <Avatar name="caden" size="lg" />
          <div className="grow grid-2" style={{ gap: 14 }}>
            <div>
              <label className="field-label">닉네임</label>
              <input className="input" defaultValue="caden" />
            </div>
            <div>
              <label className="field-label">이메일</label>
              <input className="input mono" defaultValue="caden@aiconlab.kr" />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label className="field-label">소개</label>
              <textarea className="input textarea" defaultValue="혼자 가면 미루게 되더라고요 — 그래서 공개했어요." style={{ minHeight: 70 }} />
            </div>
          </div>
        </div>
        <div className="row" style={{ justifyContent: "flex-end", marginTop: 14 }}>
          <button className="btn btn-primary">저장</button>
        </div>
      </div>

      <div className="card elevated">
        <SectionHead title="관리자 권한 부여" sub="신중하게 — admin은 모든 데이터에 접근합니다" />
        <div className="row" style={{ gap: 10 }}>
          <div className="search grow">
            <Icon name="search" size={16} />
            <input className="input" placeholder="이메일로 사용자 검색" />
          </div>
          <button className="btn btn-dark">★ 관리자로 승급</button>
        </div>

        <div className="divider" style={{ margin: "16px 0" }} />
        <div className="micro" style={{ marginBottom: 10 }}>현재 관리자</div>
        <div className="stack" style={{ gap: 8 }}>
          {MOCK_MEMBERS.filter(m => m.role === "admin").map(m => (
            <div key={m.id} className="row" style={{ justifyContent: "space-between", padding: "10px 14px", background: "var(--surface-2)", borderRadius: 8 }}>
              <div className="row" style={{ gap: 10 }}>
                <Avatar name={m.name} size="sm" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{m.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{m.email}</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--fg-3)" }}>본인 — 회수 불가</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Events, EventDetail, Posts, PostEditor, Products, Settings });
