import { createStackNavigator } from "@react-navigation/stack";
import MaidScreen from "./MaidScreens/MaidScreen";
import MaidProfileScreen from "./MaidScreens/MaidProfileScreen";
import MaidBookingScreen from "./MaidScreens/MaidBookingScreen";
import MaidServiceFormScreen from "./MaidScreens/MaidServiceFormScreen";
import DateAndTimeScreen from "./MaidScreens/DateAndTimeScreen";
import CheckoutPage from "./MaidScreens/CheckoutPage";
import PaymentScreen from "./MaidScreens/PaymentScreen";
import BookingSuccessful from "./MaidScreens/BookingSuccessful";
import WishListScreen from "./MaidScreens/WishlistScreen";
import MaidTabHomeScreen from "./MaidScreens/MaidTabHomeScreen";

const Stack = createStackNavigator();

const MaidScreenLayout = () => {
  return (
    <Stack.Navigator initialRouteName="MaidTabHomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MaidScreen" component={MaidScreen} />
      <Stack.Screen name="MaidProfileScreen" component={MaidProfileScreen} />
      <Stack.Screen name="MaidBookingScreen" component={MaidBookingScreen} />
      {/* <Stack.Screen name="MaidBookingScreen" component={MaidBookingScreen} /> */}
      <Stack.Screen name="MaidServiceFormScreen" component={MaidServiceFormScreen} />
      <Stack.Screen name="DateAndTimeScreen" component={DateAndTimeScreen} />
      <Stack.Screen name="MaidTabHomeScreen" component={MaidTabHomeScreen} />
      <Stack.Screen name="CheckoutPage" component={CheckoutPage} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="BookingSuccessful" component={BookingSuccessful} />
      <Stack.Screen name="WishListScreen" component={WishListScreen} />
    </Stack.Navigator>
  );
};

export default MaidScreenLayout;