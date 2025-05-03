import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const MaidProfileScreen = ({ navigation }) => {
  const route = useRoute();
  const maid = route.params?.maid || {
    name: "Priya Sharma",
    imageURI: "https://example.com/maid.jpg",
    rating: "4.5",
    reviews: "127",
    experience: "3",
    availability: "Full Time",
    location: "Koregaon Park, Pune",
    distance: "2.5", // Added calculated proximity
    religion: "Hindu",
    language: ["English", "Hindi", "Tamil"], // Changed to match the data structure from allMaids
    job: ["Cooking", "Deep Cleaning"], // Changed to match the data structure from allMaids
    note: "I am a professional maid with experience in cooking, cleaning, and childcare.",
    // Sample reviews for UI display
    reviewsList: [
      {
        id: 1,
        user: "Amit Kumar",
        rating: 5,
        comment:
          "Very professional and excellent cooking skills. Highly recommended!",
        date: "12 Mar 2025",
      },
      {
        id: 2,
        user: "Sneha Patel",
        rating: 4,
        comment:
          "Good at cleaning and punctual. Communication could be better.",
        date: "28 Feb 2025",
      },
    ],
  };

  // Handle continue to book service
  const handleBookService = () => {
    // Navigate to MaidBookingScreen with maid data
    navigation.navigate("MaidBookingScreen", { maid });
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Profile Header */}
      <View className="items-center pt-10">
        <View className="relative">
          <Image
            source={{ uri: maid.imageURI }}
            className="w-40 h-40 mt-10 rounded-full"
          />
          <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full">
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text className="text-xl font-SF-bold mt-4">{maid.name}</Text>

        {/* NEW: Concise 2-line summary as recommended */}
        <View className="items-center mt-2">
          <View className="flex-row items-center">
            <Text className="text-gray-700 font-SF-semibold">
              {maid.experience} years Experience | {maid.rating} ⭐
            </Text>
            <Text
              className={`ml-2 px-2 py-0.5 mt-1 rounded-full ${
                maid.verified
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-200 text-gray-600"
              } font-SF-medium text-xs`}
            >
              {maid.verified ? (
                <View className="items-center flex-row gap-2 ">
                  <Ionicons name="shield-checkmark" size={12} color="green" />
                  <Text className="font-SF-regular text-green-800">Verified</Text>
                </View >
              ) : (
                <View className="items-center flex-row gap-2">
                  <Ionicons name="alert-circle" size={12} color="gray" />
                  <Text className="font-SF-regular text-gray-800">Not Verified</Text>
                </View>
              )}
            </Text>
          </View>
          <Text className="text-gray-600 font-SF-medium mt-1">
            Specializes in: {(maid.job || []).join(", ")}
          </Text>
        </View>

        {/* Tags */}
        <View className="flex-row mt-3">
          <Text className="px-3 py-1 bg-blue-100 text-blue-600 font-SF-semibold rounded-full mr-2">
            {maid.experience} years+
          </Text>
          <Text className="px-3 py-1 bg-purple-200 font-SF-semibold text-purple-600 rounded-full">
            {maid.availability}
          </Text>
        </View>

        {/* Roles */}
        <View className="flex-row flex-wrap justify-center mt-3">
          {(maid.job || []).map((role, index) => (
            <Text
              key={index}
              className="px-3 py-1 bg-gray-200 text-gray-600 font-SF-regular rounded-full m-1"
            >
              {role}
            </Text>
          ))}
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-between px-4 py-6 mt-6">
        <TouchableOpacity className="px-6 py-2 bg-blue-300 rounded-lg">
          <Text className="font-SF-medium">Basic Details</Text>
        </TouchableOpacity>
        <TouchableOpacity className="px-6 py-2 bg-gray-100">
          <Text className="font-SF-regular">Work Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity className="px-6 py-2 bg-gray-100">
          <Text className="font-SF-regular">Contact</Text>
        </TouchableOpacity>
      </View>

      {/* Basic Details Section */}
      <View className="p-6">
        {/* NEW: Languages moved higher as recommended */}
        <View className="mb-4 flex-row justify-between my-4 items-center">
          <Text className="text-gray-600 font-SF-semibold">🗣 Languages</Text>
          <View className="flex-row">
            {(maid.languages || maid.language || []).map((lang, index) => (
              <Text
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-600 font-SF-regular rounded-full ml-2"
              >
                {lang}
              </Text>
            ))}
          </View>
        </View>
        <View className="flex-1 h-[1px] bg-gray-200" />

        {/* NEW: Location with proximity instead of just location */}
        <View className="flex-row justify-between my-4">
          <Text className="text-gray-600 font-SF-semibold">📍 Location</Text>
          <View>
            <Text className="text-gray-800 font-SF-regular">
              {maid.location}
            </Text>
            <Text className="text-gray-500 font-SF-regular text-right">
              Approx. {maid.distance} km from your community
            </Text>
          </View>
        </View>
        <View className="flex-1 h-[1px] bg-gray-200" />

        <View className="mb-4 flex-row justify-between my-4">
          <Text className="text-gray-600 font-SF-semibold">🙏 Religion</Text>
          <Text className="text-gray-800 font-SF-regular">{maid.religion}</Text>
        </View>
        <View className="flex-1 h-[1px] bg-gray-200" />

        {/* Skills & Services */}
        <Text className="text-xl font-SF-bold mt-6 my-6">
          Skills & Services
        </Text>

        {/* Cleaning Services */}
        <Text className="text-gray-800 font-SF-semibold">
          🧹 Cleaning Services
        </Text>
        <View className="flex-row flex-wrap mt-2">
          {["Brooming", "Mopping", "Dusting", "Deep Cleaning"].map(
            (service, index) => (
              <Text
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-600 font-SF-regular rounded-full mr-2 mb-2"
              >
                {service}
              </Text>
            )
          )}
        </View>

        {/* Kitchen Services */}
        <Text className="text-gray-800 font-SF-semibold mt-4">
          🍳 Kitchen Services
        </Text>
        <View className="flex-row flex-wrap mt-2">
          {["Dishwashing", "Cooking", "Kitchen Cleaning", "Kitchen Helper"].map(
            (service, index) => (
              <Text
                key={index}
                className="px-3 py-1 bg-red-100 text-red-600 font-SF-regular rounded-full mr-2 mb-2"
              >
                {service}
              </Text>
            )
          )}
        </View>

        {/* Laundry Services */}
        <Text className="text-gray-800 font-SF-semibold mt-4">
          🧺 Laundry Services
        </Text>
        <View className="flex-row flex-wrap mt-2">
          {["Washing Machine Operation", "Ironing", "Folding"].map(
            (service, index) => (
              <Text
                key={index}
                className="px-3 py-1 bg-purple-100 font-SF-regular text-purple-600 rounded-full mr-2 mb-2"
              >
                {service}
              </Text>
            )
          )}
        </View>

        {/* Additional Services */}
        <Text className="text-gray-800 font-SF-semibold mt-4">
          👩‍👧 Additional Services
        </Text>
        <View className="flex-row flex-wrap mt-2">
          {["Baby Sitting", "Pet Care", "Elderly Care"].map(
            (service, index) => (
              <Text
                key={index}
                className="px-3 py-1 font-SF-regular bg-green-100 text-green-600 rounded-full mr-2 mb-2"
              >
                {service}
              </Text>
            )
          )}
        </View>

        {/* NEW: Reviews section added before Notes as recommended */}
        <View className="mt-6">
          <Text className="text-xl font-SF-bold mb-4">Reviews</Text>
          <View className="flex-row items-center mb-4">
            <FontAwesome name="star" size={18} color="#FFC107" />
            <Text className="text-gray-700 font-SF-semibold ml-2 text-lg">
              {maid.rating}
            </Text>
            <Text className="text-gray-600 ml-2">
              ({maid.reviews || 0} reviews)
            </Text>
          </View>

          {(maid.reviewsList || []).map((review) => (
            <View key={review.id} className="bg-gray-50 p-4 rounded-lg mb-3">
              <View className="flex-row justify-between">
                <Text className="font-SF-semibold text-gray-800">
                  {review.user}
                </Text>
                <Text className="text-gray-500 font-SF-regular">
                  {review.date}
                </Text>
              </View>
              <View className="flex-row my-1">
                {[...Array(5)].map((_, i) => (
                  <FontAwesome
                    key={i}
                    name="star"
                    size={14}
                    color={i < review.rating ? "#FFC107" : "#E0E0E0"}
                    style={{ marginRight: 2 }}
                  />
                ))}
              </View>
              <Text className="font-SF-regular text-gray-700 mt-1">
                {review.comment}
              </Text>
            </View>
          ))}

          <TouchableOpacity className="mt-2">
            <Text className="text-blue-500 font-SF-semibold">
              See all reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notes now appears after Reviews */}
        <View className="mt-4 bg-white p-4 mb-4 rounded-xl shadow-md">
          <Text className="text-lg font-SF-bold mb-2 text-gray-800">Notes</Text>
          <Text className="font-SF-regular">"{maid.note}"</Text>
        </View>
      </View>
      <View className="px-5">
        <TouchableOpacity
          onPress={handleBookService}
          className="bg-blue-500 p-5 rounded-lg mb-10"
        >
          <Text className="text-white text-center font-SF-semibold">
            Continue to book the service
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MaidProfileScreen;
