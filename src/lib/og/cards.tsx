/* eslint-disable @next/next/no-img-element */
import { OG_BG, OG_SIZE } from "./size";

export function BrandOgCard({ logoSrc }: { logoSrc: string }) {
  return (
    <div
      style={{
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: OG_BG,
        padding: 80,
      }}
    >
      <img src={logoSrc} alt="" width={720} height={200} />
    </div>
  );
}

/**
 * The title box is 1040px wide and capped at 180px tall. Rather than let long
 * titles get chopped mid-word by `overflow: hidden`, step the size down and, if
 * it still won't fit, truncate explicitly with an ellipsis.
 *
 * Char budgets are derived from the box: at 52px/1.15 three lines hold ~95 chars,
 * at 44px four lines hold ~145, at 38px four lines hold ~170.
 */
export function fitTitle(title: string): { text: string; fontSize: number } {
  const t = title.trim();
  if (t.length <= 95) return { text: t, fontSize: 52 };
  if (t.length <= 145) return { text: t, fontSize: 44 };
  if (t.length <= 170) return { text: t, fontSize: 38 };
  // Truncate on a word boundary so the ellipsis reads as deliberate.
  const cut = t.slice(0, 169);
  const lastSpace = cut.lastIndexOf(" ");
  return { text: `${(lastSpace > 120 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\u2014-]+$/, "")}\u2026`, fontSize: 38 };
}

export function DocumentOgCard({
  logoSrc,
  eyebrow,
  title,
}: {
  logoSrc: string;
  eyebrow: string;
  title: string;
}) {
  const fitted = fitTitle(title);
  return (
    <div
      style={{
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: OG_BG,
        padding: 80,
      }}
    >
      <div style={{ display: "flex" }}>
        <img src={logoSrc} alt="" width={280} height={78} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 1040,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "IBM Plex Mono",
            fontSize: 20,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#82949f",
            marginBottom: 20,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: fitted.fontSize,
            lineHeight: 1.15,
            color: "#ffffff",
            maxHeight: 180,
            overflow: "hidden",
          }}
        >
          {fitted.text}
        </div>
      </div>
    </div>
  );
}
