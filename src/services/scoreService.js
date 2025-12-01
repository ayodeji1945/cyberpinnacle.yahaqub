// src/services/scoreService.js
import { doc, setDoc, updateDoc, getDoc, increment } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Create user record if not exists
export async function createUserRecord(uid, email) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email: email || null,
      score: 0,
      badges: [],
      completed: [],
      role: "user",        // default role
      status: "active",    // can be 'active' or 'restricted'
      createdAt: new Date()
    });
  }
}

// Add score
export async function addScore(uid, points) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    score: increment(points),
  });
}

// Get score
export async function getScore(uid) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data().score : 0;
}
