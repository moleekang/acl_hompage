/* eslint-disable */
// AICONLAB Admin — mock data (8 members, 6 wiki pages, 3 events, 5 posts, 3 products)

const MOCK_MEMBERS = [
  { id: "u01", name: "caden",     email: "caden@aiconlab.kr",     role: "admin",     joinedAt: "2025-03-12", lastLogin: "2026-05-13 09:14", bio: "운영자. 1인 기업 자동화 라이브.",   history: [
    { at: "2025-03-12", from: null, to: "admin",   by: "system" },
  ]},
  { id: "u02", name: "수민",       email: "sumin.k@gmail.com",      role: "member",    joinedAt: "2025-04-02", lastLogin: "2026-05-13 08:02", bio: "n8n 자동화 시도 중.",            history: [
    { at: "2025-04-02", from: null,     to: "guest",  by: "system" },
    { at: "2025-09-21", from: "guest",  to: "member", by: "caden"  },
  ]},
  { id: "u03", name: "지훈",       email: "jihoon@studio.io",        role: "member",    joinedAt: "2025-05-19", lastLogin: "2026-05-12 22:41", bio: "프리랜서 영상 제작.",            history: [
    { at: "2025-05-19", from: null,     to: "guest",  by: "system" },
    { at: "2025-10-04", from: "guest",  to: "member", by: "caden"  },
  ]},
  { id: "u04", name: "민지",       email: "minji@hanmail.net",        role: "guest",     joinedAt: "2026-04-28", lastLogin: "2026-05-11 19:30", bio: "직장인. 입문자.",                history: [
    { at: "2026-04-28", from: null,     to: "guest",  by: "system" },
  ]},
  { id: "u05", name: "도윤",       email: "doyoon.park@outlook.kr",  role: "guest",     joinedAt: "2026-05-02", lastLogin: "2026-05-13 07:48", bio: "AI 도입 검토 중인 PM.",         history: [
    { at: "2026-05-02", from: null,     to: "guest",  by: "system" },
  ]},
  { id: "u06", name: "유진",       email: "yujin@aiconlab.kr",       role: "member",    joinedAt: "2025-07-08", lastLogin: "2026-05-13 09:01", bio: "위키 정리 도와주는 멤버.",       history: [
    { at: "2025-07-08", from: null,     to: "guest",  by: "system" },
    { at: "2025-12-11", from: "guest",  to: "member", by: "caden"  },
  ]},
  { id: "u07", name: "하늘",       email: "haneul@naver.com",         role: "suspended", joinedAt: "2025-09-30", lastLogin: "2026-02-14 11:20", bio: "스팸성 댓글로 정지.",            history: [
    { at: "2025-09-30", from: null,        to: "guest",     by: "system" },
    { at: "2026-02-14", from: "guest",     to: "suspended", by: "caden", reason: "스팸 댓글 5건" },
  ]},
  { id: "u08", name: "지원",       email: "jiwon@gmail.com",          role: "guest",     joinedAt: "2026-05-09", lastLogin: "2026-05-13 06:58", bio: "주말 사이드 프로젝트 중.",       history: [
    { at: "2026-05-09", from: null,     to: "guest",  by: "system" },
  ]},
];

const MOCK_WIKI = [
  { id: "w01", title: "AICONLAB 정체성 정의",          slug: "identity",         editor: "u01", editedAt: "2026-05-12 22:30", revs: 18, deleted: false },
  { id: "w02", title: "1인 기업 자동화 사고방식",       slug: "solo-automation",  editor: "u01", editedAt: "2026-05-11 14:08", revs: 12, deleted: false },
  { id: "w03", title: "n8n 워크플로우 카탈로그",        slug: "n8n-catalog",       editor: "u06", editedAt: "2026-05-10 09:55", revs: 27, deleted: false },
  { id: "w04", title: "시청자 페르소나 v2",             slug: "persona-v2",       editor: "u02", editedAt: "2026-05-08 18:43", revs: 9,  deleted: false },
  { id: "w05", title: "logs/ 작성 표준 (W·W·H·N)",      slug: "logs-standard",     editor: "u01", editedAt: "2026-04-28 11:02", revs: 6,  deleted: false },
  { id: "w06", title: "구버전 가격표 v1",                slug: "pricing-v1",        editor: "u01", editedAt: "2026-03-04 16:21", revs: 4,  deleted: true  },
];

// Revisions for w01
const MOCK_REVISIONS = [
  { id: "r5", at: "2026-05-12 22:30", by: "u01", note: "현재 버전 — 태그라인 정리" },
  { id: "r4", at: "2026-05-10 19:14", by: "u01", note: "5대 핵심 가치 표 추가" },
  { id: "r3", at: "2026-05-02 11:00", by: "u06", note: "오타 수정" },
  { id: "r2", at: "2026-04-21 22:48", by: "u01", note: "v2 전면 개편" },
  { id: "r1", at: "2026-03-01 13:22", by: "u01", note: "최초 작성" },
];

