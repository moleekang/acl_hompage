// 사이트 곳곳에 노출되는 통계를 한 곳에서 관리.
// TODO(future): YouTube Data API v3 + Supabase count로 자동 갱신.
// 지금은 수동 갱신 — 운영자가 이 파일만 고치면 모든 노출처가 동기화된다.

export const SITE_STATS = {
  // 유튜브 채널 (https://www.youtube.com/@A-ConLab-b1m)
  youtubeSubscribers: "9,490",
  topVideoViews: "57K",

  // 커뮤니티
  communityMembers: "1,000+", // 카카오톡 단톡방
  betaTesters: "30+", // ConGen 베타 테스터

  // 컨텐츠
  wikiPages: "30+", // 공유 위키 페이지 수

  // 마지막 수동 갱신일 (참고용)
  lastUpdated: "2026-05-25",
} as const;
