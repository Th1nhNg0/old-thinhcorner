import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const current_reads = await crawl_book(
    "https://www.goodreads.com/review/list/161740636-th-nh-ng?shelf=currently-reading"
  );
  const read = await crawl_book(
    "https://www.goodreads.com/review/list/161740636-th-nh-ng?order=d&shelf=read&sort=date_read&utf8=%E2%9C%93"
  );
  // cache for week
  res.setHeader("Cache-Control", "s-maxage=604800, stale-while-revalidate");
  res.status(200).json({
    current_reads,
    read,
  });
}

async function crawl_book(url: string) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const books: any = [];
  $("#booksBody > tr").each((i, el) => {
    const title = $(el).find("td:nth-child(4) a").text().trim();
    const url =
      "https://www.goodreads.com" +
      $(el).find("td:nth-child(4) a").attr("href");
    const thumbnail = $(el)
      .find("td:nth-child(3) img")
      .attr("src")
      ?.trim()
      .replace(/.\_.+\_/, "._SX250_");

    const book = {
      title,
      url,
      thumbnail,
    };
    books.push(book);
  });
  return books;
}
