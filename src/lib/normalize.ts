// React 19's react-dom/server serializes a few attributes using React's prop
// names (autoPlay, playsInline) or historical casing (charSet) instead of the
// canonical HTML attribute names. HTML attribute names are case-insensitive, so
// the output still works in browsers — but for a clean, canonical, SEO-ready
// artifact we normalize them to lowercase here.
const ATTR_FIXES: Array<[RegExp, string]> = [
  [/\bautoPlay=/g, "autoplay="],
  [/\bplaysInline=/g, "playsinline="],
  [/\bcharSet=/g, "charset="],
];

export function normalizeHtml(html: string): string {
  return ATTR_FIXES.reduce((out, [re, fix]) => out.replace(re, fix), html);
}
