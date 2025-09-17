// pages/api/send-email.js
import nodemailer from "nodemailer";

export const config = {
  api: { bodyParser: { sizeLimit: "50mb" } }
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Método no permitido" });
  }

  const {
    to,
    subject,
    pdfBase64,
    pdfFileName,
    senderName,   // ← nombre del usuario logueado (displayName o derivado)
    senderEmail,  // ← email del usuario logueado
  } = req.body;

  if (!to || !subject || !pdfBase64) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  // Derivar un nombre amigable si no viene
  const fallbackName = (senderEmail || "")
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .trim();

  const displayName = (senderName || fallbackName || "Usuario").trim();

  // Validar email del usuario para replyTo
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");
  const replyTo = isEmail(senderEmail) ? senderEmail : undefined;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER, // buzón de servicio
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      // Mostramos el NOMBRE del usuario, pero el address es el buzón de servicio
      from: { name: displayName, address: process.env.MAIL_USER },
      to,
      subject,
      text: "Adjunto tienes tu reporte en PDF.",
      replyTo, // ← respuestas irán al usuario logueado
      // Opcional: sobre-especificar el envelope SMTP (no cambia el From visible)
      envelope: { from: process.env.MAIL_USER, to },

      attachments: [
        {
          filename: pdfFileName?.endsWith(".pdf")
            ? pdfFileName
            : `${pdfFileName || "reporte"}.pdf`,
          content: pdfBase64.split("base64,").pop(),
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    });

    return res.status(200).json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return res.status(500).json({ message: "Error al enviar correo", error: error.message });
  }
}

