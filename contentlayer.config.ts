import {
  ComputedFields,
  defineDocumentType,
  makeSource,
} from "contentlayer/source-files";

import readingTime from "reading-time";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrism from "rehype-prism-plus";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const computedFields: ComputedFields = {
  readingTime: { type: "json", resolve: (doc) => readingTime(doc.body.raw) },
  wordCount: {
    type: "number",
    resolve: (doc) => doc.body.raw.split(/\s+/gu).length,
  },
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ""),
  },
};

const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "blog/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "string", required: true },
    summary: { type: "string", required: true },
    image: { type: "string", required: false },
  },
  computedFields,
}));

const Snippet = defineDocumentType(() => ({
  name: "Snippet",
  filePathPattern: "snippets/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    logo: { type: "string", required: true },
  },
  computedFields,
}));

const contentLayerConfig = makeSource({
  contentDirPath: "data",
  documentTypes: [Blog, Snippet],
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      rehypeCodeTitles,
      rehypePrism,
      rehypeKatex,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"],
          },
        },
      ],
    ],
  },
});

export default contentLayerConfig;
