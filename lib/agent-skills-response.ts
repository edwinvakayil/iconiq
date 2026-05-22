const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control":
    "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
} as const;

const TEXT_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control":
    "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
} as const;

export function jsonAgentSkillsResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: JSON_HEADERS,
  });
}

export function skillMarkdownResponse(content: string) {
  return new Response(content, {
    headers: TEXT_HEADERS,
  });
}

export function agentSkillsNotFound() {
  return jsonAgentSkillsResponse({ error: "Skill not found" }, 404);
}
