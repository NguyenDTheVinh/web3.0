// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJc0GVCRWsF2KQjTTlSHUNvfXS7ZPgg0I",
  authDomain: "smartgreen-e57d2.firebaseapp.com",
  databaseURL: "https://smartgreen-e57d2-default-rtdb.firebaseio.com",
  projectId: "smartgreen-e57d2",
  storageBucket: "smartgreen-e57d2.appspot.com",
  messagingSenderId: "665419500037",
  appId: "1:665419500037:web:c7e8c1e2911f5f90baea6c",
  measurementId: "G-Y322CQES9E"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getDatabase(app);