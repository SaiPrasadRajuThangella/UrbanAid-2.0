import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur"; // Make sure to install this package

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const curatedServices = [
    {
      id: "1",
      title: "UrbanAid Premium",
      description: "High-frequency, full-service domestic help",
      services: [
        "Dishwashing",
        "Clothes washing & drying",
        "Kitchen assistance",
      ],
      image:
        "https://img.freepik.com/free-photo/professional-cleaning-lady-working-kitchen_1098-14212.jpg",
      iconName: "star",
      bgColor: "#4F46E5",
    },
    {
      id: "2",
      title: "UrbanAid Standard",
      description: "Daily balanced support for your home",
      services: [
        "Full house cleaning (1x/day)",
        "Dishwashing",
        "Clothes washing",
      ],
      image:
        "https://img.freepik.com/free-photo/housekeeping-concept-cleaning-service_23-2148234692.jpg",
      iconName: "checkmark-circle",
      bgColor: "#10B981",
    },
    {
      id: "3",
      title: "UrbanAid Flexi",
      description: "Fully customizable services",
      services: ["Pick your services", "Choose frequency", "Flexible timing"],
      image:
        "https://img.freepik.com/free-photo/cleaning-lady-wearing-uniform-gloves-smiling-camera_1098-2536.jpg",
      iconName: "construct",
      bgColor: "#F59E0B",
    },
  ];

  const professionalVideos = [
    {
      id: "1",
      image:
        "https://img.freepik.com/free-photo/spa-wellness-composition-with-towels-aromatic-candles_23-2148302820.jpg",
      title: "SPA for Women",
    },
    {
      id: "2",
      image:
        "https://img.freepik.com/free-photo/cleaning-bathroom-with-disinfectant-spray_23-2148300348.jpg",
      title: "Bathroom Cleaning",
    },
    {
      id: "3",
      image:
        "https://img.freepik.com/free-photo/worker-painting-wall-with-roller_23-2148473478.jpg",
      title: "Wall Panels",
    },
    {
      id: "4",
      image:
        "https://img.freepik.com/free-photo/housekeeping-hotel-worker-cleaning-room_1098-3401.jpg",
      title: "Deep Cleaning",
    },
  ];

  const services = [
    {
      name: "Domestic Help",
      time: "30 mins",
      price: "₹200/hr (Approx)",
      image:
        "https://img.freepik.com/free-photo/cleaning-service-with-professional-equipments_23-2148493004.jpg",
      iconName: "home",
      bgColor: "#4F46E5",
    },
    {
      name: "Cooks",
      time: "45 mins",
      price: "₹300/hr (Approx)",
      image:
        "https://img.freepik.com/free-photo/chef-working-kitchen_1098-12270.jpg",
      iconName: "restaurant",
      bgColor: "#F97316",
    },
    {
      name: "All Rounders",
      time: "1 hour",
      price: "₹350/hr (Approx)",
      image:
        "https://img.freepik.com/free-photo/smiling-cleaners-standing-together_1098-3433.jpg",
      iconName: "people",
      bgColor: "#10B981",
    },
    {
      name: "Baby Sitters",
      time: "1 hour",
      price: "₹250/hr (Approx)",
      image:
        "https://img.freepik.com/free-photo/child-care-nanny-babysitting-concept_1098-4050.jpg",
      iconName: "happy",
      bgColor: "#EC4899",
    },
    {
      name: "24 hrs Full Time",
      time: "2 hours",
      price: "₹15000/month",
      image:
        "https://img.freepik.com/free-photo/housekeeping-hotel-worker-with-cleaning-cart_1098-3402.jpg",
      iconName: "time",
      bgColor: "#8B5CF6",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Search Box */}
      <View className="px-4 py-4 bg-gray-50">
        <View className="flex-row items-center bg-white rounded-full shadow-sm border border-gray-100">
          <Ionicons
            name="search"
            size={20}
            color="#4F46E5"
            style={{ marginLeft: 16, marginRight: 8 }}
          />
          <TextInput
            className="flex-1 py-3 pr-4 font-SF-medium text-gray-700"
            placeholder="Search for maids, cooks, cleaners..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="gray"
          />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="px-4 py-4">
          <View className="rounded-2xl shadow-lg overflow-hidden relative">
          <Image
              source={{ uri: "https://img.freepik.com/free-photo/beautiful-living-room-home-interior-design_23-2150982318.jpg" }}
              className="absolute w-full h-full"
              resizeMode="cover"
            />
            <LinearGradient
              colors={["#2563EB", "rgba(255,255,255,0.8)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6"
            >
              <View className="w-3/4">
                <Text className="text-white font-SF-bold text-xl mb-2">
                  Your home, our expertise
                </Text>
                <Text className="text-white/90 font-SF-medium mb-4">
                  Discover trusted domestic help that transforms your daily life
                </Text>
                <TouchableOpacity className="bg-white rounded-full py-2 px-4 self-start">
                  <Text className="text-sm font-SF-semibold text-blue-600">
                    Book Now
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
        
        
        {/* Our Services Section */}
        <View className="px-4 mt-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-SF-bold text-gray-800">
              Our Services
            </Text>
            <TouchableOpacity>
              <Text className="text-indigo-600 font-SF-medium">View All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            {services.map((service, index) => (
              <TouchableOpacity
                key={index}
                className="w-[48%] bg-white rounded-2xl shadow-md mb-4 overflow-hidden"
                style={{
                  shadowColor: service.bgColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View className="relative">
                  <Image
                    source={{ uri: service.image }}
                    className="w-full h-40 rounded-t-2xl"
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    className="absolute bottom-0 left-0 right-0 h-16"
                  />
                  <View className="absolute top-2 right-2 p-2 rounded-full" style={{ backgroundColor: service.bgColor }}>
                    <Ionicons name={service.iconName} size={18} color="white" />
                  </View>
                </View>
                
                <View className="p-3">
                  <Text className="text-base font-SF-bold text-gray-800">
                    {service.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="time-outline" size={14} color="gray" />
                    <Text className="text-gray-500 font-SF-medium text-xs ml-1">
                      Available in {service.time}
                    </Text>
                  </View>
                  <Text className="text-base font-SF-bold mt-2" style={{ color: service.bgColor }}>
                    {service.price}
                  </Text>
                </View>
                <View className="px-3 pb-3">
                  <TouchableOpacity 
                    className="rounded-full py-2 px-3 items-center"
                    style={{ backgroundColor: `${service.bgColor}15` }}
                  >
                    <Text className="text-xs font-SF-semibold" style={{ color: service.bgColor }}>
                      Book Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Thoughtful Curations */}
        <View className="mt-6 mb-6">
          <View className="px-4 flex-row items-center justify-between mb-4">
            <Text className="text-xl font-SF-bold text-gray-800">
              Thoughtful Curations
            </Text>
            <TouchableOpacity>
              <Text className="text-indigo-600 font-SF-medium">View All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={curatedServices}
            horizontal
            className="p-4"
            // contentContainerStyle={{ paddingLeft: 24, paddingRight: 16 }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                className="bg-white rounded-2xl shadow-md w-72 mr-4 overflow-hidden"
                style={{
                  shadowColor: item.bgColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View className="relative">
                  <Image
                    source={{ uri: item.image }}
                    className="w-full h-40"
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    className="absolute bottom-0 left-0 right-0 h-20"
                  />
                  <View 
                    className="absolute top-3 right-3 rounded-full p-2"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    <Ionicons name={item.iconName} size={18} color="white" />
                  </View>
                  
                  <View className="absolute bottom-0 left-0 right-0 p-3">
                    <Text className="text-white font-SF-bold text-lg">
                      {item.title}
                    </Text>
                  </View>
                </View>
                
                <View className="p-4">
                  <Text className="text-gray-600 font-SF-medium text-sm mb-3">
                    {item.description}
                  </Text>
                  
                  {item.services.map((service, idx) => (
                    <View key={idx} className="flex-row items-center mb-2">
                      <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.bgColor }} />
                      <Text className="text-gray-700 text-sm font-SF-regular">
                        {service}
                      </Text>
                    </View>
                  ))}
                </View>
                
                <View className="px-4 pb-4 mt-auto">
                  <TouchableOpacity 
                    className="py-2 rounded-full items-center"
                    style={{ backgroundColor: `${item.bgColor}15` }}
                  >
                    <Text className="font-SF-semibold" style={{ color: item.bgColor }}>
                      View Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Professionals in Action */}
        <View className="mt-6 mb-6 px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-SF-bold text-gray-800">
              Professionals in Action
            </Text>
            <TouchableOpacity>
              <Text className="text-indigo-600 font-SF-medium">View All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={professionalVideos}
            horizontal
            contentContainerStyle={{ paddingRight: 8 }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity className="mr-4 rounded-2xl overflow-hidden shadow-md">
                <View className="relative">
                  <Image
                    source={{ uri: item.image }}
                    className="w-44 h-64 rounded-2xl"
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    className="absolute bottom-0 left-0 right-0 h-24 rounded-b-2xl"
                  />
                  
                  <View className="absolute inset-0 items-center justify-center">
                    <View className="bg-white/30 rounded-full p-3 backdrop-blur-md">
                      <Ionicons name="play" size={24} color="white" />
                    </View>
                  </View>
                  
                  <View className="absolute bottom-4 left-0 right-0 items-center">
                    <Text className="text-white font-SF-semibold text-base">
                      {item.title}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Special Offers */}
        <View className="mt-6 px-4 mb-24">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-SF-bold text-gray-800">
              Special Offers
            </Text>
          </View>
          
          <LinearGradient
            colors={["#4F46E5", "#fff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <Image
              source={{ uri: "https://img.freepik.com/free-photo/professional-cleaning-service-team-work_23-2149374132.jpg" }}
              className="absolute w-full h-full opacity-10"
              resizeMode="cover"
            />
            
            <View className="p-5">
              <Text className="text-2xl font-SF-bold text-white mb-3">
                Exclusive Offers
              </Text>
              
              <View className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-3">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-white/30 items-center justify-center mr-3">
                    <Text className="text-xl">🎉</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-SF-bold text-base">
                      20% OFF on your first booking
                    </Text>
                    <Text className="text-white/80 text-sm font-SF-medium mt-1">
                      Use code: FIRSTAID20
                    </Text>
                  </View>
                  <TouchableOpacity className="bg-white rounded-full py-1 px-3">
                    <Text className="text-xs font-SF-semibold text-indigo-600">
                      Apply
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-white/30 items-center justify-center mr-3">
                    <Text className="text-xl">🌟</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-SF-bold text-base">
                      Refer a friend, Get ₹500 Credit
                    </Text>
                    <Text className="text-white/80 text-sm font-SF-medium mt-1">
                      Share the UrbanAid experience
                    </Text>
                  </View>
                  <TouchableOpacity className="bg-white rounded-full py-1 px-3">
                    <Text className="text-xs font-SF-semibold text-indigo-600">
                      Share
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>



      {/* Floating Chatbot */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-indigo-600 rounded-full p-4 shadow-xl">
        <Ionicons name="chatbubble-ellipses" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;