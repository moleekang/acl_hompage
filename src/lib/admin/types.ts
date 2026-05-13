// 관리자 화면에서 쓰는 도메인 타입. 추후 Supabase row 타입과 일치시키며 진화.

export type Role = "guest" | "member" | "admin" | "suspended";

export type MemberHistory = {
  at: string;
  from: Role | null;
  to: Role;
  by: string;
  reason?: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  joinedAt: string;
  lastLogin: string;
  bio?: string;
  history: MemberHistory[];
};

export type WikiPage = {
  id: string;
  title: string;
  slug: string;
  editor: string;
  editedAt: string;
  revs: number;
  deleted: boolean;
};

export type WikiRevision = {
  id: string;
  at: string;
  by: string;
  note: string;
};

export type DiffLine = {
  kind: "ctx" | "add" | "del";
  n: string;
  text: string;
};

export type EventStatus = "open" | "draft" | "closed" | "done";

export type EventRow = {
  id: string;
  title: string;
  when: string;
  where: string;
  invited: number;
  going: number;
  declined: number;
  pending: number;
  capacity: number;
  status: EventStatus;
  body: string;
};

export type RsvpKind = "going" | "declined" | "pending";
export type EventRsvp = { uid: string; rsvp: RsvpKind };

export type PostStatus = "published" | "draft";
export type Post = {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: PostStatus;
  read: number;
  subtitle: string;
};

export type ProductStatus = "live" | "beta" | "coming" | "retired";
export type Product = {
  id: string;
  slug: string;
  name: string;
  pitch: string;
  status: ProductStatus;
  releaseAt: string;
  hero: [string, string]; // gradient stops
};
