"use client";

import { use } from "react";
import { WikiEditor } from "@/components/wiki/wiki-editor";

type Params = Promise<{ slug: string }>;

export default function Page({ params }: { params: Params }) {
  const { slug } = use(params);
  return (
    <WikiEditor
      slug={slug}
      backHref="/admin/wiki"
      afterSaveHref={() => "/admin/wiki"}
    />
  );
}
