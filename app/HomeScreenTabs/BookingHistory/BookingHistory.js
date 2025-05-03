import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";

const BookingHistory = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("all");

  // Hardcoded booking data
  const allBookings = [
    {
      bookingId: "BD-12345",
      serviceType: "Deep Cleaning",
      maidName: "Sarah Johnson",
      amount: "₹2,500",
      paymentStatus: "Service done, bill paid",
      paymentMode: "Credit Card",
      bookingDate: "10 Apr 2025",
      serviceDate: "12 Apr 2025",
      time: "09:00 AM - 12:00 PM",
      address: "42, Sunshine Apartments, Sector 18",
      duration: "3 hours",
      isPast: true
    },
    {
      bookingId: "BD-12346",
      serviceType: "Regular Cleaning",
      maidName: "Rebecca Williams",
      amount: "₹1,800",
      paymentStatus: "Service done, bill pending",
      paymentMode: "Cash",
      bookingDate: "13 Apr 2025",
      serviceDate: "15 Apr 2025",
      time: "02:00 PM - 04:00 PM",
      address: "103, Green Valley, Whitefield",
      duration: "2 hours",
      isPast: true
    },
    {
      bookingId: "BD-12347",
      serviceType: "Laundry Service",
      maidName: "Michael Brown",
      amount: "₹1,200",
      paymentStatus: "Service done, bill paid",
      paymentMode: "Digital Wallet",
      bookingDate: "19 Apr 2025",
      serviceDate: "22 Apr 2025",
      time: "10:00 AM - 11:30 AM",
      address: "78, Silver Oak Residency, HSR Layout",
      duration: "1.5 hours",
      isPast: false
    },
    {
      bookingId: "BD-12348",
      serviceType: "Kitchen Cleaning",
      maidName: "Emily Davis",
      amount: "₹2,200",
      paymentStatus: "Service done, bill pending",
      paymentMode: "Credit Card",
      bookingDate: "22 Apr 2025",
      serviceDate: "25 Apr 2025",
      time: "01:00 PM - 03:00 PM",
      address: "56, Palm Meadows, Koramangala",
      duration: "2 hours",
      isPast: false
    },
    {
      bookingId: "BD-12349",
      serviceType: "Window Cleaning",
      maidName: "James Wilson",
      amount: "₹1,500",
      paymentStatus: "Service done, bill paid",
      paymentMode: "Digital Wallet",
      bookingDate: "25 Apr 2025",
      serviceDate: "28 Apr 2025",
      time: "11:00 AM - 01:00 PM",
      address: "23, Golden Heights, Indiranagar",
      duration: "2 hours",
      isPast: false
    }
  ];

  // Filter bookings based on active tab
  const filteredBookings = [...allBookings]
    .sort((a, b) => {
      // Convert dates to comparable format (assuming format is "DD MMM YYYY")
      const dateA = new Date(a.bookingDate.split(' ').reverse().join(' '));
      const dateB = new Date(b.bookingDate.split(' ').reverse().join(' '));
      // Sort descending (most recent first)
      return dateB - dateA;
    })
    .filter(booking => {
      if (activeTab === "all") return true;
      if (activeTab === "past") return booking.isPast;
      if (activeTab === "upcoming") return !booking.isPast;
      return true;
    });

  const renderTabButton = (tabName, label) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tabName)}
      className={`flex-1 py-2 items-center ${
        activeTab === tabName 
          ? "border-b-2 border-blue-500" 
          : "border-b border-gray-300"
      }`}
    >
      <Text
        className={`text-sm font-SF-medium ${
          activeTab === tabName 
            ? "text-blue-500" 
            : "text-gray-500"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View className="mb-4">
      {/* Top horizontal line with centered booking date */}
      <View className="relative border-t border-gray-300 my-3">
        <View className="absolute top-0 left-0 right-0 flex items-center justify-center -mt-3">
          <View className="bg-gray-100 px-3">
            <Text className="text-gray-600 font-SF-medium text-sm">Booked on: {item.bookingDate}</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity
        onPress={() => navigation.navigate("DetailedHistoryPage", { item })}
        className="bg-white p-4 rounded-lg shadow-lg"
      >
        <View className="flex-row justify-between mb-3">
          <View>
            <Text className="text-lg font-SF-semibold">{item.serviceType}</Text>
            <Text className="text-gray-500 font-SF-regular text-sm">
              {item.maidName}
            </Text>
          </View>
          <View>
            <Text className="text-xl font-SF-semibold text-right">{item.amount}</Text>
            <Text className="text-gray-600 font-SF-regular text-sm text-right">
              {item.paymentMode}
            </Text>
          </View>
        </View>
        
        <View className="mb-3">
          <View className="flex-row items-center mb-1">
            <Ionicons name="calendar-outline" size={14} color="#6B7280" style={{ marginRight: 4 }} />
            <Text className="text-gray-500 font-SF-regular text-sm">Service date: {item.serviceDate}</Text>
          </View>
          <View className="flex-row items-center mb-1">
            <Ionicons name="time-outline" size={14} color="#6B7280" style={{ marginRight: 4 }} />
            <Text className="text-gray-500 font-SF-regular text-sm">{item.time} • {item.duration}</Text>
          </View>
          <View className="flex-row items-start">
            <Ionicons name="location-outline" size={14} color="#6B7280" style={{ marginRight: 4, marginTop: 3 }} />
            <Text className="text-gray-500 font-SF-regular text-sm flex-1">{item.address}</Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-end">
          <View>
            <View 
              className={
                item.paymentStatus === "Service done, bill paid"
                  ? "flex-row items-center bg-green-100 rounded-md px-2 py-1"
                  : "flex-row items-center bg-yellow-100 rounded-md px-2 py-1"
              }
            >
              {item.paymentStatus === "Service done, bill paid" ? (
                <Ionicons name="checkmark-circle" size={14} color="#22C55E" style={{ marginRight: 4 }} />
              ) : (
                <Ionicons name="time" size={14} color="#EAB308" style={{ marginRight: 4 }} />
              )}
              <Text
                className={
                  item.paymentStatus === "Service done, bill paid"
                    ? "text-green-500 font-SF-semibold text-xs"
                    : "text-yellow-500 font-SF-semibold text-xs"
                }
              >
                {item.paymentStatus}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
        </View>
      </TouchableOpacity>
      
      {/* Container for repeat booking that maintains same height whether visible or not */}
      <View className="h-10 flex-row justify-end items-center">
        {item.paymentStatus === "Service done, bill paid" && (
          <TouchableOpacity 
            className="bg-blue-50 px-3 py-1 rounded-md"
            onPress={() => navigation.navigate("BookingScreen", { repeatBooking: item })}
          >
            <Text className="text-blue-500 font-SF-medium text-sm">Repeat booking?</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Bottom horizontal line */}
      <View className="border-t border-gray-300 mt-1" />
    </View>
  );

  if (filteredBookings.length === 0) {
    return (
      <View className="flex-1 bg-gray-100 p-4 items-center justify-center">
        <LottieView
          source={require("../../assets/lottie/no-bookings.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text className="text-gray-500 font-SF-semibold">No {activeTab} bookings found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="font-SF-bold text-xl mb-3">Your Bookings</Text>
      <View className="flex-row mb-4">
        {renderTabButton("all", "All")}
        {renderTabButton("past", "Past")}
        {renderTabButton("upcoming", "Upcoming")}
      </View>
      
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.bookingId.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default BookingHistory;