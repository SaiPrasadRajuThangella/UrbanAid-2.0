import { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  ActivityIndicator, 
  Keyboard,
  Image,
  ToastAndroid,
  Platform
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const LoginOtpScreen = () => {
  const route = useRoute();
  const router = useRouter();
  const navigation = useNavigation();
  
  // Get mobile number and OTP method from route params
  const { mobileNumber = "+919912795885", otpMethod = "sms" } = route.params || {};
  
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [authenticationComplete, setAuthenticationComplete] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoVerifying, setAutoVerifying] = useState(true);
  const [otpError, setOtpError] = useState(false);
  const inputRefs = useRef([]);
  const animationRef = useRef(null);

  // Timer for resend functionality
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-verification simulation - just show the indicator for 15 seconds
  useEffect(() => {
    // Set a timeout to stop auto-verification after 15 seconds
    const autoVerifyTimeout = setTimeout(() => {
      setAutoVerifying(false);
    }, 15000);
    
    return () => {
      clearTimeout(autoVerifyTimeout);
    };
  }, []);

  const handleOtpChange = (text, index) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      
      // Clear error when user starts typing again
      if (otpError) {
        setOtpError(false);
      }

      // Move to next input box automatically
      if (text && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
      
      // Auto-submit when all boxes are filled
      if (text && index === 3) {
        // Check if all boxes are filled
        const allFilled = newOtp.every(digit => digit !== '');
        if (allFilled) {
          setTimeout(() => handleVerifyOtp(), 300);
        }
      }
    }
  };

  const handleKeyPress = (e, index) => {
    // If backspace and current input is empty, focus previous input
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resetResendTimer = () => {
    setCanResend(false);
    setTimer(60);
    
    // Clear error if present
    setOtpError(false);
    
    // Use ToastAndroid for Android, can be expanded for iOS if needed
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        `New OTP sent to ${mobileNumber}`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
    }
  };

  const handleVerifyOtp = async () => {
    const otpToVerify = otp.join("");
    
    if (otpToVerify.length === 4) {
      Keyboard.dismiss();
      setLoading(true);
      setModalVisible(true);
      
      try {
        // API call commented out and replaced with simple check for "1111"
        /*
        const apiUrl = 'http://192.168.0.123:8765/auth/login-otp';
        const response = await axios.post(apiUrl, {
          mobileNumber: "+919912795885", // Using fixed number as requested
          otp: otpToVerify
        });
        
        console.log("OTP verification response:", response.data);
        */
        
        // Simple check for the OTP "1111"
        if (otpToVerify === "1111") {
          // Successful verification
          setAuthenticationComplete(true);
          
          // Close modal and navigate after authentication is complete
          setTimeout(() => {
            setLoading(false);
            setModalVisible(false);
            router.push("./HomeScreenTabs/HomeScreenLayout");
          }, 1000);
        } else {
          // Simulate API error for any other OTP
          throw new Error("Invalid OTP");
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        
        // Close modal and show error
        setModalVisible(false);
        setLoading(false);
        setOtpError(true);
        
        // Show error toast on Android
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravity(
            'Invalid OTP. Please try again.',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
          );
        }
      }
    }
  };

  const handleContactSupport = () => {
    navigation.navigate("ContactSupportScreen");
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <Text className="text-4xl font-SF-bold text-center text-blue-600 mt-20 mb-6">
        Verification
      </Text>
      
      <Text className="text-gray-600 font-SF-regular mb-6">
        We sent a verification code to{" "}
        <Text className="font-SF-semibold">{mobileNumber}</Text>{" "}
        through{" "}
        <Text>
          <Image 
            source={require("../assets/images/logos/sms.jpg")} 
            style={{width: 16, height: 12, marginHorizontal: 2}}
          />
          <Text className="font-SF-medium"> SMS </Text>
          and
          <Image 
            source={require("../assets/images/logos/whatsaap.png")} 
            style={{width: 16, height: 12, marginHorizontal: 2}}
          />
          <Text className="font-SF-medium"> WhatsApp</Text>
        </Text>. 
        Enter the 4-digit code mentioned.
      </Text>

      {/* Debug message - remove in production */}
      {/* <Text className="text-red-500 font-SF-medium text-center mb-4">
        For testing, use code: 1111
      </Text> */}

      {/* Auto-verification indicator */}
      {autoVerifying && (
        <View className="flex-row items-center justify-center mb-4">
          <ActivityIndicator size="small" color="#3b82f6" />
          <Text className="text-blue-600 font-SF-medium ml-2">
            Auto verifying OTP...
          </Text>
        </View>
      )}

      {/* OTP Input Boxes */}
      <View className="flex-row justify-center gap-8 space-x-4 mb-5">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className={`border ${digit ? (otpError ? "border-red-500" : "border-blue-600") : "border-gray-300"} 
              font-SF-light w-16 h-16 rounded-lg text-center text-2xl`}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>
      
      {/* OTP Error Message */}
      {otpError && (
        <Text className="text-red-500 font-SF-regular text-center mb-2">
          Incorrect verification code. Please try again.
        </Text>
      )}

      {/* Verify Code Button */}
      <TouchableOpacity
        className={`w-full py-4 rounded-lg mt-8 items-center ${
          otp.join("").length === 4 ? "bg-blue-600" : "bg-gray-300"
        }`}
        disabled={otp.join("").length !== 4 || loading}
        onPress={() => handleVerifyOtp()}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center text-lg font-SF-bold">
            Verify Code
          </Text>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View className="flex-row items-center my-8">
        <View className="flex-1 h-[1px] bg-gray-200" />
        <Text className="mx-3 font-SF-light text-gray-600">
          {canResend ? "Didn't receive the code?" : `Resend in ${timer}s`}
        </Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

      {/* Resend Email */}
      <TouchableOpacity 
        disabled={!canResend}
        onPress={resetResendTimer}
        className={`w-full py-3 border border-blue-600 rounded-lg items-center ${
          canResend ? "opacity-100" : "opacity-50"
        }`}
      >
        <Text className="text-blue-600 font-SF-bold">
          Resend verification code
        </Text>
      </TouchableOpacity>

      {/* Contact Support Section */}
      <TouchableOpacity onPress={handleContactSupport} className="mt-auto mb-6 justify-end">
        <Text className="text-center text-gray-600 font-SF-regular">
          Need help?{" "}
          <Text className="text-blue-600 font-SF-bold">
            Contact Support
          </Text>
        </Text>
      </TouchableOpacity>

      {/* Authentication Modal */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          className="flex-1 justify-center items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View className="bg-white p-6 rounded-xl items-center w-4/5 max-w-sm">
            {!authenticationComplete ? (
              <>
                <LottieView
                  ref={animationRef}
                  source={require("../assets/animations/loading.json")}
                  autoPlay
                  loop={true}
                  style={{ width: 100, height: 100 }}
                />
                <Text className="text-xl font-SF-bold mt-4 text-gray-800">
                  Authenticating OTP
                </Text>
                <Text className="text-gray-600 font-SF-regular mt-1 text-center">
                  Please wait while we verify your code
                </Text>
              </>
            ) : (
              <>
                <LottieView
                  source={require("../assets/animations/success.json")}
                  autoPlay
                  loop={false}
                  style={{ width: 100, height: 100 }}
                />
                <Text className="text-xl font-SF-bold mt-4 text-gray-800">
                  Verification Successful
                </Text>
                <Text className="text-gray-600 font-SF-regular mt-1 text-center">
                  Redirecting you to home screen
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LoginOtpScreen;

// No need for additional Toast component setup since we're using the native ToastAndroid