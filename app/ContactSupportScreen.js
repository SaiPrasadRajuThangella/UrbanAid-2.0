import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ContactSupportScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issueType, setIssueType] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const issueTypes = [
    "OTP Issues",
    "Account Problems",
    "Payment Issues",
    "App Bugs",
    "Other"
  ];

  const handleSelectIssueType = (type) => {
    setIssueType(type);
    // Clear error for issue type if present
    if (errors.issueType) {
      setErrors((prev) => ({
        ...prev,
        issueType: ""
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field, value) => {
    // Clear error for field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ""
      }));
    }

    // Update field value
    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "message":
        setMessage(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    let newErrors = {};

    // Validate fields
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!issueType) {
      newErrors.issueType = "Please select an issue type";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }

    setErrors(newErrors);

    // If no errors, submit form
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          "Support Request Sent",
          "Thank you for reaching out. Our support team will get back to you soon.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack()
            }
          ]
        );
      }, 1500);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1 bg-white px-6">
        <Text className="text-4xl font-SF-bold text-center text-blue-600 mt-12 mb-2">
          Contact Support
        </Text>

        <Text className="text-base font-SF-medium text-center text-gray-700 mb-8">
          Let us know how we can help you
        </Text>

        {/* Name Input */}
        <View className="mb-5">
          <Text className="text-gray-700 font-SF-medium mb-2">Name</Text>
          <TextInput
            placeholder="Your name"
            value={name}
            onChangeText={(value) => handleInputChange("name", value)}
            className={`w-full border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } font-SF-light rounded-lg p-4`}
          />
          <View className="h-5">
            {errors.name && (
              <Text className="text-red-500 font-SF-medium text-sm">{errors.name}</Text>
            )}
          </View>
        </View>

        {/* Email Input */}
        <View className="mb-5">
          <Text className="text-gray-700 font-SF-medium mb-2">Email</Text>
          <TextInput
            placeholder="Your email address"
            value={email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            className={`w-full border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } font-SF-light rounded-lg p-4`}
          />
          <View className="h-5">
            {errors.email && (
              <Text className="text-red-500 font-SF-medium text-sm">{errors.email}</Text>
            )}
          </View>
        </View>

        {/* Issue Type Selection */}
        <View className="mb-5">
          <Text className="text-gray-700 font-SF-medium mb-2">Issue Type</Text>
          <View className="flex-row flex-wrap">
            {issueTypes.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => handleSelectIssueType(type)}
                className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                  issueType === type
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}
              >
                <Text
                  className={`font-SF-medium ${
                    issueType === type ? "text-white" : "text-gray-700"
                  }`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="h-5">
            {errors.issueType && (
              <Text className="text-red-500 font-SF-medium text-sm">
                {errors.issueType}
              </Text>
            )}
          </View>
        </View>

        {/* Message Input */}
        <View className="mb-5">
          <Text className="text-gray-700 font-SF-medium mb-2">Message</Text>
          <TextInput
            placeholder="Describe your issue..."
            value={message}
            onChangeText={(value) => handleInputChange("message", value)}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className={`w-full border ${
              errors.message ? "border-red-500" : "border-gray-300"
            } font-SF-light rounded-lg p-4 min-h-[120px]`}
          />
          <View className="h-5">
            {errors.message && (
              <Text className="text-red-500 font-SF-medium text-sm">
                {errors.message}
              </Text>
            )}
          </View>
        </View>

        {/* Contact Options */}
        <View className="mt-4 mb-8">
          <Text className="text-gray-700 font-SF-medium mb-4">
            You can also reach us directly:
          </Text>
          
          <View className="bg-gray-100 rounded-lg p-4 mb-3 flex-row items-center">
            <Image
              source={require("../assets/images/logos/email.png")}
              className="w-6 h-6 mr-3"
            />
            <Text className="text-gray-700 font-SF-medium">support@yourapp.com</Text>
          </View>
          
          <View className="bg-gray-100 rounded-lg p-4 flex-row items-center">
            <Image
              source={require("../assets/images/logos/phone.png")}
              className="w-6 h-6 mr-3"
            />
            <Text className="text-gray-700 font-SF-medium">+91 98765 43210</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 py-4 rounded-lg my-4"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-SF-bold">
              Submit
            </Text>
          )}
        </TouchableOpacity>
        
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-full py-4 mb-6"
        >
          <Text className="text-blue-600 text-center font-SF-medium">
            Back to previous screen
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ContactSupportScreen;