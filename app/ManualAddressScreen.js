import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast"; // Import Simple Toast

const AddressTypeFilter = ({ selectedType, setSelectedType }) => {
  const options = [
    { label: "Home", icon: "home" },
    { label: "Office", icon: "briefcase" },
    { label: "Workplace", icon: "building" },
    { label: "Other", icon: "more-horizontal" },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
      {options.map(({ label, icon }) => (
        <TouchableOpacity
          key={label}
          className={`flex-row items-center px-4 py-3 rounded-lg mr-3 ${
            selectedType === label ? "bg-blue-500" : "bg-gray-200"
          }`}
          onPress={() => setSelectedType(label)}
        >
          <Feather name={icon} size={20} color={selectedType === label ? "white" : "gray"} />
          <Text className={`ml-2 ${selectedType === label ? "text-white" : "text-gray-700"} font-SF-semibold`}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const ManualAddressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { location, fullAddress } = route.params;

  const [streetAddress, setStreetAddress] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [selectedType, setSelectedType] = useState("Home");

  const isFormValid = streetAddress.trim() !== "" && area.trim() !== "";

  const handleSaveAddress = () => {
    if (!isFormValid) {
      Toast.show("Please fill in all required fields!", Toast.LONG);
      return;
    }

    Toast.show("Address Saved Successfully!", Toast.LONG);

    setTimeout(() => {
      navigation.navigate("GatedCommunitiesScreen");
    }, 1000);
  };

  return (
    <View className="flex-1">
      <MapView
        style={{ width: "100%", height: "70%" }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={location} title="Your Location" />
      </MapView>

      <View className="absolute bottom-0 w-full bg-white p-6 rounded-t-3xl shadow-lg">
        <Text className="text-lg font-SF-semibold text-gray-800 mb-2">Your Current Address:</Text>
        <Text className="font-SF-regular text-gray-600 mb-6">{fullAddress}</Text>

        <TextInput
          className="border border-gray-300 px-6 font-SF-light py-4 rounded-lg mb-3"
          placeholder="Street Address"
          value={streetAddress}
          onChangeText={setStreetAddress}
        />

        <TextInput
          className="border border-gray-300 px-6 font-SF-light py-4 rounded-lg mb-3"
          placeholder="Area"
          value={area}
          onChangeText={setArea}
        />

        <TextInput
          className="border border-gray-300 px-6 font-SF-light py-4 rounded-lg mb-3"
          placeholder="Nearby Landmark (Optional)"
          value={landmark}
          onChangeText={setLandmark}
        />

        <AddressTypeFilter selectedType={selectedType} setSelectedType={setSelectedType} />

        <TouchableOpacity
          className={`py-4 rounded-lg mt-4 ${isFormValid ? "bg-blue-500" : "bg-gray-400"}`}
          disabled={!isFormValid}
          onPress={handleSaveAddress}
        >
          <Text className="text-white text-center text-lg font-SF-semibold">
            Complete Signup
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManualAddressScreen;
