import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkZTUP3LHEKThxspOmqcbQ1keHuMEFszM",
  authDomain: "live-wall-app.firebaseapp.com",
  projectId: "live-wall-app",
  storageBucket: "live-wall-app.firebasestorage.app",
  messagingSenderId: "1091951911069",
  appId: "1:1091951911069:web:ab1c8fcdcb3b58218a7474"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services so we can use them in our components
export const db = getFirestore(app);
export const storage = getStorage(app);