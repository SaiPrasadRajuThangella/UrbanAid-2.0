import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";

const ForgotPasswordScreen = () => {
  const [phone, setPhone] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [countryFlag, setCountryFlag] = useState("🇮🇳"); // Default flag
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6 justify-between py-20">
      <View>
        <Text className="text-2xl font-SF-bold mb-2">Forgot Password</Text>
        <Text className="text-gray-500 font-SF-regular mb-6">
          Please enter your mobile number to get OTP.
        </Text>

        <View className="flex-row items-center border-b-2 gap-2  pb-5 border-gray-400 m-2">
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="flex-row  items-center  mb-2"
          >
            <Text className="text-lg">{countryFlag}</Text>
            <Text className="text-blue-500 text-lg">{countryCode}</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            className="w-full font-SF-light border-gray-300 rounded-lg  "
          />
        </View>
      </View>

      <TouchableOpacity
        className="bg-indigo-600 py-4 rounded-full"
        onPress={() => router.push("./OTPverificationScreen")}
      >
        <Text className="text-white text-center text-lg font-SF-semibold">
          Continue
        </Text>
      </TouchableOpacity>

      <CountryPicker
        show={showPicker}
        pickerButtonOnPress={(item) => {
          setCountryCode(item.dial_code);
          setCountryFlag(item.flag); // Set flag emoji
          setShowPicker(false);
        }}
      />
    </View>
  );
};

export default ForgotPasswordScreen;
