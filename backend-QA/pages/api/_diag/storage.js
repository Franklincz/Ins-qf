import { bucket, admin } from "../../../lib/firebaseAdmin";

export default async function handler(req, res) {
  try {
    const bucketName = admin.app().options.storageBucket || "(no-config)";
    let exists = false;
    try {
      const [e] = await bucket.exists();
      exists = e;
    } catch (e) {}

    res.status(200).json({ ok: true, bucketName, exists });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
