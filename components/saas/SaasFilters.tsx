/**
 * Shared SVG filters used by the .text-inset / .text-inset-soft classes in saas.css.
 * (Lifted from the landing repo's app/layout.tsx.)
 */
export default function SaasFilters() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <filter id="inset-shadow-strong" x="-5%" y="-10%" width="110%" height="125%">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="2.5" />
          <feOffset dx="0" dy="4" result="b" />
          <feFlood floodColor="#0A1440" floodOpacity="0.55" />
          <feComposite in2="b" operator="in" />
          <feComposite in2="SourceAlpha" operator="in" result="sh" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="sh" />
          </feMerge>
        </filter>
        <filter id="inset-shadow-soft" x="-5%" y="-10%" width="110%" height="125%">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="2" />
          <feOffset dx="0" dy="3" result="b" />
          <feFlood floodColor="#0A1440" floodOpacity="0.38" />
          <feComposite in2="b" operator="in" />
          <feComposite in2="SourceAlpha" operator="in" result="sh" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="sh" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
