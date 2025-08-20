export default function handler(req, res) {
  const clientId = process.env.ALLEGRO_CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI; // np. https://twoj-projekt.vercel.app/api/callback
  if (!clientId || !redirectUri) {
    return res.status(500).send("Brak ALLEGRO_CLIENT_ID lub REDIRECT_URI w env.");
  }
  const url =
    `https://allegro.pl/auth/oauth/authorize?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;
  res.writeHead(302, { Location: url });
  res.end();
}
