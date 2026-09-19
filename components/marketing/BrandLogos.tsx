/**
 * Customer wordmarks for the social-proof band, and the G2 badge beside it.
 *
 * Redrawn as inline SVG rather than shipped as images: they are small, they
 * are monochrome white on a dark tile, and six image requests on a hero
 * section is a worse trade than a few hundred bytes of path data. They are
 * approximations of the real marks, in the same spirit as the Fathom glyph.
 */

const TILE =
  "flex h-[64px] w-[128px] shrink-0 items-center justify-center rounded-[10px] bg-[#1c1c1c] text-fg";

/** G2's ring with the notch and the superscript two. */
export function G2Badge({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" style={{ width: size, height: size }} aria-label="G2">
      <path
        d="M30 9.5A15 15 0 1 0 35 21H21"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="butt"
      />
      <text x="29.5" y="14.5" fontSize="13" fontWeight="700" fill="#fff" fontFamily="inherit">
        2
      </text>
    </svg>
  );
}

export function HubSpotLogo() {
  return (
    <span className={TILE}>
      <span className="flex items-baseline text-[17px] font-bold tracking-tight">
        HubSp
        <svg viewBox="0 0 24 24" className="mx-[1px] h-[12px] w-[12px] self-center" aria-hidden>
          {/* The sprocket that stands in for the second o */}
          <circle cx="11" cy="14" r="5" fill="none" stroke="#fff" strokeWidth="2.6" />
          <circle cx="20" cy="4" r="2.6" fill="none" stroke="#fff" strokeWidth="2.2" />
          <path d="M14.6 10.6 18.4 6.4" stroke="#fff" strokeWidth="2" />
          <path d="M11 9V4M11 24v-5" stroke="#fff" strokeWidth="1.6" />
        </svg>
        t
      </span>
      <span className="sr-only">HubSpot</span>
    </span>
  );
}

export function AdobeLogo() {
  return (
    <span className={`${TILE} flex-col gap-0.5`}>
      <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" aria-hidden>
        <path fill="#fff" d="M9.4 2 1 22h4.9l2.1-5.6h4.9L10.6 11H9.3l1.9-4.6L17.8 22H23L14.6 2H9.4Z" />
      </svg>
      <span className="text-[9px] font-semibold tracking-tight">Adobe</span>
    </span>
  );
}

export function ZapierLogo() {
  return (
    <span className={TILE}>
      <span className="text-[19px] font-bold tracking-tight">
        <span className="text-fg">_</span>zapier
      </span>
    </span>
  );
}

export function GrubhubLogo() {
  return (
    <span className={`${TILE} gap-1.5`}>
      <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" aria-hidden>
        <path fill="#fff" d="M12 1.5 1.8 9.4V23h20.4V9.4L12 1.5Z" />
        {/* Knife and fork, cut out of the house */}
        <path fill="#1c1c1c" d="M14.8 9.5c0-1.3.7-2.4 1.6-2.4s1.6 1.1 1.6 2.4c0 1-.4 1.9-1 2.2v7.5h-1.2v-7.5c-.6-.3-1-1.2-1-2.2Z" />
        <path fill="#1c1c1c" d="M6.6 7.1h1.1v3.2h.7V7.1h1.1v3.2h.7V7.1h1.1v3.6c0 .9-.5 1.6-1.2 1.8v6.7H7.8v-6.7c-.7-.2-1.2-.9-1.2-1.8V7.1Z" />
      </svg>
      <span className="text-[14px] font-extrabold tracking-tight">GRUBHUB</span>
    </span>
  );
}

export function EaLogo() {
  return (
    <span className={TILE}>
      <svg viewBox="0 0 48 48" className="h-[31px] w-[31px]" aria-label="EA">
        <circle cx="24" cy="24" r="21" fill="#fff" />
        <g fill="#1c1c1c">
          <path d="M14 20.5h13.5l-1.8 3H14zM12 26h13.5l-1.8 3H12z" />
          <path d="M31 17h4.5l5 14h-3.8l-3.4-10-1.5 4.4h2l1 3h-6.2z" />
        </g>
      </svg>
    </span>
  );
}

export function CalendlyLogo() {
  return (
    <span className={`${TILE} gap-1.5`}>
      <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" aria-hidden>
        <circle cx="12" cy="12" r="9.5" fill="none" stroke="#fff" strokeWidth="2.4" />
        {/* The two notches that make the ring read as Calendly's mark */}
        <path d="M12 6.5a5.5 5.5 0 1 0 0 11" fill="none" stroke="#fff" strokeWidth="2.4" />
      </svg>
      <span className="text-[15px] font-medium tracking-tight">Calendly</span>
    </span>
  );
}

/** In the order the product shows them. */
export const BRAND_LOGOS = [
  { key: "hubspot", Logo: HubSpotLogo },
  { key: "adobe", Logo: AdobeLogo },
  { key: "zapier", Logo: ZapierLogo },
  { key: "grubhub", Logo: GrubhubLogo },
  { key: "ea", Logo: EaLogo },
  { key: "calendly", Logo: CalendlyLogo },
];
