// Server-side Aicon Log activity helpers — L1/L2/L3 events (POST /event/logs).
// Usable from Server Components, Server Actions and Route Handlers (Node runtime).
// For middleware use ./middleware (edge-safe), for client components use ./client.

import { fireAiconLog } from "../_core";
import { createClient } from "@/lib/supabase/server";

export type ActivityEventOpts = {
  /** Login identifier (email) — never internal PK/UUID. */
  userId?: string | null;
  label?: string;
  value?: number;
  pagePath?: string;
  properties?: Record<string, unknown>;
  anonymousId?: string | null;
};

/** Fire-and-forget L1/L2/L3 event. Never throws. */
export function logActivityEvent(eventName: string, opts: ActivityEventOpts = {}): void {
  try {
    fireAiconLog("/event/logs", {
      event_name: eventName,
      ...(opts.userId ? { user_id: opts.userId } : {}),
      ...(opts.label ? { event_label: opts.label } : {}),
      ...(opts.value != null ? { event_value: opts.value } : {}),
      ...(opts.pagePath ? { page_path: opts.pagePath } : {}),
      ...(opts.properties ? { properties: opts.properties } : {}),
      ...(opts.anonymousId ? { anonymous_id: opts.anonymousId } : {}),
    });
  } catch {
    // logging must never break the host flow
  }
}

/**
 * Same as logActivityEvent but resolves user_id (email) from the current
 * Supabase session — for Server Actions that only hold the internal UUID.
 */
export function logActivityEventForCurrentUser(
  eventName: string,
  opts: ActivityEventOpts = {},
): void {
  void (async () => {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      logActivityEvent(eventName, { ...opts, userId: data.user?.email ?? opts.userId });
    } catch {
      logActivityEvent(eventName, opts);
    }
  })();
}

/** L3 admin_action — call after a requireAdmin()-gated action succeeds. */
export function logAdminAction(actionName: string): void {
  logActivityEventForCurrentUser("admin_action", { label: actionName });
}
