"use client";

import { useId } from "react";

import { Input } from "@/components/ui/input";

export const title = "Input Label";

export function InputFloatingLabel() {
  const id = useId();

  return (
    <div className="group relative w-full max-w-xs">
      <label
        className="absolute top-1/2 block origin-start -translate-y-1/2 cursor-text px-2 text-muted-foreground text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:font-medium group-focus-within:text-foreground group-focus-within:text-xs has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground has-[+input:not(:placeholder-shown)]:text-xs"
        htmlFor={id}
      >
        <span className="inline-flex bg-background px-1">Enter Username</span>
      </label>
      <Input
        className="dark:bg-background"
        id={id}
        placeholder="Username"
        type="name"
      />
    </div>
  );
}

export default InputFloatingLabel;
