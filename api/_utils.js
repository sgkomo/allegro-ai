export async function readJson(req) {
  return await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch (e) { reject(e); }
    });
  });
}

export const HEADERS_JSON = {
  Accept: "application/vnd.allegro.public.v1+json",
  "Content-Type": "application/vnd.allegro.public.v1+json",
};
