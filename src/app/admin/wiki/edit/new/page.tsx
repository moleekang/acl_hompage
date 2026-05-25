"use client";

import { WikiEditor } from "@/components/wiki/wiki-editor";

export default function Page() {
  return (
    <WikiEditor
      slug="new"
      backHref="/admin/wiki"
      afterSaveHref={() => "/admin/wiki"}
    />
  );
}
