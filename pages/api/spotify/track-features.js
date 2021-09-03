import { getTrackFeatures } from "@/lib/spotify-api";

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    let data = await getTrackFeatures(id);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json(e.message);
  }
}
