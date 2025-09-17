const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/send-email", async (req, res) => {
  try {
    const { to, subject, fileName, pdfBase64 } = req.body;

    if (!to || !subject || !fileName || !pdfBase64) {
      return res.status(400).json({ error: "Campos incompletos" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER, // tu correo Gmail
        pass: process.env.MAIL_PASS, // clave de aplicación (no tu contraseña normal)
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      text: "Adjunto el PDF generado desde la inspección de calidad.",
      attachments: [
        {
          filename: fileName,
          content: pdfBase64.split("base64,")[1],
          encoding: "base64",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return res.status(500).json({ error: "No se pudo enviar el correo" });
  }
});

module.exports = router;
