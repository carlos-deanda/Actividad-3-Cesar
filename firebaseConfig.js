// firebaseConfig.js
// Configuración de conexión con Firebase Cloud Firestore
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

// ============================================================================
// CREDENCIALES DE FIREBASE: se leen del archivo .env (no se sube a Git ni al ZIP)
// Copia .env.example como .env y llena los valores de tu Consola de Firebase.
// ============================================================================
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inicialización de la aplicación Firebase evitando duplicidad de instancias
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Instancia de la base de datos Cloud Firestore
const db = getFirestore(app);

// Exportación de la base de datos, app y funciones de Firestore requeridas
export { app, db, doc, getDoc, collection, getDocs };
export default db;
