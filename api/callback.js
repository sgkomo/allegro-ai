import axios from "axios";
import qs from "qs";

export default async function handler(req, res) {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send("Brak ?code w URL");

    const clientId = process.env.ALLEGRO_CLIENT_ID;
    const clientSecret = process.env.ALLEGRO_CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    const tokenResp = await axios.post(
      "https://allegro.pl/auth/oauth/token",
      qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri
      }),
      {
        auth: { username: clientId, password: clientSecret },
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }
    );

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).send(JSON.stringify(tokenResp.data, null, 2));
  } catch (e) {
    res.status(500).json(e.response?.data || { error: String(e) });
  }
}
