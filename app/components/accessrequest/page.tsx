import { AccessRequestPreviewBlock } from "@/components/accessrequest-preview-block";
import { ComponentDocsLayout } from "@/components/docs/component-docs-layout";

const ACCESS_CODE = `"use client";

import { AccessRequestBanner, type AccessRequest } from "@/components/ui/accessrequest";

const requests: AccessRequest[] = [
  {
    id: "1",
    name: "Louis Griffen",
    username: "@louis",
    avatarColor: "hsl(270 60% 60%)",
    avatarEmoji: "👩🏽‍🦱",
  },
  {
    id: "2",
    name: "Peter Griffen",
    username: "@peter",
    avatarColor: "hsl(350 60% 65%)",
    avatarEmoji: "👨🏽",
  },
  {
    id: "3",
    name: "Aditya Sur",
    username: "@aditya",
    avatarColor: "hsl(50 80% 60%)",
    avatarEmoji: "😎",
  },
];

export function Example() {
  return <AccessRequestBanner initialRequests={requests} />;
}`;

const ACCESS_PROPS = [
  {
    name: "initialRequests",
    type: "AccessRequest[]",
    desc: "Optional array of AccessRequest objects used to seed the banner. If omitted, a demo list is used.",
  },
];

export default function AccessRequestPage() {
  return (
    <ComponentDocsLayout
      codeSample={ACCESS_CODE}
      componentName="accessrequest"
      description="A floating banner that summarizes incoming access requests and expands into an inline list with approve and reject actions."
      previewChildren={<AccessRequestPreviewBlock />}
      previewDescription="Use this pattern to surface workspace, project, or file access requests without disrupting the main UI."
      propsRows={ACCESS_PROPS}
      propsTag="accessrequest"
      title="Access Request Banner"
    />
  );
}
