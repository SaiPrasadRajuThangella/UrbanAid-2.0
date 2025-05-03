import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { useRoute } from '@react-navigation/native';

export default function ScheduleScreen({ navigation }) {
  // Get route parameters from previous screens
  const route = useRoute();
  const maid = route.params?.maid || {};
  const serviceDetails = route.params?.serviceDetails || {};

  const [serviceFrequency, setServiceFrequency] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [pickerType, setPickerType] = useState("startDate");
  const [customTimeInput, setCustomTimeInput] = useState(false);
  const [errors, setErrors] = useState({});

  // Estimated price calculation based on selections
  const calculateEstimatedPrice = () => {
    // Base prices
    const basePrice = 800;
    const frequencyMultiplier = 
      serviceFrequency === "Daily" ? 0.9 :
      serviceFrequency === "Twice a week" ? 0.95 :
      serviceFrequency === "Weekly" ? 1 :
      serviceFrequency === "Bi-Weekly" ? 1.05 : 1;
    
    // Time slot adjustments
    const timeSlotAdjustment = 
      timeSlot === "Morning" ? 100 :
      timeSlot === "Evening" ? 150 : 0;
    
    return Math.round((basePrice * frequencyMultiplier) + timeSlotAdjustment);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (pickerType === "startDate") {
        setDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const showDatePickerModal = (type) => {
    setPickerType(type);
    setShowDatePicker(true);
  };

  // Validate inputs before continuing
  const validateInputs = () => {
    const newErrors = {};
    
    if (!serviceFrequency) {
      newErrors.serviceFrequency = "Please select a service frequency";
    }
    
    if (!timeSlot) {
      newErrors.timeSlot = "Please select a time slot";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle continue button - navigate to checkout with all needed data
  const handleContinue = () => {
    if (!validateInputs()) {
      return;
    }
    
    // Create schedule details object
    const scheduleDetails = {
      serviceFrequency,
      timeSlot,
      startDate: date,
      endDate: serviceFrequency !== 'One-Time' ? endDate : null,
      estimatedPrice: calculateEstimatedPrice()
    };
    
    // Navigate to Checkout Page with all collected data
    navigation.navigate("CheckoutPage", {
      maid,
      serviceDetails,
      scheduleDetails
    });
  };

  const RadioButton = ({ label, value, selected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center border rounded-lg px-4 py-2 ${
        selected ? "border-blue-500 bg-blue-100" : "border-gray-300"
      }`}
    >
      <View
        className={`w-5 h-5 rounded-full border-2 ${
          selected ? "border-blue-500 bg-blue-500" : "border-gray-300"
        }`}
      />
      <Text className="ml-2 font-SF-regular text-black">{label}</Text>
    </TouchableOpacity>
  );

  // Only show end date option for recurring schedules
  const isRecurring = serviceFrequency && serviceFrequency !== "One-Time";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 flex-col justify-between">
        <ScrollView className="flex-1 p-5 bg-white">
          <Text className="text-2xl font-SF-bold mb-5">Choose Your Schedule</Text>

          {/* Service Schedule */}
          <View className="mb-5">
            <View className="flex-row items-center mb-4">
              <Ionicons name="calendar-outline" size={20} color="#007bff" />
              <Text className="ml-2 text-blue-500 font-SF-semibold">
                Service Schedule
              </Text>
            </View>

            <Text className="text-gray-500 font-SF-regular mb-3">
              Service Frequency
            </Text>
            <View className="flex-row flex-wrap gap-3 mb-2">
              {["One-Time","Twice a week", "Daily", "Weekly", "Bi-Weekly", "Custom"].map(
                (item) => (
                  <RadioButton
                    key={item}
                    label={item}
                    value={item}
                    selected={serviceFrequency === item}
                    onPress={() => {
                      setServiceFrequency(item);
                      if (errors.serviceFrequency) {
                        setErrors({...errors, serviceFrequency: null});
                      }
                    }}
                  />
                )
              )}
            </View>
            {errors.serviceFrequency && (
              <Text className="text-red-500 text-sm mb-2">{errors.serviceFrequency}</Text>
            )}

            <Text className="text-gray-500 font-SF-regular mb-3 mt-4">Start Date</Text>
            <TouchableOpacity
              className="border border-gray-300 rounded-lg p-4 flex-row items-center justify-between mb-5"
              onPress={() => showDatePickerModal("startDate")}
            >
              <Text className="text-gray-700">{date.toLocaleDateString()}</Text>
              <Ionicons name="calendar" size={20} color="#007bff" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={pickerType === "startDate" ? date : endDate}
                mode="date"
                onChange={handleDateChange}
                minimumDate={pickerType === "endDate" ? date : new Date()}
              />
            )}

            {isRecurring && (
              <View className="mb-3">
                <Text className="text-gray-500 font-SF-regular mb-3">
                  End Date (Optional)
                </Text>
                <TouchableOpacity
                  className="border border-gray-300 rounded-lg p-4 flex-row items-center justify-between"
                  onPress={() => showDatePickerModal("endDate")}
                >
                  <Text className="text-gray-700">
                    {endDate.toLocaleDateString()}
                  </Text>
                  <Ionicons name="calendar" size={20} color="#007bff" />
                </TouchableOpacity>
              </View>
            )}
            
            <Text className="text-gray-500 font-SF-regular mb-3 mt-2">
              Select Time Slot
            </Text>
            <View className="flex-row flex-wrap gap-3 mb-2">
              {["Morning", "Afternoon", "Evening", "Custom"].map((item) => (
                <RadioButton
                  key={item}
                  label={
                    item === "Morning"
                      ? "Morning 7:00 - 10:00 AM"
                      : item === "Afternoon"
                      ? "Afternoon 11:00 AM - 3:00 PM"
                      : item === "Evening"
                      ? "Evening 4:00 - 8:00 PM"
                      : "Custom"
                  }
                  value={item}
                  selected={timeSlot === item}
                  onPress={() => {
                    setTimeSlot(item);
                    setCustomTimeInput(item === "Custom");
                    if (errors.timeSlot) {
                      setErrors({...errors, timeSlot: null});
                    }
                  }}
                />
              ))}
            </View>
            {errors.timeSlot && (
              <Text className="text-red-500 text-sm mb-2">{errors.timeSlot}</Text>
            )}
            
            {customTimeInput && (
              <View className="mt-3 p-4 bg-blue-50 rounded-lg">
                <Text className="font-SF-semibold mb-2">Custom Time Selection</Text>
                <Text className="text-sm text-gray-600 mb-2">
                  For custom time slots, our team will contact you to confirm availability.
                </Text>
                <Text className="text-sm text-gray-600">
                  You can specify your preferred time during checkout.
                </Text>
              </View>
            )}
          </View>

          {/* Price Estimate Card */}
          {(serviceFrequency && timeSlot) ? (
            <View className="bg-blue-50 rounded-lg p-4 mb-5 border border-blue-100">
              <Text className="font-SF-semibold text-blue-800 mb-2">Estimated Price</Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-700">Base service fee</Text>
                <Text className="font-SF-semibold">₹{calculateEstimatedPrice()}</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-2">
                Final price may vary based on additional services and requirements
              </Text>
            </View>
          ) : null}

          <View className="h-20"></View>
        </ScrollView>

        {/* Fixed buttons at bottom */}
        <View className="p-4 bg-white border-t border-gray-200">
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="flex-row items-center bg-gray-200 px-5 py-3 rounded-lg"
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color="#000" />
              <Text className="ml-2 font-SF-bold text-gray-700">Go Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row items-center px-5 py-3 rounded-lg ${
                serviceFrequency && timeSlot ? "bg-blue-500" : "bg-blue-300"
              }`}
              disabled={!serviceFrequency || !timeSlot}
              onPress={handleContinue}
            >
              <Ionicons name="cart-outline" size={20} color="#fff" />
              <Text className="ml-2 font-SF-bold text-white">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}