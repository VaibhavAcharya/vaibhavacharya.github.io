// ProductHunt links and badges. The official badge endpoint takes the product
// slug where it documents a numeric post id, so the count inside the badge stays
// live and there is no id to keep in sync.
//
// The launch galleries live in src/data/shots.ts, alongside the pictures of
// everything that never had a launch.

const BADGE = "https://api.producthunt.com/widgets/embed-image/v1/featured.svg";

type PhTheme = "light" | "dark" | "neutral";

export const phBadge = (slug: string, theme: PhTheme) =>
    `${BADGE}?post_id=${slug}&theme=${theme}`;

export const phLink = (slug: string) =>
    `https://www.producthunt.com/products/${slug}`;
