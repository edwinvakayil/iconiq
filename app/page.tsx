import { CommentBlock } from "@/components/comment";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import { LINK } from "@/constants";

const Home = () => {
  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-12">
          <div className="mb-6 flex items-center overflow-visible">
            <svg
              aria-hidden
              className="h-[1.25rem] w-auto shrink-0 overflow-visible text-neutral-900"
              style={{ overflow: "visible" }}
              viewBox="-57 80 1138 1040"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M565.5 1120c-29.333 0-52.75-5.67-70.25-17Q469 1086.005 469 1058c0-9.33 3.5-21.75 10.5-37.25Q490 997.5 503.75 964T528 885.25 538.5 782q0-38-4.75-75.5T519 631q-33.5 10-69 15t-69 5q-91 0-173.5-37T57.25 506-57 334q81.5-47.5 153.5-69.75t145-22.25q83.5 0 158.5 32.5T536.5 368q36.5-90.5 100.25-154.75T785 114.5 969 80q41 0 64.25 1.25c15.5.833 31.42 2.25 47.75 4.25q0 147.5-53.25 260.75T879.25 529 657.5 615q16 55.5 27.5 107.75t17.75 102.5A815 815 0 0 1 709 926q0 104-34 149t-109.5 45m-139-645q-55-38-113.25-58.75T192.5 393q-20-1-20-20.5 0-8.5 6-14t15-5.5q45 0 88.75 10.75t85.75 30.5T449.5 442q7.5 5 9 13.25t-4 15.25q-11.5 15.5-28 4.5m139 605c37.333 0 63.917-10.92 79.75-32.75S669 985 669 926q0-53-7.25-106.5t-21-112.5-33.25-128q99-4 177.75-41T920 438.5t86.75-143.5 33.75-173c-9-.667-19.08-1.167-30.25-1.5Q993.5 120 969 120q-98.5 0-180.5 35.5T645.25 260.25 546.5 432Q473 354.5 399 318.25T241.5 282q-60 0-122 17t-124 50q42 81.5 101.25 140.25t131.5 90.25T381 611q41.5 0 83.75-6t81.75-22q16.5 49.5 24.25 99.5t7.75 99.5q0 59.5-10.5 106t-24.25 80.5c-9.167 22.667-17.25 41.17-24.25 55.5q-10.5 21.495-10.5 31.5 0 11.505 13.25 18c8.833 4.33 23.25 6.5 43.25 6.5m90-663.5q-7-4.5-8.5-12.75t3.5-15.75q27-39 59.25-71.75t67.25-59T847 213q8-4 15.75-1t10.75 11q7 17-9.5 25.5-54.5 28.5-98.5 67.25T683 411q-11 16-27.5 5.5" />
            </svg>
          </div>

          <section className="scroll-mt-24" id="overview">
            <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl">
              Iconiq
            </h1>
            <p className="mt-2 font-sans text-lg text-neutral-600">
              Motion-powered animated icons for your React projects.
            </p>
            <div className="mt-10 space-y-4 font-sans text-neutral-600 text-sm leading-relaxed">
              <p>
                Iconiq is a collection of animated icons built with Motion and
                based on the Lucide icon system. Each icon is designed for
                modern interfaces, combining clean visuals with subtle motion.
              </p>
              <p>
                Icons are copy-paste React components, so you can integrate them
                directly into your codebase and customize them freely.
              </p>
              <p>
                If you’d like to suggest new icons or contribute, open an issue
                or pull request on the{" "}
                <a
                  className="font-medium text-neutral-900 underline underline-offset-4 hover:no-underline"
                  href={LINK.GITHUB}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub repository
                </a>
              </p>
            </div>
            <CommentBlock />
          </section>
        </div>
      </main>
      <OnThisPage />
    </div>
  );
};

export default Home;
