"use client";

import {
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import type {
  CardContent,
  CardDescription,
  CardFooter,
  CardImage,
  CardProps,
  CardTitle,
} from "@/registry/card";

type CardModule = {
  Card: ComponentType<CardProps>;
  CardContent: typeof CardContent;
  CardDescription: typeof CardDescription;
  CardFooter: typeof CardFooter;
  CardImage: typeof CardImage;
  CardTitle: typeof CardTitle;
};

type CardPlaygroundState = {
  interactive: boolean;
  mediaInset: boolean;
};

const artworkSrc = "/assets/gradient.png";

const DEFAULT_STATE: CardPlaygroundState = {
  interactive: true,
  mediaInset: true,
};

const cardShellClassName =
  "flex min-h-[26rem] w-full max-w-[17.5rem] flex-col gap-7 border border-border/80 bg-background pt-0 text-left shadow-[0_18px_48px_-36px_rgba(15,23,42,0.22)] sm:max-w-[20rem]";

const tagClassName =
  "inline-flex items-center rounded-md bg-muted px-2.5 py-1 font-medium text-[12px] text-foreground";

const CardPlaygroundContext = createContext<{
  CardModule: CardModule;
  state: CardPlaygroundState;
} | null>(null);

function useCardPlayground() {
  const context = useContext(CardPlaygroundContext);

  if (!context) {
    throw new Error(
      "CardPlayground components must be used within CardPlaygroundProvider."
    );
  }

  return context;
}

function PreviewFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[40rem] w-full items-center justify-center px-4 py-12">
      <div className="flex w-full flex-col items-center gap-4 text-center">
        {children}
      </div>
    </div>
  );
}

function CardPlaygroundBody({
  CardContent,
  CardDescription,
  CardFooter,
  CardImage,
  CardTitle,
  state,
}: {
  CardContent: CardModule["CardContent"];
  CardDescription: CardModule["CardDescription"];
  CardFooter: CardModule["CardFooter"];
  CardImage: CardModule["CardImage"];
  CardTitle: CardModule["CardTitle"];
  state: CardPlaygroundState;
}) {
  return (
    <>
      <CardImage
        alt="Red and purple gradient artwork"
        className="aspect-[4/2.25] w-full object-cover"
        height={4000}
        inset={state.mediaInset}
        sizes="(max-width: 640px) 100vw, 20rem"
        src={artworkSrc}
        width={6000}
      />

      <CardContent className="flex-1 space-y-3 px-4.5 pt-5 pb-0 text-left">
        <CardTitle className="text-left font-normal text-[1.1rem] leading-[1.2] tracking-[-0.04em]">
          Design Systems That Last
        </CardTitle>
        <CardDescription className="text-left text-[14px] leading-[1.45]">
          Steady patterns keep interfaces coherent as products grow.
        </CardDescription>
      </CardContent>

      <CardFooter className="mt-auto items-center justify-between gap-2 border-t-0 bg-transparent px-4.5 pt-5 pb-5">
        <span className="text-[12px] text-muted-foreground">Categories</span>
        <div className="flex flex-wrap justify-end gap-1">
          <span className={tagClassName}>Marketing</span>
          <span className={tagClassName}>UI Design</span>
        </div>
      </CardFooter>
    </>
  );
}

function CardPlaygroundPreview() {
  const { CardModule, state } = useCardPlayground();
  const {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardImage,
    CardTitle,
  } = CardModule;

  const body = (
    <CardPlaygroundBody
      CardContent={CardContent}
      CardDescription={CardDescription}
      CardFooter={CardFooter}
      CardImage={CardImage}
      CardTitle={CardTitle}
      state={state}
    />
  );

  return (
    <PreviewFrame>
      <Card className={cardShellClassName} interactive={state.interactive}>
        {body}
      </Card>
    </PreviewFrame>
  );
}

function generateCardCode(state: CardPlaygroundState, importPath: string) {
  const cardProps = state.interactive ? " interactive" : "";
  const insetLine = state.mediaInset ? "" : "\n        inset={false}";

  return `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardImage,
  CardTitle,
} from "${importPath}";

export function CardDemo() {
  return (
    <Card${cardProps} className="w-full max-w-sm pt-0">
      <CardImage
        alt="Gradient artwork"
        className="aspect-[4/2.25] w-full object-cover"
        height={900}
        src="/assets/gradient.png"
        width={1600}${insetLine}
      />
      <CardContent className="space-y-2 px-3.5 pt-3 pb-0 text-left">
        <CardTitle>Design Systems That Last</CardTitle>
        <CardDescription>
          Steady patterns keep interfaces coherent as products grow.
        </CardDescription>
      </CardContent>
      <CardFooter className="items-center justify-between gap-2 border-t-0 bg-transparent px-3.5 pt-3.5 pb-3.5">
        <span className="text-[11px] text-muted-foreground">Categories</span>
        <div className="flex flex-wrap justify-end gap-1">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium">
            Marketing
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium">
            UI Design
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}`;
}

function CardPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<CardPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: CardPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Card"
    >
      <DocsPlaygroundToggleField
        checked={state.interactive}
        label="Interactive"
        onChange={(interactive) => onChange({ interactive })}
      />
      <DocsPlaygroundToggleField
        checked={state.mediaInset}
        label="Inset media"
        onChange={(mediaInset) => onChange({ mediaInset })}
      />
    </DocsPlaygroundPanel>
  );
}

type CardPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function CardPlaygroundProvider({
  CardModule,
  importPath,
  children,
}: {
  CardModule: CardModule;
  importPath: string;
  children: (props: CardPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<CardPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<CardPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateCardCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <CardPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <CardPlaygroundContext.Provider value={{ CardModule, state }}>
      {children({
        preview: <CardPlaygroundPreview />,
        renderSettings,
      })}
    </CardPlaygroundContext.Provider>
  );
}
