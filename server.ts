// ─────────────────────────────────────────────────────────────
// Your Flights LLC — Application Server Entry Point
// Modular, clean, and production-ready Express + Vite integration.
// ─────────────────────────────────────────────────────────────
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { PORT } from './server/config';
import { permissiveCorsMiddleware } from './server/middleware';
import { seoRouter } from './server/routes/seo';
import { checkoutRouter } from './server/routes/checkout';
import { agreementRouter } from './server/routes/agreement';
import { emailRouter } from './server/routes/email';
import { adminRouter } from './server/routes/admin';
import { contractingRouter } from './server/routes/contracting';
import { paymentsRouter } from './server/routes/payments';
import { webhookRouter } from './server/routes/webhooks';

async function startServer() {
  const app = express();

  app.use(express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString();
    }
  }));
  app.use(helmet({
    contentSecurityPolicy: false, // Don't break React app during dev
    crossOriginEmbedderPolicy: false
  }));
  app.use(permissiveCorsMiddleware);

  // Health check endpoints
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      crawlerAccess: 'allowed',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      crawlerAccess: 'allowed',
      timestamp: new Date().toISOString(),
    });
  });

  // Attach modular routes
  app.use(seoRouter);
  app.use(checkoutRouter);
  app.use(agreementRouter);
  app.use(adminRouter);
  app.use(emailRouter);
  app.use(contractingRouter);
  app.use(paymentsRouter);
  app.use(webhookRouter);

  // Vite development middleware or static production serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (
        url.startsWith('/api') ||
        url.startsWith('/health') ||
        url === '/robots.txt' ||
        url === '/sitemap.xml' ||
        url.startsWith('/.well-known')
      ) {
        return next();
      }
      try {
        let template = fs.readFileSync(
          path.resolve(process.cwd(), 'index.html'),
          'utf-8'
        );
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (
        req.originalUrl.startsWith('/api') ||
        req.originalUrl.startsWith('/health') ||
        req.originalUrl === '/robots.txt' ||
        req.originalUrl === '/sitemap.xml' ||
        req.originalUrl.startsWith('/.well-known')
      ) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
