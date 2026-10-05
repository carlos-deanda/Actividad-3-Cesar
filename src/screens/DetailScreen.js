import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function DetailScreen({ route, navigation }) {
  // Recepción del ID del vehículo desde los parámetros de navegación
  const productId = route.params?.productId || route.params?.id;

  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function obtenerDetalleVehiculo() {
      if (!productId) {
        setErrorMsg("No se proporcionó un ID de vehículo válido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMsg(null);

        // ====================================================================
        // CONSULTA INDIVIDUAL A CLOUD FIRESTORE SEGÚN REQUERIMIENTOS
        // ====================================================================
        const docRef = doc(db, "vehiculos", productId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          // Documento encontrado con éxito
          setVehiculo({ id: docSnapshot.id, ...docSnapshot.data() });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error al consultar el documento en Firestore:", error);
        setErrorMsg(
          "Error al recuperar los detalles de Firestore: " + error.message
        );
      } finally {
        setLoading(false);
      }
    }

    obtenerDetalleVehiculo();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Cargando ficha del vehículo...</Text>
      </View>
    );
  }

  if (notFound) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>🔍</Text>
        <Text style={styles.errorTitle}>Vehículo no encontrado</Text>
        <Text style={styles.errorSubtitle}>
          El documento con ID "{productId}" no existe en la colección 'vehiculos'.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Regresar al catálogo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Error de Conexión</Text>
        <Text style={styles.errorSubtitle}>{errorMsg}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Regresar al catálogo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      bounces={false}
    >
      <StatusBar barStyle="light-content" />

      {/* Banner / Imagen Principal */}
      {vehiculo?.imagenUrl ? (
        <Image
          source={{ uri: vehiculo.imagenUrl }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.bannerImage, styles.placeholderBanner]}>
          <Text style={styles.placeholderEmoji}>🚘</Text>
        </View>
      )}

      {/* Botón flotante para regresar */}
      <TouchableOpacity
        style={styles.floatingBackButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingBackText}>←</Text>
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        {/* Badges de clasificación */}
        <View style={styles.badgeRow}>
          <Text style={styles.brandBadge}>{vehiculo?.marca || "Vehículo"}</Text>
          {vehiculo?.anio && (
            <Text style={styles.specBadge}>Modelo {vehiculo.anio}</Text>
          )}
          {vehiculo?.combustible && (
            <Text style={styles.fuelBadge}>{vehiculo.combustible}</Text>
          )}
        </View>

        {/* Nombre del vehículo */}
        <Text style={styles.vehicleTitle}>{vehiculo?.nombre}</Text>

        {/* ID de Firestore */}
        <View style={styles.idContainer}>
          <Text style={styles.idLabel}>ID de Documento en Firestore:</Text>
          <Text style={styles.idValue}>{productId}</Text>
        </View>

        {/* Bloque de Precio */}
        <View style={styles.priceCard}>
          <View>
            <Text style={styles.priceCardLabel}>Precio sugerido de venta</Text>
            <Text style={styles.priceCardValue}>
              ${Number(vehiculo?.precio || 0).toLocaleString()} USD
            </Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>
              {vehiculo?.disponible !== false ? "Disponible" : "Agotado"}
            </Text>
          </View>
        </View>

        {/* Ficha de Especificaciones Técnicas */}
        <Text style={styles.sectionHeader}>Ficha Técnica</Text>
        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Marca</Text>
            <Text style={styles.gridValue}>{vehiculo?.marca || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Año</Text>
            <Text style={styles.gridValue}>{vehiculo?.anio || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Combustible</Text>
            <Text style={styles.gridValue}>{vehiculo?.combustible || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Color</Text>
            <Text style={styles.gridValue}>{vehiculo?.color || "N/A"}</Text>
          </View>
        </View>

        {/* Descripción Detallada */}
        <Text style={styles.sectionHeader}>Descripción General</Text>
        <View style={styles.descCard}>
          <Text style={styles.descriptionText}>
            {vehiculo?.descripcion || "Sin descripción proporcionada."}
          </Text>
        </View>

        {/* Botón de acción */}
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.85}
          onPress={() => alert(`Solicitud enviada para ${vehiculo?.nombre}`)}
        >
          <Text style={styles.actionButtonText}>Contactar Asesor / Reservar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    width: "100%",
    minHeight: Platform.OS === "web" ? "100vh" : "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
    width: "100%",
    minHeight: Platform.OS === "web" ? "100vh" : "100%",
  },
  loadingText: {
    marginTop: 14,
    fontSize: 16,
    color: "#64748B",
    fontWeight: "500",
  },
  bannerImage: {
    width: "100%",
    height: 270,
    backgroundColor: "#E2E8F0",
  },
  placeholderBanner: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
  },
  placeholderEmoji: {
    fontSize: 70,
  },
  floatingBackButton: {
    position: "absolute",
    top: 48,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  floatingBackText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: -2,
  },
  contentContainer: {
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  brandBadge: {
    backgroundColor: "#4F46E5",
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  specBadge: {
    backgroundColor: "#E2E8F0",
    color: "#334155",
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  fuelBadge: {
    backgroundColor: "#DCFCE7",
    color: "#15803D",
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  vehicleTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  idContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 6,
  },
  idLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  idValue: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "700",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priceCard: {
    backgroundColor: "#1E1B4B",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  priceCardLabel: {
    fontSize: 12,
    color: "#C7D2FE",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  priceCardValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderColor: "#10B981",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#34D399",
    fontSize: 12,
    fontWeight: "700",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  gridItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  gridLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  gridValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 4,
  },
  descCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 28,
  },
  descriptionText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
  },
  actionButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  errorIcon: {
    fontSize: 50,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  errorSubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
