import { GetServerSideProps } from "next";
import {
  allPosts,
  allPages,
  allSnippets,
  Post,
  Snippet,
  Page,
} from "contentlayer/generated";
import siteMetadata from "data/siteMetadata";
import { allTags, Tag } from "src/lib/tags";

function generateSiteMap(
  host_url: string | undefined,
  {
    posts,
    pages,
    snippets,
    tags,
  }: {
    posts: Post[];
    pages: Page[];
    snippets: Snippet[];
    tags: Tag[];
  }
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${host_url}</loc>
    </url>
    <url>
      <loc>${host_url}/blog</loc>
    </url>
    <url>
      <loc>${host_url}/tag</loc>
    </url>
    <url>
      <loc>${host_url}/snippet</loc>
    </url>
     

       ${pages
         .map(({ slug }) => {
           return `
      <url>
          <loc>${`${host_url}/${slug}`}</loc>
      </url>
    `;
         })
         .join("")}

         ${posts
           .map(({ slug, date }) => {
             return `
          <url>
              <loc>${`${host_url}/blog/${slug}`}</loc>
              <lastmod>${date}</lastmod>
          </url>
        `;
           })
           .join("")}

       ${snippets
         .map(({ slug, date }) => {
           return `
        <url>
            <loc>${`${host_url}/snippet/${slug}`}</loc>
            <lastmod>${date}</lastmod>
        </url>
      `;
         })
         .join("")}
         ${tags
           .map(({ name }) => {
             return `
        <url>
            <loc>${`${host_url}/tag/${name}`}</loc>
        </url>
      `;
           })
           .join("")}
        
   </urlset>
 `;
}

export default function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { res } = context;
  // full host url
  const posts = allPosts.filter((post) => post.draft !== true);
  const tags = allTags();
  const pages = allPages;
  const snippets = allSnippets;

  const sitemap = generateSiteMap(siteMetadata.siteUrl, {
    posts,
    tags,
    pages,
    snippets,
  });
  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};
