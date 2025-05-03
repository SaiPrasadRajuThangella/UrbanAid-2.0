import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  TextInput,
} from "react-native";
import { ArrowLeft, Plus, Minus } from "lucide-react-native";

const options = {
  rooms: ["1", "2", "3", "4", "Custom"],
  washrooms: ["1", "2", "3", "4", "Custom"],
  residents: ["1", "2", "3", "4", "Custom"],
  homeSize: ["<500", "500 - 999", "1000 - 1999", "2000 - 2999", "3000 - 4999", "5000+"],
  petTypes: ["Dog", "Cat", "Bird", "Fish", "Other"]
};

const HouseDetails = ({ navigation, route }) => {
  const currentDetails = route.params?.currentDetails || null;

  const [selected, setSelected] = useState({
    rooms: null,
    washrooms: null,
    residents: null,
    homeSize: null,
    pets: []
  });
  
  const [petType, setPetType] = useState("");
  const [petCount, setPetCount] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  // Initialize from existing house details if available
  useEffect(() => {
    if (currentDetails) {
      setSelected({
        rooms: String(currentDetails.bedrooms),
        washrooms: String(currentDetails.bathrooms),
        residents: selected.residents,
        homeSize: getSizeRangeFromSquareFootage(currentDetails.square_footage),
        pets: currentDetails.pets || []
      });
    }
  }, [currentDetails]);

  const getSizeRangeFromSquareFootage = (footage) => {
    if (footage < 500) return "<500";
    if (footage < 1000) return "500 - 999";
    if (footage < 2000) return "1000 - 1999";
    if (footage < 3000) return "2000 - 2999";
    if (footage < 5000) return "3000 - 4999";
    return "5000+";
  };

  const handleSelect = (category, value) => {
    setSelected({ ...selected, [category]: value });
  };

  const handleAddPet = () => {
    if (petType) {
      const newPets = [...selected.pets];
      const existingPetIndex = newPets.findIndex(pet => pet.type === petType);
      
      if (existingPetIndex !== -1) {
        newPets[existingPetIndex] = { ...newPets[existingPetIndex], count: petCount };
      } else {
        newPets.push({ type: petType, count: petCount });
      }
      
      setSelected({ ...selected, pets: newPets });
      setPetType("");
      setPetCount(1);
    }
  };

  const handleRemovePet = (index) => {
    const newPets = [...selected.pets];
    newPets.splice(index, 1);
    setSelected({ ...selected, pets: newPets });
  };

  const handleIncrementPetCount = () => {
    setPetCount(prev => prev + 1);
  };

  const handleDecrementPetCount = () => {
    setPetCount(prev => prev > 1 ? prev - 1 : 1);
  };

  const allBasicFieldsSelected = selected.rooms !== null && 
                                selected.washrooms !== null && 
                                selected.homeSize !== null;

  const handleSave = () => {
    if (allBasicFieldsSelected) {
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        // Navigate back with the selected details
        if (route.params?.onSubmit) {
          route.params.onSubmit(selected);
        } else {
          navigation.navigate("EditProfileScreen", { houseDetails: selected });
        }
      }, 1000);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      {/* Header */}
      <View className="flex-row items-center mb-2">
        <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Title & Description */}
      <Text className="text-xl font-SF-semibold text-gray-900 mt-4">Tell Us About Your Home</Text>
      <Text className="text-gray-500 font-SF-regular mt-2">
        These details help us tailor our service to your needs
      </Text>

      <ScrollView className="mt-6">
        {/* Selection Section */}
        <View className="p-4 border border-gray-200 rounded-lg mb-3">
          {/* Rooms */}
          <View className="mb-5">
            <Text className="text-gray-700 font-SF-semibold mb-2">Number of Bedrooms</Text>
            <View className="flex-row flex-wrap">
              {options.rooms.map((item) => (
                <TouchableOpacity
                  key={item}
                  className={`w-[25%] py-1 px-3 border rounded-md m-1 items-center justify-center ${
                    selected.rooms === item ? "bg-blue-100 border-blue-500" : "border-gray-300"
                  }`}
                  onPress={() => handleSelect("rooms", item)}
                >
                  <Text
                    className={`text-base font-SF-regular ${
                      selected.rooms === item ? "text-blue-500" : "text-gray-700"
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Washrooms */}
          <View className="mb-5">
            <Text className="text-gray-700 font-SF-semibold mb-2">Number of Bathrooms</Text>
            <View className="flex-row flex-wrap">
              {options.washrooms.map((item) => (
                <TouchableOpacity
                  key={item}
                  className={`w-[25%] py-1 px-3 border rounded-md m-1 items-center justify-center ${
                    selected.washrooms === item ? "bg-blue-100 border-blue-500" : "border-gray-300"
                  }`}
                  onPress={() => handleSelect("washrooms", item)}
                >
                  <Text
                    className={`text-base font-SF-regular ${
                      selected.washrooms === item ? "text-blue-500" : "text-gray-700"
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Residents */}
          <View className="mb-5">
            <Text className="text-gray-700 font-SF-semibold mb-2">Number of Residents</Text>
            <View className="flex-row flex-wrap">
              {options.residents.map((item) => (
                <TouchableOpacity
                  key={item}
                  className={`w-[25%] py-1 px-3 border rounded-md m-1 items-center justify-center ${
                    selected.residents === item ? "bg-blue-100 border-blue-500" : "border-gray-300"
                  }`}
                  onPress={() => handleSelect("residents", item)}
                >
                  <Text
                    className={`text-base font-SF-regular ${
                      selected.residents === item ? "text-blue-500" : "text-gray-700"
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Home Size Section */}
        <View className="border border-gray-200 rounded-lg p-3 mb-3">
          <Text className="text-gray-700 font-SF-semibold mb-2">Approximate Size of Your Home (sqft.)</Text>
          <View className="flex-row flex-wrap">
            {options.homeSize.map((size) => (
              <TouchableOpacity
                key={size}
                className={`w-[32%] mr-3 py-1 px-3 border rounded-md m-1 items-center justify-center ${
                  selected.homeSize === size ? "bg-blue-100 border-blue-500" : "border-gray-300"
                }`}
                onPress={() => handleSelect("homeSize", size)}
              >
                <Text
                  className={`text-base font-SF-regular ${
                    selected.homeSize === size ? "text-blue-500" : "text-gray-700"
                  }`}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pets Section */}
        <View className="border border-gray-200 rounded-lg p-3 mb-3">
          <Text className="text-gray-700 font-SF-semibold mb-2">Pets</Text>
          
          {/* List of added pets */}
          {selected.pets.length > 0 && (
            <View className="mb-3">
              {selected.pets.map((pet, index) => (
                <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-100">
                  <Text className="font-SF-regular">{pet.type}</Text>
                  <View className="flex-row items-center">
                    <Text className="mr-2 font-SF-regular">{pet.count}</Text>
                    <TouchableOpacity 
                      onPress={() => handleRemovePet(index)}
                      className="bg-red-100 rounded-full p-1"
                    >
                      <Minus size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Add new pet */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-gray-600 font-SF-semibold mb-1">Pet Type</Text>
              <View className="flex-row flex-wrap mb-2">
                {options.petTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    className={`mr-2 mb-2 py-1 px-3 border rounded-md ${
                      petType === type ? "bg-blue-100 border-blue-500" : "border-gray-300"
                    }`}
                    onPress={() => setPetType(type)}
                  >
                    <Text
                      className={`font-SF-regular ${
                        petType === type ? "text-blue-500" : "text-gray-700"
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center">
              <Text className="text-gray-600 font-SF-semibold mr-3">Count:</Text>
              <TouchableOpacity 
                onPress={handleDecrementPetCount}
                className="border border-gray-300 rounded-l-md p-1 w-8 items-center"
              >
                <Minus size={14} color="#666" />
              </TouchableOpacity>
              <View className="border-t border-b border-gray-300 p-1 px-3">
                <Text>{petCount}</Text>
              </View>
              <TouchableOpacity 
                onPress={handleIncrementPetCount}
                className="border border-gray-300 rounded-r-md p-1 w-8 items-center"
              >
                <Plus size={14} color="#666" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handleAddPet}
              disabled={!petType}
              className={`py-2 px-4 rounded-md ${
                petType ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <Text className="text-white font-SF-semibold">Add Pet</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className={`py-4 rounded-lg mt-6 ${
            allBasicFieldsSelected ? "bg-blue-500" : "bg-gray-300"
          }`}
          onPress={handleSave}
          disabled={!allBasicFieldsSelected}
        >
          <Text className="text-white text-center text-lg font-SF-semibold">
            Save Home Details and Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for Success Message - Sliding from top with blur */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View className="flex-1 backdrop-blur-md" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View className="bg-white p-6 rounded-b-lg shadow-lg mt-6">
            <Text className="text-lg font-SF-semibold text-center text-gray-900">
              Details Saved
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Returning to the profile page...
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HouseDetails;