"use client";

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
  DocsPlaygroundSegmentedField,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import {
  docsPlaygroundRowClassName,
  docsPlaygroundTextInputClassName,
} from "@/components/docs/playground/docs-playground-styles";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/registry/contribution-graph";

type BlockScale = "small" | "medium" | "large";

type PaletteName = "emerald" | "sky" | "violet" | "amber" | "rose";

const LEADING_AT_REGEX = /^@/;

type ContributionGraphPlaygroundState = {
  username: string;
  scale: BlockScale;
  palette: PaletteName;
  animated: boolean;
  monthLabels: boolean;
  footer: boolean;
};

const DEFAULT_STATE: ContributionGraphPlaygroundState = {
  username: "edwinvakayil",
  scale: "medium",
  palette: "emerald",
  animated: true,
  monthLabels: true,
  footer: true,
};

const PALETTE_OPTIONS: Array<{ label: string; value: PaletteName }> = [
  { label: "Emerald", value: "emerald" },
  { label: "Sky", value: "sky" },
  { label: "Violet", value: "violet" },
  { label: "Amber", value: "amber" },
  { label: "Rose", value: "rose" },
];

/** Level ramps for the non-default palettes. Written as full literals so
 *  Tailwind's scanner picks them up; "emerald" uses the component default. */
const PALETTE_CLASSES: Record<Exclude<PaletteName, "emerald">, string> = {
  sky: 'data-[level="0"]:fill-muted data-[level="1"]:fill-sky-200 dark:data-[level="1"]:fill-sky-900 data-[level="2"]:fill-sky-400 dark:data-[level="2"]:fill-sky-700 data-[level="3"]:fill-sky-600 dark:data-[level="3"]:fill-sky-500 data-[level="4"]:fill-sky-800 dark:data-[level="4"]:fill-sky-300',
  violet:
    'data-[level="0"]:fill-muted data-[level="1"]:fill-violet-200 dark:data-[level="1"]:fill-violet-900 data-[level="2"]:fill-violet-400 dark:data-[level="2"]:fill-violet-700 data-[level="3"]:fill-violet-600 dark:data-[level="3"]:fill-violet-500 data-[level="4"]:fill-violet-800 dark:data-[level="4"]:fill-violet-300',
  amber:
    'data-[level="0"]:fill-muted data-[level="1"]:fill-amber-200 dark:data-[level="1"]:fill-amber-900 data-[level="2"]:fill-amber-400 dark:data-[level="2"]:fill-amber-700 data-[level="3"]:fill-amber-600 dark:data-[level="3"]:fill-amber-500 data-[level="4"]:fill-amber-800 dark:data-[level="4"]:fill-amber-300',
  rose: 'data-[level="0"]:fill-muted data-[level="1"]:fill-rose-200 dark:data-[level="1"]:fill-rose-900 data-[level="2"]:fill-rose-400 dark:data-[level="2"]:fill-rose-700 data-[level="3"]:fill-rose-600 dark:data-[level="3"]:fill-rose-500 data-[level="4"]:fill-rose-800 dark:data-[level="4"]:fill-rose-300',
};

const paletteLevelClasses = (palette: PaletteName) =>
  palette === "emerald" ? undefined : PALETTE_CLASSES[palette];

const SCALE_OPTIONS: Array<{ label: string; value: BlockScale }> = [
  { label: "S", value: "small" },
  { label: "M", value: "medium" },
  { label: "L", value: "large" },
];

const SCALE_PRESETS: Record<
  BlockScale,
  { blockSize: number; blockMargin: number; fontSize: number }
> = {
  small: { blockSize: 9, blockMargin: 3, fontSize: 12 },
  medium: { blockSize: 11, blockMargin: 3, fontSize: 13 },
  large: { blockSize: 13, blockMargin: 4, fontSize: 14 },
};

const ContributionGraphPlaygroundContext = createContext<{
  state: ContributionGraphPlaygroundState;
  replayToken: number;
  replay: () => void;
} | null>(null);

