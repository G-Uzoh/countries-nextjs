import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "countries-86378.firebaseapp.com",
  projectId: "countries-86378",
  storageBucket: "countries-86378.appspot.com",
  messagingSenderId: "780112959703",
  appId: "1:780112959703:web:9719782dc5438dbeb73892",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Gives access to the project authentication
const auth = getAuth(app);

// Gives access to the project database
const db = getFirestore(app);

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
    console.log(user);
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
};

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log(`${result.user} logged in`);
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
};

export { auth, db, registerWithEmailAndPassword };
