#!/usr/bin/env bash
# ==============================================================================
# Script de Exportación de Entrega para Actividad 3 (React Native + Firebase)
# Genera un archivo ZIP limpio excluyendo dependencias pesadas y archivos sensibles.
# ==============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_ZIP="$PROJECT_DIR/Actividad3_React_Native_Firebase.zip"

echo "📦 Empaquetando proyecto para entrega académica..."
echo "📂 Directorio origen: $PROJECT_DIR"

# Eliminar zip anterior si existe
rm -f "$OUTPUT_ZIP"

cd "$PROJECT_DIR"

zip -r "$OUTPUT_ZIP" . \
  -x "node_modules/*" \
  -x ".expo/*" \
  -x ".expo-shared/*" \
  -x "google-services.json" \
  -x "*serviceAccountKey*.json" \
  -x ".env" \
  -x ".env.local" \
  -x ".env.*.local" \
  -x ".git/*" \
  -x ".DS_Store" \
  -x "*/.DS_Store" \
  -x "*.zip"

echo ""
echo "✅ Archivo generado exitosamente:"
echo "📁 $OUTPUT_ZIP"
ls -lh "$OUTPUT_ZIP"
echo ""
echo "🚀 Listo para subir a Canvas / Teams / Classroom."
