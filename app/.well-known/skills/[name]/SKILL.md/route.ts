import { getProjectSkillForName } from "@/lib/agent-skills";
import {
  agentSkillsNotFound,
  skillMarkdownResponse,
} from "@/lib/agent-skills-response";

type RouteContext = {
  params: Promise<{ name: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { name } = await context.params;
  const content = await getProjectSkillForName(name);

  if (!content) {
    return agentSkillsNotFound();
  }

  return skillMarkdownResponse(content);
}
