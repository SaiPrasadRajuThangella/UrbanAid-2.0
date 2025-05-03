import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const NewPasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6 justify-between py-20">
      <View>
        <Text className="text-2xl font-SF-bold mb-2">Create new password</Text>
        <Text className="text-gray-500 font-SF-regular mb-6">
          Create a new password for your account.
        </Text>

        <TextInput
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          className="w-full font-SF-light border mt-5 border-gray-300  rounded-lg px-4 py-4 mb-3"
        />

        <TextInput
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          className="w-full font-SF-light border border-gray-300  rounded-lg px-4 py-4 mb-6"
        />
      </View>

      <TouchableOpacity
        className="bg-indigo-600  font-SF-semibold py-4 rounded-lg"
        onPress={() => {
          alert("Password Updated Successfully!");
          router.push("../loginpage");
        }}
      >
        <Text className="text-white text-center text-lg font-SF-semibold">
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewPasswordScreen;
