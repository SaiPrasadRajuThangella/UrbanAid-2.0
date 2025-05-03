import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

const ChangeCommunity = () => {
  const navigation = useNavigation();
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Dummy user location
  const userLocation = {
    latitude: 17.3850,
    longitude: 78.4867,
    name: "Marina Skies, Hyderabad",
  };

  // Dummy communities
  const communities = [
    "Prestige High Fields",
    "My Home Bhooja",
    "Lodha Bellezza",
    "Ramky Towers",
    "Aparna Sarovar",
    "Cybercity Oriana",
    "Sumadhura Acropolis",
    "PBEL City",
    "Meenakshi Trident Towers",
    "Jayabheri Orange County",
  ];

  return (
    <View className="flex-1 bg-white p-4">
      {/* Current Address */}
      <Text className="text-lg font-SF-semibold">Your Current Address</Text>
      <Text className="text-gray-500">{userLocation.name}</Text>

      {/* Change Address Button */}
      <TouchableOpacity
        className="bg-blue-600 p-3 rounded-lg mt-4"
        onPress={() => navigation.navigate("MapScreen", { userLocation })}
      >
        <Text className="text-white text-center font-SF-medium">Change Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export const MapScreen = ({ route, navigation }) => {
  const { userLocation } = route.params;

  return (
    <View className="flex-1">
      <MapView
        className="flex-1"
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          title={userLocation.name}
        />
      </MapView>

      {/* Select Community Button */}
      <TouchableOpacity
        className="absolute bottom-10 left-5 right-5 bg-blue-600 p-3 rounded-lg"
        onPress={() => navigation.navigate("CommunitySelection")}
      >
        <Text className="text-white text-center font-SF-medium">
          Select the Community Near You
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const CommunitySelection = ({ navigation }) => {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const communities = [
    "Prestige High Fields",
    "My Home Bhooja",
    "Lodha Bellezza",
    "Ramky Towers",
    "Aparna Sarovar",
    "Cybercity Oriana",
    "Sumadhura Acropolis",
    "PBEL City",
    "Meenakshi Trident Towers",
    "Jayabheri Orange County",
  ];

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-lg font-SF-semibold mb-4">Select Your Community</Text>
      
      {communities.map((community, index) => (
        <TouchableOpacity
          key={index}
          className={`p-3 border ${
            selectedCommunity === community ? "border-blue-600 bg-blue-100" : "border-gray-300"
          } rounded-lg mb-2`}
          onPress={() => setSelectedCommunity(community)}
        >
          <Text className="text-gray-800">{community}</Text>
        </TouchableOpacity>
      ))}

      {/* Select Community Button */}
      {selectedCommunity && (
        <TouchableOpacity
          className="bg-blue-600 p-3 rounded-lg mt-4"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-center font-SF-medium">Select This Community</Text>
        </TouchableOpacity>
      )}
        
      {/* Modal for Confirmation */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-80 items-center">
            <Text className="text-lg font-SF-semibold">Your location is changed</Text>
            <Text className="text-gray-500 mt-2">Your current community is {selectedCommunity}.</Text>
            <TouchableOpacity
              className="bg-blue-600 p-2 px-5 rounded-lg mt-4"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("ChangeCommunity");
              }}
            >
              <Text className="text-white font-SF-medium">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChangeCommunity;
