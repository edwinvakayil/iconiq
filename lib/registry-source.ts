type RegistryFile = {
  content?: string;
};

type RegistryPayload = {
  files?: RegistryFile[];
};

const sourceCache = new Map<string, string | null>();

export async function fetchRegistrySource(
  componentName: string
): Promise<string | null> {
  const cached = sourceCache.get(componentName);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const response = await fetch(`/r/${componentName}.json`);
    if (!response.ok) {
      sourceCache.set(componentName, null);
      return null;
    }

    const registry = (await response.json()) as RegistryPayload;
    const content = registry.files?.[0]?.content?.trim() ?? null;
    sourceCache.set(componentName, content);
    return content;
  } catch {
    sourceCache.set(componentName, null);
    return null;
  }
}
