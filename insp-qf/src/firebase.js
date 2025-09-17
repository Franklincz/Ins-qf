// src/firebase.js

// Importa lo necesario
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";   // ✅ Agregado
import { getStorage } from "firebase/storage";       // ✅ Agregado

// Configuración de tu app Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA9EaiwxLgNrfJv-3p5QluvkKNOcnUecsA",
  authDomain: "farmaciamagistral-c69dd.firebaseapp.com",
  projectId: "farmaciamagistral-c69dd",
  storageBucket: "farmaciamagistral-c69dd.appspot.com", // corregido "app" por "appspot.com"
  messagingSenderId: "632851115719",
  appId: "1:632851115719:web:44402cc5922fc96e0c98e2",
  measurementId: "G-KD4D43737Z"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exportar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);     // Firestore Database
export const storage = getStorage(app);  // Firebase Storage
