// ─────────────────────────────────────────────────────────────
// Nodemailer serviciosr helper with Hostinger & local fallbacks.
// ─────────────────────────────────────────────────────────────
import nodemailer from 'nodemailer';
import { SMTP } from '../config';

export async function createMailServiciosr() {
  const { HOST: host, USER: user, PASS: pass, PORT: port } = SMTP;

  console.log(
    `[SMTP CONFIG CHECK] Host: ${host}, User: ${user}, Pass: ${
      pass ? 'SET (' + pass.length + ' chars)' : 'NOT SET'
    }, Port: ${port}`
  );

  if (pass && pass.trim().length > 0) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass: pass.trim() },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  // Fallback: fast JSON transport for local/test environment when SMTP_PASS is empty
  return nodemailer.createTransport({
    jsonTransport: true,
  });
}
