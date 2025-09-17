// backend-email/lib/firebaseAdmin.js
import * as admin from "firebase-admin";

function loadCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8");
    return admin.credential.cert(JSON.parse(json));
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
  }
  return admin.credential.applicationDefault();
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: loadCredential(),
    projectId: process.env.FIREBASE_PROJECT_ID || "farmaciamagistral-c69dd",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "farmaciamagistral-c69dd.appspot.com",
  });
  const opts = admin.app().options;
  console.log("[admin] projectId:", opts.projectId);
  console.log("[admin] bucket:", opts.storageBucket);
}

export const db = admin.firestore();
export const bucket = admin.storage().bucket(); // ← usa el DEFAULT del app, que ya trae storageBucket
export { admin };



