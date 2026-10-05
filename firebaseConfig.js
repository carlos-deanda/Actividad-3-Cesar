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
// CREDENCIALES DE FIREBASE (REEMPLAZAR CON LAS LLAVES DE TU CONSOLA DE FIREBASE)
// Consola: https://console.firebase.google.com/ -> Configuración del proyecto
// ============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyCIxLw9NM1t7Gm_s9gf7QlaHpkT3c3f5Cs",
  authDomain: "gestion-vehiculos-app.firebaseapp.com",
  projectId: "gestion-vehiculos-app",
  storageBucket: "gestion-vehiculos-app.firebasestorage.app",
  messagingSenderId: "436767479513",
  appId: "1:436767479513:web:6bf1d1699e18dea6c790c8",
  measurementId: "G-C32WVMY7PL"
};

// Inicialización de la aplicación Firebase evitando duplicidad de instancias
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Instancia de la base de datos Cloud Firestore
const db = getFirestore(app);

// Exportación de la base de datos, app y funciones de Firestore requeridas
export { app, db, doc, getDoc, collection, getDocs };
export default db;
