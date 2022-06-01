import { allSnippets, Snippet } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import SnippetLayout from "src/layouts/SnippetLayout";
import components from "../../components/MDXComponents";

export default function BlogDetailPage({ snippet }: { snippet: Snippet }) {
  const Component = useMDXComponent(snippet.body.code);
  return (
    <SnippetLayout snippet={snippet}>
      <Component
        components={{
          ...components,
        }}
      />
    </SnippetLayout>
  );
}

export async function getStaticPaths() {
  return {
    paths: allSnippets.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const snippet = allSnippets.find((snippet) => snippet.slug === params.slug);
  return { props: { snippet } };
}