function useContributionGraphPlayground() {
  const context = useContext(ContributionGraphPlaygroundContext);

  if (!context) {
    throw new Error(
      "ContributionGraphPlayground components must be used within ContributionGraphPlaygroundProvider."
    );
  }

  return context;
}

function generateContributionGraphCode(
  state: ContributionGraphPlaygroundState
) {
  const levelClasses = paletteLevelClasses(state.palette);

  const imports = [
    "ContributionGraph",
    "ContributionGraphBlock",
    "ContributionGraphCalendar",
    state.footer && "ContributionGraphFooter",
    state.footer && "ContributionGraphLegend",
    state.footer && "ContributionGraphTotalCount",
  ].filter(Boolean) as string[];

  const preset = SCALE_PRESETS[state.scale];
  const rootAttrs = [
    `username="${state.username}"`,
    state.scale !== "medium" && `blockSize={${preset.blockSize}}`,
    !state.animated && "animated={false}",
  ].filter(Boolean) as string[];

  const calendarTag = state.monthLabels
    ? "<ContributionGraphCalendar>"
    : "<ContributionGraphCalendar hideMonthLabels>";

  const levelClassesConst = levelClasses
    ? `
// The graph colors by data-level, so any Tailwind fill ramp works.
const levelClasses =
  '${levelClasses}';
`
    : "";

  const blockLines = [
    "          <ContributionGraphBlock",
    "            activity={activity}",
    ...(levelClasses ? ["            className={levelClasses}"] : []),
    "            dayIndex={dayIndex}",
    "            weekIndex={weekIndex}",
    "          />",
  ];

  const legendLines = levelClasses
    ? [
        "        <ContributionGraphLegend>",
        "          {({ level }) => (",
        "            <svg height={12} width={12}>",
        "              <rect",
        '                className={cn("stroke-[1px] stroke-border", levelClasses)}',
        "                data-level={level}",
        "                height={12}",
        "                rx={2}",
        "                ry={2}",
        "                width={12}",
        "              />",
        "            </svg>",
        "          )}",
        "        </ContributionGraphLegend>",
      ]
    : ["        <ContributionGraphLegend />"];

  const footerLines = state.footer
    ? [
        "      <ContributionGraphFooter>",
        "        <ContributionGraphTotalCount />",
        ...legendLines,
        "      </ContributionGraphFooter>",
      ]
    : [];

  const cnImport =
    levelClasses && state.footer ? `import { cn } from "@/lib/utils";\n` : "";

  return `${cnImport}import {
  ${imports.join(",\n  ")},
} from "@/components/ui/contribution-graph";
${levelClassesConst}
export function GitHubActivity() {
  return (
    <ContributionGraph ${rootAttrs.join(" ")}>
      ${calendarTag}
        {({ activity, dayIndex, weekIndex }) => (
${blockLines.join("\n")}
        )}
      </ContributionGraphCalendar>
${footerLines.join("\n")}${footerLines.length > 0 ? "\n" : ""}    </ContributionGraph>
  );
}`;
}

