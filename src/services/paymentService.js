// src/services/paymentService.js
import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export async function unlockCourse(uid, courseId) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    unlockedCourses: arrayUnion(courseId),
  });

  return true;
}
