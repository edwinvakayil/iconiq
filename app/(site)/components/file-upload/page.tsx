"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { fileUploadApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { FileUpload } from "@/registry/file-upload";

const usageCode = `import { FileUpload } from "@/components/ui/file-upload";

export function FileUploadPreview() {
  return (
    <div className="w-full">
      <FileUpload />
    </div>
  );
}`;

function FileUploadPreview() {
  return (
    <div className="w-full">
      <FileUpload />
    </div>
  );
}

export default function RadixBaseFileUploadPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "File Upload" },
      ]}
      componentName="file-upload"
      description="File upload surface with previews and queue states."
      details={fileUploadApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/file-upload/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/components/file-upload"
      preview={<FileUploadPreview />}
      previewDescription="Drop files onto the surface, click to browse, then remove queued items to inspect the built-in preview and list behavior."
      title="File Upload"
      usageCode={usageCode}
      usageDescription="Use the uploader as-is for the built-in queue UI, then hook into the provided callbacks when you need to track selected files, limit uploads, or hand completed files to your own form or API flow."
    />
  );
}
