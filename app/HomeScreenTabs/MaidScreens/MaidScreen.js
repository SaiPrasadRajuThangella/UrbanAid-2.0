import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Animated,
} from "react-native";
import { allMaids } from "../../utils/MaidsList";
import Ionicons from "react-native-vector-icons/Ionicons";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";

const MaidListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const router = useRouter();
  
  // Animation for heart
  const [heartScale] = useState(new Animated.Value(1));

  // Redux hooks
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    //
  }, []);

  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    job: [],
    experience: null,
    rating: null,
    servicePlanDuration: null,
    gender: null,
    age: null,
    religion: null,
    petFriendly: null,
    language: [],
    maritalStatus: null,
    verified: null,
  });

  const [filteredMaids, setFilteredMaids] = useState(allMaids);

  // Toggle wishlist item with animation
  const toggleWishlist = (item) => {
    const isInWishlist = wishlist.some((maid) => maid.id === item.id);
    
    // Scale animation
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(item.id));
    } else {
      dispatch(addToWishlist(item));
    }
  };

  // Navigate to wishlist screen
  const navigateToWishlist = () => {
    navigation.navigate("WishListScreen");
  };

  // Reorganized filter options with main categories and subcategories
  const filterOptions = {
    basicDetails: {
      label: "Basic Details",
      subCategories: {
        age: {
          label: "Age",
          options: ["18-25", "26-35", "36-45", "46+"]
        },
        experience: {
          label: "Experience",
          options: ["1-2 Years", "3-5 Years", "6+ Years"]
        },
        rating: {
          label: "Rating",
          options: ["4+ Stars", "3+ Stars", "2+ Stars"]
        },
        maritalStatus: {
          label: "Marital Status",
          options: ["Single", "Married", "Divorced", "Widowed"]
        },
        gender: {
          label: "Gender",
          options: ["Male", "Female"]
        },
        language: {
          label: "Language",
          options: ["English", "Hindi", "Telugu", "Bengali", "Urdu"]
        },
        petFriendly: {
          label: "Pet Friendly",
          options: ["Yes", "No"]
        },
        religion: {
          label: "Religion",
          options: ["Christian", "Muslim", "Hindu", "Buddhist", "Other"]
        },
        verified: {
          label: "Verification Status",
          options: ["Verified", "Not Verified"]
        }
      }
    },
    skills: {
      label: "Skills",
      subCategories: {
        job: {
          label: "Job",
          options: ["Cook", "Cleaner", "Baby Sitter", "Kitchen Helper", "Top Work"]
        }
      }
    },
    availability: {
      label: "Availability",
      subCategories: {
        servicePlanDuration: {
          label: "Service Plan Duration",
          options: ["Long-term", "Short-term"]
        }
      }
    }
  };

  // Toggle main category visibility
  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
    setExpandedSubCategory(null);
  };

  // Toggle subcategory visibility
  const toggleSubCategory = (subCategory) => {
    setExpandedSubCategory(expandedSubCategory === subCategory ? null : subCategory);
  };

  // Toggle checkbox for filter options
  const toggleCheckbox = (category, option) => {
    setSelectedFilters((prev) => {
      let updatedCategory;
      if (category === "job" || category === "language") {
        updatedCategory = prev[category].includes(option)
          ? prev[category].filter((item) => item !== option)
          : [...prev[category], option];
      } else {
        updatedCategory = prev[category] === option ? null : option;
      }
      return { ...prev, [category]: updatedCategory };
    });
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = allMaids;

    // Filter by job role
    if (selectedFilters.job.length > 0) {
      filtered = filtered.filter((maid) =>
        selectedFilters.job.some((job) => maid.job.includes(job))
      );
    }

    // Filter by experience
    if (selectedFilters.experience) {
      filtered = filtered.filter((maid) => {
        if (selectedFilters.experience === "1-2 Years")
          return maid.experience <= 2;
        if (selectedFilters.experience === "3-5 Years")
          return maid.experience >= 3 && maid.experience <= 5;
        if (selectedFilters.experience === "6+ Years")
          return maid.experience > 5;
      });
    }

    // Filter by rating
    if (selectedFilters.rating) {
      filtered = filtered.filter((maid) => {
        if (selectedFilters.rating === "4+ Stars") return maid.rating >= 4;
        if (selectedFilters.rating === "3+ Stars") return maid.rating >= 3;
        if (selectedFilters.rating === "2+ Stars") return maid.rating >= 2;
      });
    }

    // Filter by gender
    if (selectedFilters.gender) {
      filtered = filtered.filter(
        (maid) => maid.gender === selectedFilters.gender
      );
    }

    // Filter by age
    if (selectedFilters.age) {
      filtered = filtered.filter((maid) => {
        const age = maid.age;
        if (selectedFilters.age === "18-25") return age >= 18 && age <= 25;
        if (selectedFilters.age === "26-35") return age >= 26 && age <= 35;
        if (selectedFilters.age === "36-45") return age >= 36 && age <= 45;
        if (selectedFilters.age === "46+") return age >= 46;
        return true; // Default case
      });
    }

    // Filter by religion
    if (selectedFilters.religion) {
      filtered = filtered.filter(
        (maid) => maid.religion === selectedFilters.religion
      );
    }

    // Filter by pet-friendly
    if (selectedFilters.petFriendly === "Yes" || selectedFilters.petFriendly === "No") {
      filtered = filtered.filter(
        (maid) => maid.petFriendly === (selectedFilters.petFriendly === "Yes")
      );
    }

    // Filter by language
    if (
      Array.isArray(selectedFilters.language) &&
      selectedFilters.language.length > 0
    ) {
      filtered = filtered.filter(
        (maid) =>
          Array.isArray(maid.language) &&
          selectedFilters.language.some((lang) => maid.language.includes(lang))
      );
    }

    // Filter by marital status
    if (selectedFilters.maritalStatus) {
      filtered = filtered.filter(
        (maid) => maid.maritalStatus === selectedFilters.maritalStatus
      );
    }

    // Filter by service plan duration
    if (selectedFilters.servicePlanDuration) {
      filtered = filtered.filter(
        (maid) => maid.availability === selectedFilters.servicePlanDuration
      );
    }

    // Filter by verification status
    if (selectedFilters.verified) {
      filtered = filtered.filter((maid) => {
        if (selectedFilters.verified === "Verified") return maid.verified === true;
        if (selectedFilters.verified === "Not Verified") return maid.verified === false;
        return true;
      });
    }

    setFilteredMaids(filtered);
    setFilterVisible(false);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Search Bar with Wishlist Icon */}
      <View className="flex-row items-center justify-between px-4 my-4">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 flex-1 mr-3">
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput
            className="ml-2 flex-1 font-SF-light rounded-full text-gray-800"
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Wishlist icon with counter badge */}
        <TouchableOpacity 
          onPress={navigateToWishlist}
          className="relative p-2"
        >
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons name="heart" size={28} color="#ff3b30" />
          </Animated.View>
          
          {wishlist.length > 0 && (
            <View className="absolute top-0 right-0 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              <Text className="text-white text-xs font-SF-bold">{wishlist.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <View className="flex-row justify-around px-4 mb-2">
        <TouchableOpacity className="flex-row items-center px-4 py-2 bg-gray-200 rounded-full">
          <Ionicons name="swap-vertical-outline" size={16} color="black" />
          <Text className="ml-2 text-sm font-SF-medium">Sort</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
          className="flex-row items-center px-4 py-2 bg-gray-200 rounded-full"
        >
          <Ionicons name="filter-outline" size={16} color="black" />
          <Text className="ml-2 text-sm font-SF-medium">Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Maid List */}
      {filteredMaids.length > 0 ? (
        <FlatList
          className="p-2 bg-gray-100"
          data={filteredMaids}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MaidProfileScreen", { maid: item });
              }}
              className="bg-white p-5 mx-4 m-3 rounded-xl shadow-md relative"
            >
              {/* Heart Icon for Wishlist */}
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  toggleWishlist(item);
                }}
                className="absolute top-2 right-2 z-20"
              >
                <Ionicons 
                  name="heart" 
                  size={24} 
                  color={wishlist.some(maid => maid.id === item.id) ? "#ff3b30" : "#d3d3d3"} 
                />
              </TouchableOpacity>

              <View className="flex-row">
                <Image
                  source={{ uri: item.imageURI }}
                  className="w-[30%] h-full rounded-lg"
                />
                <View className="ml-4 flex-1">
                  <View className="flex-row items-center mb-3">
                    <Text className="text-blue-500 mr-2 text-lg font-SF-semibold">
                      {item.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="gold" />
                      <Text className="ml-1 text-sm font-SF-medium">
                        {item.rating} ({item.reviews})
                      </Text>
                    </View>
                  </View>
                  
                  <Text className="text-gray-500 font-SF-light">
                    {item.job.join(", ")}
                  </Text>
                  <Text className="text-sm font-SF-regular text-gray-600">
                    Age: {item.age} Years
                  </Text>
                  <Text className="text-sm font-SF-regular text-gray-600">
                    Experience: {item.experience} Years
                  </Text>
                </View>
              </View>
              
              {/* Verification Badge moved to bottom right */}
              <View className="absolute bottom-2 right-2">
                {item.verified ? (
                  <View className="px-2 py-1 rounded-full bg-green-100">
                    <View className="flex-row items-center">
                      <Ionicons name="shield-checkmark" size={12} color="green" />
                      <Text className="text-xs ml-1 font-SF-medium text-green-700">
                        Verified
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="px-2 py-1 rounded-full bg-gray-100">
                    <View className="flex-row items-center">
                      <Ionicons name="alert-circle" size={12} color="gray" />
                      <Text className="text-xs ml-1 font-SF-medium text-gray-500">
                        Not Verified
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        // Show animation when no maids are found
        <View className="flex-1 justify-center items-center">
          <LottieView
            source={require("../../assets/animations/no-results.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text className="text-gray-600 px-3 font-SF-semibold text-lg mt-4">
            Oops! No service/Maid available at this time as per your requirements.
          </Text>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View className="flex-1 bg-white py-5 rounded-t-lg">
          <Text className="text-xl font-SF-semibold bg-blue-500 text-white py-5 text-center mb-4">
            Filter Options
          </Text>
          <ScrollView className="px-5">
            {/* Main Categories */}
            {Object.keys(filterOptions).map((category) => (
              <View key={category} className="mb-2 border-b border-gray-300">
                <TouchableOpacity
                  onPress={() => toggleCategory(category)}
                  className="flex-row justify-between py-3"
                >
                  <Text className="text-lg font-SF-medium">
                    {filterOptions[category].label}
                  </Text>
                  <Ionicons
                    name={
                      expandedCategory === category
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>

                {/* Subcategories */}
                {expandedCategory === category && (
                  <View className="pl-4 mb-2">
                    {Object.keys(filterOptions[category].subCategories).map((subCategory) => (
                      <View key={subCategory}>
                        <TouchableOpacity
                          onPress={() => toggleSubCategory(subCategory)}
                          className="flex-row justify-between py-2"
                        >
                          <Text className="text-md font-SF-semibold">
                            {filterOptions[category].subCategories[subCategory].label}
                          </Text>
                          <Ionicons
                            name={
                              expandedSubCategory === subCategory
                                ? "chevron-up-outline"
                                : "chevron-down-outline"
                            }
                            size={18}
                            color="black"
                          />
                        </TouchableOpacity>

                        {/* Options for each subcategory */}
                        {expandedSubCategory === subCategory && (
                          <View className="pl-4 mb-2">
                            {filterOptions[category].subCategories[subCategory].options.map((option) => (
                              <TouchableOpacity
                                key={option}
                                className="flex-row items-center py-2"
                                onPress={() => toggleCheckbox(subCategory, option)}
                              >
                                <Checkbox
                                  value={
                                    subCategory === "job" || subCategory === "language"
                                      ? selectedFilters[subCategory]?.includes(option)
                                      : selectedFilters[subCategory] === option
                                  }
                                  onValueChange={() => toggleCheckbox(subCategory, option)}
                                />
                                <Text className="ml-2 font-SF-light text-sm">{option}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Buttons */}
          <View className="flex-row justify-between mx-4 mt-4 mb-2">
            <TouchableOpacity
              onPress={() =>
                setSelectedFilters({
                  job: [],
                  experience: null,
                  rating: null,
                  servicePlanDuration: null,
                  gender: null,
                  age: null,
                  religion: null,
                  petFriendly: null,
                  language: [],
                  maritalStatus: null,
                  verified: null,
                })
              }
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              <Text className="text-black text-sm font-SF-medium">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={applyFilters}
              className="px-4 py-2 bg-blue-500 rounded-md"
            >
              <Text className="text-white text-sm font-SF-medium">Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MaidListScreen;