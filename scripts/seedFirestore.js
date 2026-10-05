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

// Importar configuración
const configPath = resolve(__dirname, "../firebaseConfig.js");
let firebaseConfig;

try {
  const configFile = readFileSync(configPath, "utf-8");
  // Extraer valores o usar objeto de configuración
  const match = configFile.match(/const firebaseConfig = ({[\s\S]*?});/);
  if (match) {
    // Evaluar objeto simple de config
    firebaseConfig = Function(`"use strict"; return (${match[1]})`)();
  }
} catch (err) {
  console.error("❌ Error al leer firebaseConfig.js:", err.message);
  process.exit(1);
}

if (!firebaseConfig || firebaseConfig.apiKey === "TU_API_KEY_AQUI") {
  console.warn("⚠️ AVISO: Aún tienes los placeholders en 'firebaseConfig.js'.");
  console.warn("   Reemplaza apiKey y projectId con tus credenciales reales de Firebase.");
  console.warn("   Aun así, puedes revisar los datos en 'data/seedVehiculos.json'.\n");
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
