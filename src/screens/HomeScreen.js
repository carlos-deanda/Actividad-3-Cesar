import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function HomeScreen({ navigation }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Consulta a la colección 'vehiculos' en Cloud Firestore
   * Transforma el QuerySnapshot en un arreglo de objetos tipados
   */
  const cargarVehiculos = useCallback(async () => {
    try {
      setErrorMessage(null);
      
      // Consulta a la colección de Firestore
      const querySnapshot = await getDocs(collection(db, "vehiculos"));
      
      // Conversión obligatoria del QuerySnapshot según requerimientos de la actividad
      const dataArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setVehiculos(dataArray);
    } catch (error) {
      console.error("Error al obtener vehículos de Firestore:", error);
      setErrorMessage(
        "No se pudieron cargar los datos de Firestore. Verifica tus credenciales en firebaseConfig.js"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    cargarVehiculos();
  }, [cargarVehiculos]);

  const onRefresh = () => {
    setRefreshing(true);
    cargarVehiculos();
  };

  /**
   * Renderizado individual de tarjeta de vehículo
   */
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => {
          // Navegación pasando el id del documento
          navigation.navigate("DetailScreen", { productId: item.id, id: item.id });
        }}
      >
        {item.imagenUrl ? (
          <Image
            source={{ uri: item.imagenUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cardImage, styles.placeholderImage]}>
            <Text style={styles.placeholderEmoji}>🚗</Text>
          </View>
        )}

        <View style={styles.cardBody}>
          <View style={styles.badgeRow}>
            <Text style={styles.brandBadge}>{item.marca || "Vehículo"}</Text>
            {item.anio && <Text style={styles.yearBadge}>{item.anio}</Text>}
            {item.combustible && (
              <Text style={styles.fuelBadge}>{item.combustible}</Text>
            )}
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {item.nombre || "Sin nombre"}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {item.descripcion || "Sin descripción disponible."}
          </Text>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.priceLabel}>Precio estimado</Text>
              <Text style={styles.priceValue}>
                ${Number(item.precio || 0).toLocaleString()} USD
              </Text>
            </View>

            <View style={styles.btnAction}>
              <Text style={styles.btnActionText}>Ver Detalle →</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Conectando con Firestore...</Text>
        <Text style={styles.loadingSubtext}>Cargando catálogo de vehículos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />

      {errorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorTitle}>⚠️ Estado de Conexión</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Text style={styles.errorHint}>
            Edita firebaseConfig.js con tus llaves y ejecuta npm run seed.
          </Text>
        </View>
      )}

      <FlatList
        style={styles.list}
        data={vehiculos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4F46E5"]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerSubtitle}>Catálogo Firestore</Text>
            <Text style={styles.headerTitle}>Vehículos Disponibles</Text>
            <Text style={styles.headerCount}>
              {vehiculos.length} {vehiculos.length === 1 ? "vehículo encontrado" : "vehículos encontrados"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>Colección vacía</Text>
              <Text style={styles.emptySubtitle}>
                No hay documentos en la colección 'vehiculos' de Firestore.
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={cargarVehiculos}
              >
                <Text style={styles.retryButtonText}>Recargar</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    width: "100%",
    minHeight: Platform.OS === "web" ? "100vh" : "100%",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
    width: "100%",
    minHeight: Platform.OS === "web" ? "100vh" : "100%",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#1E1B4B",
    fontWeight: "600",
    textAlign: "center",
  },
  loadingSubtext: {
    marginTop: 6,
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
  },
  list: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  header: {
    marginTop: 16,
    marginBottom: 20,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#4F46E5",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 4,
  },
  headerCount: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 18,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#E2E8F0",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
  },
  placeholderEmoji: {
    fontSize: 50,
  },
  cardBody: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  brandBadge: {
    backgroundColor: "#EEF2FF",
    color: "#4338CA",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  yearBadge: {
    backgroundColor: "#F1F5F9",
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  fuelBadge: {
    backgroundColor: "#ECFDF5",
    color: "#047857",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  priceLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  btnAction: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnActionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  errorBanner: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B91C1C",
  },
  errorText: {
    fontSize: 13,
    color: "#991B1B",
    marginTop: 2,
  },
  errorHint: {
    fontSize: 12,
    color: "#7F1D1D",
    marginTop: 4,
    fontStyle: "italic",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    marginHorizontal: 30,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
