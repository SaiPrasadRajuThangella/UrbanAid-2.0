import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import Toast from "react-native-toast-message";
import axios from "axios";
import CustomCheckBox from "./components/CustomcheckBox";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [termsChecked, setTermsChecked] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpMethod, setOtpMethod] = useState("sms"); // 'sms' or 'whatsapp'

  const navigation = useNavigation();
  const router = useRouter();

  // Get the scheme from app.json
  const scheme = Constants.manifest?.scheme || "your-app-scheme";
  
  // Create a proper redirect URI that matches what's in your Google Cloud Console
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: scheme,
    path: "redirect",
    // Optionally use the proxy to avoid having to add many URIs to your Google Console
    useProxy: true
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "399238489235-3bovha4cd4ttr4lsd5f1v7ciiif1iq2j.apps.googleusercontent.com",
    iosClientId: "399238489235-dsaa2pjeoatru154ov05psqsgc9137oh.apps.googleusercontent.com",
    expoClientId: "399238489235-9pk5osuom07v8gu1enau8ijdd1vihtn1.apps.googleusercontent.com",
    redirectUri: redirectUri
  });

  // Log the redirect URI to help with debugging
  useEffect(() => {
    console.log("Current redirect URI:", redirectUri);
  }, [redirectUri]);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("Authentication successful:", authentication);
      getUserInfo(authentication.accessToken);
    } else if (response?.type === "error") {
      console.error("Authentication error:", response.error);
      Alert.alert(
        "Authentication Failed", 
        `Error: ${response.error?.message || "Unknown error"}`
      );
    }
  }, [response]);

  const getUserInfo = async (accessToken) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const user = await res.json();
      console.log("User info received:", user);
      
      const userExists = await checkIfUserExists(user.email);
      
      if (userExists) {
        router.push("./HomeScreenTabs/HomeScreenLayout");
      } else {
        navigation.navigate("GoogleSignupInfoScreen", {
          email: user.email,
          name: user.name
        });
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      Alert.alert("Google Login Failed", "Could not get user info.");
    }
  };

  // Mock function to check if user exists - replace with actual API call
  const checkIfUserExists = async (email) => {
    // In a real app, you would make an API call to your backend
    // return await yourApi.checkUserExists(email);
    return false; // For demo purposes, always treating as new user
  };

  const handleLogin = async () => {
    let newErrors = {};

    // Validate mobile number (should be 10 digits after removing country code)
    const numberOnly = mobileNumber.replace("+91", "").trim();
    if (!numberOnly) {
      newErrors.phone = "Phone Number is required";
    } else if (numberOnly.length !== 10 || !/^\d{10}$/.test(numberOnly)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Validate terms agreement
    if (!termsChecked) {
      newErrors.terms = "You must agree to the terms";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      try {
        // Format the mobile number for the API call
        const formattedNumber = mobileNumber.replace(/\s/g, "");
        
        // Store the mobile number if needed
        await SecureStore.setItemAsync("userMobile", formattedNumber);

        // Navigate to OTP screen immediately
        navigation.navigate("LoginOtpScreen", { 
          mobileNumber: formattedNumber, 
          otpMethod: otpMethod 
        });
        
        // Show toast message
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: `OTP sent to your number ${formattedNumber}`,
          visibilityTime: 4000,
          position: 'bottom',
        });
        
        // API call commented out
        /*
        const apiUrl = `http://192.168.0.123:8765/auth/getOtp?mobileNumber=%2B919912795885`;
        console.log("Calling API:", apiUrl);
        
        // Make GET request with axios
        axios.get(apiUrl)
        .then(response => {
          console.log("OTP sent successfully:", response.data);
        })
        .catch(error => {
          console.error("API Error:", error);
          // Don't alert here since we've already navigated
        });
        */
      } catch (error) {
        console.error("Error in login process:", error);
        setLoading(false);
        Alert.alert("Error", "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("Starting Google login flow...");
      await promptAsync();
    } catch (error) {
      console.error("Error initiating Google login:", error);
      Alert.alert("Google Login Failed", "Could not start Google login process.");
    }
  };

  const handleAppleLogin = () => {
    Alert.alert("Apple Login", "Apple login functionality to be implemented");
  };

  const handleInstagramLogin = () => {
    Alert.alert("Instagram Login", "Instagram login functionality to be implemented");
  };

  const handleTermsPress = () => {
    // Navigate to terms and conditions screen or open a web link
    Alert.alert(
      "Terms and Conditions",
      "Navigating to Terms and Conditions page"
    );
  };

  const handleInputChange = (text) => {
    // Clear any existing error
    setErrors((prev) => ({ ...prev, phone: "" }));
    
    // If user deletes the country code, add it back
    if (!text.includes("+91")) {
      setMobileNumber("+91 " + text.replace("+91", "").replace(/\D/g, ""));
    } else {
      setMobileNumber(text);
    }
  };

  // Set initial value with country code
  useEffect(() => {
    setMobileNumber("+91 ");
  }, []);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 bg-white px-6">
        <Text className="text-4xl font-SF-bold text-center text-blue-600 mt-20 mb-10">
          Welcome back!
        </Text>

        <Text className="text-base font-SF-medium text-gray-700 mb-6">
          Enter your registered mobile number. We'll send you a one-time password for verification.
        </Text>

        {/* Mobile Number Input with fixed height for error space */}
        <View className="mb-5">
          <View className={`w-full border ${errors.phone ? "border-red-500" : "border-gray-300"} font-SF-light rounded-lg py-5 px-5 flex-row items-center`}>
            <Image 
              source={require("../assets/images/logos/IndianFlag.png")} 
              className="w-5 h-4 mr-1" 
            />
            <Text className="font-SF-medium">+91</Text>
            <Text className="mx-2 text-gray-400">|</Text>
            <TextInput
              placeholder="Mobile Number"
              value={mobileNumber.replace("+91 ", "")}
              keyboardType="phone-pad"
              onChangeText={handleInputChange}
              className="flex-1 font-SF-regular p-0"
              maxLength={10}
            />
          </View>
          <View className="h-5">
            {errors.phone && (
              <Text className="text-red-500 font-SF-medium text-sm">{errors.phone}</Text>
            )}
          </View>
        </View>

        {/* Terms and Need Help Row */}
        <View className="flex-row mt-5 mb-2 justify-between w-full items-center">
          <View className="flex-row items-center">
            <CustomCheckBox 
              label="" 
              isChecked={termsChecked} 
              onPress={() => { 
                setTermsChecked(!termsChecked); 
                setErrors((prev) => ({ ...prev, terms: "" }));
              }} 
            />
            <Text className="font-SF-medium text-gray-700">
              Agree to{" "}
              <Text 
                className="text-blue-600 font-SF-medium underline"
                onPress={handleTermsPress}
              >
                Terms & Conditions
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("./(tabs)/ForgetPasswordScreen")}
          >
            <Text className="text-blue-600 font-SF-regular">Need help?</Text>
          </TouchableOpacity>
        </View>
        
        <View className="h-5 mb-2">
          {errors.terms && (
            <Text className="text-red-500 font-SF-medium text-sm">{errors.terms}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleLogin}
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
          onPress={handleGoogleLogin}
          className="w-full flex-row shadow-md shadow-zinc-700 bg-gray-200 rounded-[10px] py-3 mt-6 mb-4 items-center justify-center"
        >
          <Image source={require("../assets/images/logos/google.png")} className="w-5 h-5" />
          <Text className="text-gray-700 text-center py-2 font-SF-bold ml-5">Login with Google</Text>
        </TouchableOpacity>

        <View className="flex-row items-center mt-6">
          <View className="flex-1 h-[1px] bg-gray-200" />
          <Text className="mx-3 font-SF-light text-gray-600">OR Login with</Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        <View className="flex-row justify-center gap-10 space-x-8 my-12">
          <TouchableOpacity
            onPress={handleAppleLogin}
            className="items-center justify-center bg-[#F1F7F6] rounded-full p-4 shadow-sm"
          >
            <Image source={require("../assets/images/logos/apple.png")} className="w-8 h-8" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleInstagramLogin}
            className="items-center justify-center bg-[#F1F7F6] rounded-full p-4 shadow-sm"
          >
            <Image source={require("../assets/images/logos/Instagram.png")} className="w-8 h-8" />
          </TouchableOpacity>
        </View>

        <Text className="mb-10 text-center font-SF-regular text-gray-600">
          Don't have an account?{" "}
          <Text
            className="text-blue-600 font-SF-bold"
            onPress={() => navigation.navigate("signuppage")}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

// Add this at the bottom of your file to register the Toast component
// You'll need to wrap your app with the Toast provider in your App.js or equivalent
// <Toast ref={(ref) => Toast.setRef(ref)} />