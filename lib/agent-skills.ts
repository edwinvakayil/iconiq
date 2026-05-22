import { readFile } from "node:fs/promises";
import path from "node:path";

const SKILL_MD_PATH = path.join(process.cwd(), "skills", "iconiq", "SKILL.md");
const CRLF_REGEX = /\r?\n/;
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---/;
const INDENTED_LINE_REGEX = /^\s+/;
const QUOTE_TRIM_REGEX = /^['"]|['"]$/g;
const SPACE_REGEX = / /g;

type SkillFrontmatter = {
  name: string;
  description: string;
};

export type AgentSkillsIndex = {
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

export function parseSkillFrontmatter(
  content: string
): SkillFrontmatter | null {
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

export function readProjectSkillMd() {
  return readFile(SKILL_MD_PATH, "utf8");
}

export async function getAgentSkillsIndex(): Promise<AgentSkillsIndex | null> {
  const content = await readProjectSkillMd();
  const frontmatter = parseSkillFrontmatter(content);

  if (!frontmatter) {
    return null;
  }

  return {
    skills: [
      {
        name: frontmatter.name,
        description: frontmatter.description,
        files: ["SKILL.md"],
      },
    ],
  };
}

export async function getProjectSkillForName(skillName: string) {
  const content = await readProjectSkillMd();
  const frontmatter = parseSkillFrontmatter(content);

  if (!frontmatter || frontmatter.name !== skillName) {
    return null;
  }

  return content;
}
