import { getRecentlyPlayed } from "@/lib/spotify-api";

export default async function handler(req, res) {
  const { limit } = req.query;
  try {
    let data = await getRecentlyPlayed(limit);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json(e.message);
  }
}
