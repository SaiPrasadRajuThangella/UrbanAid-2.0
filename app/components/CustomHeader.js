import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNotifications } from "../context/NotificationContext";
import { useRouter } from "expo-router";

const CustomHeader = () => {
  const { notifications } = useNotifications();
  const router = useRouter()
  return (
    <View className="bg-white px-5 py-6 shadow-lg flex-row justify-between items-center">
      {/* Left: User Info */}
      <View className="flex-row items-center">
        <View className="w-12 h-12 bg-blue-400 rounded-full items-center justify-center">
          <Text className="text-lg text-white font-SF-semibold">U</Text>
        </View>
        <View className="ml-3">
          <Text className="text-lg font-SF-semibold">Hi User! 👋</Text>
          <Text className="text-gray-500 font-SF-light text-sm">Marina Skies, Hyderabad</Text>
        </View>
      </View>

      {/* Right: Notifications */}
      <TouchableOpacity onPress={() => router.push("../components/NotificationScreen")} className="relative p-2 border rounded-full">
        <Ionicons name="notifications-outline" size={24} color="black" />
        
        {/* Notification Badge */}
        {notifications.length > 0 && (
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
            <Text className="text-white text-xs font-SF-semibold">{notifications.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;
