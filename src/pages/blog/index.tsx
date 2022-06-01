import moment from "moment";
import { allPosts, Post } from "contentlayer/generated";
import { pick } from "contentlayer/utils";
import ListLayout from "src/layouts/ListLayout";

export default function BlogPage({ posts }: { posts: Post[] }) {
  return <ListLayout posts={posts} name="Blog" />;
}

export async function getStaticProps() {
  const posts = allPosts
    .map((blog) => pick(blog, ["slug", "title", "summary", "date", "tags"]))
    .sort((a, b) => moment(b.date).diff(moment(a.date)));

  return { props: { posts } };
}
