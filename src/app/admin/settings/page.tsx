// 설정 — admin 목록은 fetch, 사이트 메타 저장은 후속 (site_settings 테이블 미정)
import { Avatar } from "@/components/admin/avatar";
import { Icon } from "@/components/admin/icons";
import { SectionHead } from "@/components/admin/badges";
import { fetchMembers } from "@/lib/admin/fetchers";
import { PageTopbar } from "../_components/page-topbar";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const members = await fetchMembers();
  const admins = members.filter((m) => m.role === "admin");

  return (
    <>
      <PageTopbar title="설정" crumb="/admin/settings" sub="사이트 · 운영자 · 권한" />
      <div className="stack" style={{ gap: 22, maxWidth: 900 }}>
        <div className="card elevated">
          <SectionHead title="사이트 메타" sub="검색 결과·소셜 공유 카드에 노출되는 정보입니다 (저장은 후속 작업)" />
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
              <textarea
                className="input textarea"
                defaultValue="AI로 1인 기업을 만들어가는 라이브 다큐멘터리. 정체성 → 결과물 → 자동화 순서를 지킵니다."
                style={{ minHeight: 90 }}
              />
            </div>
          </div>
          <div className="row" style={{ justifyContent: "flex-end", marginTop: 14 }}>
            <button type="button" className="btn btn-primary" disabled style={{ opacity: 0.5 }}>저장 (TODO)</button>
          </div>
        </div>

        <div className="card elevated">
          <SectionHead title="현재 관리자" sub={`role=admin인 멤버 ${admins.length}명`} />
          <div className="row" style={{ gap: 10, marginBottom: 14 }}>
            <div className="search grow">
              <Icon name="search" size={16} />
              <input className="input" placeholder="이메일로 사용자 검색 (TODO)" disabled />
            </div>
            <button type="button" className="btn btn-dark" disabled style={{ opacity: 0.5 }}>★ 관리자로 승급 (TODO)</button>
          </div>

          <div className="stack" style={{ gap: 8 }}>
            {admins.length === 0 ? (
              <div className="mono" style={{ fontSize: 12, color: "var(--fg-3)", textAlign: "center", padding: 20 }}>
                아직 admin이 없어요 — 0001_init.sql 끝의 시드 SQL을 실행하세요.
              </div>
            ) : admins.map((m) => (
              <div key={m.id} className="row" style={{ justifyContent: "space-between", padding: "10px 14px", background: "var(--surface-2)", borderRadius: 8 }}>
                <div className="row" style={{ gap: 10 }}>
                  <Avatar name={m.name} size="sm" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{m.name}</div>
                    <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{m.email}</div>
                  </div>
                </div>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{m.joinedAt} 가입</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
