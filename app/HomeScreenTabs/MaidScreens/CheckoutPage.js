import React from "react";
import { View, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';

const BookingSummaryScreen = ({ navigation }) => {
  // Get route parameters to access the data from previous screens
  const route = useRoute();
  
  // Extract maid information from the route params (passed from MaidProfileScreen)
  const maid = route.params?.maid || {
    name: 'Priya Sharma',
    imageURI: '../../../assets/images/user.jpeg',
    location: 'Location not specified',
    experience: '3'
  };
  
  // Extract service details from route params (passed from MaidBookingScreen)
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
  
  // Extract schedule details from route params (passed from ScheduleScreen)
  const scheduleDetails = route.params?.scheduleDetails || {
    serviceFrequency: 'Weekly',
    timeSlot: 'Evening',
    startDate: new Date(),
    endDate: null,
    estimatedPrice: 1200
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

  // Handle edit booking - go back to previous screen
  const handleEditBooking = () => {
    navigation.goBack();
  };

  // Format to show both date and day
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

  // Calculate platform fee
  const calculatePlatformFee = () => {
    // Platform fee is 5% of service price
    return Math.round((scheduleDetails.estimatedPrice || 1200) * 0.05);
  };

  // Calculate total amount
  const calculateTotal = () => {
    return (scheduleDetails.estimatedPrice || 1200) + calculatePlatformFee();
  };

  // Handle navigation to payment screen with all necessary data
  const handleProceedToPayment = () => {
    navigation.navigate("PaymentScreen", {
      // Pass maid details individually
      maidName: maid.name,
      maidImageURI: maid.imageURI,
      maidLocation: maid.location || 'Location not specified',
      maidExperience: maid.experience || '3',
      
      // Pass computed service type
      serviceType: determineServiceTypes(),
      
      // Pass other details
      serviceDetails: serviceDetails,
      scheduleDetails: scheduleDetails
    });
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar backgroundColor="#3b82f6" barStyle="light-content" />

      <ScrollView className="flex-1 px-4 pt-2">
        <View className="px-5 py-3">
          <Text className="text-lg text-blue-500 font-SF-semibold text-center">Booking Summary</Text>
        </View>
        
        {/* Professional Details Section with card design */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
          <Text className="text-sm font-SF-semibold text-blue-500 mb-2">PROFESSIONAL DETAILS</Text>
          <View className="flex-row items-center">
            <Image
              source={maid.imageURI ? { uri: maid.imageURI } : require("../../../assets/images/user.jpeg")}
              className="w-16 h-16 rounded-full mr-4"
            />
            <View>
              <Text className="text-lg font-SF-bold">{maid.name}</Text>
              <Text className="font-SF-regular text-gray-500">
                {maid.location || 'Location not specified'}
              </Text>
              <Text className="font-SF-regular text-gray-500">{maid.experience || '3'} years experience</Text>
            </View>
          </View>
        </View>

        {/* Service Section */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
          <Text className="text-sm font-SF-semibold text-blue-500 mb-3">SERVICE DETAILS</Text>
          
          {/* Service Type */}
          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Ionicons name="briefcase-outline" size={16} color="#6b7280" />
              <Text className="text-sm font-SF-regular text-gray-500 ml-2">
                Service Type
              </Text>
            </View>
            <Text className="text-base font-SF-semibold pl-6">
              {determineServiceTypes()}
            </Text>
          </View>
          
          {/* Time & Frequency */}
          <View className="flex-row gap-6 mb-4">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Ionicons name="time-outline" size={16} color="#6b7280" />
                <Text className="text-sm font-SF-regular text-gray-500 ml-2">
                  Arrival Time
                </Text>
              </View>
              <Text className="text-base font-SF-semibold pl-6">{getTimeSlotText()}</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Ionicons name="repeat-outline" size={16} color="#6b7280" />
                <Text className="text-sm font-SF-regular text-gray-500 ml-2">
                  Frequency
                </Text>
              </View>
              <Text className="text-base font-SF-semibold pl-6">{scheduleDetails.serviceFrequency}</Text>
            </View>
          </View>

          {/* Date Section */}
          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Ionicons name="calendar-outline" size={16} color="#6b7280" />
              <Text className="text-sm font-SF-regular text-gray-500 ml-2">
                Start Date
              </Text>
            </View>
            <Text className="text-base font-SF-semibold pl-6">{formatDate(scheduleDetails.startDate)}</Text>
            <Text className="text-sm font-SF-regular text-gray-400 pl-6">{getDay(scheduleDetails.startDate)}</Text>
          </View>
          
          {/* End Date - Only show if frequency is not one-time */}
          {scheduleDetails.serviceFrequency !== 'One-Time' && (
            <View className="mb-2">
              <View className="flex-row items-center mb-1">
                <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                <Text className="text-sm font-SF-regular text-gray-500 ml-2">
                  End Date
                </Text>
              </View>
              {scheduleDetails.endDate ? (
                <>
                  <Text className="text-base font-SF-semibold pl-6">{formatDate(scheduleDetails.endDate)}</Text>
                  <Text className="text-sm font-SF-regular text-gray-400 pl-6">{getDay(scheduleDetails.endDate)}</Text>
                </>
              ) : (
                <Text className="text-base font-SF-semibold pl-6">Not specified (ongoing)</Text>
              )}
            </View>
          )}
        </View>

        {/* Location Section */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
          <Text className="text-sm font-SF-semibold text-blue-500 mb-3">SERVICE ADDRESS</Text>
          
          {/* Address */}
          <View className="mb-4">
            <View className="flex-row items-start mb-1">
              <Ionicons name="location-outline" size={16} color="#6b7280" className="mt-1" />
              <Text className="text-sm font-SF-regular text-gray-500 ml-2">
                Address
              </Text>
            </View>
            <View className="pl-6">
              <Text className="text-base font-SF-semibold">Rohan Ghosh</Text>
              <Text className="text-gray-500 font-SF-regular">
                A-602, Chandan Arcade, Mira Bhayander Road
              </Text>
              <Text className="text-gray-500 font-SF-regular">
                Near Old Petrol Pump, Thane - 401107
              </Text>
              {/* Removed phone number for privacy */}
            </View>
          </View>

          {/* Property Details */}
          <View>
            <View className="flex-row items-center mb-1">
              <Ionicons name="home-outline" size={16} color="#6b7280" />
              <Text className="text-sm font-SF-regular text-gray-500 ml-2">
                Property Details
              </Text>
            </View>
            <Text className="text-base font-SF-semibold pl-6">{serviceDetails.adults} Adults, {serviceDetails.kids} Kids</Text>
            <Text className="text-sm font-SF-regular text-gray-500 pl-6">
              {serviceDetails.floors}, {serviceDetails.bathrooms}, {serviceDetails.pets}
            </Text>
          </View>
        </View>
        
        {/* Payment Info Card - Improved with clearer breakdown */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
          <Text className="text-sm font-SF-semibold text-blue-500 mb-3">PAYMENT DETAILS</Text>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 font-SF-regular">Service Fee</Text>
            <Text className="font-SF-regular">₹{scheduleDetails.estimatedPrice || 1200}</Text>
          </View>
          
          <View className="flex-row justify-between mb-2">
            <View className="flex-row items-center">
              <Text className="text-gray-600 font-SF-regular">Platform Fee</Text>
              <TouchableOpacity className="ml-1">
                <Ionicons name="information-circle-outline" size={14} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <Text className="font-SF-regular">₹{calculatePlatformFee()}</Text>
          </View>
          
          <View className="border-t border-gray-200 my-2"></View>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-800 font-SF-semibold">Total Amount</Text>
            <Text className="text-blue-600 font-SF-bold">₹{calculateTotal()}</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Fixed button at bottom */}
      <View className="px-4 py-3 bg-white border-t border-gray-200">
        <View className="flex-row justify-between">
          <TouchableOpacity 
            onPress={handleEditBooking}
            className="px-5 py-3 bg-gray-100 rounded-lg flex-row items-center"
          >
            <Ionicons name="create-outline" size={18} color="#4b5563" />
            <Text className="text-gray-700 font-SF-semibold ml-2">Edit Booking</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleProceedToPayment} 
            className="px-5 py-3 bg-blue-500 rounded-lg flex-row items-center"
          >
            <Ionicons name="wallet-outline" size={18} color="#fff" />
            <Text className="text-white font-SF-semibold ml-2">Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BookingSummaryScreen;