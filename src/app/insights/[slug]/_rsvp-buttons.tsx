"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { trackClientEvent } from "@/aicon/log/activity/client";

type Rsvp = "going" | "declined" | "pending";

function PickBtn({
  value,
  label,
  color,
  active,
  busy,
  onPick,
}: {
  value: Rsvp;
  label: string;
  color: string;
  active: boolean;
  busy: boolean;
  onPick: (v: Rsvp) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(value)}
      disabled={busy}
      style={{
        padding: "10px 18px",
        borderRadius: 8,
        fontWeight: 700,
        fontSize: 14,
        cursor: busy ? "wait" : "pointer",
        transition: "all 120ms",
        background: active ? color : "var(--surface-1)",
        color: active ? "var(--ink-900)" : "var(--fg-2)",
        border: "1.5px solid " + (active ? "var(--ink-900)" : "var(--border-2)"),
        boxShadow: active ? "2px 2px 0 var(--ink-900)" : "none",
      }}
    >
      {label}
    </button>
  );
}

export function RsvpButtons({ eventId, initial }: { eventId: string; initial: Rsvp }) {
  const [rsvp, setRsvp] = useState<Rsvp>(initial);
  const [busy, setBusy] = useState(false);

  async function pick(next: Rsvp) {
    if (busy || next === rsvp) return;
    setBusy(true);
    const supabase = createClient();
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      setBusy(false);
      return;
    }
    const { error } = await supabase
      .from("event_invitations")
      .update({ rsvp: next })
      .eq("event_id", eventId)
      .eq("user_id", u.user.id);
    if (!error) {
      setRsvp(next);
      // Aicon Log L3 — 공유회 RSVP (참석 확정 시에만)
      if (next === "going") trackClientEvent("event_signup", { label: eventId });
    }
    setBusy(false);
  }

  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border-1)",
        borderRadius: 14,
        padding: 20,
      }}
    >
      <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
        참석 의사
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <PickBtn value="going"    label="✓ 참석할게요" color="var(--mint-400)"  active={rsvp === "going"}    busy={busy} onPick={pick} />
        <PickBtn value="pending"  label="아직 미정"    color="var(--sun-400)"   active={rsvp === "pending"}  busy={busy} onPick={pick} />
        <PickBtn value="declined" label="이번엔 거절"  color="var(--paper-dim)" active={rsvp === "declined"} busy={busy} onPick={pick} />
      </div>
    </div>
  );
}
