// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyxuvGvhkc9Bl909NeHspTN4NK2EeouCA",
  authDomain: "inventory-management-b8c39.firebaseapp.com",
  projectId: "inventory-management-b8c39",
  storageBucket: "inventory-management-b8c39.appspot.com",
  messagingSenderId: "56707342484",
  appId: "1:56707342484:web:3d919c1dcc41481d651481",
  measurementId: "G-263LDXH6V9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}