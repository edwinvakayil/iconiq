"use server";

import { SITE } from "@/constants";
import { getComponentForV0 } from "@/helpers/get-component-for-v0";

export async function openComponentInV0Action(
  name: string,
  pageContent?: string
) {
  try {
    const template = await getComponentForV0(name, pageContent);

    if (!template) {
      throw new Error(`Component ${name} not found.`);
    }

    const payload = {
      ...template,
      meta: {
        project: SITE.NAME,
        author: SITE.AUTHOR.NAME,
        url: SITE.URL,
      },
      source: {
        title: SITE.NAME,
        url: SITE.URL,
        file: `${name}.tsx`,
      },
    };

    const response = await fetch("https://v0.dev/chat/api/templates/open", {
      method: "POST",
      body: JSON.stringify({
        version: 3,
        template: payload,
      }),
      headers: {
        "x-v0-edit-secret": process.env.V0_API_KEY ?? "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Unauthorized");
      }
      console.error(
        "Error fetching /api/templates/open:",
        await response.text()
      );
      throw new Error("Something went wrong. Please try again later.");
    }

    const result = await response.json();
    return { error: null, url: result.url };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return { error: error.message, url: null };
    }
    return { error: "Something went wrong. Please try again later.", url: "" };
  }
}
