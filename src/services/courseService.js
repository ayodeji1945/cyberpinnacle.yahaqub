import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function createUserRecord(uid, email) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      email,
      role: "user",
      status: "active",
      score: 0,
      createdAt: new Date().toISOString(),
    });
  }
}
