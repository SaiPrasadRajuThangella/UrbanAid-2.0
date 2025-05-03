import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  StyleSheet,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

const PaymentScreen = () => {
  const navigation = useNavigation();
  // Get route parameters to access the data from previous screens
  const route = useRoute();
  
  // Extract all necessary details from route params passed from BookingSummaryScreen
  // Since we're not getting maid details directly, extract from route directly
  const maid = {
    name: route.params?.maidName || 'Priya Sharma',
    imageURI: route.params?.maidImageURI || '../../../assets/images/user.jpeg',
    location: route.params?.maidLocation || 'Hyderabad',
    experience: route.params?.maidExperience || '3'
  };
  
  const serviceDetails = route.params?.serviceDetails || {
    adults: '2',
    kids: '1',
    pets: 'No Pets',
    floors: '1 Floor',
    bathrooms: '1-2 Bathrooms',
    livingBedroomsCleaning: 'Required',
    dishwashing: 'Required',
    countertopCleaning: 'Required',
    meals: '2 Meals',
    foodType: 'Vegetarian',
    washingMethod: 'With Machine',
    drying: 'Required',
    ironingFolding: 'Required'
  };
  
  const scheduleDetails = route.params?.scheduleDetails || {
    serviceFrequency: 'Weekly',
    timeSlot: 'Evening',
    startDate: new Date(),
    endDate: null,
    estimatedPrice: 1200
  };

  // Payment and coupon states
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customCouponCode, setCustomCouponCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Sample coupon data
  const availableCoupons = [
    {
      id: "NEW50",
      code: "NEW50",
      description: "50% off for new users",
      discountPercent: 50,
      maxDiscount: 200,
      validUntil: "May 15, 2025",
      isNewUser: true,
    },
    {
      id: "FLASH25",
      code: "FLASH25",
      description: "25% off on all services",
      discountPercent: 25,
      maxDiscount: 300,
      validUntil: "April 30, 2025",
    },
    {
      id: "WEEKEND20",
      code: "WEEKEND20",
      description: "20% off for weekend bookings",
      discountPercent: 20,
      maxDiscount: 250,
      validUntil: "May 30, 2025",
    },
  ];

  // Sample payment methods
  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: 'smartphone',
      description: 'Pay using any UPI app',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'credit-card',
      description: 'All major cards accepted',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: 'account-balance',
      description: 'All major banks available',
    },
    {
      id: 'wallet',
      name: 'Mobile Wallet',
      icon: 'account-balance-wallet',
      description: 'Paytm, PhonePe, etc.',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: 'money',
      description: 'Pay after service completion',
    },
  ];

  // Helper functions from BookingSummaryScreen
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };
  
  // Get time slot display text
  const getTimeSlotText = () => {
    switch(scheduleDetails.timeSlot) {
      case 'Morning':
        return '7:00 - 10:00 am';
      case 'Afternoon':
        return '11:00 am - 3:00 pm';
      case 'Evening':
        return '4:00 - 8:00 pm';
      case 'Custom':
        return 'Custom Time';
      default:
        return '4:00 - 8:00 pm';
    }
  };

  // Determine service types based on selected options
  const determineServiceTypes = () => {
    const services = [];
    
    if (serviceDetails.livingBedroomsCleaning === 'Required' || 
        serviceDetails.bathrooms !== 'Not Required') {
      services.push('Cleaning');
    }
    
    if (serviceDetails.dishwashing === 'Required' || 
        serviceDetails.countertopCleaning === 'Required') {
      services.push('Kitchen Work');
    }
    
    if (serviceDetails.meals !== 'Not Required') {
      services.push('Cooking');
    }
    
    if (serviceDetails.washingMethod !== 'Not Required' || 
        serviceDetails.drying === 'Required' || 
        serviceDetails.ironingFolding === 'Required') {
      services.push('Laundry');
    }
    
    return services.join(', ');
  };

  // Price calculation functions
  const calculateSubtotal = () => {
    return scheduleDetails?.estimatedPrice || 1200;
  };

  const calculatePlatformFee = () => {
    return Math.round(calculateSubtotal() * 0.05);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const discountAmount = Math.round((calculateSubtotal() * appliedCoupon.discountPercent) / 100);
    return Math.min(discountAmount, appliedCoupon.maxDiscount);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculatePlatformFee() - calculateDiscount();
  };

  // Animation functions for coupon modal
  useEffect(() => {
    if (showCouponModal) {
      Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showCouponModal]);

  // Handle coupon application
  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
    setShowSuccessModal(true);
    
    // Close the coupon modal
    setShowCouponModal(false);
    
    // Show success modal with animation for 2 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);
  };

  // Apply custom coupon code
  const handleApplyCustomCoupon = () => {
    setErrorMessage("");
    
    if (!customCouponCode.trim()) {
      setErrorMessage("Please enter a coupon code");
      return;
    }
    
    const foundCoupon = availableCoupons.find(
      coupon => coupon.code.toUpperCase() === customCouponCode.toUpperCase()
    );
    
    if (foundCoupon) {
      handleApplyCoupon(foundCoupon);
      setCustomCouponCode("");
    } else {
      setErrorMessage("Invalid coupon code");
    }
  };

  // Handle final payment
  const handleMakePayment = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate("BookingSuccessful", {
        maidName: maid.name,
        maidImageURI: maid.imageURI,
        maidLocation: maid.location,
        maidExperience: maid.experience,
        serviceDetails,
        scheduleDetails,
        paymentDetails: {
          method: selectedPaymentMethod,
          amount: calculateTotal(),
          discount: calculateDiscount(),
          couponApplied: appliedCoupon?.code,
        },
      });
    }, 2000);
  };

  // Modal offset animation value
  const translateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <View className="flex-1 bg-white">
      <StatusBar backgroundColor="#3b82f6" barStyle="light-content" />
      
      <ScrollView className="flex-1">
        {/* Order Summary Section */}
        <View className="px-4 py-5">
          <Text className="text-xl font-SF-bold mb-4">Order Summary</Text>
          
          {/* Summary Card */}
          <View className="bg-white rounded-xl p-4 mb-5 shadow-sm border border-gray-100">
            {/* Service Details */}
            <View className="flex-row items-start mb-3">
              <View className="h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-3 mt-1">
                <Ionicons name="briefcase-outline" size={20} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-blue-600 font-SF-semibold">Service</Text>
                <Text className="text-base font-SF-semibold">
                  {maid.name}
                </Text>
                <Text className="text-sm font-SF-regular text-gray-600">
                  {route.params?.serviceType || "Cleaning, Kitchen Work"} • {scheduleDetails.serviceFrequency}
                </Text>
              </View>
            </View>
            
            {/* Date & Time */}
            <View className="flex-row items-start mb-3">
              <View className="h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-3 mt-1">
                <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-blue-600 font-SF-semibold">Date & Time</Text>
                <Text className="text-base font-SF-semibold">
                  {formatDate(scheduleDetails.startDate)}
                </Text>
                <Text className="text-sm font-SF-regular text-gray-600">
                  {getDay(scheduleDetails.startDate)} • {getTimeSlotText()}
                </Text>
                {scheduleDetails.serviceFrequency !== 'One-Time' && scheduleDetails.endDate && (
                  <Text className="text-sm font-SF-regular text-gray-600">
                    Until {formatDate(scheduleDetails.endDate)}
                  </Text>
                )}
              </View>
            </View>
            
            {/* Address */}
            <View className="flex-row items-start mb-4">
              <View className="h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-3 mt-1">
                <Ionicons name="location-outline" size={20} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-blue-600 font-SF-semibold">Service Address</Text>
                <Text className="text-base font-SF-semibold">Ananya Reddy</Text>
                <Text className="text-sm font-SF-regular text-gray-600">
                  Flat 403, Serene Heights, Road No. 12, Banjara Hills, Hyderabad - 500034
                </Text>
              </View>
            </View>
            
            {/* Property Details */}
            <View className="flex-row items-start">
              <View className="h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-3 mt-1">
                <Ionicons name="home-outline" size={20} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-blue-600 font-SF-semibold">Property Details</Text>
                <Text className="text-base font-SF-semibold">
                  {serviceDetails.adults} Adults, {serviceDetails.kids} Kids
                </Text>
                <Text className="text-sm font-SF-regular text-gray-600">
                  {serviceDetails.floors}, {serviceDetails.bathrooms}, {serviceDetails.pets}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Coupons and Offers Section */}
          <View className="bg-white rounded-xl mb-5 shadow-sm border border-gray-100 overflow-hidden">
            <TouchableOpacity 
              onPress={() => setShowCouponModal(true)}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center">
                <View className="h-10 w-10 rounded-full bg-amber-100 items-center justify-center mr-3">
                  <Ionicons name="pricetag-outline" size={20} color="#f59e0b" />
                </View>
                <View>
                  <Text className="text-base font-SF-semibold">
                    {appliedCoupon ? `${appliedCoupon.code} Applied` : "Apply Coupon"}
                  </Text>
                  {appliedCoupon && (
                    <Text className="text-sm font-SF-regular text-green-600">
                      ₹{calculateDiscount()} discount applied
                    </Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
            
            {appliedCoupon && (
              <View className="bg-green-50 p-3 border-t border-green-100">
                <Text className="text-sm font-SF-semibold text-green-600">
                  {appliedCoupon.description}
                </Text>
              </View>
            )}
          </View>
          
          {/* Payment Methods */}
          <Text className="text-xl font-SF-bold mb-4">Select Payment Method</Text>
          
          <View className="bg-white rounded-xl mb-5 shadow-sm border border-gray-100 overflow-hidden">
            {paymentMethods.map((method, index) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedPaymentMethod(method.id)}
                className={`p-4 flex-row items-center justify-between ${
                  index < paymentMethods.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                    <MaterialIcons name={method.icon} size={20} color="#6b7280" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-SF-semibold">{method.name}</Text>
                    <Text className="text-sm font-SF-regular text-gray-500">{method.description}</Text>
                  </View>
                </View>
                <View className={`h-5 w-5 rounded-full border-2 ${
                  selectedPaymentMethod === method.id 
                    ? "border-blue-500 bg-blue-500" 
                    : "border-gray-300"
                }`} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Price Summary and Pay Button */}
      <View className="bg-white border-t border-gray-200 p-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500 font-SF-regular">Subtotal</Text>
          <Text className="font-SF-semibold">₹{calculateSubtotal()}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500 font-SF-regular">Platform Fee</Text>
          <Text className="font-SF-semibold">₹{calculatePlatformFee()}</Text>
        </View>
        {appliedCoupon && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-green-600">Discount</Text>
            <Text className="font-SF-semibold text-green-600">-₹{calculateDiscount()}</Text>
          </View>
        )}
        <View className="border-t border-gray-200 my-2"></View>
        <View className="flex-row justify-between mb-4">
          <Text className="font-SF-bold text-lg">Total Amount</Text>
          <Text className="font-SF-bold text-lg text-blue-600">₹{calculateTotal()}</Text>
        </View>
        
        <TouchableOpacity
          onPress={handleMakePayment}
          disabled={isProcessing}
          className={`rounded-lg p-4 items-center ${
            isProcessing ? "bg-blue-300" : "bg-blue-500"
          }`}
        >
          {isProcessing ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="#fff" size="small" />
              <Text className="text-white font-SF-bold ml-2">Processing...</Text>
            </View>
          ) : (
            <Text className="text-white font-SF-bold text-lg">
              Pay ₹{calculateTotal()}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Coupon Selection Modal */}
      <Modal
        visible={showCouponModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowCouponModal(false)}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
        <View className="flex-1 justify-end">
          <Animated.View
            style={[
              {
                transform: [{ translateY: translateY }],
                backgroundColor: 'white',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                maxHeight: '80%',
              },
            ]}
          >
            <View className="p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-SF-bold">Apply Coupon</Text>
                <TouchableOpacity onPress={() => setShowCouponModal(false)}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              
              {/* Enter Coupon Code */}
              <View className="flex-row mb-4">
                <TextInput
                  className="flex-1 border border-gray-300 rounded-l-lg p-3 font-SF-regular"
                  placeholder="Enter coupon code"
                  value={customCouponCode}
                  onChangeText={setCustomCouponCode}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  onPress={handleApplyCustomCoupon}
                  className="bg-blue-500 rounded-r-lg px-4 items-center justify-center"
                >
                  <Text className="text-white font-SF-semibold">Apply</Text>
                </TouchableOpacity>
              </View>
              
              {errorMessage ? (
                <Text className="text-red-500 mb-3">{errorMessage}</Text>
              ) : null}
              
              <Text className="text-gray-500 font-SF-semibold mb-3">Available Coupons</Text>
              
              <ScrollView className="max-h-80">
                {availableCoupons.map((coupon) => (
                  <View
                    key={coupon.id}
                    className="border border-gray-200 rounded-lg mb-3 overflow-hidden"
                  >
                    <View className="flex-row items-stretch">
                      <View className="bg-blue-50 p-3 items-center justify-center w-20 border-r border-dashed border-gray-300">
                        <Text className="text-blue-600 font-SF-bold text-lg">{coupon.discountPercent}%</Text>
                        <Text className="text-blue-500 text-xs">OFF</Text>
                      </View>
                      
                      <View className="p-3 flex-1">
                        <View className="flex-row justify-between">
                          <Text className="font-SF-semibold mb-1">{coupon.code}</Text>
                          <Text className="text-xs text-gray-500">Valid till {coupon.validUntil}</Text>
                        </View>
                        <Text className="text-sm text-gray-600 mb-2">{coupon.description}</Text>
                        <Text className="text-xs text-gray-500">Up to ₹{coupon.maxDiscount}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => handleApplyCoupon(coupon)}
                      className="bg-blue-500 p-2"
                    >
                      <Text className="text-white text-center font-SF-semibold">
                        Apply Coupon
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </Modal>
      
      {/* Success Animation Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black bg-opacity-30 items-center justify-center">
          <View className="bg-white rounded-xl p-6 w-4/5 items-center">
            <View className="w-20 h-20 mb-4">
              <LottieView
                source={require('../../../assets/animations/coupon-success.json')}
                autoPlay
                loop={true}
              />
            </View>
            <Text className="text-xl font-SF-bold text-center mb-2">Hurray!</Text>
            <Text className="text-green-600 font-SF-semibold text-center mb-3">
              Coupon successfully applied!
            </Text>
            <Text className="text-center text-gray-600 mb-2">
              You saved ₹{calculateDiscount()} with {appliedCoupon?.code}
            </Text>
            <View className="bg-green-50 rounded-lg p-3 w-full mt-2">
              <View className="flex-row justify-between">
                <Text className="font-SF-regular">New total:</Text>
                <Text className="font-SF-bold">₹{calculateTotal()}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentScreen;