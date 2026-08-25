import { logoSrc } from "@/lib/og/assets";
import { BrandOgCard } from "@/lib/og/cards";
import { renderOgImage } from "@/lib/og/render";
import { OG_SIZE } from "@/lib/og/size";

export const alt = "Ophthalmology Business Academy";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(<BrandOgCard logoSrc={logoSrc} />);
}
