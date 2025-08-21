import axios from "axios";
import { readJson, HEADERS_JSON } from "./_utils.js";

const API_BASE = "https://api.allegro.pl";

export default async function handler(req, res) {
  try {
    const authHeader = req.headers["authorization"] || req.headers["x-access-token"];
    const token = (authHeader || "").replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ error: "Brak access_token" });

    const b = await readJson(req);

    const payload = {
      name: String(b.name || "Produkt"),
      category: { id: String(b.categoryId) },                  // np. "620" (przykład; użyj właściwej kategorii)
      sellingMode: { format: "BUY_NOW",
        price: { amount: String(b.price || "1.00"), currency: String(b.currency || "PLN") } },
      images: (b.images || []).map((u) => ({ url: u })),       // URL-e z uploadu
      description: { sections: [{ items: [{ type: "TEXT", content: String(b.description || "") }]}]},
      publication: { status: "INACTIVE" },                     // szkic
      location: b.location || { city: "Warszawa", postCode: "00-001", countryCode: "PL" }
      // UWAGA: parametry kategorii (np. stan/EAN) dodaj przez /sale/categories/{id}/parameters – to dołożymy później
    };

    const r = await axios.post(`${API_BASE}/sale/offers`, payload, {
      headers: { ...HEADERS_JSON, Authorization: `Bearer ${token}` },
    });

    res.status(200).json({ offerId: r.data.id, raw: r.data });
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || { error: String(e) });
  }
}
