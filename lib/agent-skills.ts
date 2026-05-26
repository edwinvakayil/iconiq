import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const SKILLS_DIR = path.join(process.cwd(), "skills");
/** Default skill served at /SKILL.md for consumers installing from iconiqui.com */
export const DEFAULT_PUBLIC_SKILL_NAME = "iconiq-shadcn";
const CRLF_REGEX = /\r?\n/;
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---/;
const INDENTED_LINE_REGEX = /^\s+/;
const QUOTE_TRIM_REGEX = /^['"]|['"]$/g;
const SPACE_REGEX = / /g;

type SkillFrontmatter = {
  name: string;
  description: string;
};

type AgentSkillsIndex = {
  skills: Array<{
    name: string;
    description: string;
    files: ["SKILL.md"];
  }>;
};

function parseFoldedBlockScalar(lines: string[], startIndex: number) {
  const parts: string[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === "") {
      index += 1;
      continue;
    }
    if (!INDENTED_LINE_REGEX.test(line)) {
      break;
    }
    parts.push(line.trim());
    index += 1;
  }

  return {
    value: parts.join(" "),
    nextIndex: index,
  };
}

function parseSkillFrontmatter(content: string): SkillFrontmatter | null {
  const match = content.match(FRONTMATTER_REGEX);
  if (!match) {
    return null;
  }

  const lines = match[1].split(CRLF_REGEX);
  let name: string | null = null;
  let description: string | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (line.startsWith("name:")) {
      name = line.slice("name:".length).trim();
      continue;
    }

    if (line.startsWith("description:")) {
      const inline = line.slice("description:".length).trim();
      if (inline === ">- " || inline === ">-") {
        const folded = parseFoldedBlockScalar(lines, index + 1);
        description = folded.value;
        index = folded.nextIndex - 1;
        continue;
      }
      if (inline === "|" || inline === "|+") {
        const folded = parseFoldedBlockScalar(lines, index + 1);
        description = folded.value.replace(SPACE_REGEX, "\n");
        index = folded.nextIndex - 1;
        continue;
      }
      description = inline.replace(QUOTE_TRIM_REGEX, "");
    }
  }

  if (!(name && description)) {
    return null;
  }

  return { name, description };
}

function skillMdPath(skillName: string) {
  return path.join(SKILLS_DIR, skillName, "SKILL.md");
}

function readSkillFile(skillName: string) {
  return readFile(skillMdPath(skillName), "utf8");
}

async function listSkillNames() {
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function readProjectSkillMd(skillName = DEFAULT_PUBLIC_SKILL_NAME) {
  return readSkillFile(skillName);
}

export async function getAgentSkillsIndex(): Promise<AgentSkillsIndex | null> {
  const skillNames = await listSkillNames();
  const skills: AgentSkillsIndex["skills"] = [];

  for (const skillName of skillNames) {
    const content = await readSkillFile(skillName);
    const frontmatter = parseSkillFrontmatter(content);

    if (!frontmatter) {
      continue;
    }

    skills.push({
      name: frontmatter.name,
      description: frontmatter.description,
      files: ["SKILL.md"],
    });
  }

  if (skills.length === 0) {
    return null;
  }

  return { skills };
}

export async function getProjectSkillForName(skillName: string) {
  const content = await readSkillFile(skillName);
  const frontmatter = parseSkillFrontmatter(content);

  if (!frontmatter || frontmatter.name !== skillName) {
    return null;
  }

  return content;
}
