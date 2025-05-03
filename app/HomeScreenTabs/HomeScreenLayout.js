import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StatusBar, Platform } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

// Import Screens
import HomeScreen from "./HomeScreen";
import MaidScreenLayout from "./MaidScreenLayout";
import ProfileScreenLayout from "./ProfileScreenLayout";
import BookingHistoryStack from "./BookingHistoryStack";
import NotificationScreen from "../components/NotificationScreen";
// import ProfileScreen from "../components/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Enhanced Custom Header Component with LinearGradient (integrated directly)
const CustomHeader = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  // Calculate proper padding for the header
  const topPadding = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0;
  
  return (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6']} // dark blue to medium blue
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ paddingTop: topPadding }}
      className="px-5 py-2 shadow-lg"
    >
      {/* Status Bar with proper color */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#1E40AF" 
        translucent 
      />
      
      {/* Main Header Content */}
      <View className="flex-row py-1 justify-between items-center">
        {/* Left: App Title and Location */}
        <View className="pt-2">
          <Text className="text-2xl font-SF-bold text-white">Urban Aid</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={12} color="white" />
            <Text className="text-white font-SF-regular text-sm  opacity-90">
              Jubilee Hills, Hyderabad
            </Text>
          </View>
        </View>

        {/* Right: Profile and Notifications */}
        <View className="flex-row pt-3 items-center">
          {/* Notifications Icon */}
          <TouchableOpacity
            onPress={() => navigation.navigate("NotificationScreen")}
            className="p-2 relative"
          >
            <View className="w-10 h-10 bg-blue-800 bg-opacity-30 rounded-full items-center justify-center border border-white border-opacity-40">
              <Ionicons name="notifications-outline" size={20} color="white" />
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-xs text-white font-bold">6</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

// Tab Navigator Component
const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Services")
            iconName = focused ? "briefcase" : "briefcase-outline";
          else if (route.name === "Bookings")
            iconName = focused ? "calendar" : "calendar-outline";
          else if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1D4ED8", // Deeper blue color
        tabBarInactiveTintColor: "#6B7280", // Gray color
        tabBarStyle: {
          paddingVertical: 10,
          height: 70,
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.12,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontFamily: "SF-medium",
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarItemStyle: {
          padding: 5,
        },
        header: () => <CustomHeader navigation={navigation} />,
        headerTransparent: false,
        headerStyle: {
          height: undefined, 
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={MaidScreenLayout} />
      <Tab.Screen name="Bookings" component={BookingHistoryStack} />
      <Tab.Screen name="Profile" component={ProfileScreenLayout} />
    </Tab.Navigator>
  );
};

// Main App Component with Stack Navigation
const HomeScreenLayout = () => {
  return (
    <SafeAreaProvider>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen 
          name="NotificationScreen" 
          component={NotificationScreen}
          options={{
            headerShown: false,
          }} 
        />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
};

export default HomeScreenLayout;