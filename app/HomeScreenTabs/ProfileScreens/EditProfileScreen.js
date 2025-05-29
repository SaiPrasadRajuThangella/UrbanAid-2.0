import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo

const EditProfileScreen = ({ navigation, route }) => {
  // Initialize with hardcoded user data
  const initialUserData = {
    id: "uuid",
    name: "John Doe",
    email: "john@example.com",
    phone: "+919876543210",
    unit_number: "A-123",
    community_id: "uuid",
    address: "123 Main St, Apartment 456",
    profile_image_url: null, // Add profile image URL field
    house_details: {
      bedrooms: 3,
      bathrooms: 2,
      square_footage: 1500,
      pets: [{ type: "Dog", count: 2 }],
    },
  };

  const [userData, setUserData] = useState(initialUserData);
  const [formValues, setFormValues] = useState({
    name: initialUserData.name,
    phone: initialUserData.phone,
    unit_number: initialUserData.unit_number,
    address: initialUserData.address,
  });
  const [profileImage, setProfileImage] = useState(null); // State to store the selected image

  // Update house details when returned from HouseDetails screen
  useEffect(() => {
    if (route.params?.houseDetails) {
      const newHouseDetails = {
        bedrooms: parseInt(
          route.params.houseDetails.rooms === "Custom"
            ? "0"
            : route.params.houseDetails.rooms
        ),
        bathrooms: parseFloat(
          route.params.houseDetails.washrooms === "Custom"
            ? "0"
            : route.params.houseDetails.washrooms
        ),
        square_footage: getSqFootage(route.params.houseDetails.homeSize),
        pets: route.params.houseDetails.pets || userData.house_details.pets,
      };

      setUserData((prev) => ({
        ...prev,
        house_details: newHouseDetails,
      }));
    }
  }, [route.params?.houseDetails]);

  // Request permission for accessing the camera roll
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  // Function to pick an image from gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  // Function to upload profile image
  const uploadProfileImage = async (imageUri) => {
    // Create form data
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const fileType = filename.split('.').pop();
    
    formData.append('file', {
      uri: imageUri,
      type: `image/${fileType}`,
      name: filename,
    });

    /* 
    // API call code for uploading image (commented out as requested)
    try {
      const response = await fetch('YOUR_API_ENDPOINT/users/profile/image', {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer YOUR_TOKEN',
        },
        body: formData,
      });

      const jsonResponse = await response.json();
      
      if (jsonResponse.status === 'success') {
        setUserData(prev => ({
          ...prev,
          profile_image_url: jsonResponse.data.profile_image_url
        }));
        Alert.alert("Success", "Profile image updated successfully!");
      } else {
        Alert.alert("Error", "Failed to upload profile image");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while uploading your profile image");
      console.error(error);
    }
    */

    // Mock response for now
    const mockResponse = {
      status: "success",
      data: {
        profile_image_url: imageUri, // Just use the local URI for mock
      },
    };

    // Update the user data with the response
    setUserData(prev => ({
      ...prev,
      profile_image_url: mockResponse.data.profile_image_url
    }));

    // Show success alert
    Alert.alert("Success", "Profile image updated successfully!", [
      { text: "OK" },
    ]);
  };

  const getSqFootage = (sizeRange) => {
    // Convert the size range to a numerical value
    if (!sizeRange) return 0;
    if (sizeRange === "<500") return 499;
    if (sizeRange === "500 - 999") return 750;
    if (sizeRange === "1000 - 1999") return 1500;
    if (sizeRange === "2000 - 2999") return 2500;
    if (sizeRange === "3000 - 4999") return 4000;
    if (sizeRange === "5000+") return 5000;
    return 0;
  };

  const handleInputChange = (field, value) => {
    setFormValues({
      ...formValues,
      [field]: value,
    });
  };

  const handleSaveChanges = () => {
    // Build the request payload
    const payload = {
      name: formValues.name,
      phone: formValues.phone,
      unit_number: formValues.unit_number,
      community_id: userData.community_id,
      address: formValues.address,
      house_details: userData.house_details,
    };

    // For now, use the hardcoded response
    const mockResponse = {
      status: "success",
      data: {
        id: "uuid",
        name: formValues.name,
        email: userData.email,
        phone: formValues.phone,
        unit_number: formValues.unit_number,
        community_id: userData.community_id,
        address: formValues.address,
        house_details: userData.house_details,
        profile_image_url: userData.profile_image_url,
      },
    };

    // Update the user data with the response
    setUserData(mockResponse.data);

    // Show success alert
    Alert.alert("Success", "Your profile has been updated successfully!", [
      { text: "OK" },
    ]);

    /* API call would be like this:
    try {
      const response = await fetch('YOUR_API_ENDPOINT/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_TOKEN'
        },
        body: JSON.stringify(payload)
      });
      
      const jsonResponse = await response.json();
      
      if (jsonResponse.status === 'success') {
        setUserData(jsonResponse.data);
        Alert.alert("Success", "Your profile has been updated successfully!");
      } else {
        Alert.alert("Error", "Failed to update profile");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating your profile");
      console.error(error);
    }
    */
  };

  // Determine image source based on state
  const profileImageSource = profileImage 
    ? { uri: profileImage } 
    : userData.profile_image_url 
    ? { uri: userData.profile_image_url }
    : require("../../../assets/images/user.jpeg");

  return (
    <ScrollView>
      <View className="flex-1 bg-white p-4">
        {/* Header */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-4 left-4"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Profile Picture */}
        <View className="items-center mt-10">
          <Image
            source={profileImageSource}
            className="w-28 h-28 rounded-full"
          />
          <TouchableOpacity 
            className="absolute top-24 bg-blue-500 p-1 rounded-full"
            onPress={pickImage}
          >
            <Ionicons name="pencil" size={16} color="white" />
          </TouchableOpacity>
        </View>

        <Text className="text-xl font-SF-semibold text-center mt-4">
          Edit Profile
        </Text>

        {/* Input Fields */}
        <View className="mt-6 space-y-4">
          <InputField
            label="Name"
            value={formValues.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />
          <InputField
            label="Phone Number"
            value={formValues.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
          />
          <InputField
            label="Unit Number"
            value={formValues.unit_number}
            onChangeText={(text) => handleInputChange("unit_number", text)}
          />
          <InputField
            label="Address"
            value={formValues.address}
            onChangeText={(text) => handleInputChange("address", text)}
          />

          {/* House Details Dropdown */}
          <View className="mb-3 px-2">
            <Text className="text-black font-SF-medium">House Details</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("HouseDetailsScreen", {
                  onSubmit: (details) =>
                    navigation.navigate("EditProfileScreen", {
                      houseDetails: details,
                    }),
                  currentDetails: userData.house_details,
                })
              }
              className="border border-gray-300 rounded-lg p-3 mt-1 flex-row justify-between items-center"
            >
              <Text className="font-SF-light text-gray-700">
                {userData.house_details
                  ? `${userData.house_details.bedrooms} Room${
                      userData.house_details.bedrooms !== 1 ? "s" : ""
                    }, ${userData.house_details.bathrooms} Bathroom${
                      userData.house_details.bathrooms !== 1 ? "s" : ""
                    }`
                  : "Select House Details"}
              </Text>
              <View className="flex-row items-center">
                {userData.house_details && (
                  <View className="bg-green-500 rounded-full w-2 h-2 mr-2" />
                )}
                <Ionicons name="chevron-forward" size={18} color="#666" />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPasswordScreen")}
            className="bg-blue-500 flex-row items-center justify-center p-3 py-4 rounded-lg mt-4"
          >
            <Ionicons name="lock-closed" size={16} color="white" />
            <Text className="text-white font-SF-medium ml-2">
              Change Password
            </Text>
          </TouchableOpacity>

          {/* Save Changes Button */}
          <TouchableOpacity
            onPress={handleSaveChanges}
            className="bg-green-500 mb-10 flex-row items-center justify-center p-3 py-4 rounded-lg mt-4"
          >
            <Ionicons name="save" size={16} color="white" />
            <Text className="text-white font-SF-medium ml-2">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const InputField = ({ label, value, onChangeText }) => (
  <View className="mb-3 px-2">
    <Text className="text-black font-SF-medium">{label}</Text>
    <TextInput
      className="border border-gray-300 font-SF-light rounded-lg p-3 mt-1"
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

export default EditProfileScreen;