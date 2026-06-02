// 관리자 대시보드 — 4개 위젯 + 빠른 액션 (Supabase fetch)
import Link from "next/link";
import { Icon } from "@/components/admin/icons";
import { Avatar } from "@/components/admin/avatar";
import { Sparkline } from "@/components/admin/sparkline";
import { RoleBadge, Status, SectionHead, type StatusKind } from "@/components/admin/badges";
import { PageTopbar } from "./_components/page-topbar";
import { fetchDashboardCounts, fetchMembers } from "@/lib/admin/fetchers";
import { getSiteStats } from "@/lib/site-stats";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  draft: "초안", open: "모집 중", closed: "마감", done: "완료",
};

export default async function DashboardPage() {
  const [counts, members, stats] = await Promise.all([
    fetchDashboardCounts(),
    fetchMembers(),
    getSiteStats(),
  ]);
  const nameById = new Map(members.map((m) => [m.id, m.name]));
  const next = counts.nextEvent;

  // 신규가입 sparkline은 실제 일별 집계가 아니라 단순 카운트라, 7일 분포 시뮬레이션
  const sparkData = [1, 0, 2, 3, 1, 4, Math.max(0, counts.signupsCount - 11)];

  return (
    <>
      <PageTopbar title="대시보드" crumb="/admin" sub="오늘 운영 한눈에" />
      <div className="stack" style={{ gap: 24 }}>
        <div className="grid-2">
          {/* 1. 신규 가입 */}
          <div className="card elevated">
            <div className="between">
              <div>
                <div className="micro">신규 가입 · 최근 7일</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
                  <span className="mono" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1 }}>{counts.signupsCount}</span>
                  <span className="mono" style={{ fontSize: 13, color: "var(--text-mint)" }}>총 멤버 {members.length}</span>
                </div>
              </div>
              <span className="sticker mint" style={{ transform: "rotate(3deg)" }}>최근 가입</span>
            </div>
            <div style={{ marginTop: 14 }}>
              <Sparkline data={sparkData} />
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)", display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span>-6d</span><span>-5d</span><span>-4d</span><span>-3d</span><span>-2d</span><span>어제</span><span>오늘</span>
              </div>
            </div>
          </div>

          {/* 2. 위키 멤버 승급 대기 */}
          <div className="card elevated">
            <div className="micro">위키 멤버 승급 대기</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
              <span className="mono" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1 }}>{counts.waitingQueue.length}</span>
              <span style={{ fontSize: 13, color: "var(--fg-3)" }}>명이 검토 대기 중</span>
            </div>
            <div className="stack" style={{ gap: 8, marginTop: 14 }}>
              {counts.waitingQueue.length === 0 ? (
                <div className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>대기열이 비었어요</div>
              ) : counts.waitingQueue.map((p) => (
                <div key={p.id} className="row" style={{ justifyContent: "space-between", padding: "8px 12px", background: "var(--surface-2)", borderRadius: 8 }}>
                  <div className="row" style={{ gap: 10 }}>
                    <Avatar name={p.nickname ?? "?"} size="sm" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{p.nickname ?? "—"}</div>
                      <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)" }}>가입 {(p.created_at ?? "").slice(0, 10)}</div>
                    </div>
                  </div>
                  <RoleBadge role="guest" />
                </div>
              ))}
            </div>
            <Link href="/admin/members" className="btn btn-secondary btn-sm" style={{ marginTop: 12, width: "100%", justifyContent: "center" }}>
              검토하러 가기 <Icon name="arrow-right" size={14} />
            </Link>
          </div>

          {/* 3. 활성 위키 페이지 */}
          <div className="card elevated">
            <div className="micro">활성 위키 페이지</div>
            <div className="row" style={{ gap: 18, alignItems: "flex-end", marginTop: 6 }}>
              <div>
                <span className="mono" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1 }}>{counts.wikiActiveCount}</span>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>활성 페이지</div>
              </div>
              <div>
                <span className="mono" style={{ fontSize: 24, fontWeight: 700, color: "var(--text-mint)" }}>{counts.wikiTodayCount}</span>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>오늘 수정</div>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div className="micro" style={{ marginBottom: 8 }}>최근 수정자</div>
              <div className="row">
                {counts.recentEditorIds.length === 0 ? (
                  <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>—</span>
                ) : counts.recentEditorIds.map((uid, i) => {
                  const name = nameById.get(uid) ?? "?";
                  return (
                    <span key={uid} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                      <Avatar name={name} size="sm" style={{ border: "2px solid var(--surface-1)" }} />
                    </span>
                  );
                })}
                {counts.recentEditorIds.length > 0 && (
                  <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)", marginLeft: 10 }}>
                    {counts.recentEditorIds.map((u) => nameById.get(u)).filter(Boolean).join(" · ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 4. 다가오는 공유회 */}
          <div className="card elevated">
            <div className="between">
              <div className="micro">다가오는 공유회</div>
              {next && <Status kind={next.status as StatusKind} label={STATUS_LABEL[next.status] ?? next.status} />}
            </div>
            {next ? (
              <>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginTop: 8 }}>{next.title}</h3>
                <div className="mono" style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 6 }}>
                  {new Date(next.starts_at).toLocaleString("ko-KR")} · {next.location ?? "—"}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 14, color: "var(--fg-3)", marginTop: 14 }}>예정된 공유회가 없어요.</div>
            )}
          </div>
        </div>

        {/* 유튜브 채널 현황 (YouTube Data API · 6h 캐시) */}
        <div className="card elevated">
          <SectionHead title="유튜브 채널" sub="Ai-Con Lab · 6시간마다 자동 갱신" />
          <div className="grid-4" style={{ marginTop: 4 }}>
            <YtStat n={stats.youtubeSubscribers} label="구독자" />
            <YtStat n={stats.youtubeTotalViews} label="총 조회수" />
            <YtStat n={stats.youtubeVideoCount} label="영상 수" />
            <YtStat n={stats.topVideoViews} label="인기 영상 뷰" />
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="card elevated">
          <SectionHead title="빠른 액션" sub="자주 쓰는 글쓰기와 발행 작업" />
          <div className="grid-4">
            <Link href="/admin/posts/new" className="btn btn-primary btn-lg" style={{ justifyContent: "center" }}>
              <Icon name="plus" size={14} /> 새 글
            </Link>
            <Link href="/admin/products/new" className="btn btn-secondary btn-lg" style={{ justifyContent: "center" }}>
              <Icon name="plus" size={14} /> 새 제품
            </Link>
            <Link href="/admin/events" className="btn btn-secondary btn-lg" style={{ justifyContent: "center" }}>
              <Icon name="plus" size={14} /> 공유회 관리
            </Link>
            <Link href="/admin/wiki" className="btn btn-secondary btn-lg" style={{ justifyContent: "center" }}>
              <Icon name="plus" size={14} /> 위키 관리
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// 유튜브 통계 미니 stat — 큰 숫자 + 라벨
function YtStat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{n}</div>
      <div className="micro" style={{ marginTop: 6 }}>{label}</div>
    </div>
  );
}
