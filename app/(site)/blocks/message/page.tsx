"use client";

import { MessagePlaygroundProvider } from "@/app/(site)/blocks/message/_components/message-playground";
import { messageApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";

const usageCode = `import {
  Message,
  MessageAvatar,
  MessageBubble,
  MessageContent,
  MessageGroup,
} from "@/components/ui/message";

export function Conversation() {
  return (
    <MessageGroup>
      <Message align="end">
        <MessageAvatar>EV</MessageAvatar>
        <MessageContent>
          <MessageBubble variant="primary">
            Deploying to prod real quick.
          </MessageBubble>
        </MessageContent>
      </Message>
      <Message align="start">
        <MessageAvatar>KD</MessageAvatar>
        <MessageContent>
          <MessageBubble>It's 4:55 PM. On a Friday.</MessageBubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  );
}`;

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Blocks" },
  { label: "Message" },
];

export default function MessagePage() {
  return (
    <MessagePlaygroundProvider>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName="message"
          description="Chat message primitives with fluid slide-in animations from each bubble's tail."
          details={messageApiDetails}
          detailsDescription="Message is the row that owns alignment and plays the entrance; everything else composes inside it. The entrance is a single spring driving x, scale, and opacity together — the row starts a small step toward its own side at 90% scale, with the transform origin pinned to the bubble's tail corner, overshoots its resting spot, and bounces back once before settling, so the message reads as morphing out of the composer rather than sliding across the screen. MessageBubble supplies the pill (muted, primary, or ghost), MessageAvatar anchors to the bubble's tail, and MessageHeader/MessageFooter carry the small muted labels. Alignment flows from the single align prop through data attributes, and the whole entrance is dropped under prefers-reduced-motion."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/message/page.tsx`}
          itemSlug="message"
          pageUrl="/blocks/message"
          preview={preview}
          previewClassName="min-h-[24rem]"
          previewDescription="The exchange always plays both sides: the sent message springs in from the right in its primary pill, and the reply follows a beat later from the left in muted — hit Replay to run it again. Use the floating sliders control in the bottom-right corner to open settings — pick each side's bubble style and toggle avatar, header, footer, and the animation itself. Every change replays the conversation and updates the Usage code to match."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Message"
          railNotes={[
            "Use the floating sliders button in the bottom-right of the preview to open settings.",
            "Bubble and part changes update the preview and Usage code together.",
            "Set `align` once on Message; avatar, bubble, and footer all flip sides from it.",
            "Pass `animated={false}` to rows already on screen so only new messages play the entrance.",
            "Reduced motion drops the entrance entirely — messages simply appear in place.",
          ]}
          title="Message"
          usageCode={usageCode}
          usageDescription={
            'Compose a conversation from MessageGroup rows. Give each Message an `align` — `end` for the sender, `start` for the other side — and the entrance direction, row order, and bubble alignment all follow. Use `variant="primary"` on the sender\'s bubble, the muted default for replies, and `ghost` for bare text like streamed AI responses.'
          }
        />
      )}
    </MessagePlaygroundProvider>
  );
}
