"use client";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function FirestoreTest() {
  const loadUsers = async () => {
    const snap = await getDocs(collection(db!, "users"));
    snap.forEach((doc) => console.log(doc.id, doc.data()));
  };

  return <button onClick={loadUsers}>Load Firestore Data</button>;
}
