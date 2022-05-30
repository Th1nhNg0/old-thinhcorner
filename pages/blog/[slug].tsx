import { allBlogs, Blog } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";

export default function BlogDetailPage({ post }: { post: Blog }) {
  const Component = useMDXComponent(post.body.code);
  return (
    <div>
      <Component />
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: allBlogs.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = allBlogs.find((post) => post.slug === params.slug);
  return { props: { post } };
}
