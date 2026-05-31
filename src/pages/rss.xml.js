import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

export async function GET(context) {
    const posts = (await getCollection("writings")).sort(
        (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
    );

    const feedURL = new URL("rss.xml", context.site).href;
    const lastBuildDate = posts
        .map((post) => post.data.updatedDate ?? post.data.pubDate)
        .sort((a, b) => b.valueOf() - a.valueOf())[0]
        ?.toUTCString();

    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: context.site,
        xmlns: { atom: "http://www.w3.org/2005/Atom" },
        customData: [
            "<language>en-IN</language>",
            `<atom:link href="${feedURL}" rel="self" type="application/rss+xml"/>`,
            lastBuildDate && `<lastBuildDate>${lastBuildDate}</lastBuildDate>`,
        ]
            .filter(Boolean)
            .join(""),
        items: posts.map((post) => ({
            ...post.data,
            link: `/writings/${post.id}/`,
        })),
    });
}
