
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db, getUserProfile } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin";
  branch?: string;
  year?: string;
  rollNo?: string;
  mobileNo?: string;
  photoURL?: string;
};

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (!user) {
        setUserData(null);
        return;
      }

      // Subscribe to user data in Firestore
      const unsubscribeSnapshot = onSnapshot(
        doc(db, "users", user.uid),
        (doc) => {
          if (doc.exists()) {
            setUserData({
              id: user.uid,
              ...doc.data() as Omit<UserData, 'id'>
            });
          } else {
            setUserData(null);
            setError(new Error("User data not found"));
            toast.error("User profile data not found.");
          }
        },
        (error) => {
          console.error("Error fetching user data:", error);
          setError(error);
          toast.error("Error loading profile data");
        }
      );

      return () => {
        unsubscribeSnapshot();
      };
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
