import { allPosts, Post } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import PostLayout from "src/layouts/PostLayout";
import components from "../../components/MDXComponents";

export default function BlogDetailPage({ post }: { post: Post }) {
  const Component = useMDXComponent(post.body.code);
  return (
    <PostLayout post={post}>
      <Component
        components={{
          ...components,
        }}
      />
    </PostLayout>
  );
}

export async function getStaticPaths() {
  return {
    paths: allPosts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = allPosts.find((post) => post.slug === params.slug);
  return { props: { post } };
}
