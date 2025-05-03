import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const ResetPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    setPasswordMismatch(text !== password && text.length > 0);
  };

  const handleUpdatePassword = () => {
    if (password === confirmPassword && password.length > 0) {
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate("ProfileScreen");
      }, 3000);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      {/* Title & Subtitle */}
      <Text className="text-2xl font-SF-semibold">Set a new password</Text>
      <Text className="text-gray-500 font-SF-light mt-1">
        Create a new password. Ensure it differs from previous ones for security.
      </Text>

      {/* Password Input */}
      <Text className="mt-6 text-gray-700 font-SF-medium">Password</Text>
      <TextInput
        className="border font-SF-light border-gray-300 rounded-lg px-4 py-3 mt-2 text-gray-800"
        placeholder="Enter your new password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm Password Input */}
      <Text className="mt-4 text-gray-700 font-SF-medium">Confirm Password</Text>
      <TextInput
        className="border font-SF-light border-gray-300 rounded-lg px-4 py-3 mt-2 text-gray-800"
        placeholder="Re-enter password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
      />

      {/* Password Mismatch Warning */}
      {passwordMismatch && (
        <Text className="text-red-500 font-SF-light mt-2">
          Password and Confirm Password should be the same
        </Text>
      )}

      {/* Update Password Button */}
      <TouchableOpacity
        className={`py-4 rounded-lg mt-6 items-center ${
          passwordMismatch || !password || !confirmPassword
            ? "bg-gray-300"
            : "bg-blue-500"
        }`}
        disabled={passwordMismatch || !password || !confirmPassword}
        onPress={handleUpdatePassword}
      >
        <Text className="text-white font-SF-semibold text-lg">Update Password</Text>
      </TouchableOpacity>

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
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Slightly dark background
    }}
  >
    <View className="bg-white p-6 rounded-t-2xl items-center">
      <LottieView
        source={require("../assets/animations/success.json")}
        autoPlay
        loop={false}
        style={{ width: 100, height: 100 }}
      />
      <Text className="text-xl font-SF-semibold mt-2">Password Updated Successfully</Text>
      <Text className="text-gray-500 font-SF-light mt-1">
        Getting you back to your profile
      </Text>
    </View>
  </View>
</Modal>

    </View>
  );
};

export default ResetPasswordScreen;
