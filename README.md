# lucidwave

Animated React icon library. 350+ copy-paste ready icons built with [Motion](https://motion.dev) and based on [Lucide](https://lucide.dev).

![lucidwave — Animated React Icons](./public/og.png)

**[→ Live demo](https://lucidwave.vercel.app)**

---

## Install

```bash
pnpm add @lucidwave/core
# or
npm i @lucidwave/core
# or
yarn add @lucidwave/core
```

## Use

```tsx
import { Heart } from "@lucidwave/core";

export default function Example() {
  return <Heart className="size-8" />;
}
```

Icons are SVG components. Pass `className`, `size`, `color`, and other standard SVG props to style them. All icons use Motion for animations and work with Tailwind and plain CSS.

---

## What’s included

- **350+ animated icons** — Same vocabulary as Lucide, with smooth Motion animations.
- **Copy-paste or package** — Use the CLI to copy source into your repo or install the package.
- **MIT licensed** — Free for personal and commercial use.
- **Customizable** — SVG + React; tweak stroke, duration, and behavior as needed.

---

## Tech

- [Motion](https://motion.dev) for animation  
- [Lucide](https://lucide.dev) as the icon base  
- [Next.js](https://nextjs.org) for the docs site  

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. lucidwave only accepts icons based on Lucide; custom or third-party icon sets are not accepted.

---

## License

MIT © [Edwin Vakayil](https://www.edwinvakayil.info). See [LICENSE](LICENSE) for details.

---
