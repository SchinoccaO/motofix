// ─── MAILER — Resend (HTTP API, funciona en Render free tier) ────────────────
// Render bloquea SMTP saliente (puertos 25/465/587). Resend usa HTTPS.
//
// Requiere en .env / Render Environment:
//   RESEND_API_KEY  → re_xxxxxxxxx (desde resend.com → API Keys)
//
// El "from" usa el dominio por defecto de Resend (onboarding@resend.dev)
// hasta que verifiques tu dominio en resend.com/domains.

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = process.env.RESEND_FROM || 'MotoFIX <onboarding@resend.dev>';

/**
 * Envía un correo vía Resend (HTTPS).
 * @param {{ to: string, subject: string, html: string, from?: string }} options
 */
export async function sendMail({ to, subject, html, from }) {
    const { data, error } = await resend.emails.send({
        from: from || FROM_ADDRESS,
        to,
        subject,
        html,
    });

    if (error) {
        throw new Error(`Resend error: ${error.message}`);
    }

    return data;
}

export default resend;
