import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB18TgzinytdaVD8WCDk075Oo8zvjtKwAY",
  authDomain: "projetmaman-15542.firebaseapp.com",
  projectId: "projetmaman-15542",
  storageBucket: "projetmaman-15542.firebasestorage.app",
  messagingSenderId: "898336517917",
  appId: "1:898336517917:web:9384d03b5ed7a68253fbf4",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
