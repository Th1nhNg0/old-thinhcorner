import { getFeeling } from "@/lib/spotify-api";

export default async function handler(req, res) {
  try {
    let data = await getFeeling();
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json(e.message);
  }
}
