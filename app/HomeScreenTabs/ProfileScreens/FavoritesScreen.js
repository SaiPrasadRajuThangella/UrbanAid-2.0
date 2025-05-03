import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../../redux/slices/wishlistSlice";
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  // Access wishlist items from Redux store
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (itemId) => {
    dispatch(removeFromWishlist(itemId));
  };

  // Navigate to maid profile
  const navigateToMaidProfile = (maid) => {
    navigation.navigate("MaidProfileScreen", { maid });
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-blue-500 px-4 py-5">
        <Text className="text-white text-xl font-SF-semibold text-center">
          Favorites
        </Text>
      </View>

      {wishlistItems.length > 0 ? (
        <FlatList
          className="p-2 bg-gray-100"
          data={wishlistItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigateToMaidProfile(item)}
              className="bg-white p-5 mx-4 m-3 rounded-xl shadow-md relative"
            >
              {/* Heart Icon for Wishlist */}
              <TouchableOpacity
                onPress={() => handleRemoveFromWishlist(item.id)}
                className="absolute top-2 right-2 z-20"
              >
                <Ionicons name="heart" size={24} color="#ff3b30" />
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
              
              {/* Verification Badge */}
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
        // Show animation when no items in wishlist
        <View className="flex-1 justify-center items-center">
          {/* <LottieView
            source={require("../assets/animations/no-results.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          /> */}
          <Text className="text-gray-600 px-3 font-SF-semibold text-lg mt-4">
            Your favorites list is empty
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate("MaidScreen")}
            className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-SF-medium">Browse Maids</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FavoritesScreen;