import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import CustomCheckBox from "./components/CustomcheckBox";
import { useNavigation } from "@react-navigation/native";

WebBrowser.maybeCompleteAuthSession();

const SignUpScreen = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpMethod, setOtpMethod] = useState("sms");

  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID_HERE",
    iosClientId: "YOUR_IOS_CLIENT_ID_HERE",
    expoClientId: "YOUR_EXPO_CLIENT_ID_HERE",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      getUserInfo(authentication.accessToken);
    }
  }, [response]);

  const getUserInfo = async (accessToken) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const user = await res.json();
      navigation.navigate("GoogleSignupInfoScreen", {
        email: user.email,
        name: user.name,
      });
    } catch (err) {
      console.error("Error fetching user info:", err);
      Alert.alert("Google Sign Up Failed", "Could not get user info.");
    }
  };

  const handleTermsPress = () => {
    Alert.alert("Terms and Conditions", "Navigating to Terms and Conditions page");
  };

  const handleInputChange = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "phone") {
      // For the new input field, we're handling just the number portion
      setPhone("+91 " + value.replace(/\D/g, ""));
    } else if (field === "fullName") {
      setFullName(value);
    }
  };

  const handleAppleSignUp = () => {
    Alert.alert("Apple Sign Up", "Apple sign-up functionality to be implemented");
  };

  const handleInstagramSignUp = () => {
    Alert.alert("Instagram Sign Up", "Instagram sign-up functionality to be implemented");
  };

  const handleSignUp = async () => {
    let newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    const numberOnly = phone.replace("+91", "").trim();
    if (!numberOnly) {
      newErrors.phone = "Phone Number is required";
    } else if (numberOnly.length !== 10 || !/^\d{10}$/.test(numberOnly)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!isChecked) {
      newErrors.terms = "You must agree to the terms";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      try {
        ToastAndroid.show("OTP sent to your mobile number", ToastAndroid.SHORT);
        navigation.navigate("SignUpOtpScreen", {
          phone: phone,
          fullName: fullName,
          otpMethod: otpMethod,
        });
      } catch (error) {
        Alert.alert("Sign Up Failed", "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Initialize with country code only on component mount
    setPhone("+91 ");
  }, []);

  // Function to display all error messages
  const getErrorMessages = () => {
    const errorMessages = [];
    if (errors.fullName) errorMessages.push(errors.fullName);
    if (errors.phone) errorMessages.push(errors.phone);
    return errorMessages;
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1  bg-white px-6">
        <Text className="text-4xl font-SF-bold text-center text-blue-600 mt-20 mb-10">Welcome !</Text>

        {/* Name Input without gap for error */}
        <View>
          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={(value) => handleInputChange("fullName", value)}
            className={`w-full border ${errors.fullName ? "border-red-500" : "border-gray-300"} font-SF-light rounded-lg p-5 py-5`}
          />
        </View>

        {/* Phone Input with combined errors display */}
        <View className="mt-5">
          <View className={`w-full border ${errors.phone ? "border-red-500" : "border-gray-300"} font-SF-light rounded-lg py-5 px-5 flex-row items-center`}>
            <Image 
              source={require("../assets/images/logos/IndianFlag.png")} 
              className="w-5 h-4 mr-1" 
            />
            <Text className="font-SF-medium">+91</Text>
            <Text className="mx-2 text-gray-400">|</Text>
            <TextInput
              placeholder="Mobile Number"
              value={phone.replace("+91 ", "")}
              keyboardType="phone-pad"
              onChangeText={(value) => handleInputChange("phone", value)}
              className="flex-1 font-SF-regular p-0"
              maxLength={10}
            />
          </View>
          
          {/* Combined error messages section - show in the error space */}
          <View className="h-10 mt-1 justify-center">
            {getErrorMessages().map((error, index) => (
              <Text key={index} className="text-red-500 font-SF-medium text-sm">
                {error}
              </Text>
            ))}
          </View>
        </View>

        {/* Terms and Conditions */}
        <View className="mb-5 mt-5">
          <View className="flex-row items-center">
            <CustomCheckBox
              label=""
              isChecked={isChecked}
              onPress={() => {
                setIsChecked(!isChecked);
                setErrors((prev) => ({ ...prev, terms: "" }));
              }}
            />
            <Text className="font-SF-medium text-gray-700">
              Agree to{" "}
              <Text className="text-blue-600 font-SF-medium underline" onPress={handleTermsPress}>
                Terms & Conditions
              </Text>
            </Text>
          </View>
          <View className="h-5">
            {errors.terms && (
              <Text className="text-red-500 font-SF-medium text-sm">{errors.terms}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          className="w-full bg-blue-600 py-4 rounded-lg mt-2"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View className="flex-row items-center justify-center">
              <Text className="text-white text-center text-lg font-SF-bold">Send OTP via</Text>
              <View className="mx-2">
                <View className={`flex-row items-center px-2 py-1 rounded-lg`}>
                  <Image source={require("../assets/images/logos/sms.png")} className="w-4 h-4 mr-1" />
                  <Text className="text-white font-SF-medium text-sm">SMS</Text>
                </View>
              </View>
              <Text className="text-white font-SF-bold">/</Text>
              <View className="mx-2">
                <View className={`flex-row items-center px-2 py-1 rounded-lg`}>
                  <Image source={require("../assets/images/logos/whatsaap.png")} className="w-4 h-4 mr-1" />
                  <Text className="text-white font-SF-medium text-sm">WhatsApp</Text>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => promptAsync()}
          className="w-full flex-row shadow-md shadow-zinc-700 bg-gray-200 rounded-[10px] py-3 mt-6 mb-4 items-center justify-center"
        >
          <Image source={require("../assets/images/logos/google.png")} className="w-5 h-5" />
          <Text className="text-gray-700 text-center py-2 font-SF-bold ml-5">Sign Up with Google</Text>
        </TouchableOpacity>

        <View className="flex-row items-center mt-6">
          <View className="flex-1 h-[1px] bg-gray-200" />
          <Text className="mx-3 font-SF-light text-gray-600">OR Sign Up with</Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        <View className="flex-row justify-center gap-10 space-x-8 my-12">
          <TouchableOpacity
            onPress={handleAppleSignUp}
            className="items-center justify-center bg-[#F1F7F6] rounded-full p-4 shadow-sm"
          >
            <Image source={require("../assets/images/logos/apple.png")} className="w-8 h-8" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleInstagramSignUp}
            className="items-center justify-center bg-[#F1F7F6] rounded-full p-4 shadow-sm"
          >
            <Image source={require("../assets/images/logos/Instagram.png")} className="w-8 h-8" />
          </TouchableOpacity>
        </View>

        <Text className="mb-10 text-center font-SF-regular text-gray-600">
          Already have an account?{" "}
          <Text className="text-blue-600 font-SF-bold" onPress={() => navigation.navigate("loginpage", { phone })}>
            Log in
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;