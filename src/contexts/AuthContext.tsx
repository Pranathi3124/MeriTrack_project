
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db, getUserProfile } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";

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
    let unsubscribeSnapshot: (() => void) | undefined;
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      // Clean up any existing Firestore subscription before setting up a new one or clearing user data
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = undefined;
      }
      
      if (!user) {
        // When logging out, clear user data without trying to fetch from Firestore
        setUserData(null);
        setLoading(false);
        return;
      }

      // Set up Firestore subscription only if we have a user
      unsubscribeSnapshot = onSnapshot(
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
            toast({
              title: "Error loading profile data",
              variant: "destructive",
            });
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching user data:", error);
          setError(error);
          toast({
            title: "Error loading profile data",
            variant: "destructive",
          });
          setLoading(false);
        }
      );
    });

    // Clean up both subscriptions when the component unmounts
    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
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
