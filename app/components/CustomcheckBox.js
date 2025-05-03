import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Using Material Icons

const CustomCheckBox = ({ label, isChecked, onPress }) => {
  return (
    <TouchableOpacity className="flex-row items-center space-x-2" onPress={onPress}>
      <View
        className={`w-6 h-6 border-2 mr-2 rounded-md flex items-center justify-center ${
          isChecked ? "bg-blue-500 border-blue-500" : "border-gray-400"
        }`}
      >
        {isChecked && <Icon name="check" size={18} color="white" />}
      </View>
      <Text className="text-gray-700 font-SF-medium">{label}</Text>
    </TouchableOpacity>
  );
};

export default CustomCheckBox;
