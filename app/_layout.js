import { SplashScreen, Stack } from "expo-router";
import "./globals.css";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    // "SF-bold": require("../assets/fonts/Rubik-bold.ttf"),
    "SF-bold": require("../assets/fonts/SanFranciscoProText/SFProText-Bold.ttf"),
    "SF-heavy": require("../assets/fonts/SanFranciscoProText/SFProText-Heavy.ttf"),
    "SF-light": require("../assets/fonts/SanFranciscoProText/SFProText-Light.ttf"),
    "SF-medium": require("../assets/fonts/SanFranciscoProText/SFProText-Medium.ttf"),
    "SF-semibold": require("../assets/fonts/SanFranciscoProText/SFProText-Semibold.ttf"),
    "SF-regular": require("../assets/fonts/SanFranciscoProText/SFProText-Regular.ttf"),
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="loginpage" />
            <Stack.Screen name="signuppage" />
            <Stack.Screen name="MapScreen" />
            <Stack.Screen name="AddCommunityScreen" />
            <Stack.Screen name="HomeDetailsScreen" />
            <Stack.Screen name="GatedCommunitiesScreen" />
            <Stack.Screen name="LoginOtpScreen" />
            <Stack.Screen name="SignUpOtpScreen" />
            <Stack.Screen name="ContactSupportScreen" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}