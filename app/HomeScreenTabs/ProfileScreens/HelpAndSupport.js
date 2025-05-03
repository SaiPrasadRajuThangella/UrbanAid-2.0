import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  SafeAreaView,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";

const HelpAndSupportScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketDescription, setTicketDescription] = useState("");
  const [expandedFaqs, setExpandedFaqs] = useState({});

  // List of support categories
  const categories = [
    {
      id: "booking",
      icon: "calendar",
      title: "Booking Issues",
      description: "Help with scheduling, cancellations, and modifications",
    },
    {
      id: "payment",
      icon: "card",
      title: "Payment Problems",
      description: "Assistance with payments, refunds, and invoices",
    },
    {
      id: "service",
      icon: "people",
      title: "Service Quality",
      description: "Issues with maid services or service quality",
    },
    {
      id: "account",
      icon: "person-circle",
      title: "Account Management",
      description: "Help with profile, settings, and account details",
    },
    {
      id: "technical",
      icon: "bug",
      title: "Technical Support",
      description: "App functionality issues and technical problems",
    },
  ];

  // Sample FAQ data
  const faqData = {
    booking: [
      {
        question: "How do I book a maid service?",
        answer:
          "Navigate to the main screen, select a maid from the list, customize your service needs, choose your preferred date and time, and complete the booking by adding it to the cart and confirming payment.",
      },
      {
        question: "Can I reschedule my booking?",
        answer:
          "Yes, you can reschedule a booking by going to your upcoming bookings, selecting the booking you wish to change, and tapping on 'Reschedule'. Follow the prompts to select a new date and time.",
      },
      {
        question: "How do I cancel a booking?",
        answer:
          "To cancel a booking, go to your upcoming bookings, select the booking you wish to cancel, and tap on 'Cancel Booking'. Please note our cancellation policy may apply depending on how close to the service time you cancel.",
      },
    ],
    payment: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept credit/debit cards, mobile wallets, UPI payments, and net banking. All payments are processed securely through our payment gateway.",
      },
      {
        question: "How do I request a refund?",
        answer:
          "For refund requests, please go to the booking in your history, select 'Request Refund', and follow the instructions. Refunds are processed according to our refund policy.",
      },
      {
        question: "I was charged incorrectly. What should I do?",
        answer:
          "If you believe you were charged incorrectly, please contact our support team immediately by raising a ticket with details of the booking and the payment issue.",
      },
    ],
    service: [
      {
        question: "What if I'm not satisfied with the service?",
        answer:
          "We strive for customer satisfaction. If you're not happy with the service provided, please rate the service and provide feedback. You can also contact our support team to address any specific concerns.",
      },
      {
        question: "Can I request the same maid for future bookings?",
        answer:
          "Yes, you can add a maid to your favorites list by tapping the heart icon on their profile. When booking, you can select from your favorites or specifically request that maid if they're available.",
      },
      {
        question: "What services are included in the basic package?",
        answer:
          "The basic package includes standard cleaning of specified areas, including dusting, sweeping, mopping, and bathroom cleaning. Additional services like cooking, laundry, and specialized cleaning can be added during booking customization.",
      },
    ],
    account: [
      {
        question: "How do I update my profile information?",
        answer:
          "Go to the Profile screen, tap on 'Edit Profile', update your information, and save the changes.",
      },
      {
        question: "How do I change my password?",
        answer:
          "Go to Profile > Account Settings > Security > Change Password. You'll need to enter your current password and then set a new one.",
      },
      {
        question: "Can I have multiple addresses saved in my account?",
        answer:
          "Yes, you can add and manage multiple addresses by going to Profile > Addresses. You can add new addresses, edit existing ones, and set a default address for your bookings.",
      },
    ],
    technical: [
      {
        question: "The app keeps crashing. What should I do?",
        answer:
          "First, try closing and reopening the app. If that doesn't work, try restarting your device. If the issue persists, try clearing the app cache from Profile > Clear Cache. If none of these solutions work, please contact our technical support team.",
      },
      {
        question: "How do I update the app?",
        answer:
          "The app should update automatically through your device's app store. If not, open the App Store (iOS) or Play Store (Android), search for our app, and tap 'Update' if available.",
      },
      {
        question: "Why can't I see my booking history?",
        answer:
          "Make sure you're logged in with the correct account. If you still can't see your history, try pulling down to refresh the screen. If the problem persists, try clearing the app cache or contact our support team.",
      },
    ],
  };

  // Contact channels
  const contactOptions = [
    {
      id: "phone",
      icon: "call",
      title: "Call Us",
      description: "Speak directly with our customer support team",
      action: "1-800-MAID-SERVICE",
      actionType: "phone",
    },
    {
      id: "email",
      icon: "mail",
      title: "Email Support",
      description: "Send us an email, we'll respond within 24 hours",
      action: "support@maidservice.com",
      actionType: "email",
    },
    {
      id: "chat",
      icon: "chatbubble-ellipses",
      title: "Live Chat",
      description: "Chat with a support agent in real-time",
      action: "Start Chat",
      actionType: "button",
    },
    {
      id: "whatsapp",
      icon: "logo-whatsapp",
      title: "WhatsApp",
      description: "Message us on WhatsApp for quick assistance",
      action: "+1-234-567-8900",
      actionType: "whatsapp",
    },
  ];

  // Toggle FAQ expansion
  const toggleFaq = (faqId) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [faqId]: !prev[faqId],
    }));
  };

  // Submit support ticket
  const submitTicket = () => {
    if (ticketDescription.trim().length === 0) return;
    
    // Here you would normally send the ticket to your backend
    console.log("Submitting ticket:", {
      category: selectedCategory,
      description: ticketDescription,
    });
    
    setTicketSubmitted(true);
    setTimeout(() => {
      setModalVisible(false);
      setTicketSubmitted(false);
      setTicketDescription("");
      setSelectedCategory(null);
    }, 2000);
  };

  // Render FAQ item
  const renderFaqItem = ({ item, index }) => {
    const faqId = `${selectedCategory}-${index}`;
    const isExpanded = expandedFaqs[faqId];
    
    return (
      <TouchableOpacity
        className="border-b border-gray-200 py-3"
        onPress={() => toggleFaq(faqId)}
      >
        <View className="flex-row justify-between items-center">
          <Text className="font-SF-semibold text-gray-800 flex-1 pr-2">
            {item.question}
          </Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4B5563"
          />
        </View>
        
        {isExpanded && (
          <Text className="mt-2 text-gray-600 font-SF-regular text-sm">
            {item.answer}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-SF-bold text-gray-800">
              Help & Support
            </Text>
            <Text className="text-gray-500 font-SF-regular mt-1">
              How can we assist you today?
            </Text>
          </View>

          {/* Search */}
          <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-6">
            <Ionicons name="search-outline" size={20} color="gray" />
            <TextInput
              className="ml-2 flex-1 font-SF-light rounded-full text-gray-800"
              placeholder="Search for help"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Help Categories */}
          <Text className="font-SF-medium text-lg text-gray-800 mb-3">
            Select a Topic
          </Text>
          
          <View className="mb-6">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="flex-row items-center p-3 border-b border-gray-100"
                onPress={() => setSelectedCategory(category.id)}
              >
                <View className="bg-blue-100 p-2 rounded-full mr-3">
                  <Ionicons name={category.icon} size={22} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="font-SF-semibold text-gray-800">
                    {category.title}
                  </Text>
                  <Text className="text-gray-500 text-sm font-SF-light">
                    {category.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
              </TouchableOpacity>
            ))}
          </View>

          {/* FAQs Section - Shown when a category is selected */}
          {selectedCategory && (
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="font-SF-bold text-lg text-blue-500">
                  Frequently Asked Questions
                </Text>
                <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                  <Text className="text-blue-500 font-SF-regular text-sm">
                    Back to Topics
                  </Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={faqData[selectedCategory]}
                renderItem={renderFaqItem}
                keyExtractor={(item, index) => `faq-${index}`}
                scrollEnabled={false}
              />
              
              <TouchableOpacity
                className="mt-4 bg-blue-500 py-3 rounded-lg"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-white text-center font-SF-medium">
                  Didn't find what you're looking for? Submit a ticket
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Contact Us Section */}
          <View className="mb-6">
            <Text className="font-SF-bold text-lg text-gray-800 mb-3">
              Contact Us
            </Text>
            
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                className="flex-row items-center p-3 border-b border-gray-100"
              >
                <View className="bg-blue-100 p-2 rounded-full mr-3">
                  <Ionicons name={option.icon} size={22} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="font-SF-semibold text-gray-800">
                    {option.title}
                  </Text>
                  <Text className="text-gray-500 text-sm font-SF-light">
                    {option.description}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text className="text-blue-500 font-SF-medium">
                    {option.action}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Submit a Ticket Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-SF-bold text-gray-800">
                Submit a Support Ticket
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            {ticketSubmitted ? (
              // Success message
              <View className="items-center py-6">
                <LottieView
                  source={require("../MaidScreens/Animation - 1741084319116.json")} // You'll need to add this animation
                  autoPlay
                  loop={false}
                  style={{ width: 120, height: 120 }}
                />
                <Text className="text-lg font-SF-semibold text-green-600 mt-4">
                  Ticket Submitted Successfully!
                </Text>
                <Text className="text-gray-500 text-center mt-2">
                  We'll get back to you as soon as possible.
                </Text>
              </View>
            ) : (
              // Ticket form
              <>
                <View className="mb-4">
                  <Text className="font-SF-medium text-gray-700 mb-2">
                    Issue Category
                  </Text>
                  <View className="flex-row flex-wrap">
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        className={`mr-2 mb-2 px-3 py-1 rounded-full border ${
                          selectedCategory === category.id
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                        onPress={() => setSelectedCategory(category.id)}
                      >
                        <Text
                          className={`text-sm ${
                            selectedCategory === category.id
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          {category.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="font-SF-medium text-gray-700 mb-2">
                    Describe your issue
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 min-h-32 text-gray-800"
                    placeholder="Please provide details about your issue..."
                    multiline
                    value={ticketDescription}
                    onChangeText={setTicketDescription}
                  />
                </View>

                <TouchableOpacity
                  className="bg-blue-500 py-3 rounded-lg"
                  onPress={submitTicket}
                >
                  <Text className="text-white text-center font-SF-medium">
                    Submit
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HelpAndSupportScreen;