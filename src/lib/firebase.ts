import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, updatePassword, User } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, addDoc, deleteDoc, Timestamp, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByP1CGXCpQSPvQSYSgAE50n8qacAoPz9Y",
  authDomain: "achivements-9a327.firebaseapp.com",
  projectId: "achivements-9a327",
  storageBucket: "achivements-9a327.firebasestorage.app",
  messagingSenderId: "1094047518758",
  appId: "1:1094047518758:web:06a72948e627ebae0c96e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// User roles
export type UserRole = "student" | "faculty" | "admin";

// Validate email format based on role
export const validateEmail = (email: string, role: UserRole): boolean => {
  console.log(`Validating ${role} email: ${email}`);
  
  if (role === "student") {
    // Updated pattern: exactly 10 characters with 6th character as 'A', all others are digits, followed by @vnrvjiet.in
    const studentPattern = /^\d{5}A\d{4}@vnrvjiet\.in$/;
    const isValid = studentPattern.test(email);
    console.log(`Student email validation result: ${isValid} with pattern ${studentPattern}`);
    return isValid;
  } else if (role === "faculty") {
    // Faculty email format: facultyname@vnrvjiet.in (e.g., varshini@vnrvjiet.in)
    const facultyPattern = /^[a-zA-Z]+@vnrvjiet\.in$/;
    const isValid = facultyPattern.test(email);
    console.log(`Faculty email validation result: ${isValid} with pattern ${facultyPattern}`);
    return isValid;
  } else if (role === "admin") {
    // Admin email format: admin@vnrvjiet.in
    const adminPattern = /^admin@vnrvjiet\.in$/;
    const isValid = adminPattern.test(email);
    console.log(`Admin email validation result: ${isValid} with pattern ${adminPattern}`);
    return isValid;
  }
  return false;
};

// User authentication
export const signUp = async (email: string, password: string, role: UserRole, userData: any) => {
  try {
    console.log(`Starting signup process for ${role} with email: ${email}`);
    
    // Validate email format again as a safeguard
    if (!validateEmail(email, role)) {
      console.error(`Invalid email format for ${role} role: ${email}`);
      throw new Error(`Invalid email format for ${role} role`);
    }
    
    console.log("Email format validated, creating user with Firebase Auth");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created in Firebase Auth:", user.uid);
    
    // Create user profile in Firestore
    console.log("Creating user profile in Firestore with data:", { ...userData, email, role });
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      email,
      role,
      createdAt: serverTimestamp(),
    });
    console.log("User profile created in Firestore");
    
    // Update display name
    console.log("Updating display name to:", userData.name);
    await updateProfile(user, {
      displayName: userData.name,
    });
    console.log("Display name updated");
    
    return user;
  } catch (error) {
    console.error("Error in signUp function:", error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// User profile management
export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    throw new Error("User not found");
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: any) => {
  try {
    await updateDoc(doc(db, "users", userId), data);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const uploadProfilePicture = async (userId: string, file: File) => {
  try {
    const storageRef = ref(storage, `profile_pictures/${userId}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    await updateDoc(doc(db, "users", userId), { photoURL: downloadURL });
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

export const changePassword = async (user: User, newPassword: string) => {
  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// Achievement categories
export type AchievementCategory = 
  | "academic" 
  | "sports" 
  | "internships" 
  | "hackathon" 
  | "workshops" 
  | "co-curricular";

// Define Achievement type for export
export type Achievement = {
  id: string;
  title: string;
  category: string;
  description: string;
  date: Date | any;
  documentURL?: string;
  documentName?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: any;
  studentName: string;
  studentEmail: string;
  rollNo: string;
  branch: string;
  year: string;
  userId: string;
};

// Achievement management
export const addAchievement = async (userId: string, achievementData: any) => {
  try {
    const achievementRef = await addDoc(collection(db, "achievements"), {
      ...achievementData,
      userId,
      createdAt: serverTimestamp(),
      status: "pending" // For faculty approval
    });
    return achievementRef.id;
  } catch (error) {
    console.error("Error adding achievement:", error);
    throw error;
  }
};

export const uploadAchievementDocument = async (achievementId: string, file: File) => {
  try {
    const storageRef = ref(storage, `achievements/${achievementId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    await updateDoc(doc(db, "achievements", achievementId), { 
      documentURL: downloadURL,
      documentName: file.name
    });
    return downloadURL;
  } catch (error) {
    console.error("Error uploading achievement document:", error);
    throw error;
  }
};

export const getUserAchievements = async (userId: string) => {
  try {
    const q = query(collection(db, "achievements"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user achievements:", error);
    throw error;
  }
};

// Faculty functions
export const getAllAchievements = async (filters: any = {}): Promise<Achievement[]> => {
  try {
    let q = query(collection(db, "achievements"));
    
    // Apply filters if provided
    if (filters.branch && filters.branch !== "all") {
      q = query(q, where("branch", "==", filters.branch));
    }
    if (filters.year && filters.year !== "all") {
      q = query(q, where("year", "==", filters.year));
    }
    if (filters.category && filters.category !== "all") {
      q = query(q, where("category", "==", filters.category));
    }
    if (filters.rollNo) {
      q = query(q, where("rollNo", "==", filters.rollNo));
    }
    if (filters.startDate && filters.endDate) {
      q = query(q, 
        where("date", ">=", filters.startDate),
        where("date", "<=", filters.endDate)
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Achievement[];
  } catch (error) {
    console.error("Error getting all achievements:", error);
    throw error;
  }
};

// Admin functions
export const getAllUsers = async (role: UserRole) => {
  try {
    const q = query(collection(db, "users"), where("role", "==", role));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

export const removeUser = async (userId: string) => {
  try {
    await deleteDoc(doc(db, "users", userId));
  } catch (error) {
    console.error("Error removing user:", error);
    throw error;
  }
};

// Audit logs
export const addAuditLog = async (action: string, userId: string, details: any) => {
  try {
    await addDoc(collection(db, "audit_logs"), {
      action,
      userId,
      details,
      timestamp: serverTimestamp(),
      ipAddress: window.location.hostname
    });
  } catch (error) {
    console.error("Error adding audit log:", error);
    throw error;
  }
};

export const getAuditLogs = async (filters: any = {}) => {
  try {
    let q = query(collection(db, "audit_logs"));
    
    // Apply filters
    if (filters.userId) {
      q = query(q, where("userId", "==", filters.userId));
    }
    if (filters.action) {
      q = query(q, where("action", "==", filters.action));
    }
    if (filters.startDate && filters.endDate) {
      q = query(q, 
        where("timestamp", ">=", filters.startDate),
        where("timestamp", "<=", filters.endDate)
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting audit logs:", error);
    throw error;
  }
};
