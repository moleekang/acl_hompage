// 사이트 곳곳에 노출되는 통계를 한 곳에서 관리.
// 유튜브 지표(구독자·총조회수·영상수·인기영상뷰)는 getSiteStats()가 YouTube Data API로
// 실시간 조회한다(6h 캐시). 아래 SITE_STATS는 API 실패/키 없음 시 폴백 + 비유튜브 값(수동 관리).

import { cache } from "react";
import { getYoutubeStats } from "./youtube";

export const SITE_STATS = {
  // 유튜브 채널 (https://www.youtube.com/@A-ConLab-b1m)
  // 아래 값은 API 실패/키 없음 시 폴백 — 2026-06-01 실측 기준으로 갱신.
  youtubeSubscribers: "10,400",
  youtubeTotalViews: "190K", // 채널 총 누적 조회수
  youtubeVideoCount: "16", // 업로드 영상 수
  topVideoViews: "60K", // 인기 영상 조회수

  // 커뮤니티
  communityMembers: "1,000+", // 카카오톡 단톡방
  betaTesters: "30+", // ConGen 베타 테스터

  // 컨텐츠
  wikiPages: "30+", // 공유 위키 페이지 수

  // 마지막 수동 갱신일 (참고용)
  lastUpdated: "2026-06-01",
} as const;

// 유튜브 지표를 실시간 값으로 덮어쓴 통계를 반환. cache()로 요청당 1회만 조회(여러 컴포넌트가 호출해도 dedup).
// API 실패/키 없음 시 SITE_STATS 폴백값을 그대로 사용.
export const getSiteStats = cache(async () => {
  const yt = await getYoutubeStats();
  return {
    ...SITE_STATS,
    youtubeSubscribers: yt?.subscribers ?? SITE_STATS.youtubeSubscribers,
    youtubeTotalViews: yt?.totalViews ?? SITE_STATS.youtubeTotalViews,
    youtubeVideoCount: yt?.videoCount ?? SITE_STATS.youtubeVideoCount,
    topVideoViews: yt?.topVideoViews ?? SITE_STATS.topVideoViews,
  };
});
