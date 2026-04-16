import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCrUFDT2K-BoNpRNMTDbRmOVv53oRtrGGM",
  authDomain: "portal-4900a.firebaseapp.com",
  projectId: "portal-4900a",
  storageBucket: "portal-4900a.firebasestorage.app",
  messagingSenderId: "490417015450",
  appId: "1:490417015450:web:7f108114696ffffdb62d23",
  measurementId: "G-CDPLG7Y9L0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics — only enable in browser (not SSR)
isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});

export default app;
