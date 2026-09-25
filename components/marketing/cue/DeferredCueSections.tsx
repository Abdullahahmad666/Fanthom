"use client";

import dynamic from "next/dynamic";
import { LazySection } from "@/components/ui/LazySection";

/**
 * Everything below the Cue landing page's fold.
 *
 * Same three-part arrangement step 6 established and measured: dynamic() to
 * split the chunk, LazySection to keep it out of the first render tree, and
 * `ssr: false` -- which needs this client boundary to be legal -- to stop Next
 * preloading the chunk anyway. Dropping any one of the three defers nothing.
 *
 * The options object is repeated at each call because Next reads it at compile
 * time and rejects a hoisted const.
 */

const HowItWorks = dynamic(() => import("./HowItWorks").then((m) => m.HowItWorks), {
  ssr: false,
});
const WorksWhereYouMeet = dynamic(
  () => import("./WorksWhereYouMeet").then((m) => m.WorksWhereYouMeet),
  { ssr: false },
);
const MomentSearch = dynamic(() => import("./MomentSearch").then((m) => m.MomentSearch), {
  ssr: false,
});
const PlainlyHonest = dynamic(() => import("./PlainlyHonest").then((m) => m.PlainlyHonest), {
  ssr: false,
});
const CueClosing = dynamic(() => import("./CueClosing").then((m) => m.CueClosing), {
  ssr: false,
});

/* Each height is the smallest that section measured across 1440, 1024 and
   768, so the floor never pads and the page never jumps. */
export function DeferredCueSections() {
  return (
    <>
      <LazySection minHeight={710}>
        <HowItWorks />
      </LazySection>
      <LazySection minHeight={610}>
        <WorksWhereYouMeet />
      </LazySection>
      <LazySection minHeight={750}>
        <MomentSearch />
      </LazySection>
      <LazySection minHeight={660}>
        <PlainlyHonest />
      </LazySection>
      <LazySection minHeight={490}>
        <CueClosing />
      </LazySection>
    </>
  );
}
