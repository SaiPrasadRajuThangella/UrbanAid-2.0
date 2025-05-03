import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white p-6">
      {/* Back Button */}
      {/* <TouchableOpacity className="mb-6">
        <Text className="text-2xl">←</Text>
      </TouchableOpacity> */}

      <Text className="text-2xl font-SF-semibold">Forgot password</Text>
      <Text className="text-gray-500 font-SF-light mt-1">Please enter your email to reset the password</Text>

      {/* Email Input */}
      <Text className="mt-10 text-gray-700 font-SF-medium">Your Email /Username /Mobile No</Text>
      <TextInput
        className="border border-gray-300 font-SF-light rounded-lg px-4 py-3 mt-2 text-gray-800"
        placeholder="Enter your Email /Username /Mobile No"
        keyboardType="email-address"
      />

      {/* Reset Password Button */}
      <TouchableOpacity
        className="bg-blue-500 py-4  rounded-lg mt-10 items-center"
        onPress={() => navigation.navigate("VerifyOtpScreen")}
      >
        <Text className="text-white font-SF-semibold text-lg">Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
