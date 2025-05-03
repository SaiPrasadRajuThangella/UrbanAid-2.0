import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
const OTPVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const router = useRouter();
  const handleOtpChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center gap-5">
      <Text className="text-2xl font-SF-bold mb-2">Verification</Text>
      <Text className="text-gray-500 font-SF-light mb-6">
        We've sent OTP to your mobile number at *********080. Please enter the
        4-digit code.
      </Text>

      <View className="flex-row justify-between p-1 mb-6">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            className="w-20 h-20 text-xl text-center bg-gray-200 rounded-lg"
          />
        ))}
      </View>

      <Text className="text-gray-500 font-SF-light mb-2">
        Didn’t receive code?
      </Text>
      <TouchableOpacity>
        <Text className="text-blue-500 font-SF-light">Resend in 32s</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-indigo-600 py-4  rounded-full mt-6"
        onPress={() => router.push("./NewPasswordScreen")}
      >
        <Text className="text-white text-center text-lg font-SF-semibold">
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OTPVerificationScreen;