const MOCK_DIFF = [
  { kind: "ctx", n: "12", text: "## 5대 핵심 가치 (모든 의사결정의 기준)" },
  { kind: "ctx", n: "13", text: "" },
  { kind: "del", n: "14", text: "1. 기여 우선 — 무료 자료를 먼저 내놓는다." },
  { kind: "add", n: "14", text: "1. **기여 우선** — \"1을 주고, N을 받는다.\" 무료 자료·도구·노하우를 먼저 내놓는다." },
  { kind: "ctx", n: "15", text: "2. **솔직한 공유** — \"노하우를 숨기지 않는다.\" 실패담·시행착오까지 공개한다." },
  { kind: "ctx", n: "16", text: "3. **상호 존중** — 권위적·무시 톤은 절대 금지." },
  { kind: "del", n: "17", text: "4. 실행력 — 결과로 증명한다." },
  { kind: "add", n: "17", text: "4. **실행력** — \"말이 아닌 결과로 증명한다.\" 결과물·증거·돌아가는 스크린이 카피보다 무겁다." },
  { kind: "add", n: "18", text: "5. **시간 자유** — \"시간을 돌려준다.\" 모든 의사결정의 북극성." },
  { kind: "ctx", n: "19", text: "" },
];

const MOCK_EVENTS = [
  {
    id: "e01", title: "공유회 #07 · n8n 자동화 라이브",
    when: "2026-05-18 20:00",
    where: "Zoom (URL은 RSVP 후 안내)",
    invited: 24, going: 12, declined: 2, pending: 10, capacity: 30,
    status: "open",
    body: "이번 주에 정착시킨 n8n 워크플로우 1개를 같이 뜯어봐요. 화면 공유로 한 줄씩 같이 따라 만드는 시간입니다.",
  },
  {
    id: "e02", title: "공유회 #06 · 회고 — 4월 한 달",
    when: "2026-04-27 20:00",
    where: "Zoom",
    invited: 22, going: 18, declined: 1, pending: 3, capacity: 25,
    status: "done",
    body: "4월에 시도한 자동화 3건 · 실패 2건 · 다음 달 계획을 공유합니다.",
  },
  {
    id: "e03", title: "공유회 #08 · 코어 멤버 OT",
    when: "2026-06-01 21:00",
    where: "오프라인 · 성수동 (정확한 위치는 RSVP 후 안내)",
    invited: 0, going: 0, declined: 0, pending: 0, capacity: 8,
    status: "draft",
    body: "코어 그룹 첫 OT. 초안 작성 중.",
  },
];

const MOCK_RSVP = [
  { uid: "u02", rsvp: "going" },
  { uid: "u03", rsvp: "going" },
  { uid: "u06", rsvp: "going" },
  { uid: "u04", rsvp: "pending" },
  { uid: "u05", rsvp: "pending" },
  { uid: "u08", rsvp: "declined" },
];

const MOCK_POSTS = [
  { id: "p01", title: "프롬프트 너머의 컨텍스트", category: "사고방식",   author: "u01", date: "2026-05-09", status: "published", read: 6, subtitle: "AI를 잘 쓰는 게 아니라, 컨텍스트를 잘 깔아주는 일" },
  { id: "p02", title: "n8n 워크플로우 1개 정착기", category: "자동화",   author: "u01", date: "2026-05-02", status: "published", read: 9, subtitle: "스크립트 자동화 첫 정착까지의 12주" },
  { id: "p03", title: "1인 기업 정체성 정의서 v2", category: "회사",      author: "u01", date: "2026-04-21", status: "published", read: 11, subtitle: "고객 → 페르소나 → 약속 → 결과물" },
  { id: "p04", title: "실패한 자동화 3건과 배운 것", category: "실패담",  author: "u01", date: "2026-04-14", status: "published", read: 7,  subtitle: "" },
  { id: "p05", title: "5월 회고와 6월 계획 (작성 중)", category: "logs",   author: "u01", date: "—",         status: "draft",     read: 5,  subtitle: "" },
];

const MOCK_PRODUCTS = [
  { id: "pr01", slug: "memo-to-script",  name: "메모→스크립트",   pitch: "음성 메모를 5분 안에 영상 스크립트로",     status: "live",    releaseAt: "2026-04 출시", hero: ["#FFD23F", "#FF8E72"] },
  { id: "pr02", slug: "weekly-logs-bot", name: "위클리 로그 봇",  pitch: "매주 금요일 logs/ 초안을 자동 생성",        status: "beta",    releaseAt: "베타 진행 중", hero: ["#4DE0A6", "#5A7CFF"] },
  { id: "pr03", slug: "context-pack",    name: "컨텍스트 팩",     pitch: "팀 위키를 AI가 읽을 수 있는 형식으로",      status: "coming",  releaseAt: "2026 Q3 예정",   hero: ["#EAE5D6", "#FFD23F"] },
];

// Status labels (KR) — used in tables
const STATUS_LABELS = {
  open: "모집 중", draft: "초안", closed: "마감", done: "완료",
  published: "발행됨",
  live: "운영 중", beta: "베타", coming: "예정", retired: "종료",
};

const ROLE_LABELS = { admin: "관리자", member: "위키 멤버", guest: "게스트", suspended: "정지" };

function findMember(uid) { return MOCK_MEMBERS.find(m => m.id === uid); }

// Recent dashboard sparkline — daily signups last 7 days
const SPARK_SIGNUPS = [1, 0, 2, 3, 1, 4, 5];

Object.assign(window, {
  MOCK_MEMBERS, MOCK_WIKI, MOCK_REVISIONS, MOCK_DIFF,
  MOCK_EVENTS, MOCK_RSVP, MOCK_POSTS, MOCK_PRODUCTS,
  STATUS_LABELS, ROLE_LABELS, SPARK_SIGNUPS, findMember,
});
