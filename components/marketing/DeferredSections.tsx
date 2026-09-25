"use client";

import dynamic from "next/dynamic";
import { LazySection } from "@/components/ui/LazySection";

/**
 * Everything on the landing page below the hero.
 *
 * Three things had to line up for this to actually defer anything, and the
 * first two alone did nothing when measured:
 *
 *  1. `dynamic()` splits the chunk. On its own that is all it does -- the
 *     component is still in the first render tree, so the chunk is fetched
 *     immediately anyway.
 *  2. LazySection keeps it out of the tree until it is nearly in view.
 *  3. `ssr: false`, which needs this client boundary to be legal. Without it
 *     Next renders the section on the server and emits a preload for its
 *     chunk, so the browser fetches it before anything has been scrolled.
 *
 * The options object is repeated at every call rather than shared: Next reads
 * these at compile time to decide what to emit, so it has to be a literal it
 * can see, and a hoisted `const` is rejected outright.
 *
 * The cost is that this content is no longer in the initial HTML. That is
 * acceptable here specifically because the app is noindex -- if these pages
 * were meant to rank, the trade would go the other way.
 */

const FeatureCarousel = dynamic(
  () => import("./FeatureCarousel").then((m) => m.FeatureCarousel),
  { ssr: false },
);
const TeamTabs = dynamic(() => import("./TeamTabs").then((m) => m.TeamTabs), {
  ssr: false,
});
const PillarSection = dynamic(
  () => import("./PillarSection").then((m) => m.PillarSection),
  { ssr: false },
);
const StatsSection = dynamic(
  () => import("./StatsSection").then((m) => m.StatsSection),
  { ssr: false },
);
const UnstoppableSection = dynamic(
  () => import("./UnstoppableSection").then((m) => m.UnstoppableSection),
  { ssr: false },
);
const WorksWhereYouMeet = dynamic(
  () => import("./WorksWhereYouMeet").then((m) => m.WorksWhereYouMeet),
  { ssr: false },
);
const RoleCards = dynamic(() => import("./RoleCards").then((m) => m.RoleCards), {
  ssr: false,
});

/** Heights are the measured height of each section, so nothing jumps. */
export function DeferredFeatureCarousel() {
  return (
    <LazySection minHeight={900}>
      <FeatureCarousel />
    </LazySection>
  );
}

export function DeferredTeamTabs() {
  return (
    <LazySection minHeight={620}>
      <TeamTabs />
    </LazySection>
  );
}

export function DeferredRest() {
  return (
    <>
      <LazySection minHeight={1400}>
        <PillarSection />
      </LazySection>
      <LazySection minHeight={900}>
        <StatsSection />
      </LazySection>
      <LazySection minHeight={1600}>
        <UnstoppableSection />
      </LazySection>
      <LazySection minHeight={1200}>
        <WorksWhereYouMeet />
      </LazySection>
      <LazySection minHeight={700}>
        <RoleCards />
      </LazySection>
    </>
  );
}
