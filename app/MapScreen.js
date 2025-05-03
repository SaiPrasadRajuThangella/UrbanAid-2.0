import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
// import axios from "axios"; // Commented out as requested
import { SafeAreaView } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");

const BOTTOM_SHEET_MIN_HEIGHT = height * 0.5; // 50% of screen height (equal with map)
const BOTTOM_SHEET_MAX_HEIGHT = height * 0.8; // 80% of screen height when expanded
// const API_BASE_URL = "http://192.168.0.123:8765"; // Commented out as requested
// const AUTH_TOKEN = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzc3Nzc3NnQGdtYWlsLmNvbSIsImV4cCI6MTc0NTQwMjkyOH0.HOWw7tLQF8RMMUTMkyt5Lry_YPRXnF6AmJOuwAJbLBEES1dB0dbQXSluRW0210XH"; // Commented out as requested

// Hardcoded community data
const HARDCODED_COMMUNITIES = [
  {
    id: 1,
    name: "Royal Palms Enclave",
    address: "Road No. 12, Banjara Hills",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    pincode: "500034",
    latitude: 17.4235,
    longitude: 78.4275,
    amenities: ["Swimming Pool", "Gym", "Tennis Court", "24/7 Security"]
  },
  {
    id: 2,
    name: "Green Valley Apartments",
    address: "Plot No. 45, Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    pincode: "500033",
    latitude: 17.4269,
    longitude: 78.4071,
    amenities: ["Playground", "Garden", "Community Hall"]
  },
  {
    id: 3,
    name: "Skyline Towers",
    address: "Main Road, Gachibowli",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    pincode: "500032",
    latitude: 17.4400,
    longitude: 78.3489,
    amenities: ["Swimming Pool", "Gym", "Clubhouse", "Children's Play Area"]
  },
  {
    id: 4,
    name: "Serene Heights",
    address: "IT Park Road, Kondapur",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    pincode: "500084",
    latitude: 17.4578, 
    longitude: 78.3780,
    amenities: ["Yoga Center", "Indoor Games", "Library"]
  },
  {
    id: 5,
    name: "Lakeside Villas",
    address: "Lake Avenue, Kukatpally",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    pincode: "500072",
    latitude: 17.4849,
    longitude: 78.4117,
    amenities: ["Lake View", "Walking Track", "Community Garden"]
  },
  {
    id: 6,
    name: "Meridian Heights",
    address: "Main Street, Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    pincode: "500081",
    latitude: 17.4480,
    longitude: 78.3907,
    amenities: ["Swimming Pool", "Gym", "Party Hall"]
  },
  {
    id: 7,
    name: "Silver Oak Residency",
    address: "Botanical Gardens Road, Kondapur",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    pincode: "500084",
    latitude: 17.4623,
    longitude: 78.3759,
    amenities: ["Jogging Track", "Senior Citizen Area", "Children's Play Area"]
  }
];

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [fullAddress, setFullAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // Added fields for apartment details
  const [apartmentNo, setApartmentNo] = useState("");
  const [blockNo, setBlockNo] = useState("");
  const [addressType, setAddressType] = useState("Home");

  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(50)).current;
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  // Animation related state
  const bottomSheetHeight = useRef(
    new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)
  ).current;
  const lastGestureDy = useRef(0);

  // Modified address types as requested - changed "Office" to "Home"
  const addressTypes = ["Home", "Workplace", "Other"];

  // Modified function to use hardcoded data instead of API
  const fetchCommunities = async (cityName = "Hyderabad") => {
    try {
      setLoadingCommunities(true);
      
      // Simulate network delay for realistic behavior
      setTimeout(() => {
        // Filter communities by city name if needed
        const filteredCommunities = HARDCODED_COMMUNITIES.filter(
          community => community.city.toLowerCase() === cityName.toLowerCase()
        );
        
        setCommunities(filteredCommunities);
        setLoadingCommunities(false);
      }, 1500); // 1.5 second delay to simulate network
      
    } catch (err) {
      console.error("Error fetching communities:", err);
      setError("Failed to fetch communities. Please try again.");
      setCommunities([]);
      setLoadingCommunities(false);
    }
  };

  // Function to select a community without closing dropdown
  const selectCommunity = (item) => {
    setSelectedCommunity(item);
    // Close dropdown after selection
    setDropdownOpen(false);
    
    // Set full address from community data
    if (item) {
      setFullAddress(`${item.address}, ${item.city}, ${item.state}, ${item.country}, ${item.pincode}`);
    }
    
    // Reset form fields when selecting a new community
    setApartmentNo("");
    setBlockNo("");
    setAddressType("Home");
  };

  // Function to add a new community to the list
  const addNewCommunity = (newCommunity) => {
    const newId = communities.length > 0 
      ? Math.max(...communities.map(c => c.id)) + 1 
      : 1;
    
    const communityToAdd = {
      id: newId,
      name: newCommunity.name,
      ...newCommunity,
      isNewlyAdded: true
    };
    
    // Add to communities list
    setCommunities(prev => [...prev, communityToAdd]);
    
    // Auto-select the newly added community
    setSelectedCommunity(communityToAdd);
  };

  // Function to handle adding a new community
  const goToAddCommunity = () => {
    // Navigate to the AddCommunityScreen
    navigation.navigate("AddCommunityScreen", {
      location,
      fullAddress,
      onAddCommunity: addNewCommunity
    });
  };

  // Function to reset bottom sheet to minimum height (50% of screen)
  const resetBottomSheetHeight = () => {
    Animated.spring(bottomSheetHeight, {
      toValue: BOTTOM_SHEET_MIN_HEIGHT,
      bounciness: 0,
      useNativeDriver: false,
    }).start();
  };

  // Function to expand bottom sheet to maximum height (80% of screen)
  const expandBottomSheet = () => {
    Animated.spring(bottomSheetHeight, {
      toValue: BOTTOM_SHEET_MAX_HEIGHT,
      bounciness: 0,
      useNativeDriver: false,
    }).start();
  };

  // Function to go back to community selection
  const goBackToCommunitySelection = () => {
    setSelectedCommunity(null);
  };

  // Filtered communities based on search
  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(search.toLowerCase())
  );

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Paginated data
  const paginatedData = filteredCommunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCommunities.length / itemsPerPage);

  // PanResponder for draggable bottom sheet
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: () => {
        bottomSheetHeight.setOffset(bottomSheetHeight._value);
      },
      onPanResponderMove: (_, gestureState) => {
        lastGestureDy.current = gestureState.dy;
        const newHeight = bottomSheetHeight._offset - gestureState.dy;
        if (
          newHeight >= BOTTOM_SHEET_MIN_HEIGHT &&
          newHeight <= BOTTOM_SHEET_MAX_HEIGHT
        ) {
          bottomSheetHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: () => {
        bottomSheetHeight.flattenOffset();

        // Snap to min or max height based on gesture direction and current position
        const currentHeight = bottomSheetHeight._value;
        const midPoint =
          (BOTTOM_SHEET_MAX_HEIGHT + BOTTOM_SHEET_MIN_HEIGHT) / 2;

        let targetHeight;
        if (lastGestureDy.current < 0) {
          // Moving up
          targetHeight =
            currentHeight > midPoint
              ? BOTTOM_SHEET_MAX_HEIGHT
              : BOTTOM_SHEET_MIN_HEIGHT;
        } else {
          // Moving down
          targetHeight =
            currentHeight < midPoint
              ? BOTTOM_SHEET_MIN_HEIGHT
              : BOTTOM_SHEET_MAX_HEIGHT;
        }

        Animated.spring(bottomSheetHeight, {
          toValue: targetHeight,
          bounciness: 0,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  // Toggle dropdown animation
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    Animated.timing(dropdownAnim, {
      toValue: dropdownOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    // Reset scroll to top when opening dropdown
    if (!dropdownOpen) {
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    // Start animations for loading screen
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(textSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Get location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission denied");
        setLoading(false);
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);

        let reverseGeocode = await Location.reverseGeocodeAsync(
          currentLocation.coords
        );
        if (reverseGeocode.length > 0) {
          const addressObj = reverseGeocode[0];
          const formattedAddress = `${addressObj.name || ''}, ${addressObj.street || ''}, ${addressObj.district || ''}, ${addressObj.city || ''}, ${addressObj.region || ''}, ${addressObj.postalCode || ''}, ${addressObj.country || ''}`;
          setFullAddress(formattedAddress);
        }
        
        // Start fetching communities once we have the location
        await fetchCommunities();
      } catch (err) {
        console.error("Error getting location:", err);
        setError("Failed to get your location. Please try again.");
        
        // Fallback to default location in case of error (Hyderabad)
        setLocation({
          latitude: 17.3850,
          longitude: 78.4867
        });
        setFullAddress("Hyderabad, Telangana, India");
        
        // Still try to load communities with the default location
        await fetchCommunities();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Map height based on bottom sheet position
  const mapHeight = bottomSheetHeight.interpolate({
    inputRange: [BOTTOM_SHEET_MIN_HEIGHT, BOTTOM_SHEET_MAX_HEIGHT],
    outputRange: [
      height - BOTTOM_SHEET_MIN_HEIGHT,
      height - BOTTOM_SHEET_MAX_HEIGHT,
    ],
    extrapolate: "clamp",
  });

  // Dynamic dropdown height based on content
  const dropdownHeight = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 530], // Increased height to fit all content including "Community not listed" section
    extrapolate: "clamp",
  });

  // Render community item
  const renderCommunityItem = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        className={`p-4 my-1 rounded-lg border ${
          selectedCommunity?.id === item.id
            ? "bg-blue-500 border-blue-700"
            : item.isNewlyAdded 
              ? "bg-green-50 border-green-200" 
              : "bg-gray-100 border-gray-200"
        }`}
        onPress={() => selectCommunity(item)}
      >
        <View className="flex-row justify-between items-center">
          <Text
            className={`text-base ${
              selectedCommunity?.id === item.id
                ? "text-white font-SF-semibold"
                : item.isNewlyAdded
                  ? "text-gray-700 font-SF-semibold"
                  : "text-gray-700 font-SF-regular"
            }`}
          >
            {item.name}
          </Text>
          
          {item.isNewlyAdded && selectedCommunity?.id !== item.id && (
            <View className="bg-green-100 px-2 py-1 rounded-full">
              <Text className="text-xs text-green-700 font-SF-medium">New</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      {loading ? (
        // Enhanced loading screen with animations
        <Animated.View
          className="flex-1 items-center justify-center bg-white"
          style={{ opacity: fadeAnim }}
        >
          <LottieView
            source={require("../assets/animations/location-loading.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Animated.Text
            className="text-gray-700 text-xl font-SF-semibold mt-4"
            style={{ transform: [{ translateY: textSlideAnim }] }}
          >
            Finding your location...
          </Animated.Text>
          <Animated.Text
            className="text-gray-500 text-sm font-SF-regular mt-2 px-10 text-center"
            style={{ transform: [{ translateY: textSlideAnim }], opacity: 0.8 }}
          >
            We're detecting your current location to show nearby communities
          </Animated.Text>
        </Animated.View>
      ) : (
        <>
          {/* Map View with dynamic height */}
          {location && (
            <Animated.View style={{ height: mapHeight }}>
              <MapView
                style={{ width: "100%", height: "100%" }}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={resetBottomSheetHeight}
              >
                <Marker coordinate={location} title="Your Location" />
                
                {/* Show markers for all communities */}
                {communities.map((community) => (
                  community.latitude && community.longitude ? (
                    <Marker
                      key={community.id}
                      coordinate={{
                        latitude: community.latitude,
                        longitude: community.longitude
                      }}
                      title={community.name}
                      description={community.address}
                      pinColor={selectedCommunity?.id === community.id ? "#1D4ED8" : "#F59E0B"}
                      onPress={() => selectCommunity(community)}
                    />
                  ) : null
                ))}
              </MapView>
            </Animated.View>
          )}

          {/* Draggable Bottom Sheet */}
          <Animated.View
            style={{
              height: bottomSheetHeight,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "white",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: -3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              elevation: 6,
            }}
          >
            {/* Simplified drag handle - horizontal bar only */}
            <View
              {...panResponder.panHandlers}
              className="items-center pt-2 pb-2 w-full"
            >
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>

            {loadingCommunities ? (
              // Loading communities animation
              <View className="flex-1 items-center justify-center pb-10">
                <LottieView
                  source={require("../assets/animations/buildings.json")}
                  autoPlay
                  loop
                  style={{ width: 150, height: 150 }}
                />
                <Text className="text-gray-700 text-lg font-SF-semibold mt-4">
                  Discovering nearby communities...
                </Text>
              </View>
            ) : error ? (
              // Error state
              <View className="flex-1 items-center justify-center p-5">
                <Ionicons name="alert-circle" size={50} color="#EF4444" />
                <Text className="text-red-500 text-lg font-SF-semibold mt-4 text-center">
                  {error}
                </Text>
                <TouchableOpacity
                  className="mt-6 bg-blue-500 px-5 py-2.5 rounded-lg"
                  onPress={() => fetchCommunities()}
                >
                  <Text className="text-white font-SF-semibold">Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                onPress={expandBottomSheet}
                style={{ flex: 1 }}
              >
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5">
                  {!selectedCommunity ? (
                    // Show community selection when no community is selected
                    <View style={{ paddingBottom: 20 }}>
                      <Text className="text-xl font-SF-bold text-gray-800 mb-3">
                        Select Your Community
                      </Text>

                      {/* Dropdown button */}
                      <TouchableOpacity
                        className="border border-gray-300 rounded-lg p-4 flex-row justify-between items-center bg-white shadow-sm"
                        onPress={toggleDropdown}
                        activeOpacity={0.7}
                      >
                        <Text className="text-base font-SF-medium text-gray-700">
                          {selectedCommunity
                            ? selectedCommunity.name
                            : "Select a community"}
                        </Text>
                        {selectedCommunity && selectedCommunity.isNewlyAdded && (
                          <View className="bg-green-100 px-2 py-1 rounded-full mr-2">
                            <Text className="text-xs text-green-700 font-SF-medium">New</Text>
                          </View>
                        )}
                        <Ionicons
                          name={dropdownOpen ? "chevron-up" : "chevron-down"}
                          size={24}
                          color="#6B7280"
                        />
                      </TouchableOpacity>

                      {/* Dropdown content with expanded length */}
                      <Animated.View
                        style={{
                          height: dropdownHeight,
                          overflow: "hidden",
                          zIndex: 999,
                        }}
                        className="border-x  border-gray-300 rounded-b-lg bg-white shadow-md"
                      >
                        <View className="p-3">
                          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 border border-gray-200">
                            <Ionicons name="search" size={20} color="#6B7280" />
                            <TextInput
                              className="flex-1 px-2 py-3 text-base font-SF-regular"
                              placeholder="Search communities..."
                              value={search}
                              onChangeText={setSearch}
                              autoCapitalize="none"
                            />
                            {search.length > 0 && (
                              <TouchableOpacity onPress={() => setSearch("")}>
                                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>

                        <View style={{ height: 300 }}>
                          <Animated.ScrollView className="px-2 pb-2">
                            {filteredCommunities.length > 0 ? (
                              paginatedData.map((item) =>
                                renderCommunityItem(item)
                              )
                            ) : (
                              <View className="p-4 items-center">
                                <Text className="text-gray-500 font-SF-medium">
                                  No communities found matching your search.
                                </Text>
                              </View>
                            )}
                          </Animated.ScrollView>
                        </View>
                        
                        {/* Pagination component immediately below dropdown items */}
                        {totalPages > 1 && (
                          <View className="flex-row justify-center items-center py-2 mb-4 bg-gray-50 border-t border-gray-200">
                            <TouchableOpacity
                              disabled={currentPage === 1}
                              onPress={() => setCurrentPage(currentPage - 1)}
                              className={`px-4 py-1.5 mx-1 rounded-md ${
                                currentPage === 1 ? "bg-gray-200" : "bg-blue-500"
                              }`}
                            >
                              <Text
                                className={`font-SF-semibold ${
                                  currentPage === 1 ? "text-gray-500" : "text-white"
                                }`}
                              >
                                Prev
                              </Text>
                            </TouchableOpacity>

                            <Text className="mx-3 font-SF-semibold text-gray-700">
                              {currentPage} of {totalPages}
                            </Text>

                            <TouchableOpacity
                              disabled={currentPage === totalPages}
                              onPress={() => setCurrentPage(currentPage + 1)}
                              className={`px-4 py-1.5 mx-1 rounded-md ${
                                currentPage === totalPages
                                  ? "bg-gray-200"
                                  : "bg-blue-500"
                              }`}
                            >
                              <Text
                                className={`font-SF-semibold ${
                                  currentPage === totalPages
                                    ? "text-gray-500"
                                    : "text-white"
                                }`}
                              >
                                Next
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                        
                        {/* Community not listed section INSIDE dropdown */}
                        <View className="mt-2 mb-2 px-3">
                          <View className="flex-row justify-center items-center mb-2">
                            <Text className="text-blue-600 text-sm font-SF-semibold">
                              Community not listed here? Don't worry, we got you.
                            </Text>
                          </View>
                          
                          {/* Add Community Button (Explicit) */}
                          <TouchableOpacity
                            className="py-3 rounded-lg bg-blue-500 flex-row justify-center items-center shadow-sm mb-4"
                            onPress={goToAddCommunity}
                          >
                            <Ionicons name="add-outline" size={24} color="white" />
                            <Text className="text-white font-SF-semibold ml-2 text-base">
                              Add New Community
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </Animated.View>

                      {/* Community visual placeholder when no selection and dropdown is closed */}
                      {!selectedCommunity && !dropdownOpen && (
                        <View className="items-center justify-center mt-6">
                          <LottieView
                            source={require("../assets/animations/community.json")}
                            autoPlay
                            loop
                            style={{ width: 200, height: 180 }}
                          />
                          <Text className="text-gray-600 text-base font-SF-medium text-center mt-2">
                            Choose a gated community to continue
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    // Show apartment details form when a community is selected
                    <View className="pt-2 pb-40">
                      {/* Added back button */}
                      <View className="flex-row items-center mb-4">
                        <TouchableOpacity 
                          onPress={goBackToCommunitySelection}
                          className="p-2 mr-2"
                        >
                          <Ionicons name="arrow-back" size={24} color="#1D4ED8" />
                        </TouchableOpacity>
                        <Text className="text-xl font-SF-bold text-gray-800">
                          Your Address Details
                        </Text>
                      </View>

                      {/* Enhanced Community information card with better styling */}
                      <View className="bg-gray-100 p-5 rounded-lg border border-gray-200 mb-5 shadow-sm">
                        <View className="flex-row items-center mb-2">
                          <View className="bg-blue-500 p-2 rounded-lg mr-3">
                            <Ionicons name="business" size={22} color="white" />
                          </View>
                          <View className="flex-1">
                            <Text className="text-blue-800 font-SF-bold text-lg">
                              {selectedCommunity.name}
                            </Text>
                            {selectedCommunity.isNewlyAdded && (
                              <View className="bg-green-100 px-2 py-0.5 rounded-full self-start mt-1">
                                <Text className="text-xs text-green-700 font-SF-medium">Newly Added</Text>
                              </View>
                            )}
                          </View>
                        </View>
                        
                        <View className="flex-row items-center ml-1 mt-2">
                          <Ionicons name="location" size={16} color="#4B5563" />
                          <Text className="text-gray-600 font-SF-regular text-sm ml-1 flex-1">
                            {selectedCommunity.address}, {selectedCommunity.city}, {selectedCommunity.state}
                          </Text>
                        </View>
                        
                        <View className="flex-row items-center ml-1 mt-1">
                          <Ionicons name="mail" size={16} color="#4B5563" />
                          <Text className="text-gray-600 font-SF-regular text-sm ml-1">
                            {selectedCommunity.pincode}, {selectedCommunity.country}
                          </Text>
                        </View>
                        
                        {selectedCommunity.amenities && (
                          <View className="flex-row flex-wrap mt-3">
                            {selectedCommunity.amenities.map((amenity, index) => (
                              <View key={index} className="bg-white px-2 py-1 rounded-full mr-2 mt-1 border border-blue-200">
                                <Text className="text-xs text-blue-700 font-SF-medium">{amenity}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>

                      {/* Apartment Number */}
                      <View className="mb-4">
                        <Text className="text-gray-700 font-SF-semibold mb-1">
                          Apartment No
                        </Text>
                        <TextInput
                          className="border border-gray-300 rounded-lg px-4 py-3 text-base font-SF-regular"
                          placeholder="Enter your apartment number"
                          value={apartmentNo}
                          onChangeText={setApartmentNo}
                        />
                      </View>

                      {/* Block Number */}
                      <View className="mb-4">
                        <Text className="text-gray-700 font-SF-semibold mb-1">
                          Block No
                        </Text>
                        <TextInput
                          className="border border-gray-300 rounded-lg px-4 py-3 text-base font-SF-regular"
                          placeholder="Enter your block number"
                          value={blockNo}
                          onChangeText={setBlockNo}
                        />
                      </View>

                      {/* Address Type */}
                      <View className="mb-8">
                        <Text className="text-gray-700 font-SF-semibold mb-2">
                          Address Type
                        </Text>
                        <View className="flex-row flex-wrap">
                          {addressTypes.map((type) => (
                            <TouchableOpacity
                              key={type}
                              className={`mr-3 mb-2 px-4 py-2 rounded-full ${
                                addressType === type
                                  ? "bg-blue-500"
                                  : "bg-gray-200"
                              }`}
                              onPress={() => setAddressType(type)}
                            >
                              <Text
                                className={`font-SF-medium ${
                                  addressType === type
                                    ? "text-white"
                                    : "text-gray-700"
                                }`}
                              >
                                {type}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}
                </ScrollView>
              </TouchableOpacity>
            )}

            {/* Fixed buttons at the bottom when a community is selected */}
            {selectedCommunity && !loadingCommunities && !error && (
              <View className="absolute bottom-0 left-0 right-0 flex-row justify-between p-5 bg-white border-t border-gray-200">
                <TouchableOpacity
                  className="bg-gray-300 py-3.5 rounded-lg shadow-sm flex-1 mr-2"
                  onPress={() => setSelectedCommunity(null)}
                >
                  <Text className="text-white text-center font-SF-semibold text-lg">
                    Change Community
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-blue-500 py-3.5 rounded-lg shadow-sm flex-1 ml-2"
                  onPress={() =>
                    navigation.navigate("HomeDetailsScreen", {
                      community: selectedCommunity,
                      location,
                      fullAddress: `${selectedCommunity.address}, ${selectedCommunity.city}, ${selectedCommunity.state}, ${selectedCommunity.country}, ${selectedCommunity.pincode}`,
                      apartmentNo,
                      blockNo,
                      addressType,
                    })
                  }
                >
                  <Text className="text-white text-center font-SF-semibold text-lg">
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

export default MapScreen;