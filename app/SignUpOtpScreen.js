import { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  ActivityIndicator, 
  Keyboard,
  Image
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUpOtpScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Get phone number and OTP method from route params
  const { phone = "", otpMethod = "sms", fullName = "" } = route.params || {};
  
  // Generate a random 5-digit OTP for validation
  const correctOtp = useRef("11111"); // You can generate a random OTP here instead of hardcoding
  
  const [otp, setOtp] = useState(["", "", "", "", ""]);
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

  // Auto-verification simulation (stops after 15 seconds)
  useEffect(() => {
    const autoVerifyTimeout = setTimeout(() => {
      setAutoVerifying(false);
    }, 15000);
    
    return () => clearTimeout(autoVerifyTimeout);
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
      if (text && index < 4) {
        inputRefs.current[index + 1]?.focus();
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
    
    // Generate a new random OTP when resending
    const newOtp = Math.floor(10000 + Math.random() * 90000).toString();
    correctOtp.current = newOtp;
    console.log("New OTP generated:", newOtp); // In a real app, you would send this to the server
    
    // Clear error if present
    setOtpError(false);
  };

  const handleVerifyOtp = () => {
    if (otp.join("").length === 5) {
      Keyboard.dismiss();
      
      // Check if entered OTP matches the correct OTP
      const enteredOtp = otp.join("");
      
      if (enteredOtp === "11111") {
      // if (enteredOtp === correctOtp.current) {
        // Successful verification flow
        setLoading(true);
        setModalVisible(true);
        
        // Set a timer to update the authentication status and close modal
        setTimeout(() => {
          setAuthenticationComplete(true);
          
          // Close modal and navigate after authentication is complete
          setTimeout(() => {
            setLoading(false);
            setModalVisible(false);
            navigation.navigate("MapScreen");
          }, 1000);
        }, 3000);
      } else {
        // Show error for incorrect OTP
        setOtpError(true);
      }
    }
  };

  const handleContactSupport = () => {
    navigation.navigate("ContactSupportScreen");
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      {/* <View className="my-20"><Text>njdj</Text></View> */}
      <Text className="text-4xl font-SF-bold text-center text-blue-600 mt-20 mb-6">
        Verification
      </Text>
      <Text className="text-gray-600 font-SF-regular mb-6">
        We sent a verification code to{" "}
        <Text className="font-SF-semibold">{phone}</Text>{" "}
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
        Enter the 5-digit code mentioned.
      </Text>

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
      <View className="flex-row justify-between mb-5">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className={`border ${digit ? (otpError ? "border-red-500" : "border-blue-600") : "border-gray-300"} 
              font-SF-light w-14 h-16 rounded-lg text-center text-xl`}
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
          otp.join("").length === 5 ? "bg-blue-600" : "bg-gray-300"
        }`}
        disabled={otp.join("").length !== 5 || loading}
        onPress={handleVerifyOtp}
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
                  Redirecting you to next step
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SignUpOtpScreen;