import { CommentButtonClient } from "./comment.client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const GITHUB_REPO_API = "https://api.github.com/repos/edwinvakayil/iconiq";

async function getRepoOwnerAvatar(): Promise<string | null> {
  try {
    const res = await fetch(GITHUB_REPO_API, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 3600 },
    });
    const data = (await res.json()) as { owner?: { avatar_url?: string } };
    return data?.owner?.avatar_url ?? null;
  } catch {
    return null;
  }
}

const CommentBlock = async () => {
  const avatarUrl = await getRepoOwnerAvatar();

  return (
    <div className="relative my-[40px] flex w-full max-w-[610px] flex-col items-center justify-center max-[655px]:px-0">
      <div className="flex w-full flex-wrap items-center justify-between gap-4 border-neutral-200 pt-4 max-[655px]:pl-0 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarImage
              alt="Edwin Vakayil, the author of Iconiq"
              className="select-none"
              src={avatarUrl ?? undefined}
            />
            <AvatarFallback className="bg-neutral-200 font-sans dark:bg-neutral-800">
              EV
            </AvatarFallback>
          </Avatar>
          <p className="text-[13px] text-neutral-600 tracking-[0.01em] dark:text-neutral-400">
            <a
              className="underline underline-offset-2 transition-colors duration-100 hover:text-primary focus-visible:outline-1 focus-visible:outline-primary"
              href="https://www.edwinvakayil.info"
              rel="noopener noreferrer"
              tabIndex={0}
              target="_blank"
            >
              edwin vakayil
            </a>
            , creator of Iconiq
          </p>
        </div>
        <CommentButtonClient />
      </div>
    </div>
  );
};

export { CommentBlock };
