import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import icons

const HomeScreen = () => {
  const services = [
    { name: "Domestic Help", time: "30 mins", price: "₹200/hr" },
    { name: "Baby Sitters", time: "1 hour", price: "₹250/hr" },
    { name: "Cooks", time: "45 mins", price: "₹300/hr" },
    { name: "All Rounders", time: "1 hour", price: "₹350/hr" },
    { name: "24 hrs Full Time", time: "2 hours", price: "₹15000/month" },
  ];

  return (
    <View className="flex-1 bg-white   p-5 " >
      {/* Header */}
      <View className="flex-row items-center pt-5 justify-between">
        {/* User Info */}
        <View className="flex-row mt-2 items-center">
          <View className="w-10 h-10 bg-blue-400 mr-2 rounded-full items-center justify-center">
            <Text className="text-lg text-black font-SF-semibold">U</Text>
          </View>
          <View className="ml-3">
            <Text className="text-lg font-SF-semibold">Hi User! 👋</Text>
            <Text className="text-gray-500 font-SF-light text-sm">Marina Skies, Hyderabad</Text>
          </View>
        </View>
        {/* Profile Icon */}
        <View className="w-10 h-10 mt-2  rounded-full items-center justify-center">
        <Ionicons name="notifications-outline" size={22} color="black" />
          {/* <Text className="text-lg text-black font-SF-semibold">N</Text> */}
        </View>
      </View>

      {/* Search Box */}
      <View className="mt-4">
        <TextInput
          className="bg-gray-100 rounded-full font-SF-light p-4 my-2 text-gray-600"
          placeholder="Search for maids, cooks, cleaners..."
        />
      </View>

      {/* Next Available Maid */}
      <View className="bg-gray-100 p-4 rounded-lg my-4 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-800 font-SF-semibold">Next Available Maid</Text>
          <Text className="text-gray-500 font-SF-light">In 30 minutes</Text>
        </View>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full">
          <Text className="text-white font-SF-semibold">Book Now</Text>
        </TouchableOpacity>
      </View>

      {/* Our Services */}
      <Text className="text-2xl p-1 font-SF-bold mt-6">Our Services</Text>

      {/* Service Cards */}
      <ScrollView className="mt-3 " contentContainerStyle={{ flexDirection: "row", justifyContent:"between",flexWrap: "wrap" }}>
        {services.map((service, index) => (
          <View key={index} className="bg-white shadow-lg p-5 rounded-lg w-[48%] m-1">
            <View className="w-10 h-10  bg-gray-200 items-center justify-center  rounded-full mb-2" ><Text></Text></View>
           
            <Text className="text-gray-900 font-SF-semibold">{service.name}</Text>
            <Text className="text-gray-500 text-sm">Next Available in {service.time}</Text>
            <Text className="text-blue-500 font-SF-semibold">{service.price}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Floating Chatbot */}
      {/* <TouchableOpacity className="absolute bottom-5 right-5">
        <Image source={require("../assets/chatbot.png")} className="w-16 h-16" />
      </TouchableOpacity> */}
    </View>
  );
};

export default HomeScreen;
