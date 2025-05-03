import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const { height } = Dimensions.get('window');

// Constants for API
const API_BASE_URL = "http://192.168.0.123:8765";
const AUTH_TOKEN = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzc3Nzc3NnQGdtYWlsLmNvbSIsImV4cCI6MTc0NTQwMjkyOH0.HOWw7tLQF8RMMUTMkyt5Lry_YPRXnF6AmJOuwAJbLBEES1dB0dbQXSluRW0210XH";

const AddCommunityScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { location, fullAddress, onAddCommunity } = route.params;

  // Form state - simplified
  const [communityName, setCommunityName] = useState('');
  const [buildingType, setBuildingType] = useState('Apartment');
  const [totalTowers, setTotalTowers] = useState(''); // Now optional
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const lottieRef = useRef(null);

  // Extract address components for API payload
  useEffect(() => {
    // Try to extract zip code from fullAddress if available
    const addressParts = fullAddress.split(',');
    const possibleZipCode = addressParts.find(part => 
      part.trim().match(/^\d{5,6}$/)
    );
    
    if (possibleZipCode) {
      setZipCode(possibleZipCode.trim());
    }
  }, [fullAddress]);

  // Building types
  const buildingTypes = ['Apartment', 'Villa', 'Townhouse'];

  // Validate form - simplified
  const validateForm = () => {
    if (!communityName.trim()) {
      Alert.alert('Error', 'Please enter community name');
      return false;
    }
    if (!zipCode.trim()) {
      Alert.alert('Error', 'Please enter zip code');
      return false;
    }
    return true;
  };

  // Prepare address components from fullAddress
  const extractAddressComponents = () => {
    // Default values
    let city = "Hyderabad";
    let state = "Telangana";
    let country = "India";
    let address = fullAddress;

    // Try to extract from fullAddress if possible
    const addressParts = fullAddress.split(',').map(part => part.trim());
    
    // Find city, state, country if available in the address
    addressParts.forEach(part => {
      if (part.toLowerCase().includes('hyderabad')) {
        city = "Hyderabad";
      } else if (part.toLowerCase().includes('telangana')) {
        state = "Telangana";
      } else if (part.toLowerCase().includes('india')) {
        country = "India";
      }
    });

    return {
      address,
      city,
      state,
      country,
      pincode: zipCode || "500006" // Use entered zipCode or default
    };
  };

  // Handle submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      setError(null);
      
      try {
        // Extract address components
        const addressComponents = extractAddressComponents();
        
        // Create payload for API - simplified
        const payload = {
          name: communityName,
          address: addressComponents.address,
          city: addressComponents.city,
          state: addressComponents.state,
          country: addressComponents.country,
          pincode: addressComponents.pincode,
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
          // Additional properties for our app (simplified)
          buildingType,
          totalTowers: totalTowers || "1", // Default to 1 if not provided
          // Removed totalUnits and amenities
        };

        // Make API call
        const response = await axios.post(
          `${API_BASE_URL}/communities`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${AUTH_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Check if response is successful
        if (response.data && response.data.status === "success") {
          // Show success animation for a moment
          setTimeout(() => {
            // Format the community object for our app's state
            const newCommunity = {
              id: response.data.data.id || Date.now(), // Use server ID or generate temp one
              name: communityName,
              buildingType,
              totalTowers: totalTowers || "1",
              address: addressComponents.address,
              city: addressComponents.city,
              state: addressComponents.state,
              country: addressComponents.country,
              pincode: addressComponents.pincode,
              latitude: location.latitude,
              longitude: location.longitude,
              isNewlyAdded: true
            };
            
            // Call the callback to add community to parent screen
            onAddCommunity(newCommunity);
            
            // Navigate back
            navigation.goBack();
          }, 2000); // Show animation for 2 seconds
        } else {
          // Handle API success but with error status
          throw new Error(response.data.message || "Failed to add community");
        }
      } catch (err) {
        console.error("Error adding community:", err);
        setError(err.message || "Failed to add your community. Please try again.");
        setLoading(false);
        Alert.alert(
          "Error",
          "Failed to add your community. Please try again later."
        );
      }
    }
  };

  // Render building type options
  const renderBuildingTypeOptions = () => {
    return (
      <View className="flex-row flex-wrap">
        {buildingTypes.map((type) => (
          <TouchableOpacity
            key={type}
            className={`mr-3 mb-2 px-4 py-2 rounded-full ${
              buildingType === type ? 'bg-blue-500' : 'bg-gray-200'
            }`}
            onPress={() => setBuildingType(type)}
          >
            <Text
              className={`font-SF-medium ${
                buildingType === type ? 'text-white' : 'text-gray-700'
              }`}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      {loading ? (
        // Loading animation
        <View className="flex-1 items-center justify-center bg-white">
          <LottieView
            ref={lottieRef}
            source={require('../assets/animations/community-add-success.json')}
            autoPlay
            loop={false}
            style={{ width: 250, height: 250 }}
          />
          <Text className="text-gray-700 text-xl font-SF-semibold mt-4">
            Adding your community...
          </Text>
          <Text className="text-gray-500 text-sm font-SF-regular mt-2 px-10 text-center">
            We're adding your community to Urban Aid
          </Text>
        </View>
      ) : (
        <>
          {/* Header */}
          <View className="flex-row items-center px-5 py-4 border-b border-gray-200">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-lg font-SF-bold text-gray-800 ml-4">
              Add Your Community
            </Text>
          </View>

          <ScrollView className="flex-1 p-5">
            {/* Community Information */}
            <View className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <Text className="text-blue-700 font-SF-semibold text-base mb-1">
                Current Location
              </Text>
              <Text className="text-gray-600 font-SF-regular text-sm">
                {fullAddress}
              </Text>
            </View>

            {/* Error message if any */}
            {error && (
              <View className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
                <View className="flex-row items-center">
                  <Ionicons name="alert-circle" size={22} color="#EF4444" />
                  <Text className="text-red-700 font-SF-semibold text-base ml-2">
                    Error
                  </Text>
                </View>
                <Text className="text-gray-600 font-SF-regular text-sm mt-1">
                  {error}
                </Text>
              </View>
            )}

            {/* Form Fields - simplified */}
            <View className="mb-5">
              <Text className="text-gray-700 font-SF-semibold mb-1">
                Community Name*
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base font-SF-regular"
                placeholder="Enter community name"
                value={communityName}
                onChangeText={setCommunityName}
              />
            </View>

            <View className="mb-5">
              <Text className="text-gray-700 font-SF-semibold mb-2">
                Building Type
              </Text>
              {renderBuildingTypeOptions()}
            </View>

            <View className="mb-5">
              <Text className="text-gray-700 font-SF-semibold mb-1">
                Tower/Block (Optional)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base font-SF-regular"
                placeholder="Enter number of towers or blocks"
                value={totalTowers}
                onChangeText={setTotalTowers}
                keyboardType="numeric"
              />
            </View>

            <View className="mb-5">
              <Text className="text-gray-700 font-SF-semibold mb-1">
                Zip Code*
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base font-SF-regular"
                placeholder="Enter zip code"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
              />
            </View>

            <View className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-20">
              <View className="flex-row items-center">
                <Ionicons name="information-circle" size={22} color="#F59E0B" />
                <Text className="text-yellow-700 font-SF-semibold text-base ml-2">
                  Note
                </Text>
              </View>
              <Text className="text-gray-600 font-SF-regular text-sm mt-1">
                By adding this community, you're helping others in your area find and join Urban Aid. Your community will be verified within 24-48 hours.
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="bg-blue-500 mt-20 py-4 rounded-lg shadow-md mb-10"
              onPress={handleSubmit}
            >
              <Text className="text-white text-center font-SF-semibold text-lg">
                Add Community to Urban Aid
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default AddCommunityScreen;