// ─────────────────────────────────────────────────────────────
// SEO, Robots.txt, Sitemap.xml & Security.txt Route Handlers
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import path from 'path';
import fs from 'fs';

export const seoRouter = Router();

// Robots.txt endpoint for search engines and compliance crawlers
seoRouter.get('/robots.txt', (_req, res) => {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.setHeader('Content-Type', 'text/plain');
    return res.sendFile(robotsPath);
  }
  res.type('text/plain');
  res.send(
    "User-agent: *\nAllow: /\nCrawl-delay: 1\n\nUser-agent: Stripe-Bot\nAllow: /\nCrawl-delay: 1\n\nUser-agent: PayPal-Crawler\nAllow: /\nCrawl-delay: 1\n\nUser-agent: Googlebot\nAllow: /\nCrawl-delay: 1\n\nUser-agent: Bingbot\nAllow: /\nCrawl-delay: 1\n\nUser-agent: DuckDuckBot\nAllow: /\nCrawl-delay: 1\n\nSitemap: https://yourflightsllc.com/sitemap.xml\n"
  );
});

// RFC 9116 Security.txt endpoint
seoRouter.get('/.well-known/security.txt', (_req, res) => {
  res.type('text/plain');
  res.send(
    "Contact: mailto:support@yourflightsllc.com\nExpires: 2027-12-31T23:59:59.000Z\nPreferred-Languages: en\nCanonical: https://yourflightsllc.com/.well-known/security.txt\nPolicy: https://yourflightsllc.com/terms\n"
  );
});

// Sitemap.xml endpoint
seoRouter.get('/sitemap.xml', (_req, res) => {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.setHeader('Content-Type', 'application/xml');
    return res.sendFile(sitemapPath);
  }
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourflightsllc.com/</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/custom-strategies</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/destination-research</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/consulting-prep</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/guides</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/request-assistance</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/terms</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/privacy</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/refund-policy</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/compliance</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`);
});
