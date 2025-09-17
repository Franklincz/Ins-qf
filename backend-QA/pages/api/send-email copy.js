// pages/api/send-email.js

import nodemailer from "nodemailer";

// Aumenta el límite para no truncar tu base64
export const config = {
  api: {
    bodyParser: { sizeLimit: "50mb" }
  }
};

export default async function handler(req, res) {
  // — CORS básico para que tu Vite-front pueda llamar sin errores
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

  const { to, subject, pdfBase64, pdfFileName } = req.body;
  if (!to || !subject || !pdfBase64) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  console.log("📦 Tamaño base64 recibido:", pdfBase64.length, "caracteres");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text: "Adjunto tienes tu reporte en PDF.",
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
    return res
      .status(500)
      .json({ message: "Error al enviar correo", error: error.message });
  }
}
