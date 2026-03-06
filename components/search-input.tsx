import { useHotkey } from "@tanstack/react-hotkeys";
import { SearchIcon } from "lucide-react";
import { useRef } from "react";

import { Input } from "./ui/input";

type SearchInputProps = {
  searchValue: string;
  setSearchValue: (value: string) => void;
};

const SearchInput = ({ searchValue, setSearchValue }: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useHotkey(
    "Mod+F",
    (event) => {
      event?.preventDefault?.();
      inputRef.current?.focus();
      inputRef.current?.select();
    },
    {
      ignoreInputs: false,
    }
  );

  return (
    <div className="relative w-full max-w-[260px]">
      <Input
        aria-label="Search icons"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="pr-20 pl-8"
        inputMode="search"
        leadingIcon={
          <SearchIcon className="size-4 text-neutral-400" strokeWidth={2.5} />
        }
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search icons..."
        ref={inputRef}
        role="search"
        spellCheck="false"
        value={searchValue}
      />
      <div className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-500 md:flex">
        <kbd className="flex h-4 min-w-4 items-center justify-center rounded-[3px] bg-neutral-200 px-1 text-[10px] leading-4">
          ⌘
        </kbd>
        <kbd className="flex h-4 min-w-4 items-center justify-center rounded-[3px] bg-neutral-200 px-1 text-[10px] leading-4">
          F
        </kbd>
      </div>
    </div>
  );
};

export { SearchInput };
