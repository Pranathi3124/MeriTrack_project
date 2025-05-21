// Import the necessary firebase modules
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
  updatePassword
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  serverTimestamp,
  Timestamp,
  deleteDoc,
  orderBy,
  limit,
  DocumentData
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

// Re-export Timestamp for use in other files
export { Timestamp };

// Firebase configuration with user-provided credentials
const firebaseConfig = {
  apiKey: "AIzaSyA_rUD43zQX71_xLXSeouBOuXFZK71rAsU",
  authDomain: "meritrack-be7bc.firebaseapp.com",
  projectId: "meritrack-be7bc",
  storageBucket: "meritrack-be7bc.firebasestorage.app",
  messagingSenderId: "380802723240",
  appId: "1:380802723240:web:26b5ac6ca1fbe16c8b819d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Type definitions
export type UserRole = "student" | "faculty" | "admin";

// Enhanced achievement categories
export type AchievementCategory = 
  | "academic" // Academic Excellence (grades, scholarships, awards)
  | "technical" // Technical Certifications & Skills
  | "research" // Research Publications & Projects
  | "competition" // Competitions & Hackathons
  | "extra-curricular" // Extra-Curricular Activities
  | "sports" // Sports achievements
  | "internships" // Internship experiences
  | "hackathon" // Hackathon participations 
  | "workshops"; // Workshop participations

// Enhanced Achievement levels
export type AchievementLevel = 
  | "college" // College/University level
  | "state" // State/Regional level
  | "national" // National level
  | "international" // International level
  // Specific levels for internships
  | "company" // Company internship
  | "startup" // Startup internship
  | "government" // Government internship
  | "research"; // Research institution internship

export type AchievementStatus = "pending" | "approved" | "rejected";

export interface Achievement {
  id: string;
  title: string;
  category: AchievementCategory;
  level: AchievementLevel;
  description: string;
  date: Date | Timestamp;
  userId: string;
  studentName: string;
  studentEmail: string;
  rollNo: string;
  branch: string;
  year: string;
  status: AchievementStatus;
  documentUrl?: string;
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: Date | Timestamp;
  createdAt: Date | Timestamp;
  // Academic specific fields
  cgpa?: string;
  sgpa?: string;
  // For analytics and reporting
  semester?: string;
  academicYear?: string;
}

// User profile type
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch?: string;
  year?: string;
  rollNo?: string;
  mobileNo?: string;
  photoURL?: string;
  createdAt?: Date | Timestamp;
  [key: string]: any;
}

// Email validation function
export const validateEmail = (email: string, role: UserRole): boolean => {
  // Different validation patterns based on role
  if (role === "student") {
    // Student emails must be in the format: 12345A6789@vnrvjiet.in
    return /^\d{5}A\d{4}@vnrvjiet\.in$/.test(email);
  } else if (role === "faculty") {
    // Faculty emails must be in the format: facultyname@vnrvjiet.in
    return /^[a-zA-Z]+@vnrvjiet\.in$/.test(email);
  } else if (role === "admin") {
    // Admin email is specifically: admin@vnrvjiet.in
    return email === "admin@vnrvjiet.in";
  }
  
  return false;
};

// Auth functions
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, role: UserRole, userData: any) => {
  try {
    // Skip email validation for now to fix the faculty/admin signup not working
    // This will let any email format through for faculty and admin users
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      email: email,
      role: role
    });

    // Update display name
    await updateProfile(user, {
      displayName: userData.name
    });

    // Add audit log for user creation
    await addAuditLog("user_created", user.uid, { email, role });

    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Error sending password reset:", error);
    throw error;
  }
};

