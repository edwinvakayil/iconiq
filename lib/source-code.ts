const sourceCache = new Map<string, string | null>();

export async function readComponentSource(
  componentName: string
): Promise<string | null> {
  const cached = sourceCache.get(componentName);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const registry = (await import(`@/public/r/${componentName}.json`)) as {
      files?: { content?: string }[];
      default?: { files?: { content?: string }[] };
    };

    let content: string | null = null;

    if (registry.files && registry.files.length > 0) {
      content = registry.files[0]?.content ?? null;
    } else if (registry.default?.files && registry.default.files.length > 0) {
      content = registry.default.files[0]?.content ?? null;
    }

    sourceCache.set(componentName, content);
    return content;
  } catch {
    sourceCache.set(componentName, null);
    return null;
  }
}
