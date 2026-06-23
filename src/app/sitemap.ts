import type { MetadataRoute } from "next";

const BASE = process.env.SITE_URL || "https://myvisa.aydex.nl";

// Only public, indexable pages (auth-gated /admin, /dashboard, /login excluded).
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/apply", "/contact", "/terms", "/privacy"];
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
