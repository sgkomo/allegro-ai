import axios from "axios";
import { readJson } from "./_utils.js";

export default async function handler(req, res) {
  try {
    const authHeader = req.headers["authorization"] || req.headers["x-access-token"];
    const token = (authHeader || "").replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ error: "Brak access_token (Authorization: Bearer ...)" });

    const body = await readJson(req);
    const { imageUrl } = body;
    if (!imageUrl) return res.status(400).json({ error: "Podaj imageUrl w body" });

    // pobierz obraz
    const img = await axios.get(imageUrl, { responseType: "arraybuffer" });

    // wrzuć do Allegro
    const r = await axios.post(
      "https://upload.allegro.pl/sale/images",
      img.data,
      {
        headers: {
          Accept: "application/vnd.allegro.public.v1+json",
          "Content-Type": img.headers["content-type"] || "image/jpeg",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Zwracamy JSON Allegro (m.in. pole "location")
    res.status(200).json(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || { error: String(e) });
  }
}
