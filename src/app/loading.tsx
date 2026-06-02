// 루트 로딩 fallback — 자체 loading.tsx가 없는 모든 공개 페이지가 이걸 사용.
// 목록/랜딩 톤(list). 상세([slug]) 페이지는 각자 article 스켈레톤을 둔다.
import { PageSkeleton } from "@/components/aiconlab/page-skeleton";

export default function Loading() {
  return <PageSkeleton variant="list" />;
}
