import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  deleteDoc,
  getDocs,
  where,
  collection,
  getFirestore,
  query,
  getDoc,
} from "firebase/firestore";
import { getFavourites } from "../store/favouritesSlice";

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
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
};

export const logout = () => {
  auth.signOut();
};

export const getNameOfUser = async (user) => {
  if (user) {
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const name = doc.data().name;
      console.log("Name from getNameOfuser: ", name);
      return name;
    });
  }
  return null;
};

export const addFavouriteToFirebase = async (uid, name) => {
  try {
    await addDoc(collection(db, `users/${uid}/favourites`), { name });
    console.log("Favourite added to Firebase database");
  } catch (error) {
    console.log("Error adding favourite to Firebase database: ", error);
  }
};

export const removeFavouriteFromFirebase = async (uid, name) => {
  console.log("Name: ", name);

  try {
    if (!name) {
      console.error(
        "Error removing favourite from Firebase database: Name parameter is undefined"
      );
      return;
    }

    const q = query(
      collection(db, `users/${uid}/favourites`),
      where("name", "==", name)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log("Favourite removed from Firebase database");
    });
  } catch (error) {
    console.log("Error removing favourite from Firebase database: ", error);
  }
};

export const clearFavouritesFromFirebase = async (uid) => {
  try {
    const q = query(collection(db, `users/${uid}/favourites`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
      console.log("Favourites removed from Firebase database");
    });
  } catch (error) {
    console.log("Error removing favourites from Firebase database: ", error);
  }
};

export const getFavouritesFromSource = () => async (dispatch) => {
  const user = auth.currentUser;

  if (user) {
    const q = await getDocs(collection(db, `users/${user.uid}/favourites`));
    const favourites = q.docs.map((doc) => doc.data().name);
    dispatch(getFavourites(favourites));
  }
};

export { auth, db, registerWithEmailAndPassword };
