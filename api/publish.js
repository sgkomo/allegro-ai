import axios from "axios";
import { readJson, HEADERS_JSON } from "./_utils.js";
import crypto from "node:crypto";

const API_BASE = "https://api.allegro.pl";

export default async function handler(req, res) {
  try {
    const authHeader = req.headers["authorization"] || req.headers["x-access-token"];
    const token = (authHeader || "").replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ error: "Brak access_token" });

    const { offerId } = await readJson(req);
    if (!offerId) return res.status(400).json({ error: "Podaj offerId" });

    const commandId = crypto.randomUUID();

    const payload = {
      publication: { action: "ACTIVATE" },
      offerCriteria: [{ type: "CONTAINS_OFFERS", offers: [{ id: String(offerId) }] }],
    };

    const r = await axios.put(
      `${API_BASE}/sale/offer-publication-commands/${commandId}`,
      payload,
      { headers: { ...HEADERS_JSON, Authorization: `Bearer ${token}` } }
    );

    res.status(200).json({ commandId, tasks: r.data.tasks || [] });
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || { error: String(e) });
  }
}
