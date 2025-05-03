import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./ProfileScreens/ProfileScreen";
import EditProfileScreen from "./ProfileScreens/EditProfileScreen";
import ForgotPasswordScreen from "./ProfileScreens/ForgotPasswordScreen";
import VerifyOtpScreen from "./ProfileScreens/VerifyOtpScreen";
import ResetPasswordScreen from "./ProfileScreens/ResetPasswordScreen";
import ChangeCommunity from "./ProfileScreens/ChangeCommunity";
import HouseDetails from "./ProfileScreens/HouseDetails";
import HelpAndSupport from "./ProfileScreens/HelpAndSupport";
import FavoritesScreen from "./ProfileScreens/FavoritesScreen";

const Stack = createStackNavigator();

const ProfileScreenLayout = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="VerifyOtpScreen" component={VerifyOtpScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      <Stack.Screen name="ChangeCommunity" component={ChangeCommunity} />
      <Stack.Screen name="HouseDetailsScreen" component={HouseDetails} />
      <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
    </Stack.Navigator>
  );
};

export default ProfileScreenLayout;