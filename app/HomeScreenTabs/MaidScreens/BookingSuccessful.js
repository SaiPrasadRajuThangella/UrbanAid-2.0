import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";

const BookingSuccessfulScreen = ({navigation}) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    // require("../HomeScreen")
    const timeout = setTimeout(() => {
      // na
      // require("../BookingHistory")
        navigation.navigate("Bookings")
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <LottieView
        source={require("../assets/animations/success.json")} // Place animation in assets/animations
        autoPlay
        loop={false}
        style={{ width: 150, height: 150 }}
      />
      
      <Text className="text-2xl font-SF-bold text-green-600 mt-4">
        Booking Successful!
      </Text>

      <Text className="text-lg font-SF-semibold text-green-600 mt-2">
        Redirecting you in {countdown}...
      </Text>
    </View>
  );
};

export default BookingSuccessfulScreen;
