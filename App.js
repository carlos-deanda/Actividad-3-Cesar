import React from "react";
import { StatusBar, View, StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { registerRootComponent } from "expo";
import AppNavigator from "./src/navigation/AppNavigator";

// Configuración de estilo global para #root en React Native Web
if (Platform.OS === "web" && typeof document !== "undefined") {
  const rootStyleId = "react-native-web-root-fix";
  if (!document.getElementById(rootStyleId)) {
    const styleTag = document.createElement("style");
    styleTag.id = rootStyleId;
    styleTag.textContent = `
      #root {
        display: flex;
        flex-direction: column;
        height: 100vh;
        min-height: 100vh;
        width: 100%;
      }
      body {
        margin: 0;
        padding: 0;
      }
    `;
    document.head.appendChild(styleTag);
  }
}

function App() {
  return (
    <SafeAreaProvider style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />
      <View
        style={{
          flex: 1,
          width: "100%",
          minHeight: Platform.OS === "web" ? "100vh" : "100%",
          height: "100%",
        }}
      >
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default registerRootComponent(App);


