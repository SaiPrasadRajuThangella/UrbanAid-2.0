import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; 
const CommunitySelectionScreen = () => {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(""); // Store human-readable address
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);
  const [showCommunityList, setShowCommunityList] = useState(false);

  const CustomCheckBox = ({ label, isChecked, onPress }) => {
    return (
      <TouchableOpacity
        className="flex-row items-center space-x-2"
        onPress={onPress}
      >
        <View
          className={`w-6 h-6 border-2 rounded-md flex items-center justify-center ${
            isChecked ? "bg-blue-500 border-blue-500" : "border-gray-400"
          }`}
        >
          {isChecked && <Icon name="check" size={18} color="white" />}
        </View>
        <Text className="text-gray-700">{label}</Text>
      </TouchableOpacity>
    );
  };
  // Sample list of gated communities
  const gatedCommunities = [
    "Rainbow Wishes",
    "Divine Allura",
    "Floatilla",
    "Aparna Cyberzone",
    "My Home Navadweep",
    "Hill Ridge Springs",
    "My Home Jewel",
    "Ambience Fort",
    "Amrutha Valley",
    "Malaysian Township",
  ];

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setIsFetchingLocation(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);

      // 🔥 Reverse geocode to get human-readable location
      let addressArray = await Location.reverseGeocodeAsync(userLocation.coords);
      if (addressArray.length > 0) {
        let address = addressArray[0];
        setLocationName(`${address.city}, ${address.region}, ${address.country}`);
      } else {
        setLocationName("Unknown Location");
      }

      setIsFetchingLocation(false);
    };

    fetchLocation();
  }, []);

  const handleSelectCommunity = (community) => {
    setSelectedCommunity(community);
  };

  const handleContinue = () => {
    router.push({
      pathname: "/HomeScreen",
      params: {
        community: JSON.stringify({
          name: selectedCommunity,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            name: locationName, // Pass location name to HomeScreen
          },
        }),
      },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <Text className="text-lg font-SF-bold p-4">Select Your Community</Text>

      {/* Map or Loading Indicator */}
      <View className="h-72">
        {isFetchingLocation ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="green" />
            <Text className="text-gray-500 mt-2">Fetching location...</Text>
          </View>
        ) : location ? (
          <MapView
            style={{ height: "100%" }}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
          </MapView>
        ) : (
          <Text className="text-red-500 text-center">Error: {errorMsg}</Text>
        )}
      </View>

      {/* Button to Show Gated Communities */}
      {!showCommunityList && location && (<>
          <Text className="text-black p-3 font-SF-medium text-lg ml-2">You are in {locationName}, </Text>
          <TouchableOpacity
          onPress={() => setShowCommunityList(true)}
          className="bg-green-500 p-3 mx-4 mt-4 rounded-full flex-row items-center justify-center shadow-md"
        >
          <Ionicons name="location" size={20} color="white" />
          <Text className="text-white font-SF-medium text-lg ml-2">select your community</Text>
        </TouchableOpacity>
        </> )}

      {/* List of Gated Communities */}
      {showCommunityList && (
        <>
          <Text className="text-lg font-SF-bold mt-4 px-4">Select a Gated Community</Text>
          <FlatList
            data={gatedCommunities}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingBottom: 80 }} // To make space for the floating button
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectCommunity(item)}
                className={`p-4 my-2 mx-4 rounded-lg ${selectedCommunity === item ? "bg-green-200" : "bg-gray-100"}`}
              >
                <Text className="text-lg font-SF-light">{item}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* Floating "Continue" Button */}
      {selectedCommunity && (
        <TouchableOpacity
          onPress={handleContinue}
          className="absolute bottom-6 left-4 right-4 bg-green-500 py-3 rounded-full items-center shadow-lg"
        >
          <Text className="text-white text-lg">Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CommunitySelectionScreen;
