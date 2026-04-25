import { HomeHero } from "./home-hero";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height-mobile))] w-full min-w-0 lg:min-h-[calc(100vh-var(--header-height-desktop))]">
      <main className="min-w-0 flex-1">
        <HomeHero />
      </main>
    </div>
  );
}
