// admin/* 진입 시 즉시 노출되는 스켈레톤.
// Next.js App Router의 loading.tsx 규약 — 같은 세그먼트의 page.tsx가
// 데이터 fetch로 블록될 때 자동으로 이 컴포넌트가 Suspense fallback으로 렌더된다.
//
// 디자인: topbar 자리 + 카드 그리드 자리만 잡아주고 펄스로 로딩감 전달.

export default function AdminLoading() {
  return (
    <>
      <div className="admin-skel topbar-skel">
        <div className="admin-skel-bar w-28 h-3" />
        <div className="admin-skel-bar w-48 h-7 mt-2" />
      </div>

      <div className="admin-skel-grid">
        <div className="admin-skel-card" />
        <div className="admin-skel-card" />
        <div className="admin-skel-card" />
        <div className="admin-skel-card admin-skel-card-wide" />
        <div className="admin-skel-card admin-skel-card-wide" />
      </div>
    </>
  );
}
