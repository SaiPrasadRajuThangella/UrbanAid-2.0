import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from "react-redux";

const ProfileScreen = ({ navigation }) => {
  // Get wishlist count from Redux store
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  return (
    <View className="flex-1 bg-white p-4">
      {/* Profile Info */}
      <View className="items-center mt-6 px-6 gap-2 flex-row">
        <Image 
          source={require("../../../assets/images/user.jpeg")} 
          className="w-28 h-28 rounded-full" 
        />
        <View>
          <Text className="text-sm font-SF-semibold mt-2">Test-User</Text>
          <Text className="text-sm font-SF-light text-gray-500">Test-User@gmail.com</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfileScreen")}
            className="mt-3 bg-blue-600 px-3 py-1 rounded-lg"
          >
            <Text className="text-white text-sm text-center font-SF-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Options */}
      <View className="mt-6 px-4">
        <ProfileOption 
          iconName="heart" 
          title="Favourites" 
          onPress={() => navigation.navigate("FavoritesScreen")}
          badge={wishlistCount > 0 ? wishlistCount.toString() : null}
        />
        <ProfileOption iconName="download" title="Downloads" />
        <ProfileOption iconName="globe" title="Languages" />
        <ProfileOption 
          onPress={() => navigation.navigate("ChangeCommunity")} 
          iconName="location" 
          title="Addresses" 
        />
        <ProfileOption iconName="tv" title="Subscription" />
        <ProfileOption iconName="phone-portrait" title="Display" />
        <ProfileOption 
          onPress={() => navigation.navigate("HelpAndSupport")} 
          iconName="help-circle" 
          title="Help and Support" 
        />
      </View>

      {/* Other Options */}
      <View className="mt-6 px-4 border-t border-gray-200 pt-4">
        <ProfileOption iconName="trash" title="Clear Cache" />
        <ProfileOption iconName="time" title="Clear History" />
        <ProfileOption iconName="log-out" title="Log Out" />
      </View>
    </View>
  );
};

// ProfileOption component with onPress handling and optional badge
const ProfileOption = ({ iconName, title, onPress, badge }) => (
  <TouchableOpacity 
    className="flex-row justify-between items-center py-3" 
    onPress={onPress}
  >
    <View className="flex-row items-center gap-4 mt-2 space-x-3">
      <Ionicons name={iconName} size={20} color="black" />
      <Text className="text-gray-700 font-SF-regular">{title}</Text>
    </View>
    <View className="flex-row items-center">
      {badge && (
        <View className="bg-red-500 rounded-full w-5 h-5 flex items-center justify-center mr-2">
          <Text className="text-white text-xs font-SF-bold">{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color="gray" />
    </View>
  </TouchableOpacity>
);

export default ProfileScreen;