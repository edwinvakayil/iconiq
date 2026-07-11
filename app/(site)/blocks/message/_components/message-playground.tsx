"use client";

import { motion } from "motion/react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import {
  Message,
  MessageAvatar,
  MessageBubble,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/registry/message";

type MessageVariant = "default" | "primary" | "ghost";

type MessagePlaygroundState = {
  sentVariant: MessageVariant;
  receivedVariant: MessageVariant;
  avatar: boolean;
  header: boolean;
  footer: boolean;
  animated: boolean;
};

const DEFAULT_STATE: MessagePlaygroundState = {
  sentVariant: "primary",
  receivedVariant: "default",
  avatar: true,
  header: false,
  footer: false,
  animated: true,
};

const VARIANT_OPTIONS: Array<{ label: string; value: MessageVariant }> = [
  { label: "Primary", value: "primary" },
  { label: "Muted", value: "default" },
  { label: "Ghost", value: "ghost" },
];

/** The two sides of the conversation the preview always shows: sent on the
 *  right, received on the left, each with its own copy so every combination
 *  reads like a real exchange. */
const SIDES = {
  sent: {
    align: "end",
    text: "Deploying to prod real quick.",
    avatar: "🧑‍💻",
    initials: "EV",
    header: "You",
    footer: "4:55 PM · Sent",
  },
  received: {
    align: "start",
    text: "It's 4:55 PM. On a Friday.",
    avatar: "🤠",
    initials: "KD",
    header: "Kate",
    footer: "4:56 PM",
  },
} as const;

/** Delay before the reply lands, long enough for the sent message's bounce
 *  to finish reading as its own gesture. */
const REPLY_BEAT = 900;

/** How long after the reply mounts before the replay control appears —
 *  roughly the reply's entrance, so the button only shows once every
 *  message has fully landed. */
const REPLAY_REVEAL = 600;

const MessagePlaygroundContext = createContext<{
  state: MessagePlaygroundState;
  replayToken: number;
  replay: () => void;
} | null>(null);

function useMessagePlayground() {
  const context = useContext(MessagePlaygroundContext);

  if (!context) {
    throw new Error(
      "MessagePlayground components must be used within MessagePlaygroundProvider."
    );
  }

  return context;
}

function generateMessageCode(state: MessagePlaygroundState) {
  const imports = [
    "Message",
    state.avatar && "MessageAvatar",
    "MessageBubble",
    "MessageContent",
    state.footer && "MessageFooter",
    "MessageGroup",
    state.header && "MessageHeader",
  ].filter(Boolean) as string[];

  const renderMessage = (side: keyof typeof SIDES, variant: MessageVariant) => {
    const preset = SIDES[side];

    const messageAttrs = [
      preset.align === "end" && `align="end"`,
      !state.animated && "animated={false}",
    ].filter(Boolean) as string[];
    const messageTag =
      messageAttrs.length > 0
        ? `<Message ${messageAttrs.join(" ")}>`
        : "<Message>";

    const bubbleTag =
      variant === "default"
        ? "<MessageBubble>"
        : `<MessageBubble variant="${variant}">`;

    const contentLines = [
      state.header && `<MessageHeader>${preset.header}</MessageHeader>`,
      `${bubbleTag}${preset.text}</MessageBubble>`,
      state.footer && `<MessageFooter>${preset.footer}</MessageFooter>`,
    ].filter(Boolean) as string[];

    return [
      `  ${messageTag}`,
      ...(state.avatar
        ? [`    <MessageAvatar>${preset.initials}</MessageAvatar>`]
        : []),
      "    <MessageContent>",
      ...contentLines.map((line) => `      ${line}`),
      "    </MessageContent>",
      "  </Message>",
    ];
  };

  const lines = [
    "<MessageGroup>",
    ...renderMessage("sent", state.sentVariant),
    ...renderMessage("received", state.receivedVariant),
    "</MessageGroup>",
  ];

  return `import {
  ${imports.join(",\n  ")},
} from "@/components/ui/message";

export function Conversation() {
  return (
    ${lines.join("\n    ")}
  );
}`;
}

