import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";

const ReviewServiceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { booking } = route.params;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Rating criteria
  const [criteriaRatings, setCriteriaRatings] = useState({
    quality: 0,
    punctuality: 0,
    behavior: 0,
    cleanliness: 0
  });

  const updateCriteriaRating = (criterion, value) => {
    setCriteriaRatings({
      ...criteriaRatings,
      [criterion]: value
    });
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const renderStars = (currentRating, onRatingPress) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        onPress={() => onRatingPress(star)}
        activeOpacity={0.7}
        className="px-1"
      >
        <Ionicons
          name={star <= currentRating ? "star" : "star-outline"}
          size={24}
          color={star <= currentRating ? "#FFC107" : "#CBD5E0"}
        />
      </TouchableOpacity>
    ));
  };

  const renderCriteriaItem = (title, criterion) => (
    <View className="flex-row items-center justify-between mb-5">
      <Text className="text-gray-700 font-SF-medium w-28">{title}</Text>
      <View className="flex-row">
        {renderStars(criteriaRatings[criterion], (value) => 
          updateCriteriaRating(criterion, value)
        )}
      </View>
    </View>
  );

  const calculateOverallRating = () => {
    const { quality, punctuality, behavior, cleanliness } = criteriaRatings;
    const sum = quality + punctuality + behavior + cleanliness;
    
    if (sum === 0) return 0;
    
    // Calculate average and round to nearest 0.5
    const average = sum / 4;
    return Math.round(average * 2) / 2;
  };

  const handleSubmit = () => {
    const overallRating = calculateOverallRating();
    
    if (overallRating === 0) {
      Alert.alert(
        "Rating Required", 
        "Please rate at least one criteria before submitting your review."
      );
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setRating(overallRating);
      
      // In a real application, you would send the review data to your backend here
      console.log({
        bookingId: booking.bookingId,
        serviceType: booking.serviceType,
        maidName: booking.maidName,
        overallRating: overallRating,
        criteriaRatings: criteriaRatings,
        reviewText: reviewText.trim() || "Great service!",
        timestamp: new Date().toISOString()
      });
    }, 1500);
  };

  if (submitted) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center p-6">
        <LottieView
          source={require("../../assets/lottie/success.json")}
          autoPlay
          loop={false}
          style={{ width: 200, height: 200 }}
        />
        <Text className="text-2xl font-SF-bold text-gray-800 mb-2 text-center">
          Thanks for your review!
        </Text>
        <Text className="text-base text-gray-600 mb-6 text-center">
          Your feedback helps improve our service and assists other customers.
        </Text>
        <View className="flex-row mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= Math.round(rating) ? "star" : "star-outline"}
              size={32}
              color="#FFC107"
              style={{ marginHorizontal: 4 }}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("BookingHistory")}
          className="bg-blue-500 w-full py-4 rounded-xl shadow"
        >
          <Text className="text-white font-SF-bold text-center text-base">
            Back to Bookings
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-4 py-4 shadow-sm mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="mr-3"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-SF-bold text-gray-800">Review Service</Text>
          </View>
        </View>

        {/* Service Info */}
        <View className="bg-white rounded-xl shadow-sm mx-4 p-5 mb-4">
          <View className="flex-row justify-between items-start mb-3">
            <View>
              <Text className="text-xl font-SF-bold text-gray-800">{booking.serviceType}</Text>
              <Text className="text-gray-500 font-SF-medium">{booking.maidName}</Text>
            </View>
            <View>
              <Text className="text-lg font-SF-bold text-gray-800 text-right">{booking.amount}</Text>
            </View>
          </View>
          
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar" size={16} color="#6B7280" style={{ marginRight: 6 }} />
            <Text className="text-gray-600 font-SF-medium text-sm">{booking.serviceDate}</Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#6B7280" style={{ marginRight: 6 }} />
            <Text className="text-gray-600 font-SF-medium text-sm">{booking.time}</Text>
          </View>
        </View>

        {/* Rating Section */}
        <View className="bg-white rounded-xl shadow-sm mx-4 p-5 mb-4">
          <Text className="text-lg font-SF-bold text-gray-800 mb-5">
            Rate Your Experience
          </Text>
          
          {renderCriteriaItem("Quality", "quality")}
          {renderCriteriaItem("Punctuality", "punctuality")}
          {renderCriteriaItem("Behavior", "behavior")}
          {renderCriteriaItem("Cleanliness", "cleanliness")}
          
          <View className="border-t border-gray-200 my-3" />
          
          <View className="flex-row items-center justify-between mt-2 mb-3">
            <Text className="text-gray-700 font-SF-semibold">Overall Rating</Text>
            <Text className="text-2xl font-SF-bold text-yellow-500">
              {calculateOverallRating() > 0 ? calculateOverallRating().toFixed(1) : "--"}
            </Text>
          </View>
        </View>

        {/* Review Text Section */}
        <View className="bg-white rounded-xl shadow-sm mx-4 p-5 mb-6">
          <Text className="text-lg font-SF-bold text-gray-800 mb-3">
            Write Your Review
          </Text>
          
          <View className="bg-gray-50 rounded-xl border border-gray-200 p-2 mb-2">
            <TextInput
              className="text-gray-800 font-SF-regular min-h-24 p-2 text-base"
              placeholder="Share your experience with this service..."
              multiline={true}
              value={reviewText}
              onChangeText={setReviewText}
              textAlignVertical="top"
            />
          </View>
          
          <Text className="text-gray-500 font-SF-regular text-xs italic">
            Your review helps other customers and service providers to improve.
          </Text>
        </View>

        {/* Images Upload Section - commented out for simplicity */}
        {/* <View className="bg-white rounded-xl shadow-sm mx-4 p-5 mb-4">
          <Text className="text-lg font-SF-bold text-gray-800 mb-3">
            Add Photos (Optional)
          </Text>
          
          <View className="flex-row mb-2">
            <TouchableOpacity className="w-20 h-20 bg-gray-100 rounded-md items-center justify-center mr-3 border border-dashed border-gray-300">
              <Ionicons name="add" size={30} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-gray-500 font-SF-regular text-xs italic">
            Add up to 3 photos of the service results.
          </Text>
        </View> */}

        {/* Submit Button */}
        <View className="mx-4 mb-10">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            className={`py-4 rounded-xl shadow ${submitting ? "bg-gray-400" : "bg-blue-500"}`}
          >
            {submitting ? (
              <View className="flex-row items-center justify-center">
                <Text className="text-white font-SF-bold text-base mr-2">
                  Submitting
                </Text>
                {/* In a real app, use ActivityIndicator */}
                <Ionicons name="sync" size={20} color="#FFF" />
              </View>
            ) : (
              <Text className="text-white font-SF-bold text-center text-base">
                Submit Review
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReviewServiceScreen;