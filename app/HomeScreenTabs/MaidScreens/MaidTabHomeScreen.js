import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  SafeAreaView, 
  StatusBar,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const MaidTabHomeScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  const services = [
    {
      id: 1,
      title: 'Book Our Services',
      description: 'Look Maids & Services to Book Instantly',
      image: 'https://img.freepik.com/free-photo/professional-cleaning-service-work_23-2149374373.jpg',
      navigateTo: 'MaidScreen',
      colors: ['#90CAF9', '#3B82F6'],
      textColor: 'white',
      icon: 'calendar-outline'
    },
    {
      id: 2,
      title: 'Not in the List?',
      description: 'Don\'t worry, we listen to you. Tell us about your service requirement.',
      image: 'https://img.freepik.com/free-photo/customer-service-satiSFaction-concept_53876-127243.jpg',
      navigateTo: 'MaidServiceFormScreen',
      colors: ['#90CAF9', '#059669'],
      textColor: 'white',
      icon: 'create-outline'
    },
    {
      id: 3,
      title: 'Already Have a Maid?',
      description: 'Link it to our Portal',
      image: 'https://img.freepik.com/free-photo/close-up-hand-taking-notes_23-2149115087.jpg',
      navigateTo: 'RandomScreen',
      colors: ['#90CAF9', '#D97706'],
      textColor: 'white',
      icon: 'link-outline'
    },
  ];

  const handleCardPress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView className="flex-1 px-5 pt-8">
        {/* Header */}
        <View className="mb-2">
          <Text className="text-3xl text-gray-800 font-SF-bold">
            Hello, What are you Looking Today?
          </Text>
        </View>

        {/* Search Bar (Enhanced) */}
        <View className="flex-row items-center bg-white px-4 py-1 rounded-full shadow-sm border border-gray-100 mb-6">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 font-SF-regular text-gray-700"
            placeholder="Search for services..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Service Cards */}
        <View className="space-y-5 gap-5 mb-10">
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              onPress={() => handleCardPress(service.navigateTo)}
              activeOpacity={0.95}
            >
              {/* Card with image and overlay */}
              <View className="w-full  h-48 relative">
                <Image
                  source={{ uri: service.image }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  className="absolute inset-0"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                
                {/* Service icon in top right corner */}
                <View className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full">
                  <Ionicons name={service.icon} size={22} color={service.colors[0]} />
                </View>
              </View>
              
              {/* Content section with gradient background */}
               <LinearGradient
                            colors={["#2563EB", "rgba(255,255,255,0.8)"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="p-6"
                          >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className={`text-xl ${service.textColor} font-SF-heavy mb-2`}>
                      {service.title}
                    </Text>
                    <Text className={`${service.textColor} text-base font-SF-regular opacity-90 pr-4`}>
                      {service.description}
                    </Text>
                  </View>
                  
                  {/* Arrow icon with circle background */}
                  <View className={`bg-white bg-opacity-20 p-3 rounded-full`}>
                    <Ionicons name="arrow-forward" size={20} color="black" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback Section with Enhanced Design */}
        <View className="py-5  bg--100 px-4 ">
        <TouchableOpacity>
          <Text className="text-center text-gray-600 font-SF-medium">
            Want to help us improve our app? <Text className="text-blue-500 font-SF-heavy">Give Feedback</Text>
          </Text>
        </TouchableOpacity>
      </View>
        
        {/* Extra space at bottom */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MaidTabHomeScreen;