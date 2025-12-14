"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";

interface AuthUser extends User {
  isAdmin?: boolean;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Mock user for development
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check if user is admin
          const userDoc = await getDoc(doc(db!, "users", firebaseUser.uid));
          const userData = userDoc.data();

          setUser({
            ...firebaseUser,
            // isAdmin: userData?.isAdmin || false,
            ...userData,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(firebaseUser as AuthUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      // Mock login for development
      setUser(null);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = getFirebaseErrorMessage(error);
      throw new Error(errorMessage);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    if (!isFirebaseConfigured || !auth || !db) {
      // Mock registration for development
      setUser(null);
      return;
    }

    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user document in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name,
        email,
        isAdmin: false,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = getFirebaseErrorMessage(error);
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !db) {
      // Mock Google login for development
      setUser(null);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const { user: firebaseUser } = await signInWithPopup(auth, provider);

      // Check if user document exists, create if not
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", firebaseUser.uid), {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          isAdmin: false,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = getFirebaseErrorMessage(error);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) {
      // Mock logout for development
      setUser(null);
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