function ContributionGraphPlaygroundPreview() {
  const { state, replayToken, replay } = useContributionGraphPlayground();
  const preset = SCALE_PRESETS[state.scale];
  const levelClasses = paletteLevelClasses(state.palette);

  return (
    <div className="flex w-full flex-col items-center gap-4 px-4 py-10">
      <ContributionGraph
        animated={state.animated}
        blockMargin={preset.blockMargin}
        blockSize={preset.blockSize}
        fontSize={preset.fontSize}
        key={`${state.username}-${state.scale}-${state.palette}-${state.animated}-${replayToken}`}
        username={state.username}
      >
        <ContributionGraphCalendar hideMonthLabels={!state.monthLabels}>
          {({ activity, dayIndex, weekIndex }) => (
            <ContributionGraphBlock
              activity={activity}
              className={levelClasses}
              dayIndex={dayIndex}
              weekIndex={weekIndex}
            />
          )}
        </ContributionGraphCalendar>
        {state.footer && (
          <ContributionGraphFooter className="text-xs">
            <ContributionGraphTotalCount />
            {levelClasses ? (
              <ContributionGraphLegend>
                {({ level }) => (
                  <svg
                    height={preset.blockSize}
                    key={level}
                    width={preset.blockSize}
                  >
                    <title>{`${level} contributions`}</title>
                    <rect
                      className={cn("stroke-[1px] stroke-border", levelClasses)}
                      data-level={level}
                      height={preset.blockSize}
                      rx={2}
                      ry={2}
                      width={preset.blockSize}
                    />
                  </svg>
                )}
              </ContributionGraphLegend>
            ) : (
              <ContributionGraphLegend />
            )}
          </ContributionGraphFooter>
        )}
      </ContributionGraph>
      {state.animated && (
        <button
          className="self-center px-1 text-muted-foreground text-xs transition-colors hover:text-foreground"
          onClick={replay}
          type="button"
        >
          Replay ↺
        </button>
      )}
    </div>
  );
}

function PlaygroundUsernameField({
  onCommit,
  value,
}: {
  onCommit: (username: string) => void;
  value: string;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = () => {
    const next = draft.trim().replace(LEADING_AT_REGEX, "");

    if (next.length === 0) {
      setDraft(value);
      return;
    }

    onCommit(next);
  };

  return (
    <div className={`${docsPlaygroundRowClassName} flex-nowrap gap-3 px-3`}>
      <span className="shrink-0 whitespace-nowrap font-medium text-[#5c5c61] text-[13px] dark:text-[#a1a1a6]">
        Username
      </span>
      <input
        aria-label="GitHub username"
        className={docsPlaygroundTextInputClassName}
        onBlur={commit}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            commit();
            event.currentTarget.blur();
          }
        }}
        placeholder="github username"
        spellCheck={false}
        value={draft}
      />
    </div>
  );
}

function ContributionGraphPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<ContributionGraphPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: ContributionGraphPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={
        <DocsPlaygroundClearButton label="Reset options" onClick={onReset} />
      }
      onClose={onClose}
      title="Contribution Graph"
    >
      <PlaygroundUsernameField
        onCommit={(username) => onChange({ username })}
        value={state.username}
      />
      <DocsPlaygroundSegmentedField
        label="Block size"
        onChange={(scale) => onChange({ scale })}
        options={SCALE_OPTIONS}
        value={state.scale}
      />
      <DocsPlaygroundSelectField
        label="Color"
        onChange={(palette) => onChange({ palette })}
        options={PALETTE_OPTIONS}
        value={state.palette}
      />
      <DocsPlaygroundToggleField
        checked={state.animated}
        label="Animated"
        onChange={(animated) => onChange({ animated })}
      />
      <DocsPlaygroundToggleField
        checked={state.monthLabels}
        label="Month labels"
        onChange={(monthLabels) => onChange({ monthLabels })}
      />
      <DocsPlaygroundToggleField
        checked={state.footer}
        label="Footer"
        onChange={(footer) => onChange({ footer })}
      />
    </DocsPlaygroundPanel>
  );
}

type ContributionGraphPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function ContributionGraphPlaygroundProvider({
  children,
}: {
  children: (props: ContributionGraphPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] =
    useState<ContributionGraphPlaygroundState>(DEFAULT_STATE);
  const [replayToken, setReplayToken] = useState(0);

  const updateState = (next: Partial<ContributionGraphPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateContributionGraphCode(state));
  }, [setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const replay = () => setReplayToken((token) => token + 1);

  const renderSettings = (onClose: () => void) => (
    <ContributionGraphPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <ContributionGraphPlaygroundContext.Provider
      value={{ state, replayToken, replay }}
    >
      {children({
        preview: <ContributionGraphPlaygroundPreview />,
        renderSettings,
      })}
    </ContributionGraphPlaygroundContext.Provider>
  );
}
