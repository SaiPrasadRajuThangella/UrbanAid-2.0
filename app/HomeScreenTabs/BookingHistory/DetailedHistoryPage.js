import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const DetailedHistoryPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;

  // Handler functions for different actions
  const handleCancel = () => {
    navigation.navigate("CancelBookingScreen", { booking: item });
  };

  const handleReschedule = () => {
    navigation.navigate("RescheduleBookingScreen", { booking: item });
  };

  const handleReview = () => {
    navigation.navigate("ReviewServiceScreen", { booking: item });
  };

  const handleBookAgain = () => {
    navigation.navigate("BookingScreen", { repeatBooking: item });
  };

  // Enhanced renderActionButtons function based on payment status and isPast
  const renderActionButtons = () => {
    // Title for the action buttons section
    const renderTitle = () => (
      <Text className="text-lg font-SF-bold text-gray-800 mb-3">
        {item.paymentStatus === "Service done, bill pending"
          ? "Payment & Options"
          : "Service Options"}
      </Text>
    );

    // Common button styling for all payment status scenarios - all blue with white text
    const renderButton = (icon, label, onPress, marginBottom = true) => (
      <TouchableOpacity
        onPress={onPress}
        className={`bg-blue-600 rounded-xl py-4 px-4 flex-row items-center shadow ${
          marginBottom ? "mb-3" : ""
        }`}
        activeOpacity={0.7}
      >
        <View className="bg-blue-700 p-2 rounded-full mr-3">


            <Ionicons name={icon} size={15} color="white" />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-white font-SF-semibold text-base">
              {label}
            </Text>
          </View>
          {label === "Review Service" && (
            <Text className="text-white font-SF-light text-xs">
              Share your experience
            </Text>
          )}
          {label === "Book Again" && (
            <Text className="text-white font-SF-light text-xs">
              Quick rebooking with same details
            </Text>
          )}
          {label === "Make Payment" && (
            <Text className="text-white font-SF-light text-xs">
              Complete your pending payment
            </Text>
          )}
          {label === "Reschedule" && (
            <Text className="text-white font-SF-light text-xs">
              Change your service date and time
            </Text>
          )}
          {label === "Cancel Booking" && (
            <Text className="text-white font-SF-light text-xs">
              Cancel this service
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="white" />
      </TouchableOpacity>
    );

    // Service done, bill paid
    if (item.paymentStatus === "Service done, bill paid") {
      return (
        <>
          {renderTitle()}
          <View>
            {renderButton("star-outline", "Review Service", handleReview)}
            {renderButton("repeat", "Book Again", handleBookAgain, false)}
          </View>
        </>
      );
    }
    // Service done, bill pending
    else if (item.paymentStatus === "Service done, bill pending") {
      return (
        <>
          {renderTitle()}
          <View>
            {renderButton("card-outline", "Make Payment", () =>
              navigation.navigate("PaymentScreen", { booking: item })
            )}
            {renderButton("star-outline", "Review Service", handleReview)}
            {item.isPast
              ? renderButton("repeat", "Book Again", handleBookAgain, false)
              : renderButton(
                  "calendar-outline",
                  "Reschedule",
                  handleReschedule,
                  false
                )}
          </View>
        </>
      );
    }
    // Upcoming bookings (not yet serviced)
    else if (!item.isPast) {
      return (
        <>
          {renderTitle()}
          <View>
            {renderButton("calendar-outline", "Reschedule", handleReschedule)}
            {renderButton(
              "close-circle-outline",
              "Cancel Booking",
              handleCancel,
              false
            )}
          </View>
        </>
      );
    }
    // Default for any other status (past bookings)
    else {
      return (
        <>
          {renderTitle()}
          <View>
            {renderButton("star-outline", "Review Service", handleReview)}
            {renderButton("repeat", "Book Again", handleBookAgain, false)}
          </View>
        </>
      );
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 p-4">
        {/* Header with back button */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-SF-bold text-gray-800">
            Booking Details
          </Text>
        </View>

        {/* Booking Details Card */}
        <View className="bg-white rounded-xl shadow-lg p-5 mb-4">
          {/* Service Type and Amount */}
          <View className="flex-row justify-between items-start mb-5">
            <View>
              <Text className="text-2xl font-SF-bold text-gray-800">
                {item.serviceType}
              </Text>
              <Text className="text-gray-500 font-SF-medium">
                {item.maidName}
              </Text>
            </View>
            <View>
              <Text className="text-xl font-SF-bold text-gray-800 text-right">
                {item.amount}
              </Text>
              <Text className="text-gray-500 font-SF-medium text-right">
                {item.paymentMode}
              </Text>
            </View>
          </View>

          {/* Status Tag */}
          <View className="mb-5">
            <View
              className={
                item.paymentStatus === "Service done, bill paid"
                  ? "flex-row items-center bg-green-100 rounded-md px-3 py-2 self-start"
                  : "flex-row items-center bg-yellow-100 rounded-md px-3 py-2 self-start"
              }
            >
              {item.paymentStatus === "Service done, bill paid" ? (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color="#22C55E"
                  style={{ marginRight: 6 }}
                />
              ) : (
                <Ionicons
                  name="time"
                  size={16}
                  color="#EAB308"
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                className={
                  item.paymentStatus === "Service done, bill paid"
                    ? "text-green-600 font-SF-semibold text-sm"
                    : "text-yellow-600 font-SF-semibold text-sm"
                }
              >
                {item.paymentStatus}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View className="border-t border-gray-200 my-3" />

          {/* Booking and Service Date */}
          <View className="mt-2 mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#6B7280"
                style={{ marginRight: 8, width: 20 }}
              />
              <View>
                <Text className="text-gray-500 font-SF-regular text-sm">
                  Booked on
                </Text>
                <Text className="text-gray-800 font-SF-medium">
                  {item.bookingDate}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="calendar"
                size={18}
                color="#6B7280"
                style={{ marginRight: 8, width: 20 }}
              />
              <View>
                <Text className="text-gray-500 font-SF-regular text-sm">
                  Service date
                </Text>
                <Text className="text-gray-800 font-SF-medium">
                  {item.serviceDate}
                </Text>
              </View>
            </View>
          </View>

          {/* Time and Duration */}
          <View className="mb-4">
            <View className="flex-row items-center">
              <Ionicons
                name="time-outline"
                size={18}
                color="#6B7280"
                style={{ marginRight: 8, width: 20 }}
              />
              <View>
                <Text className="text-gray-500 font-SF-regular text-sm">
                  Time slot
                </Text>
                <Text className="text-gray-800 font-SF-medium">
                  {item.time} ({item.duration})
                </Text>
              </View>
            </View>
          </View>

          {/* Location */}
          <View className="mb-4">
            <View className="flex-row">
              <Ionicons
                name="location-outline"
                size={18}
                color="#6B7280"
                style={{ marginRight: 8, width: 20, marginTop: 2 }}
              />
              <View className="flex-1">
                <Text className="text-gray-500 font-SF-regular text-sm">
                  Service location
                </Text>
                <Text className="text-gray-800 font-SF-medium">
                  {item.address}
                </Text>
              </View>
            </View>
          </View>

          {/* Transaction Details */}
          <View className="mb-2">
            <View className="flex-row">
              <Ionicons
                name="card-outline"
                size={18}
                color="#6B7280"
                style={{ marginRight: 8, width: 20 }}
              />
              <View>
                <Text className="text-gray-500 font-SF-regular text-sm">
                  Transaction ID
                </Text>
                <Text className="text-gray-800 font-SF-medium">
                  {item.bookingId}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Service Provider Section */}
        <View className="bg-white rounded-xl shadow-lg p-5 mb-4">
          <Text className="text-lg font-SF-bold text-gray-800 mb-3">
            Service Provider
          </Text>
          <View className="flex-row items-center">
            <View className="h-12 w-12 rounded-full bg-gray-300 mr-3 items-center justify-center">
              <Ionicons name="person" size={24} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-SF-semibold">
                {item.maidName}
              </Text>
              <Text className="text-gray-500 font-SF-regular">
                Professional {item.serviceType} Expert
              </Text>
            </View>
            <TouchableOpacity
              className="bg-blue-500 rounded-md px-3 py-2 flex-row items-center"
              onPress={() => {
                // In a real app, you would use Linking API to make a phone call
                // Linking.openURL(`tel:${serviceProviderPhone}`);
                alert("Calling service provider...");
              }}
            >
              <Ionicons
                name="call-outline"
                size={16}
                color="#FFFFFF"
                style={{ marginRight: 4 }}
              />
              <Text className="text-white font-SF-medium">Call</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row mt-4 border border-gray-200 rounded-md overflow-hidden">
            <TouchableOpacity
              className="flex-1 py-3 flex-row items-center justify-center"
              onPress={() =>
                navigation.navigate("MessageScreen", {
                  provider: item.maidName,
                })
              }
            >
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color="#3B82F6"
                style={{ marginRight: 4 }}
              />
              <Text className="text-blue-500 font-SF-medium">Message</Text>
            </TouchableOpacity>

            <View className="w-px bg-gray-300 h-full" />

            <TouchableOpacity
              className="flex-1 py-3 flex-row items-center justify-center"
              onPress={() =>
                navigation.navigate("ReportIssueScreen", { booking: item })
              }
            >
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color="#3B82F6"
                style={{ marginRight: 4 }}
              />
              <Text className="text-blue-500 font-SF-medium">Report Issue</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Options */}
        <View className="bg-white rounded-xl shadow-lg p-5 mb-4">
          <Text className="text-lg font-SF-bold text-gray-800 mb-3">
            Additional Options
          </Text>

          <TouchableOpacity
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={() =>
              navigation.navigate("ViewInvoiceScreen", { booking: item })
            }
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color="#6B7280"
              style={{ marginRight: 12, width: 24, textAlign: "center" }}
            />
            <Text className="flex-1 text-gray-800 font-SF-medium">
              View Invoice
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={() =>
              navigation.navigate("DownloadReceiptScreen", { booking: item })
            }
          >
            <Ionicons
              name="download-outline"
              size={20}
              color="#6B7280"
              style={{ marginRight: 12, width: 24, textAlign: "center" }}
            />
            <Text className="flex-1 text-gray-800 font-SF-medium">
              Download Receipt
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
          </TouchableOpacity>

          {!item.isPast && (
            <TouchableOpacity
              className="flex-row items-center py-3 border-b border-gray-100"
              onPress={() =>
                navigation.navigate("ModifyServiceScreen", { booking: item })
              }
            >
              <Ionicons
                name="create-outline"
                size={20}
                color="#6B7280"
                style={{ marginRight: 12, width: 24, textAlign: "center" }}
              />
              <Text className="flex-1 text-gray-800 font-SF-medium">
                Modify Service Details
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={() =>
              navigation.navigate("HelpSupportScreen", { booking: item })
            }
          >
            <Ionicons
              name="help-circle-outline"
              size={20}
              color="#6B7280"
              style={{ marginRight: 12, width: 24, textAlign: "center" }}
            />
            <Text className="flex-1 text-gray-800 font-SF-medium">
              Help & Support
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View className="bg-white rounded-xl shadow-lg p-5 mb-10">
          {renderActionButtons()}
        </View>
      </ScrollView>
    </View>
  );
};

export default DetailedHistoryPage;
