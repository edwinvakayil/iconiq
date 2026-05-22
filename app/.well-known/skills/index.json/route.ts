import { getAgentSkillsIndex } from "@/lib/agent-skills";
import {
  agentSkillsNotFound,
  jsonAgentSkillsResponse,
} from "@/lib/agent-skills-response";

export async function GET() {
  const index = await getAgentSkillsIndex();

  if (!index) {
    return agentSkillsNotFound();
  }

  return jsonAgentSkillsResponse(index);
}
