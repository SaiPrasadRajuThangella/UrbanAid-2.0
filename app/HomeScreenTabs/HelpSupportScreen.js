import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Linking } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const HelpSupportScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { booking } = route.params;

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Common support issues
  const supportIssues = [
    {
      id: 1,
      title: "Service Quality Issue",
      icon: "alert-circle-outline",
      description: "Report problems with service quality, incomplete work, or damage"
    },
    {
      id: 2,
      title: "Billing & Payment",
      icon: "card-outline",
      description: "Questions about charges, payment methods, refunds, or receipts"
    },
    {
      id: 3,
      title: "Booking Modifications",
      icon: "calendar-outline",
      description: "Help with changing service details, date, time, or address"
    },
    {
      id: 4,
      title: "Service Provider Issues",
      icon: "person-outline",
      description: "Report problems with behavior, tardiness, or no-shows"
    },
    {
      id: 5,
      title: "Technical Problems",
      icon: "build-outline",
      description: "Issues with the app, website, or account"
    },
    {
      id: 6,
      title: "Service Suggestions",
      icon: "bulb-outline",
      description: "Provide feedback or suggestions for service improvement"
    }
  ];

  // Filter issues based on search query
  const filteredIssues = supportIssues.filter(
    issue => issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             issue.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // FAQs for the help section
  const faqs = [
    {
      question: "How can I reschedule my booking?",
      answer: "You can reschedule your booking up to 12 hours before the scheduled service time. Go to the booking details page and tap on 'Reschedule' to select a new date and time.",
    },
    {
      question: "What's your cancellation policy?",
      answer: "Free cancellation is available up to 24 hours before the scheduled service. For cancellations less than 24 hours before the service, a cancellation fee of 20% applies.",
    },
    {
      question: "How do I report an issue with a service?",
      answer: "If you have an issue with a completed service, you can report it within 48 hours. Go to your booking details page and select 'Report Issue' to provide details about the problem.",
    },
    {
      question: "When will I get a refund for a cancelled service?",
      answer: "Refunds for eligible cancellations are processed within 5-7 business days and will be returned to your original payment method.",
    },
    {
      question: "How do I contact my service provider directly?",
      answer: "You can call or message your service provider directly from the booking details page by clicking on the 'Call' or 'Message' buttons in the Service Provider section."
    }
  ];

  const handleSubmitIssue = () => {
    if (!selectedIssue) {
      alert("Please select an issue type");
      return;
    }

    if (!message.trim()) {
      alert("Please provide details about your issue");
      return;
    }

    // In a real app, this would send the support request to a backend
    alert("Your support request has been submitted. We'll get back to you within 24 hours.");
    
    // Reset form and navigate back
    setSelectedIssue(null);
    setMessage("");
    navigation.goBack();
  };

  const handleCall = () => {
    // In a real app, this would use the Linking API to make a phone call
    // Linking.openURL('tel:+18005551234');
    alert("Calling customer support at +1-800-555-1234");
  };

  const handleChat = () => {
    // In a real app, this would navigate to a chat interface
    navigation.navigate("LiveChatScreen", { booking });
  };

  const renderFAQItem = (item, index) => (
    <View 
      key={index} 
      className="bg-white rounded-xl shadow-sm mb-3 overflow-hidden"
    >
      <TouchableOpacity 
        className="p-4"
        onPress={() => {
          // In a real app, this could expand to show the answer
          alert(item.answer);
        }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-gray-800 font-SF-semibold">{item.question}</Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#2563EB" />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 p-4">
        {/* Header with back button */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-SF-bold text-gray-800">Help & Support</Text>
        </View>

        {/* Search input */}
        <View className="bg-white rounded-xl shadow-sm px-4 py-3 mb-4 flex-row items-center">
          <Ionicons name="search-outline" size={18} color="#6B7280" className="mr-2" />
          <TextInput
            className="flex-1 font-SF-regular text-gray-800 ml-2"
            placeholder="Search for help topics..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Booking reference card */}
        {booking && (
          <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <Text className="text-gray-500 font-SF-regular text-sm mb-1">Reference Booking</Text>
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-gray-800 font-SF-semibold">{booking.serviceType}</Text>
                <Text className="text-gray-500 font-SF-regular text-sm">
                  {booking.bookingId} • {booking.serviceDate}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => navigation.navigate("DetailedHistoryPage", { item: booking })}
                className="bg-gray-100 p-2 rounded-full"
              >
                <Ionicons name="open-outline" size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Contact options */}
        <View className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <Text className="text-lg font-SF-bold text-gray-800 mb-3">Contact Us</Text>
          
          <View className="flex-row mb-3">
            <TouchableOpacity 
              onPress={handleCall}
              className="flex-1 bg-blue-500 rounded-xl mr-2 p-4 items-center shadow"
            >
              <View className="bg-blue-600 p-2 rounded-full mb-2">
                <Ionicons name="call-outline" size={20} color="#FFFFFF" />
              </View>
              <Text className="text-white font-SF-semibold">Call Support</Text>
              <Text className="text-blue-100 text-xs text-center">24/7 Helpline</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleChat}
              className="flex-1 bg-blue-500 rounded-xl ml-2 p-4 items-center shadow"
            >
              <View className="bg-blue-600 p-2 rounded-full mb-2">
                <Ionicons name="chatbubbles-outline" size={20} color="#FFFFFF" />
              </View>
              <Text className="text-white font-SF-semibold">Live Chat</Text>
              <Text className="text-blue-100 text-xs text-center">Avg. response 5 min</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            onPress={() => Linking.openURL('mailto:support@example.com')}
            className="flex-row items-center p-3 bg-gray-50 rounded-xl"
          >
            <Ionicons name="mail-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />
            <View className="flex-1">
              <Text className="text-gray-800 font-SF-medium">Email Support</Text>
              <Text className="text-gray-500 text-xs">support@example.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Report an issue section */}
        <View className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <Text className="text-lg font-SF-bold text-gray-800 mb-3">Report an Issue</Text>
          
          <Text className="text-gray-600 font-SF-regular mb-3">Please select the type of issue you're experiencing:</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {filteredIssues.map((issue) => (
              <TouchableOpacity 
                key={issue.id}
                onPress={() => setSelectedIssue(issue.id)}
                className={`mr-3 p-3 rounded-xl w-32 shadow ${
                  selectedIssue === issue.id ? "bg-blue-500" : "bg-white"
                }`}
              >
                <View className={`${
                  selectedIssue === issue.id ? "bg-blue-600" : "bg-blue-50"
                } p-2 rounded-full w-10 h-10 items-center justify-center mb-2`}>
                  <Ionicons 
                    name={issue.icon} 
                    size={20} 
                    color={selectedIssue === issue.id ? "#FFFFFF" : "#2563EB"} 
                  />
                </View>
                <Text className={`font-SF-semibold text-sm ${
                  selectedIssue === issue.id ? "text-white" : "text-gray-800"
                }`}>
                  {issue.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View className="bg-gray-50 rounded-xl border border-gray-200 p-2 mb-4">
            <TextInput
              className="text-gray-800 font-SF-regular min-h-24 p-2"
              placeholder="Please describe your issue in detail..."
              multiline={true}
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
            />
          </View>
          
          <TouchableOpacity
            onPress={handleSubmitIssue}
            className="bg-blue-500 rounded-xl py-4 px-4 flex-row items-center justify-center shadow"
          >
            <View className="bg-blue-600 p-2 rounded-full mr-3">
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </View>
            <Text className="text-white font-SF-semibold text-base">Submit Issue</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ section */}
        <View className="bg-white rounded-xl shadow-lg p-4 mb-10">
          <Text className="text-lg font-SF-bold text-gray-800 mb-3">Frequently Asked Questions</Text>
          
          {faqs.map((faq, index) => renderFAQItem(faq, index))}
          
          <TouchableOpacity
            onPress={() => navigation.navigate("AllFAQsScreen")}
            className="mt-2 flex-row items-center justify-center"
          >
            <Text className="text-blue-600 font-SF-semibold mr-1">View all FAQs</Text>
            <Ionicons name="chevron-forward" size={16} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen;