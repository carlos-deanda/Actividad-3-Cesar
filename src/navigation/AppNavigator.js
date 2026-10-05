import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import DetailScreen from "../screens/DetailScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1E1B4B", // Indigo oscuro moderno
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 18,
        },
        headerShadowVisible: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "🚗 Catálogo de Vehículos",
        }}
      />
      <Stack.Screen
        name="DetailScreen"
        component={DetailScreen}
        options={{
          title: "Ficha del Vehículo",
          headerBackTitle: "Catálogo",
        }}
      />
    </Stack.Navigator>
  );
}
