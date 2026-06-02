// YouTube Data API v3 — 채널 통계 + 인기 영상 조회수 실시간 조회.
// 키: process.env.GEMINI_API_KEY — 이 키는 YouTube Data API v3 권한이 있는
//     Google Cloud API 키다(이름만 GEMINI). 서버 전용 — 절대 클라이언트로 노출 금지.
// 캐시: fetch next.revalidate 6시간 → 6h마다 1회만 호출(쿼터 절약 + 페이지 속도).
// 실패/키 없음 → null 반환. 호출측(getSiteStats)에서 하드코딩 값으로 폴백한다.

const CHANNEL_ID = "UC-3YrPCAZOlUMTfi7eeSICA"; // youtube.com/@A-ConLab-b1m (Ai-Con Lab)
const REVALIDATE = 21600; // 6h
const API = "https://www.googleapis.com/youtube/v3";

export type YoutubeStats = {
  subscribers: string; // 콤마 포맷 "10,400"
  totalViews: string; // 압축 "190K"
  videoCount: string; // "16"
  topVideoViews: string | null; // 인기 영상 조회수 압축, 실패 시 null
};

// 외부 응답 형태 — 필요한 필드만
type ChannelResp = {
  items?: { statistics?: { subscriberCount?: string; viewCount?: string; videoCount?: string } }[];
};
type SearchResp = { items?: { id?: { videoId?: string } }[] };
type VideosResp = { items?: { statistics?: { viewCount?: string } }[] };

// 1.2M / 190K 형태로 압축 (기존 "57K" 표기와 일관)
function compact(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return Math.round(n / 1_000) + "K";
  return String(n);
}

async function ytFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`youtube ${res.status}`);
  return (await res.json()) as T;
}

export async function getYoutubeStats(): Promise<YoutubeStats | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    const ch = await ytFetch<ChannelResp>(
      `${API}/channels?part=statistics&id=${CHANNEL_ID}&key=${key}`,
    );
    const st = ch.items?.[0]?.statistics;
    if (!st) return null;

    const stats: YoutubeStats = {
      subscribers: Number(st.subscriberCount ?? 0).toLocaleString("en-US"),
      totalViews: compact(Number(st.viewCount ?? 0)),
      videoCount: Number(st.videoCount ?? 0).toLocaleString("en-US"),
      topVideoViews: null,
    };

    // 인기 영상(조회수순 1개) → 그 영상의 실제 조회수. search는 쿼터가 크므로(100u) 실패해도 통계는 유지.
    try {
      const s = await ytFetch<SearchResp>(
        `${API}/search?part=id&channelId=${CHANNEL_ID}&order=viewCount&type=video&maxResults=1&key=${key}`,
      );
      const vid = s.items?.[0]?.id?.videoId;
      if (vid) {
        const v = await ytFetch<VideosResp>(
          `${API}/videos?part=statistics&id=${vid}&key=${key}`,
        );
        const vc = v.items?.[0]?.statistics?.viewCount;
        if (vc != null) stats.topVideoViews = compact(Number(vc));
      }
    } catch (e) {
      console.error("[youtube] top video:", (e as Error).message);
    }

    return stats;
  } catch (e) {
    console.error("[youtube] getYoutubeStats:", (e as Error).message);
    return null;
  }
}
