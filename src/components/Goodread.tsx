import React, { useState } from "react";
import fetcher from "src/lib/fetcher";
import useSWR from "swr";
import { motion } from "framer-motion";

interface Books {
  title: string;
  url: string;
  thumbnail: string;
}
export default function GoodRead() {
  const [isShow, setIsShow] = useState(false);
  const { data, isValidating, error } = useSWR<{
    current_reads: Books[];
    read: Books[];
  }>("/api/goodreads", fetcher);

  if (error || !data) return null;
  return (
    <div>
      <h3 className="mb-3 text-2xl font-bold">My bookshelf</h3>
      <p className="mb-3 text-lg text-subtle">
        I love reading books, here is my bookshelf on{" "}
        <a
          className="text-gold"
          href="https://www.goodreads.com/user/show/161740636-th-nh-ng"
        >
          Goodreads
        </a>
      </p>
      <h2 className="mb-3 text-xl font-bold">Currently reading</h2>

      <div className="grid grid-cols-2 md:grid-cols-4">
        {data?.current_reads.slice(0, 4).map((book) => (
          <a
            href={book.url}
            key={book.title}
            title={book.title}
            className="w-full h-full"
          >
            <img
              src={book.thumbnail}
              alt=""
              className="object-cover w-full h-full"
            />
          </a>
        ))}
      </div>

      <h2 className="mt-10 mb-3 text-xl font-bold">Read</h2>
      <motion.div
        animate={{ height: isShow ? "auto" : 300 }}
        transition={{ duration: 0.5 }}
        className="relative grid grid-cols-4 overflow-hidden md:grid-cols-6"
      >
        {data?.read.map((book) => (
          <a
            href={book.url}
            key={book.title}
            title={book.title}
            className="w-full h-full"
          >
            <img
              src={book.thumbnail}
              alt=""
              className="object-cover w-full h-full"
            />
          </a>
        ))}
        <button
          className="absolute bottom-0 w-full p-2 text-xl font-medium text-white bg-gradient-to-t to-transparent from-base "
          onClick={() => setIsShow(!isShow)}
          type="button"
        >
          <span className="shadow">Show {isShow ? "less" : "more"}</span>
        </button>
      </motion.div>
    </div>
  );
}
