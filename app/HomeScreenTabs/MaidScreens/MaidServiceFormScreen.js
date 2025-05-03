import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MaidServiceFormScreen = () => {
  const navigation = useNavigation();

  // Animation value
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Form state
  const [serviceType, setServiceType] = useState('');
  const [timingChange, setTimingChange] = useState('');
  const [bookingTypes, setBookingTypes] = useState('');
  const [customizePlan, setCustomizePlan] = useState('');
  const [frequency, setFrequency] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [budget, setBudget] = useState('');

  // Dropdown options
  const serviceOptions = [
    'Deep Cleaning',
    'Elderly Care',
    'Child Care',
    'Cooking',
    'Laundry Services',
    'Pet Care',
    'Home Organization',
    'Special Event Cleaning',
    'Other'
  ];

  const frequencyOptions = [
    'One-time',
    'Daily',
    'Weekly',
    'Bi-weekly',
    'Monthly',
    'Custom'
  ];

  const budgetOptions = [
    'Economy (₹500-1000)',
    'Standard (₹1000-2000)',
    'Premium (₹2000-3500)',
    'Luxury (₹3500+)',
    'Need to discuss'
  ];

  // Dropdown state
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [frequencyDropdownOpen, setFrequencyDropdownOpen] = useState(false);
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);

  // Form progress
  const [formProgress, setFormProgress] = useState(0);

  React.useEffect(() => {
    // Calculate form progress based on filled fields
    let filledFields = 0;
    if (serviceType) filledFields++;
    if (timingChange) filledFields++;
    if (bookingTypes) filledFields++;
    if (customizePlan) filledFields++;
    if (frequency) filledFields++;
    if (specialRequirements) filledFields++;
    if (preferredLocation) filledFields++;
    if (budget) filledFields++;
    
    setFormProgress((filledFields / 8) * 100);

    // Animation for status message
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  }, [serviceType, timingChange, bookingTypes, customizePlan, frequency, specialRequirements, preferredLocation, budget]);

  const toggleServiceDropdown = () => {
    setServiceDropdownOpen(!serviceDropdownOpen);
    setFrequencyDropdownOpen(false);
    setBudgetDropdownOpen(false);
  };

  const toggleFrequencyDropdown = () => {
    setFrequencyDropdownOpen(!frequencyDropdownOpen);
    setServiceDropdownOpen(false);
    setBudgetDropdownOpen(false);
  };

  const toggleBudgetDropdown = () => {
    setBudgetDropdownOpen(!budgetDropdownOpen);
    setServiceDropdownOpen(false);
    setFrequencyDropdownOpen(false);
  };

  const selectService = (option) => {
    setServiceType(option);
    setServiceDropdownOpen(false);
  };

  const selectFrequency = (option) => {
    setFrequency(option);
    setFrequencyDropdownOpen(false);
  };

  const selectBudget = (option) => {
    setBudget(option);
    setBudgetDropdownOpen(false);
  };

  const handleSubmit = () => {
    // Form submission logic
    alert('Your customization request has been submitted!');
    navigation.goBack();
  };

  const renderDropdown = (isOpen, options, onSelect, placeholder) => {
    if (!isOpen) return null;
    
    return (
      <View className="border border-gray-300 rounded-lg mt-1 bg-white shadow-md z-10">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            className={`p-4 ${index !== options.length - 1 ? 'border-b border-gray-200' : ''} ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            onPress={() => onSelect(option)}
            activeOpacity={0.7}
          >
            <Text className="font-SF-regular text-gray-800">{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderInputField = (label, value, setValue, placeholder, multiline = true) => (
    <View className="mb-6">
      <Text className="text-gray-700 font-SF-medium mb-2">
        {label}
      </Text>
      <TextInput
        className="border border-gray-300 bg-gray-50 rounded-lg p-4 font-SF-regular text-gray-800"
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor="#a0aec0"
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-5 pt-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-2xl text-gray-800 font-SF-bold mb-2">
              Customize Your Service
            </Text>
            <Text className="text-gray-600 font-SF-regular">
              Tell us what you're looking for and we'll make it happen!
            </Text>
          </View>

          {/* Progress bar */}
          <View className="mb-8">
            <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <View 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${formProgress}%` }} 
              />
            </View>
            <Text className="text-gray-500 font-SF-regular text-right mt-1 text-xs">
              {Math.round(formProgress)}% completed
            </Text>
          </View>

          {/* Form sections */}
          <View className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
            <Text className="text-blue-800 font-SF-medium">
              We're excited to hear about your custom service needs! The more details you provide, the better we can tailor our offerings to you.
            </Text>
          </View>

          {/* Service Type Dropdown */}
          <View className="mb-6">
            <Text className="text-gray-700 font-SF-medium mb-2">
              What type of service are you expecting which Urban Aid isn't providing now?
            </Text>
            <TouchableOpacity 
              className="border border-gray-300 rounded-lg p-4 flex-row justify-between items-center bg-gray-50"
              onPress={toggleServiceDropdown}
              activeOpacity={0.7}
            >
              <Text className={`${serviceType ? 'text-gray-800' : 'text-gray-400'} font-SF-regular`}>
                {serviceType || 'Select a service type'}
              </Text>
              <Text className="text-gray-600">▼</Text>
            </TouchableOpacity>
            {renderDropdown(serviceDropdownOpen, serviceOptions, selectService)}
          </View>

          {/* Frequency Dropdown */}
          <View className="mb-6">
            <Text className="text-gray-700 font-SF-medium mb-2">
              How often would you need this service?
            </Text>
            <TouchableOpacity 
              className="border border-gray-300 rounded-lg p-4 flex-row justify-between items-center bg-gray-50"
              onPress={toggleFrequencyDropdown}
              activeOpacity={0.7}
            >
              <Text className={`${frequency ? 'text-gray-800' : 'text-gray-400'} font-SF-regular`}>
                {frequency || 'Select frequency'}
              </Text>
              <Text className="text-gray-600">▼</Text>
            </TouchableOpacity>
            {renderDropdown(frequencyDropdownOpen, frequencyOptions, selectFrequency)}
          </View>

          {/* Budget Dropdown (New) */}
          <View className="mb-6">
            <Text className="text-gray-700 font-SF-medium mb-2">
              What's your budget range for this service?
            </Text>
            <TouchableOpacity 
              className="border border-gray-300 rounded-lg p-4 flex-row justify-between items-center bg-gray-50"
              onPress={toggleBudgetDropdown}
              activeOpacity={0.7}
            >
              <Text className={`${budget ? 'text-gray-800' : 'text-gray-400'} font-SF-regular`}>
                {budget || 'Select budget range'}
              </Text>
              <Text className="text-gray-600">▼</Text>
            </TouchableOpacity>
            {renderDropdown(budgetDropdownOpen, budgetOptions, selectBudget)}
          </View>

          {/* Text Input Fields */}
          {renderInputField(
            "What changes do you need about our timings?",
            timingChange,
            setTimingChange,
            "e.g., Evening services, weekend availability, etc."
          )}

          {renderInputField(
            "What do you think about booking types?",
            bookingTypes,
            setBookingTypes,
            "e.g., Subscription, one-time, emergency, etc."
          )}

          {renderInputField(
            "Want to customize any service plan?",
            customizePlan,
            setCustomizePlan,
            "Tell us how you'd like to customize our existing plans"
          )}

          {renderInputField(
            "Any special requirements or preferences?",
            specialRequirements,
            setSpecialRequirements,
            "e.g., Eco-friendly products, specific equipment, etc."
          )}

          {/* Preferred Location (New) */}
          <View className="  rounded-xl mb-6 ">
            {renderInputField(
              "Where would you prefer this service to be available?",
              preferredLocation,
              setPreferredLocation,
              "Enter your area, neighborhood, or city",
              false
            )}
          </View>

          {/* Permission to call question with radio buttons */}
          <View className="mb-6">
            <Text className="text-gray-700 font-SF-medium mb-3">
              Is it okay to call you about your request?
            </Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity 
                className="flex-row  mr-3 items-center"
                activeOpacity={0.7}
              >
                <View className="h-5 w-5 rounded-full border-2 border-blue-500 mr-2 items-center justify-center">
                  <View className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                </View>
                <Text className="font-SF-medium text-gray-700">Yes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center"
                activeOpacity={0.7}
              >
                <View className="h-5 w-5 rounded-full border-2 border-gray-300 mr-2 items-center justify-center">
                  {/* Empty circle for unselected state */}
                </View>
                <Text className="font-SF-medium text-gray-700">No</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Submit button */}
          <TouchableOpacity 
            className="bg-green-600 rounded-lg py-4 px-6 shadow-md mb-8"
            activeOpacity={0.8}
          >
            <Text className="text-white font-SF-semibold text-center text-lg">
              Submit and hear from us soon
            </Text>
          </TouchableOpacity>
          
          {/* Separator */}
          <View className="border-t border-gray-200 my-4" />

          {/* Horizontally scrolling status message */}
          <View className="mb-6 py-3 overflow-hidden bg-green-50 rounded-lg">
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={{ paddingRight: 50 }}
            >
              <Animated.View
                style={{
                  transform: [{
                    translateX: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, -500]
                    })
                  }]
                }}
              >
                <Text className="text-green-600 font-SF-medium text-base">
                  Hurray! Our service providers are active right now • Hurray! Our service providers are active right now • Hurray! Our service providers are active right now •
                </Text>
              </Animated.View>
            </Animated.ScrollView>
          </View>

          {/* Other Company Services */}
          <View className="mb-8 space-y-5">
            <Text className="text-gray-800 font-SF-bold text-xl mb-2">
              Other Company Services You Might Like
            </Text>
            
            {/* Talk to us card */}
            <TouchableOpacity 
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 elevation-3"
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <View className="relative w-full h-40">
                {/* Full image background */}
                <Image
                  source={{ uri: 'https://img.freepik.com/free-photo/customer-service-agent-with-headset-working-call-center_23-2149194159.jpg' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                
                {/* Text overlay with blur background */}
                <View className="absolute bottom-0 left-0 right-0 p-4">
                  <View className="absolute inset-0 bg-black opacity-40 blur-md" />
                  <View className="flex-row items-center justify-between z-10">
                    <Text className="text-white font-SF-bold text-lg">
                      Customer Support
                    </Text>
                    <View className="bg-blue-600 px-3 py-1 rounded-full">
                      <Text className="text-white font-SF-medium text-xs">
                        Talk to us
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            
            {/* Book appointment card */}
            <TouchableOpacity 
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 elevation-3"
              activeOpacity={0.8}
            >
              <View className="relative w-full h-40">
                {/* Full image background */}
                <Image
                  source={{ uri: 'https://img.freepik.com/free-photo/closeup-business-woman-hand-booking-appointment-calendar_53876-14798.jpg' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                
                {/* Text overlay with blur background */}
                <View className="absolute bottom-0 left-0 right-0 p-4">
                  <View className="absolute inset-0 bg-black opacity-40 blur-md" />
                  <View className="flex-row items-center justify-between z-10">
                    <Text className="text-white font-SF-bold text-lg">
                      Instant Booking
                    </Text>
                    <View className="bg-indigo-600 px-3 py-1 rounded-full">
                      <Text className="text-white font-SF-medium text-xs">
                        Book now
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            
            {/* Schedule call card */}
            <TouchableOpacity 
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 elevation-3"
              activeOpacity={0.8}
            >
              <View className="relative w-full h-40">
                {/* Full image background */}
                <Image
                  source={{ uri: 'https://img.freepik.com/free-photo/business-concept-close-up-businesswoman-hands-holding-mobile-phone-with-blank-screen-office_1258-104330.jpg' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                
                {/* Text overlay with blur background */}
                <View className="absolute bottom-0 left-0 right-0 p-4">
                  <View className="absolute inset-0 bg-black opacity-40 blur-md" />
                  <View className="flex-row items-center justify-between z-10">
                    <Text className="text-white font-SF-bold text-lg">
                      Personal Consultation
                    </Text>
                    <View className="bg-gray-700 px-3 py-1 rounded-full">
                      <Text className="text-white font-SF-medium text-xs">
                        Schedule
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Additional info */}
          <View className="bg-gray-50 p-4 rounded-lg mb-8">
            <Text className="text-gray-500 font-SF-regular text-center text-sm">
              By submitting this form, you'll help us improve our service offerings.
              Your feedback is valuable to us!
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MaidServiceFormScreen;