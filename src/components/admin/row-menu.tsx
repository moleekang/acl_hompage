"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Icon } from "./icons";

export type RowMenuItem =
  | { id: string; label: string; primary?: boolean; danger?: boolean; divider?: false }
  | { divider: true; id?: undefined; label?: undefined };

type Props = {
  items: RowMenuItem[];
  onSelect?: (id: string) => void;
};

export function RowMenu({ items, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: globalThis.MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        style={{ padding: 4, color: "var(--fg-2)" }}
        aria-label="액션"
      >
        <Icon name="more" size={16} />
      </button>
      {open && (
        <div
          className="rowmenu"
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          {items.map((it, i) => {
            if (it.divider) return <div key={i} className="rm-div" />;
            return (
              <button
                key={i}
                type="button"
                className={it.primary ? "primary" : it.danger ? "danger" : ""}
                onClick={() => {
                  setOpen(false);
                  if (it.id) onSelect?.(it.id);
                }}
              >
                {it.label}
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
}
