// pages/api/proxy-upload-drive.js
import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { pdfBase64, pdfFileName, folderId } = req.body;

    if (!pdfBase64 || !pdfFileName) {
      return res.status(400).json({ error: "Faltan datos del PDF" });
    }

    // 1. Autenticación con cuenta de servicio
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/drive.file"]
    );

    const drive = google.drive({ version: "v3", auth });

    // 2. Convertir base64 a Buffer
    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    // 3. Metadatos del archivo
    const fileMetadata = {
      name: pdfFileName,
      mimeType: "application/pdf",
      parents: folderId ? [folderId] : undefined,
    };

    // 4. Subida a Google Drive
    const file = await drive.files.create({
      resource: fileMetadata,
      media: {
        mimeType: "application/pdf",
        body: BufferToStream(pdfBuffer), // Convertimos a stream
      },
      fields: "id",
    });

    res.status(200).json({ fileId: file.data.id });
  } catch (error) {
    console.error("Error subiendo a Drive:", error);
    res.status(500).json({ error: error.message });
  }
}

// Función auxiliar para convertir Buffer en stream
import { Readable } from "stream";
function BufferToStream(binary) {
  const readable = new Readable();
  readable.push(binary);
  readable.push(null);
  return readable;
}
