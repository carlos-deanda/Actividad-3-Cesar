# 📱 Actividad 3: React Native + Cloud Firestore

Proyecto móvil desarrollado en **React Native** con **React Navigation (Stack Navigator)** y conexión modular a **Firebase Cloud Firestore**.

---

## 📋 Cumplimiento de Requerimientos de la Actividad

1. **Navegación Stack**: Estructurado con `@react-navigation/native-stack` (`HomeScreen` -> `DetailScreen`).
2. **Conexión Firestore (`firebaseConfig.js`)**: Preparado con el SDK modular (`initializeApp`, `getFirestore`, `doc`, `getDoc`, `collection`, `getDocs`) y placeholders claros para las credenciales.
3. **Colección y Documentos de Prueba**:
   - `data/seedVehiculos.json` con 5 vehículos completos (más de 4 campos cada uno: `nombre`, `marca`, `precio`, `descripcion`, `anio`, `combustible`, `color`, `imagenUrl`).
   - `scripts/seedFirestore.js` para sembrar la base de datos automáticamente con un solo comando.
4. **Pantalla 1 (`src/screens/HomeScreen.js`)**:
   - Consulta con `getDocs(collection(db, "vehiculos"))`.
   - Conversión obligatoria del QuerySnapshot:
     ```javascript
     const dataArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
     ```
   - Renderizado en `<FlatList>`.
   - Al pulsar un elemento, navega a `DetailScreen` pasando el `productId` / `id`.
5. **Pantalla 2 (`src/screens/DetailScreen.js`)**:
   - Recibe el `id` por parámetros de navegación.
   - Consulta individual a Firestore:
     ```javascript
     const docRef = doc(db, "vehiculos", productId);
     const docSnapshot = await getDoc(docRef);
     ```
   - Despliega todos los campos del vehículo con interfaz moderna, tarjeta de precio y ficha técnica.
6. **Script de Entrega `.zip` (`scripts/export_zip.sh`)**:
   - Genera automáticamente el ZIP excluyendo `node_modules`, `.expo`, `google-services.json`, llaves sensibles y `.git`.

---

## 🗂️ Estructura del Proyecto

```text
Actividad 3/
├── App.js                      # Contenedor raíz con NavigationContainer y SafeAreaProvider
├── app.json                    # Metadatos de la aplicación
├── package.json                # Dependencias y scripts de ejecución
├── firebaseConfig.js           # Configuración e inicialización de Cloud Firestore
├── .gitignore                  # Exclusiones de Git y seguridad
├── README.md                   # Esta documentación
├── data/
│   └── seedVehiculos.json      # 5 documentos de vehículos listos para Firestore
├── scripts/
│   ├── seedFirestore.js        # Script de inicialización de la base de datos
│   └── export_zip.sh           # Script para generar el archivo de entrega
└── src/
    ├── navigation/
    │   └── AppNavigator.js     # Stack Navigator (HomeScreen & DetailScreen)
    └── screens/
        ├── HomeScreen.js       # Lista de vehículos desde Firestore con FlatList
        └── DetailScreen.js     # Consulta y vista detallada por ID
```

---

## 🚀 Guía de Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Firebase Firestore
Abre `firebaseConfig.js` y reemplaza los valores de `firebaseConfig` con las credenciales de tu proyecto en la [Consola de Firebase](https://console.firebase.google.com/):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

> **Reglas de Seguridad de Firestore (Modo Prueba para la Actividad):**
> En Firebase Console -> Cloud Firestore -> Pestaña *Reglas*:
> ```text
> rules_version = '2';
> service cloud.firestore {
>   match /databases/{database}/documents {
>     match /{document=**} {
>       allow read, write: if true;
>     }
>   }
> }
> ```

---

### 3. Poblar la Colección `vehiculos` en Firestore (Seed)
Ejecuta el script automatizado para insertar los 5 documentos de prueba en tu base de datos:

```bash
npm run seed
```
*(o directamente: `node scripts/seedFirestore.js`)*

---

### 4. Iniciar la Aplicación

- **Con React Native CLI / Metro:**
  ```bash
  npm start
  ```
- **Con Android:**
  ```bash
  npm run android
  ```
- **Con Expo (si utilizas el cliente Expo Go):**
  ```bash
  npx expo start
  ```

---

## 📦 5. Generar Archivo ZIP de Entrega

Para generar el archivo ZIP limpio listo para entregar (Canvas / Classroom / Teams), ejecuta:

```bash
npm run zip
```
*(o: `bash scripts/export_zip.sh`)*

Este comando creará:
`Actividad3_React_Native_Firebase.zip` garantizando que **no contenga** `node_modules`, `.expo`, ni archivos de credenciales privadas como `google-services.json`.
