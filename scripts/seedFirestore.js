/**
 * Script de Inicialización de Cloud Firestore (Seed Script)
 * Inserta automáticamente los 5 documentos de prueba en la colección 'vehiculos'.
 * 
 * Uso:
 * 1. Asegúrate de haber colocado tus credenciales en firebaseConfig.js
 * 2. Ejecuta: node scripts/seedFirestore.js (o npm run seed)
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar credenciales desde .env
try {
  process.loadEnvFile(resolve(__dirname, "../.env"));
} catch (err) {
  console.error("❌ No se encontró el archivo .env. Copia .env.example como .env y llénalo.");
  process.exit(1);
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("❌ Faltan EXPO_PUBLIC_FIREBASE_API_KEY o EXPO_PUBLIC_FIREBASE_PROJECT_ID en .env.");
  process.exit(1);
}

async function seed() {
  console.log("🚀 Iniciando carga de documentos en Cloud Firestore...");
  
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const jsonPath = resolve(__dirname, "../data/seedVehiculos.json");
    const rawData = readFileSync(jsonPath, "utf-8");
    const vehiculos = JSON.parse(rawData);

    console.log(`📦 Encontrados ${vehiculos.length} vehículos para registrar.`);

    for (const item of vehiculos) {
      const { id, ...data } = item;
      const docRef = doc(db, "vehiculos", id);
      await setDoc(docRef, data);
      console.log(`  ✅ Insertado: [${id}] - ${data.marca} ${data.nombre} ($${data.precio})`);
    }

    console.log("\n🎉 ¡Inicialización completada con éxito en la colección 'vehiculos'!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al conectar o insertar en Firestore:", error.message);
    process.exit(1);
  }
}

seed();
