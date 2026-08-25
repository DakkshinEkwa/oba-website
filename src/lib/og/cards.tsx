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

export function DocumentOgCard({
  logoSrc,
  eyebrow,
  title,
}: {
  logoSrc: string;
  eyebrow: string;
  title: string;
}) {
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
            fontSize: 52,
            lineHeight: 1.15,
            color: "#ffffff",
            maxHeight: 180,
            overflow: "hidden",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
