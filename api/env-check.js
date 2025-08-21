export default function handler(req, res) {
  const keys = ["ALLEGRO_CLIENT_ID", "ALLEGRO_CLIENT_SECRET", "REDIRECT_URI"];
  const report = Object.fromEntries(
    keys.map(k => [k, {present: !!process.env[k], length: (process.env[k]||"").length}])
  );
  res.status(200).json(report);
}
