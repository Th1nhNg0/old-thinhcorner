import type { NextPage } from "next";
import Link from "next/link";

export default function Home() {
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
      <NewestPost />
      <FeaturedSnippet />
    </div>
  );
}

function NewestPost() {
  return (
    <div>
      <h3 className="mb-6 text-2xl font-bold tracking-tight">Bài viết mới</h3>
      <div className="flex flex-col gap-5 md:flex-row">
        <Link href="/blog/style-guides-component-libraries-design-systems">
          <a className="transform hover:scale-105 duration-300 transition-all rounded-xl w-full md:w-1/3 bg-gradient-to-r p-1 from-[#D8B4FE] to-[#818CF8]">
            <div className="flex flex-col justify-between h-full p-4 rounded-lg bg-surface ">
              <div className="flex flex-col justify-between md:flex-row">
                <h4 className="w-full mb-6 text-lg font-medium tracking-tight text-text md:text-lg sm:mb-10 ">
                  Everything I Know About Style Guides, Design Systems, and
                  Component Libraries
                </h4>
              </div>
              <div className="flex items-center text-text capsize">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
                <span className="ml-2 align-baseline capsize">152,158</span>
              </div>
            </div>
          </a>
        </Link>
        <Link href="/blog/style-guides-component-libraries-design-systems">
          <a className="transform hover:scale-[1.01] transition-all rounded-xl w-full md:w-1/3 bg-gradient-to-r p-1 from-[#FDE68A] via-[#FCA5A5] to-[#FECACA]">
            <div className="flex flex-col justify-between h-full p-4 rounded-lg bg-surface">
              <div className="flex flex-col justify-between md:flex-row">
                <h4 className="w-full mb-6 text-lg font-medium tracking-tight text-text md:text-lg sm:mb-10 ">
                  Rust Is The Future of JavaScript Infrastructure
                </h4>
              </div>
              <div className="flex items-center text-text capsize">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
                <span className="ml-2 align-baseline capsize">152,158</span>
              </div>
            </div>
          </a>
        </Link>
        <Link href="/blog/style-guides-component-libraries-design-systems">
          <a className="transform hover:scale-[1.01] transition-all rounded-xl w-full md:w-1/3 bg-gradient-to-r p-1 from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]">
            <div className="flex flex-col justify-between h-full p-4 rounded-lg bg-surface">
              <div className="flex flex-col justify-between md:flex-row">
                <h4 className="w-full mb-6 text-lg font-medium tracking-tight text-text md:text-lg sm:mb-10 ">
                  Past, Present, and Future of React State Management
                </h4>
              </div>
              <div className="flex items-center text-text capsize">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
                <span className="ml-2 align-baseline capsize">152,158</span>
              </div>
            </div>
          </a>
        </Link>
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

function FeaturedSnippet() {
  return (
    <div>
      <h3 className="mb-6 text-2xl font-bold tracking-tight">
        Snippet nổi bật
      </h3>
      <div className="grid gap-5 md:grid-cols-2">
        {[0, 1, 3, 4].map((e) => (
          <Link href="/snippet" key={e}>
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
                Buttondown
              </h4>
              <p className="mt-1 text-subtle">Get all subscribers.</p>
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
