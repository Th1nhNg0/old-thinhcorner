import React from "react";
import { allTags } from "src/lib/tags";
import { allPosts, Post } from "contentlayer/generated";
import ListLayout from "src/layouts/ListLayout";

export default function TagViewPage({
  posts,
  tagName,
}: {
  posts: Post[];
  tagName: string;
}) {
  return <ListLayout posts={posts} name={tagName} />;
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
  const posts = allPosts.filter((post) => post.tags.includes(slug));
  return { props: { posts, tagName: slug } };
}
