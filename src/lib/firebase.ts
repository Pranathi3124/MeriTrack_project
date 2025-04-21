import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, updatePassword, User } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, addDoc, deleteDoc, Timestamp, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgIqRBzVraKgX-J7R1z3x3G5QfbUeTdaw",
  authDomain: "studentachievement-cc943.firebaseapp.com",
  projectId: "studentachievement-cc943",
  storageBucket: "studentachievement-cc943.firebasestorage.app",
  messagingSenderId: "542510757562",
  appId: "1:542510757562:web:88f5e3bb332f9c07877483"
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
  if (role === "student") {
    // Student email format: 24075a0501@vnrvjiet.in or 24076b0560@vnrvjiet.in
    // Four digits, followed by a letter, followed by four digits, followed by @vnrvjiet.in
    return /^\d{4}[a-zA-Z]\d{4}@vnrvjiet\.in$/.test(email);
  } else if (role === "faculty") {
    // Faculty email format: facultyname@vnrvjiet.in (e.g., varshini@vnrvjiet.in)
    return /^[a-zA-Z]+@vnrvjiet\.in$/.test(email);
  } else if (role === "admin") {
    // Admin email format: admin@vnrvjiet.in
    return /^admin@vnrvjiet\.in$/.test(email);
  }
  return false;
};

// User authentication
export const signUp = async (email: string, password: string, role: UserRole, userData: any) => {
  try {
    if (!validateEmail(email, role)) {
      throw new Error(`Invalid email format for ${role} role`);
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      email,
      role,
      createdAt: serverTimestamp(),
    });
    
    // Update display name
    await updateProfile(user, {
      displayName: userData.name,
    });
    
    return user;
  } catch (error) {
    console.error("Error signing up:", error);
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
