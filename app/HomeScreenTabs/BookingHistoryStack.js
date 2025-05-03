import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookingHistory from "./BookingHistory/BookingHistory";
import DetailedHistoryPage from "./BookingHistory/DetailedHistoryPage";
import ReviewServiceScreen from "./BookingHistory/ReviewServiceScreen";
import HelpSupportScreen from "./HelpSupportScreen";

const Stack = createNativeStackNavigator();

const BookingHistoryStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookingHistory" component={BookingHistory} />
      <Stack.Screen name="DetailedHistoryPage" component={DetailedHistoryPage} />
      <Stack.Screen name="ReviewServiceScreen" component={ReviewServiceScreen} />
      <Stack.Screen name="HelpSupportScreen" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
};

export default BookingHistoryStack;
