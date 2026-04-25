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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setSearchValue("");
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-[280px]">
      <Input
        aria-label="Search icons"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="pr-20 pl-8"
        inputMode="search"
        leadingIcon={
          <SearchIcon
            className="size-4 text-muted-foreground"
            strokeWidth={2.5}
          />
        }
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search icons..."
        ref={inputRef}
        role="search"
        spellCheck="false"
        value={searchValue}
      />
      <div className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 items-center gap-1 font-mono text-[10px] text-muted-foreground md:flex">
        <kbd className="flex h-4 min-w-4 items-center justify-center px-1 text-[10px] leading-4">
          ⌘
        </kbd>
        <kbd className="flex h-4 min-w-4 items-center justify-center px-1 text-[10px] leading-4">
          F
        </kbd>
      </div>
    </div>
  );
};

export { SearchInput };
