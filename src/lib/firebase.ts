
// Import the necessary firebase modules
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
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
  deleteDoc
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

// Replace with your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN2YeQkGmNiEZYoNlbPf-mZWQZVvU_T-M",
  authDomain: "vnrvjiet-meritrack.firebaseapp.com",
  projectId: "vnrvjiet-meritrack",
  storageBucket: "vnrvjiet-meritrack.appspot.com",
  messagingSenderId: "472464221994",
  appId: "1:472464221994:web:44e0be2bd965195bf8ee02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

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

export const signUp = async (email: string, password: string, userData: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      email: email
    });

    // Update display name
    await updateProfile(user, {
      displayName: userData.name
    });

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

// User functions
export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return {
        id: userId,
        ...userDoc.data()
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

// File upload function
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
