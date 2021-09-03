import { getTop } from "@/lib/spotify-api";

export default async function handler(req, res) {
  const { type, time_range } = req.query;
  try {
    let data = await getTop(type, time_range);
    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(400).json(e.message);
  }
}
