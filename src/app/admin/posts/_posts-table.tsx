"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Avatar } from "@/components/admin/avatar";
import { Icon } from "@/components/admin/icons";
import { RowMenu } from "@/components/admin/row-menu";
import { Status } from "@/components/admin/badges";
import { publishPost, deletePost } from "../_actions/posts";
import type { MemberRow } from "@/lib/admin/fetchers";

export type PostRow = {
  slug: string;
  title: string;
  sub: string | null;
  cat: string;
  read_time: string | null;
  published_at: string | null;
  author_id: string | null;
};

const CATEGORIES = ["전체", "사고방식", "자동화", "회사", "실패담", "logs"];

export function PostsTable({ posts, members }: { posts: PostRow[]; members: MemberRow[] }) {
  const [cat, setCat] = useState("전체");
  const [pending, start] = useTransition();
  const nameById = new Map(members.map((m) => [m.id, m.name]));

  const filtered = posts.filter((p) => cat === "전체" || p.cat === cat);

  function handle(action: "publish" | "unpublish" | "delete", slug: string, title: string) {
    if (action === "delete" && !confirm(`"${title}"을(를) 삭제할까요?`)) return;
    start(async () => {
      try {
        if (action === "publish") await publishPost(slug, true);
        else if (action === "unpublish") await publishPost(slug, false);
        else if (action === "delete") await deletePost(slug);
      } catch (e) {
        alert("실패: " + (e instanceof Error ? e.message : String(e)));
      }
    });
  }

  return (
    <div className="stack" style={{ gap: 18, opacity: pending ? 0.7 : 1 }}>
      <div className="row wrap" style={{ gap: 12 }}>
        <div className="search" style={{ flex: "1 1 320px", maxWidth: 420 }}>
          <Icon name="search" size={16} />
          <input className="input" placeholder="제목으로 검색" />
        </div>
        <div className="row" style={{ gap: 6 }}>
          {CATEGORIES.map((c) => (
            <button key={c} type="button" className={"chip " + (cat === c ? "active" : "")} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="grow" />
        <Link href="/admin/posts/new" className="btn btn-primary">
          <Icon name="plus" size={14} /> 새 글
        </Link>
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
            {filtered.length === 0 ? (
              <tr><td colSpan={7}><div className="empty"><div className="h">글이 없어요</div><div>위에서 새 글을 작성해 보세요.</div></div></td></tr>
            ) : filtered.map((p) => {
              const author = p.author_id ? nameById.get(p.author_id) ?? "—" : "—";
              const published = !!p.published_at;
              return (
                <tr key={p.slug}>
                  <td>
                    <Link href={`/admin/posts/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div style={{ fontWeight: 700 }}>{p.title}</div>
                      {p.sub && <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{p.sub}</div>}
                    </Link>
                  </td>
                  <td><span className="chip" style={{ padding: "3px 9px", fontSize: 11 }}>{p.cat}</span></td>
                  <td className="num">{p.published_at ? new Date(p.published_at).toLocaleDateString("ko-KR") : "—"}</td>
                  <td className="num">{p.read_time ?? "—"}</td>
                  <td>
                    <div className="user-cell">
                      <Avatar name={author} size="sm" />
                      <span style={{ fontSize: 13 }}>{author}</span>
                    </div>
                  </td>
                  <td>
                    {published ? <Status kind="live" label="발행됨" /> : <Status kind="draft" label="초안" />}
                  </td>
                  <td className="actions">
                    <RowMenu
                      items={[
                        { id: "edit", label: "편집", primary: true },
                        { id: published ? "unpublish" : "publish", label: published ? "비공개로" : "발행" },
                        { divider: true },
                        { id: "del", label: "삭제", danger: true },
                      ]}
                      onSelect={(id) => {
                        if (id === "edit") window.location.href = `/admin/posts/${p.slug}`;
                        else if (id === "publish") handle("publish", p.slug, p.title);
                        else if (id === "unpublish") handle("unpublish", p.slug, p.title);
                        else if (id === "del") handle("delete", p.slug, p.title);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
