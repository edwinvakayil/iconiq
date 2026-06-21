"use client";

import * as React from "react";

type DocsSidebarContextValue = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: () => void;
  close: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  desktopAnchorRef: React.RefObject<HTMLDivElement | null>;
  mobileAnchorRef: React.RefObject<HTMLDivElement | null>;
};

const DocsSidebarContext = React.createContext<DocsSidebarContextValue | null>(
  null
);

export function DocsSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const desktopAnchorRef = React.useRef<HTMLDivElement>(null);
  const mobileAnchorRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);

  React.useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const syncAnchor = () => {
      anchorRef.current = mediaQuery.matches
        ? desktopAnchorRef.current
        : (mobileAnchorRef.current ?? desktopAnchorRef.current);
    };

    syncAnchor();
    mediaQuery.addEventListener("change", syncAnchor);

    return () => {
      mediaQuery.removeEventListener("change", syncAnchor);
    };
  });

  const value = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      open,
      close,
      anchorRef,
      desktopAnchorRef,
      mobileAnchorRef,
    }),
    [isOpen, open, close]
  );

  return (
    <DocsSidebarContext.Provider value={value}>
      {children}
    </DocsSidebarContext.Provider>
  );
}

export function useDocsSidebar() {
  const context = React.useContext(DocsSidebarContext);
  if (!context) {
    throw new Error("useDocsSidebar must be used within DocsSidebarProvider");
  }
  return context;
}