function PlaygroundMessage({
  side,
  variant,
}: {
  side: keyof typeof SIDES;
  variant: MessageVariant;
}) {
  const { state } = useMessagePlayground();
  const preset = SIDES[side];

  return (
    <Message align={preset.align} animated={state.animated}>
      {state.avatar && (
        <MessageAvatar className="size-8 text-base">
          {preset.avatar}
        </MessageAvatar>
      )}
      <MessageContent>
        {state.header && <MessageHeader>{preset.header}</MessageHeader>}
        <MessageBubble variant={variant}>{preset.text}</MessageBubble>
        {state.footer && <MessageFooter>{preset.footer}</MessageFooter>}
      </MessageContent>
    </Message>
  );
}

/** Plays the exchange once per mount: the sent message lands first and the
 *  reply follows a beat later, so both entrance directions are always shown.
 *  Remounted (via key) on every option change and replay — which also hides
 *  the replay control again until the new run has fully landed. */
function PlaygroundConversation() {
  const { state, replay } = useMessagePlayground();
  const [showReply, setShowReply] = useState(!state.animated);
  const [complete, setComplete] = useState(!state.animated);

  useEffect(() => {
    if (showReply) {
      return;
    }
    const timer = setTimeout(() => setShowReply(true), REPLY_BEAT);
    return () => clearTimeout(timer);
  }, [showReply]);

  // The replay control appears only once the reply's entrance has settled,
  // so it never shows while messages are still landing.
  useEffect(() => {
    if (!showReply || complete) {
      return;
    }
    const timer = setTimeout(() => setComplete(true), REPLAY_REVEAL);
    return () => clearTimeout(timer);
  }, [showReply, complete]);

  return (
    <>
      <MessageGroup className="gap-3">
        <PlaygroundMessage side="sent" variant={state.sentVariant} />
        {showReply && (
          <PlaygroundMessage side="received" variant={state.receivedVariant} />
        )}
      </MessageGroup>
      {complete && (
        <motion.button
          animate={{ opacity: 1 }}
          className="self-start px-1 text-muted-foreground text-xs transition-colors hover:text-foreground"
          initial={{ opacity: 0 }}
          onClick={replay}
          transition={{ duration: 0.3, ease: "easeOut" }}
          type="button"
        >
          Replay ↺
        </motion.button>
      )}
    </>
  );
}

function MessagePlaygroundPreview() {
  const { state, replayToken } = useMessagePlayground();

  return (
    <div className="flex min-h-[16rem] w-full max-w-md flex-col gap-6 py-10">
      <PlaygroundConversation
        // Remounting on every option change replays the whole exchange, so
        // each tweak in the settings panel is immediately visible in motion.
        key={`${JSON.stringify(state)}-${replayToken}`}
      />
    </div>
  );
}

function MessagePlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<MessagePlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: MessagePlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={
        <DocsPlaygroundClearButton label="Reset options" onClick={onReset} />
      }
      onClose={onClose}
      title="Message"
    >
      <DocsPlaygroundSelectField
        label="Sent bubble"
        onChange={(sentVariant) => onChange({ sentVariant })}
        options={VARIANT_OPTIONS}
        value={state.sentVariant}
      />
      <DocsPlaygroundSelectField
        label="Received bubble"
        onChange={(receivedVariant) => onChange({ receivedVariant })}
        options={VARIANT_OPTIONS}
        value={state.receivedVariant}
      />
      <DocsPlaygroundToggleField
        checked={state.avatar}
        label="Avatar"
        onChange={(avatar) => onChange({ avatar })}
      />
      <DocsPlaygroundToggleField
        checked={state.header}
        label="Header"
        onChange={(header) => onChange({ header })}
      />
      <DocsPlaygroundToggleField
        checked={state.footer}
        label="Footer"
        onChange={(footer) => onChange({ footer })}
      />
      <DocsPlaygroundToggleField
        checked={state.animated}
        label="Animated"
        onChange={(animated) => onChange({ animated })}
      />
    </DocsPlaygroundPanel>
  );
}

type MessagePlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function MessagePlaygroundProvider({
  children,
}: {
  children: (props: MessagePlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<MessagePlaygroundState>(DEFAULT_STATE);
  const [replayToken, setReplayToken] = useState(0);

  const updateState = (next: Partial<MessagePlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateMessageCode(state));
  }, [setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const replay = () => setReplayToken((token) => token + 1);

  const renderSettings = (onClose: () => void) => (
    <MessagePlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <MessagePlaygroundContext.Provider value={{ state, replayToken, replay }}>
      {children({
        preview: <MessagePlaygroundPreview />,
        renderSettings,
      })}
    </MessagePlaygroundContext.Provider>
  );
}
