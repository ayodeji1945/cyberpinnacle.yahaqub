import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Restrict a user
export async function restrictUser(uid) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { status: "restricted" });
}

// Activate a user
export async function activateUser(uid) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { status: "active" });
}

// Delete user record
export async function deleteUserRecord(uid) {
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
}
