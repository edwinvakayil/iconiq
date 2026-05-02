import { readFile } from "node:fs/promises";
import path from "node:path";

type ChangelogGroup = {
  items: string[];
  label: string;
};

type ChangelogEntry = {
  changes: string;
  date: string;
  groups: ChangelogGroup[];
  summary: string;
  title: string;
  version: string;
};

const ENTRY_SEPARATOR_PATTERN = /^---\s*$/m;
const GROUP_HEADING_PATTERN = /^([A-Z][A-Z0-9 _-]+):$/;
const WORD_SEPARATOR_PATTERN = /[\s_-]+/;

type EntryDraft = {
  currentGroup: ChangelogGroup | null;
  date: string;
  groups: ChangelogGroup[];
  summary: string;
  title: string;
  version: string;
};

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(WORD_SEPARATOR_PATTERN)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function readFieldLine(line: string, prefix: string) {
  return line.startsWith(prefix) ? line.slice(prefix.length).trim() : null;
}

function applyScalarField(line: string, draft: EntryDraft) {
  const date = readFieldLine(line, "DATE:");
  if (date !== null) {
    draft.date = date;
    return true;
  }

  const version = readFieldLine(line, "VERSION:");
  if (version !== null) {
    draft.version = version;
    return true;
  }

  const title = readFieldLine(line, "TITLE:");
  if (title !== null) {
    draft.title = title;
    return true;
  }

  const summary = readFieldLine(line, "SUMMARY:");
  if (summary !== null) {
    draft.summary = summary;
    return true;
  }

  return false;
}

function appendWrappedLine(
  line: string,
  draft: EntryDraft,
  changeLines: string[]
) {
  if (!(draft.currentGroup && draft.currentGroup.items.length > 0)) {
    return;
  }

  const lastIndex = draft.currentGroup.items.length - 1;
  draft.currentGroup.items[lastIndex] =
    `${draft.currentGroup.items[lastIndex]} ${line}`;
  changeLines.push(line);
}

function parseChangelogEntry(block: string) {
  const lines = block
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);

  const draft: EntryDraft = {
    currentGroup: null,
    date: "",
    groups: [],
    summary: "",
    title: "",
    version: "",
  };
  const changeLines: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (applyScalarField(line, draft)) {
      continue;
    }

    const groupMatch = line.match(GROUP_HEADING_PATTERN);
    if (groupMatch) {
      draft.currentGroup = {
        items: [],
        label: toTitleCase(groupMatch[1]),
      };
      draft.groups.push(draft.currentGroup);
      changeLines.push(line);
      continue;
    }

    if (line.startsWith("- ")) {
      const itemText = line.slice(2).trim();
      if (draft.currentGroup) {
        draft.currentGroup.items.push(itemText);
      }
      changeLines.push(line);
      continue;
    }

    appendWrappedLine(line, draft, changeLines);
  }

  if (!(draft.date && draft.version && draft.title)) {
    return null;
  }

  return {
    changes: changeLines.join("\n").trim(),
    date: draft.date,
    groups: draft.groups,
    summary: draft.summary,
    title: draft.title,
    version: draft.version,
  } satisfies ChangelogEntry;
}

function parseChangelogFile(content: string) {
  return content
    .split(ENTRY_SEPARATOR_PATTERN)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(parseChangelogEntry)
    .filter((entry): entry is ChangelogEntry => entry !== null);
}

async function getChangelogEntries() {
  const filePath = path.join(process.cwd(), "content", "changelog.txt");
  const content = await readFile(filePath, "utf8");
  return parseChangelogFile(content);
}

export type { ChangelogEntry, ChangelogGroup };
export { getChangelogEntries };
