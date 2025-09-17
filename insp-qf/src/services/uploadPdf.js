// src/services/uploadPdf.js
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // <-- tu src/firebase.js (exporta storage)

export function uploadPdfToStorage(fileOrBlob, { uid, reportCode }) {
  const user = (uid || "anon").replace(/[^\w-]/g, "");
  const code = (reportCode || `INS-${Date.now()}`).replace(/[^\w-]/g, "");
  const path = `reportes/${user}/${code}-${Date.now()}.pdf`;

  const storageRef = ref(storage, path);
  const metadata = { contentType: "application/pdf" };

  const task = uploadBytesResumable(storageRef, fileOrBlob, metadata);

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      // (snap) => { const pct = Math.round(100*snap.bytesTransferred/snap.totalBytes); ... (opcional) },
      null,
      reject,
      async () => {
        const url = await getDownloadURL(storageRef);
        resolve({ url, path });
      }
    );
  });
}
