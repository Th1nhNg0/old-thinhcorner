import { Post } from "contentlayer/generated";
import moment from "moment";
import Link from "next/link";
import Tag from "src/components/Tag";
import ViewCounter from "src/components/ViewCounter";

export default function PostLayout({
  children,
  post,
}: {
  children: React.ReactNode;
  post: Post;
}) {
  return (
    <div>
      <article>
        <h1 className="mb-4 text-3xl font-bold text-rose md:text-5xl ">
          {post.title}
        </h1>
        <div className=" border-b-[1px] pb-4 border-muted ">
          <div className="flex flex-col items-start justify-between w-full mt-2 md:flex-row md:items-center">
            <div className="flex items-center">
              <p className="text-subtle">{moment(post.date).format("LL")}</p>
            </div>
            <p className="mt-2 text-sm text-subtle min-w-32 md:mt-0">
              {post.readingTime.text}
              {` • `}
              <ViewCounter slug={post.slug} update />
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {post.tags?.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        </div>
        <div className="mt-8 prose max-w-none">{children}</div>
      </article>
    </div>
  );
}
