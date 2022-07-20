import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  listAll,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-storage.js";

import {
  getDatabase,
  set,
  onValue,
  ref as refdb,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHgHUl0jJUKlFvSzRyxPN2smXq2Udsr38",
  authDomain: "uploadimage-84556.firebaseapp.com",
  projectId: "uploadimage-84556",
  storageBucket: "uploadimage-84556.appspot.com",
  messagingSenderId: "410578577199",
  appId: "1:410578577199:web:75610d8d52a2e5f0e063da",
  measurementId: "G-PYPM0RBS4C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

export {
  storage,
  database,
  set,
  ref,
  refdb,
  uploadBytes,
  uploadBytesResumable,
  listAll,
  getDownloadURL,
  onValue,
  update,
  remove,
};