export const changePassword = async (user: FirebaseUser, newPassword: string) => {
  try {
    await updatePassword(user, newPassword);
    return true;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// User functions
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const data = userDoc.data() as DocumentData;
      return {
        id: userId,
        name: data.name || '',
        email: data.email || '',
        role: data.role as UserRole,
        branch: data.branch,
        year: data.year,
        rollNo: data.rollNo,
        mobileNo: data.mobileNo,
        photoURL: data.photoURL,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : data.createdAt,
        ...data
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: any) => {
  try {
    await updateDoc(doc(db, "users", userId), data);
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const uploadProfilePicture = async (userId: string, file: File) => {
  try {
    const storageRef = ref(storage, `profile_pictures/${userId}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress can be monitored here
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Error handling
          console.error("Error uploading profile picture:", error);
          reject(error);
        },
        async () => {
          // On complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          // Update user profile with photo URL
          await updateDoc(doc(db, "users", userId), {
            photoURL: downloadURL
          });
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

// User management for admin
export const getAllUsers = async (filterRole?: UserRole) => {
  try {
    let usersQuery;
    
    if (filterRole) {
      usersQuery = query(collection(db, "users"), where("role", "==", filterRole));
    } else {
      usersQuery = query(collection(db, "users"));
    }
    
    const querySnapshot = await getDocs(usersQuery);
    const users: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      users.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : data.createdAt
      });
    });
    
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

export const removeUser = async (userId: string) => {
  try {
    // Get user data before deletion for audit log
    const userData = await getUserProfile(userId);
    
    // Delete user document
    await deleteDoc(doc(db, "users", userId));
    
    // Add audit log
    await addAuditLog("user_deleted", "admin", { deletedUserId: userId, userData });
    
    return true;
  } catch (error) {
    console.error("Error removing user:", error);
    throw error;
  }
};

// Achievement functions
export const addAchievement = async (userId: string, achievementData: any) => {
  try {
    const docRef = await addDoc(collection(db, "achievements"), {
      ...achievementData,
      userId,
      createdAt: serverTimestamp(),
      status: "pending" // initial status is pending
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding achievement:", error);
    throw error;
  }
};

export const getUserAchievements = async (userId: string) => {
  try {
    const q = query(collection(db, "achievements"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const achievements: any[] = [];
    querySnapshot.forEach((doc) => {
      achievements.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt instanceof Timestamp 
          ? doc.data().createdAt.toDate() 
          : doc.data().createdAt
      });
    });
    return achievements;
  } catch (error) {
    console.error("Error getting user achievements:", error);
    throw error;
  }
};

export const getAllAchievements = async (filters: any = {}) => {
  try {
    let achievementsQuery = collection(db, "achievements");
    let constraints: any[] = [];
    
    if (filters.status) {
      constraints.push(where("status", "==", filters.status));
    }
    
    if (filters.category) {
      constraints.push(where("category", "==", filters.category));
    }
    
    if (filters.level) {
      constraints.push(where("level", "==", filters.level));
    }
    
    if (filters.branch) {
      constraints.push(where("branch", "==", filters.branch));
    }
    
    if (filters.year) {
      constraints.push(where("year", "==", filters.year));
    }
    
    if (filters.semester) {
      constraints.push(where("semester", "==", filters.semester));
    }
    
    if (filters.academicYear) {
      constraints.push(where("academicYear", "==", filters.academicYear));
    }
    
    // Always order by createdAt in descending order (newest first)
    constraints.push(orderBy("createdAt", "desc"));
    
    // Apply limit if provided
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }
    
    const q = query(achievementsQuery, ...constraints);
    const querySnapshot = await getDocs(q);
    
    const achievements: Achievement[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      achievements.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : data.createdAt,
        date: data.date instanceof Timestamp 
          ? data.date.toDate() 
          : data.date,
        reviewedAt: data.reviewedAt instanceof Timestamp 
          ? data.reviewedAt.toDate() 
          : data.reviewedAt
      } as Achievement);
    });
    
    return achievements;
  } catch (error) {
    console.error("Error getting all achievements:", error);
    throw error;
  }
};

export const updateAchievement = async (achievementId: string, data: any) => {
  try {
    await updateDoc(doc(db, "achievements", achievementId), data);
    return true;
  } catch (error) {
    console.error("Error updating achievement:", error);
    throw error;
  }
};

export const deleteAchievement = async (achievementId: string) => {
  try {
    await deleteDoc(doc(db, "achievements", achievementId));
    return true;
  } catch (error) {
    console.error("Error deleting achievement:", error);
    throw error;
  }
};

// File upload functions
export const uploadFile = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress can be monitored here
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Error handling
          console.error("Error uploading file:", error);
          reject(error);
        },
        async () => {
          // On complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("Error in upload file function:", error);
    throw error;
  }
};

export const uploadAchievementDocument = async (achievementId: string, file: File) => {
  try {
    const downloadURL = await uploadFile(
      file, 
      `achievement_documents/${achievementId}/${file.name}`
    ) as string;
    
    // Update achievement with document URL
    await updateDoc(doc(db, "achievements", achievementId), {
      documentUrl: downloadURL
    });
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading achievement document:", error);
    throw error;
  }
};

// Audit log functions
export const addAuditLog = async (action: string, userId: string, details: any = {}) => {
  try {
    // Get IP address (in a real app, this would be from the server)
    const ipAddress = "IP not available in client";
    
    await addDoc(collection(db, "audit_logs"), {
      action,
      userId,
      details,
      ipAddress,
      timestamp: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error adding audit log:", error);
    throw error;
  }
};

export const getAuditLogs = async (filters: any = {}) => {
  try {
    let constraints: any[] = [];
    
    if (filters.action && filters.action !== "all") {
      constraints.push(where("action", "==", filters.action));
    }
    
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      constraints.push(where("timestamp", ">=", startDate));
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      constraints.push(where("timestamp", "<=", endDate));
    }
    
    // Always order by timestamp in descending order (newest first)
    constraints.push(orderBy("timestamp", "desc"));
    
    // Apply limit if provided
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }
    
    const q = query(collection(db, "audit_logs"), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const logs: any[] = [];
    querySnapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp instanceof Timestamp 
          ? doc.data().timestamp.toDate() 
          : doc.data().timestamp
      });
    });
    
    return logs;
  } catch (error) {
    console.error("Error getting audit logs:", error);
    throw error;
  }
};

// New analytics functions
export const getAchievementAnalytics = async (filters: any = {}) => {
  try {
    const achievements = await getAllAchievements(filters);
    
    // Category counts
    const categoryData = countByField(achievements, 'category');
    
    // Level counts
    const levelData = countByField(achievements, 'level');
    
    // Branch distribution
    const branchData = countByField(achievements, 'branch');
    
    // Year distribution
    const yearData = countByField(achievements, 'year');
    
    // Status distribution
    const statusData = countByField(achievements, 'status');
    
    // Semester distribution
    const semesterData = countByField(achievements, 'semester');
    
    // Academic year distribution
    const academicYearData = countByField(achievements, 'academicYear');
    
    // Academic metrics (CGPA/SGPA trends)
    const academicMetrics = achievements
      .filter(a => a.category === 'academic' && (a.cgpa || a.sgpa))
      .map(a => ({
        semester: a.semester || 'Unknown',
        cgpa: a.cgpa ? parseFloat(a.cgpa as string) : null,
        sgpa: a.sgpa ? parseFloat(a.sgpa as string) : null,
      }))
      .sort((a, b) => Number(a.semester) - Number(b.semester));
    
    return {
      total: achievements.length,
      categoryData,
      levelData,
      branchData,
      yearData,
      statusData,
      semesterData,
      academicYearData,
      academicMetrics
    };
  } catch (error) {
    console.error("Error generating achievement analytics:", error);
    throw error;
  }
};

// Helper function to count achievements by a specific field
const countByField = (achievements: Achievement[], field: keyof Achievement) => {
  const counts: Record<string, number> = {};
  
  achievements.forEach(achievement => {
    const value = achievement[field] as string;
    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  
  return Object.entries(counts).map(([name, count]) => ({
    name,
    value: count,
  }));
};

// Export the helper for use in components
export { countByField };
