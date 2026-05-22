import { readProjectSkillMd } from "@/lib/agent-skills";
import { skillMarkdownResponse } from "@/lib/agent-skills-response";

export async function GET() {
  const content = await readProjectSkillMd();
  return skillMarkdownResponse(content);
}
