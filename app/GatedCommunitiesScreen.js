import React, { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

const GatedCommunitiesScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  // Predefined list of gated communities
  const communities = [
    { id: 1, name: "Greenwood Residency" },
    { id: 2, name: "Lakeview Apartments" },
    { id: 3, name: "Sunshine Villas" },
    { id: 4, name: "Palm Meadows" },
    { id: 5, name: "Oakwood Residency" },
    { id: 6, name: "Silver Heights" },
    { id: 7, name: "Emerald Greens" },
    { id: 8, name: "Royal Enclave" },
    { id: 9, name: "Blue Ridge Towers" },
    { id: 10, name: "Horizon Residency" },
  ];

  // Filtered communities based on search input
  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-SF-bold text-gray-900 mb-4">
        Select Your Gated Community
      </Text>

      {/* Search Input */}
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-lg font-SF-regular"
        placeholder="Search your community..."
        value={search}
        onChangeText={setSearch}
      />

      {/* List of Communities or No Results Message */}
      {filteredCommunities.length > 0 ? (
        <>
          <FlatList
            data={filteredCommunities}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`p-5 my-2 rounded-lg border ${
                  selectedCommunity?.id === item.id ? "bg-blue-500 border-blue-700" : "bg-gray-200 border-gray-300"
                }`}
                onPress={() => setSelectedCommunity(item)}
              >
                <Text
                  className={`text-lg text-center ${
                    selectedCommunity?.id === item.id ? "text-white font-SF-semibold" : "text-gray-700 font-SF-regular"
                  }`}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Show Button Only if a Community is Selected */}
          {selectedCommunity && (
            <TouchableOpacity
              className="bg-blue-500 py-4 rounded-lg mt-6"
              onPress={() => navigation.navigate("HomeDetailsScreen", { community: selectedCommunity })}
            >
              <Text className="text-white text-center text-lg font-SF-medium">
                Fill Your Residence Details
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        // No results found message with Lottie animation
        <View className="flex-1 items-center justify-center">
          <LottieView
            source={require("../assets/lottie/not-found.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text className="text-gray-500 text-lg font-SF-regular text-center">
            We're sorry, your community isn't listed here.
          </Text>
        </View>
      )}
    </View>
  );
};

export default GatedCommunitiesScreen;
 