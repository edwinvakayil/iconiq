import { HomeHero } from "./home-hero";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full min-w-0">
      <main className="min-w-0 flex-1">
        <HomeHero />
      </main>
    </div>
  );
}
