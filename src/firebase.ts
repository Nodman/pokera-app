// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGhW4UyexupiQs__fAoe1dBbcAVVp2vSs",
  authDomain: "poker-app-74315.firebaseapp.com",
  databaseURL:
    "https://poker-app-74315-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "poker-app-74315",
  storageBucket: "poker-app-74315.appspot.com",
  messagingSenderId: "298551651727",
  appId: "1:298551651727:web:1e7e9499744f1da401effa",
};

// Initialize Firebase
export const init = () => initializeApp(firebaseConfig);
