import { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

const VerifyOtpScreen = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [isModalVisible, setModalVisible] = useState(false);
  const inputRefs = useRef([]);

  const handleOtpChange = (text, index) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input box automatically
      if (text && index < 4) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerifyOtp = () => {
    if (otp.join("").length === 5) {
      setModalVisible(true);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-SF-semibold">Check your email</Text>
      <Text className="text-gray-500 font-SF-regular mt-1">
        We sent a reset link to <Text className="font-SF-semibold">contact@dscode...com</Text>{" "}
        enter the 5-digit code mentioned in the email.
      </Text>

      {/* OTP Input Boxes */}
      <View className="flex-row justify-between mt-6">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className="border border-gray-300 w-12 h-12 rounded-lg text-center text-xl"
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
          />
        ))}
      </View>

      {/* Verify Code Button */}
      <TouchableOpacity
        className={`py-4 rounded-lg mt-10 items-center ${
          otp.join("").length === 5 ? "bg-blue-500" : "bg-gray-300"
        }`}
        disabled={otp.join("").length !== 5}
        onPress={handleVerifyOtp}
      >
        <Text className="text-white font-SF-semibold text-lg">Verify Code</Text>
      </TouchableOpacity>

      {/* Resend Email */}
      <Text className="text-center font-SF-light text-gray-500 mt-10">
        Haven’t got the email yet?{" "}
        <Text className="text-blue-500 font-SF-medium">Resend email</Text>
      </Text>

      {/* Success Modal */}
      <Modal
  visible={isModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
>
  <View
    style={{
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)", // Fully transparent background
    }}
  >
    <View className="bg-white p-6 rounded-t-2xl items-center">
      <LottieView
        source={require("../assets/animations/success.json")}
        autoPlay
        loop={false}
        style={{ width: 100, height: 100 }}
      />
      <Text className="text-xl font-SF-semibold mt-2">Verification Successful</Text>
      <Text className="text-gray-500 font-SF-light mt-1">
        Please proceed to update the password.
      </Text>

      {/* Proceed Button */}
      <TouchableOpacity
        className="bg-blue-500 py-3 px-6 mt-6 rounded-lg"
        onPress={() => {
          setModalVisible(false);
          navigation.navigate("ResetPasswordScreen");
        }}
      >
        <Text className="text-white font-SF-semibold text-lg">Proceed</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
};

export default VerifyOtpScreen;
