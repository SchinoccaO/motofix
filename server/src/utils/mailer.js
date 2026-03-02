// ─── MAILER — transporter singleton de Nodemailer ────────────────────────────
// Usar siempre `sendMail(options)` de este módulo en vez de crear un
// transporter inline. Así la config SMTP está en un solo lugar.
//
// Requiere en .env:
//   SMTP_HOST   (default: smtp.gmail.com)
//   SMTP_PORT   (default: 587)
//   SMTP_USER   → motofixoficial@gmail.com
//   SMTP_PASS   → App Password de Google (16 chars, sin espacios)
//                 Generarlo en: https://myaccount.google.com/apppasswords

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // STARTTLS en port 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Envía un correo. Wrappea transporter.sendMail con los defaults de MotoFIX.
 * @param {{ to: string, subject: string, html: string, from?: string }} options
 */
export async function sendMail({ to, subject, html, from }) {
    return transporter.sendMail({
        from: from || `"MotoFIX" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    });
}

export default transporter;
