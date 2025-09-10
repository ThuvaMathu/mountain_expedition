"use client";

import { useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

// ✅ Firebase config directly from env
const firebaseConfig = {
  apiKey: "AIzaSyBPomD68Z_W_RtLeK14HXfwdlb4LplIMyo",
  authDomain: "careful-drummer-471609-n2.firebaseapp.com",
  projectId: "careful-drummer-471609-n2",
  storageBucket: "careful-drummer-471609-n2.firebasestorage.app",
  messagingSenderId: "467568596282",
  appId: "1:467568596282:web:c71538dd2f1a138bd9ec03",
  measurementId: "G-RFF9KZ874T",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app, "tamil-adventure");

type User = {
  id?: string;
  name: string;
  age: number;
};

export default function FirestoreCrudPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(0);

  // 🔹 Read users
  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data: User[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as User),
    }));
    setUsers(data);
  };

  // 🔹 Create user
  const createUser = async () => {
    if (!name || !age) return;
    await addDoc(collection(db, "users"), { name, age });
    setName("");
    setAge(0);
    fetchUsers();
  };

  // 🔹 Update first user (example)
  const updateUser = async (id: string) => {
    const ref = doc(db, "users", id);
    await updateDoc(ref, { name: name || "Updated User", age: age || 99 });
    fetchUsers();
  };

  // 🔹 Delete user
  const deleteUser = async (id: string) => {
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  useEffect(() => {
    const testFetch = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        snapshot.forEach((doc) => console.log(doc.id, doc.data()));
        console.log("Fetch successful ✅");
      } catch (err) {
        console.error("Fetch failed ❌", err);
      }
    };
    testFetch();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🔥 Firestore CRUD Test</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={createUser}>Add User</button>
      </div>

      <button onClick={fetchUsers} style={{ marginBottom: "1rem" }}>
        Refresh Users
      </button>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.age} years)
            <button
              onClick={() => updateUser(user.id!)}
              style={{ marginLeft: "0.5rem" }}
            >
              Update
            </button>
            <button
              onClick={() => deleteUser(user.id!)}
              style={{ marginLeft: "0.5rem", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
