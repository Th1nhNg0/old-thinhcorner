import { allPosts, Post } from "contentlayer/generated";
import { NextSeo } from "next-seo";
import React from "react";
import ListLayout from "src/layouts/ListLayout";
import { allTags } from "src/lib/tags";

export default function TagViewPage({
  posts,
  tagName,
}: {
  posts: Post[];
  tagName: string;
}) {
  return (
    <>
      <NextSeo
        title={tagName.toUpperCase()}
        description={`All the blog with ${tagName} tag`}
      />
      <ListLayout posts={posts} name={tagName} />
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: allTags().map((tag) => ({
      params: { slug: tag.name },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const posts = allPosts.filter(
    (post) => post.draft !== true && post.tags.includes(slug)
  );
  return { props: { posts, tagName: slug } };
}
