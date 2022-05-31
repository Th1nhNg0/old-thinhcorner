import Link from "next/link";
import moment from "moment";
import classNames from "classnames";
import { allPosts, allSnippets, Post, Snippet } from "contentlayer/generated";
import { pick } from "contentlayer/utils";
import snippet from "./snippet";

export default function Home({
  posts,
  snippets,
}: {
  snippets: Snippet[];
  posts: Post[];
}) {
  return (
    <div className="space-y-10">
      <div className="border-b-[1px] pb-5 border-muted">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-text sm:leading-10 md:leading-14">
          Xin chào, mình là{" "}
          <Link href="/about">
            <a className="hover-underline-animation text-rose">Thịnh</a>
          </Link>
        </h1>
        <h2 className="mt-3 font-mono md:text-lg text-subtle">
          Just a guy like to programming.
        </h2>
      </div>
      <NewestPost posts={posts} />
      <FeaturedSnippet snippets={snippets} />
    </div>
  );
}

function NewestPost({ posts }: { posts: Post[] }) {
  return (
    <div>
      <h3 className="mb-6 text-2xl font-bold tracking-tight">Bài viết mới</h3>
      <div className="flex flex-col gap-5 md:flex-row">
        {posts.map((post, i) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <a
              className={classNames(
                "transform hover:scale-105 duration-300 transition-all rounded-xl w-full md:w-1/3 bg-gradient-to-r p-1 ",
                {
                  "from-[#D8B4FE] to-[#818CF8]": i == 0,
                  "from-[#FDE68A] via-[#FCA5A5] to-[#FECACA]": i == 1,
                  "from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]": i == 2,
                }
              )}
            >
              <div className="flex flex-col justify-between h-full p-4 rounded-lg bg-surface ">
                <div className="flex flex-col justify-between md:flex-row">
                  <h4 className="w-full mb-6 text-lg font-medium tracking-tight text-text md:text-lg sm:mb-10 ">
                    {post.title}
                  </h4>
                </div>
                <div>
                  <div className="text-subtle">
                    {new Intl.NumberFormat().format(123451)} views
                  </div>
                  <div>
                    {moment(post.date).subtract(6, "days").format("LL")}
                  </div>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <Link href="/blog">
        <a className="flex items-center mt-5 transition-all hover:text-text text-subtle">
          Đọc tất cả bài viết
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </Link>
    </div>
  );
}

function FeaturedSnippet({ snippets }: { snippets: Snippet[] }) {
  return (
    <div>
      <h3 className="mb-6 text-2xl font-bold tracking-tight">
        Snippet nổi bật
      </h3>
      <div className="grid gap-5 md:grid-cols-2">
        {snippets.map((snippet) => (
          <Link href="/snippet" key={snippet.slug}>
            <a className="relative w-full p-4 transition duration-500 transform border rounded cursor-pointer bg-surface border-hightlight-high group hover:scale-105">
              <div className="absolute bottom-0 left-0 w-full h-0.5 duration-300 origin-left transform scale-x-0 bg-rose group-hover:scale-x-100"></div>
              <div className="absolute bottom-0 left-0 w-0.5 h-full duration-300 origin-bottom transform scale-y-0 bg-rose group-hover:scale-y-100"></div>
              <div className="absolute top-0 left-0 w-full h-0.5 duration-300 origin-right transform scale-x-0 bg-rose group-hover:scale-x-100"></div>
              <div className="absolute bottom-0 right-0 w-0.5 h-full duration-300 origin-top transform scale-y-0 bg-rose group-hover:scale-y-100"></div>
              <img
                src="https://leerob.io/_next/image?url=%2Flogos%2Fbuttondown.png&w=32&q=75"
                alt=""
                className="rounded-full"
              />
              <h4 className="mt-2 text-lg font-bold text-left text-text">
                {snippet.title}
              </h4>
              <p className="mt-1 text-subtle">{snippet.description}</p>
            </a>
          </Link>
        ))}
      </div>
      <Link href="/blog">
        <a className="flex items-center mt-5 transition-all hover:text-text text-subtle">
          Xem tất cả snippet
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </Link>
    </div>
  );
}

export async function getStaticProps() {
  const posts = allPosts
    .map((post) => pick(post, ["slug", "title", "summary", "date"]))
    .sort((a, b) => moment(b.date).diff(moment(a.date)))
    .slice(0, 3);
  const snippets = allSnippets.map((snippet) =>
    pick(snippet, ["description", "title", "logo", "slug"])
  );
  return { props: { posts, snippets } };
}
