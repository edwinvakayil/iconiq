"use client";

import { fileUploadApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { usageToV0Page } from "@/lib/component-v0-pages";
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

export default function FileUploadPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "File Upload" },
      ]}
      componentName="file-upload"
      description="Drag-and-drop file uploader with click-to-browse fallback, queued file rows, image previews, and animated removal."
      details={fileUploadApiDetails}
      preview={<FileUploadPreview />}
      previewDescription="Drop files onto the surface, click to browse, then remove queued items to inspect the built-in preview and list behavior."
      title="File Upload"
      usageCode={usageCode}
      usageDescription="Use the uploader as-is for the built-in queue UI, then hook into the provided callbacks when you need to track selected files, limit uploads, or hand completed files to your own form or API flow."
      v0PageCode={usageToV0Page(usageCode)}
    />
  );
}
