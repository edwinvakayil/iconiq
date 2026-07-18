/**
 * The browser build of Tailwind ships no types — importing it is a pure
 * side effect (it starts the runtime compiler). Used by /studio only.
 */
declare module "@tailwindcss/browser";
