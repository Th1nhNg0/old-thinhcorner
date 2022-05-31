import moment from "moment";
import Link from "next/link";
import slugify from "slugify";
import { allPosts, Post } from "contentlayer/generated";
import { pick } from "contentlayer/utils";

export default function blog({ posts }: { posts: Post[] }) {
  return (
    <div>
      <div className="border-b-[1px] pb-8 mb-8 border-muted">
        <div className="max-w-xl ">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl text-text">
            Blog
          </h1>
          <p className="mb-4 text-subtle">
            Mình đang tập viết blog, có thể bài viết chưa được hay nhất có thể.
            Mình đã viết được tổng cộng xx bài viết. Dùng thanh search dưới đây
            để tìm theo tiêu đề.
          </p>
          <div className="relative w-full">
            <input
              aria-label="Search articles"
              type="text"
              placeholder="Search articles"
              className="block w-full px-4 py-2 border rounded-md border-hightlight-med bg-surface focus:ring-rose focus:border-rose"
            />
            <svg
              className="absolute w-5 h-5 right-3 top-3 text-subtle"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <ul>
        {posts.map((post) => {
          return (
            <li key={post.slug} className="py-4">
              <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="font-medium leading-6 text-subtle">
                    <time dateTime={post.date}>
                      {moment(post.date).format("LL")}
                    </time>
                  </dd>
                  <div>
                    <p className="font-medium leading-6 text-muted ">
                      {new Intl.NumberFormat().format(12341)} views
                    </p>
                  </div>
                </dl>
                <div className="space-y-3 xl:col-span-3">
                  <div>
                    <h3 className="text-2xl font-bold leading-8 tracking-tight">
                      <Link href={`/blog/${post.slug}`} className="text-text">
                        {post.title}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap">
                      {/* {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))} */}
                    </div>
                  </div>
                  <div className="prose text-subtle">{post.summary}</div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
const Tag = ({ text }: { text: string }) => {
  return (
    <Link href={`/tags/${slugify(text)}`}>
      <a className="mr-3 text-sm font-medium uppercase duration-300 text-foam text-opacity-70 hover:text-opacity-100">
        {text.split("-").join(" ")}
      </a>
    </Link>
  );
};

export async function getStaticProps() {
  const posts = allPosts
    .map((blog) => pick(blog, ["slug", "title", "summary", "date"]))
    .sort((a, b) => moment(b.date).diff(moment(a.date)));
  return { props: { posts } };
}
