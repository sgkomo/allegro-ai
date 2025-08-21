import axios from "axios";
import qs from "qs";

export default async function handler(req, res) {
  try {
    const { refresh_token } = await (await import("./_utils.js")).then(m => m.readJson(req));
    if (!refresh_token) return res.status(400).json({ error: "Podaj refresh_token" });

    const r = await axios.post(
      "https://allegro.pl/auth/oauth/token",
      qs.stringify({ grant_type: "refresh_token", refresh_token }),
      {
        auth: { username: process.env.ALLEGRO_CLIENT_ID, password: process.env.ALLEGRO_CLIENT_SECRET },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    res.status(200).json(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || { error: String(e) });
  }
}
