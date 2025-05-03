import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StatusBar, Animated } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const notifications = [
  {
    id: "1",
    title: "Payment Successful",
    description: "The hotel name has been booked successfully.",
    time: "Now",
    icon: "card-outline",
    date: "Today",
    isRead: false,
  },
  {
    id: "2",
    title: "Reminder",
    description: "Three days left to start your reservation in the hotel name.",
    time: "2 min ago",
    icon: "alarm-outline",
    date: "Today",
    isRead: false,
  },
  {
    id: "3",
    title: "40% Special Discount",
    description: "Special promotion only valid today.",
    time: "1 day ago",
    icon: "pricetag-outline",
    date: "Yesterday",
    isRead: true,
  },
  {
    id: "4",
    title: "Credit Card Connected!",
    description: "Credit Card has been linked.",
    time: "1 day ago",
    icon: "wallet-outline",
    date: "Yesterday",
    isRead: true,
  },
  {
    id: "5",
    title: "40% Special Discount",
    description: "Special promotion only valid today.",
    time: "2 months ago",
    icon: "pricetag-outline",
    date: "December 28, 2024",
    isRead: true,
  },
  {
    id: "6",
    title: "Credit Card Connected!",
    description: "Credit Card has been linked.",
    time: "2 months ago",
    icon: "wallet-outline",
    date: "December 27, 2024",
    isRead: true,
  },
];

const NotificationScreen = ({navigation}) => {
  const router = useRouter();
  const [notificationData, setNotificationData] = useState(notifications);

  // Group notifications by date
  const groupedNotifications = notificationData.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {});

  // Function to mark notification as read
  const markAsRead = (id) => {
    setNotificationData(
      notificationData.map((item) =>
        item.id === id ? { ...item, isRead: true } : item
      )
    );
  };

  // Function to clear all notifications
  const clearAllNotifications = () => {
    setNotificationData([]);
  };

  // Function to get icon background color based on notification type
  const getIconBgColor = (icon) => {
    switch (icon) {
      case "card-outline":
        return "bg-green-500";
      case "alarm-outline":
        return "bg-yellow-500";
      case "pricetag-outline":
        return "bg-purple-500";
      case "wallet-outline":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  // Render empty state
  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center">
      <View className="bg-gray-100 p-6 rounded-full mb-4">
        <Ionicons name="notifications-off-outline" size={50} color="#9CA3AF" />
      </View>
      <Text className="font-SF-bold text-lg text-gray-700 mb-2">No notifications yet</Text>
      <Text className="font-SF-regular text-sm text-gray-500 text-center px-10">
        We'll notify you when something important happens in your account
      </Text>
    </View>
  );

  // Render notification item
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => markAsRead(item.id)}
      className={`p-4 rounded-xl mb-3 flex-row items-start ${
        item.isRead ? "bg-gray-50" : "bg-blue-50 border border-blue-100"
      }`}
      activeOpacity={0.7}
    >
      <View className={`w-12 h-12 ${getIconBgColor(item.icon)} rounded-full items-center justify-center mr-3`}>
        <Ionicons name={item.icon} size={24} color="white" />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text className={`${item.isRead ? "text-gray-800" : "text-black"} font-SF-semibold text-base`}>
            {item.title}
          </Text>
          {!item.isRead && (
            <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
          )}
        </View>
        <Text className={`${item.isRead ? "text-gray-500" : "text-gray-600"} font-SF-regular text-sm mb-1`}>
          {item.description}
        </Text>
        <Text className="text-gray-400 font-SF-regular text-xs">
          {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render date section
  const renderDateSection = ({ item: date }) => (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-500 text-sm font-SF-medium">
          {date}
        </Text>
        {date === "Today" && (
          <TouchableOpacity>
            <Text className="text-blue-500 text-xs font-SF-medium">Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>
      {groupedNotifications[date].map((notification) => (
        <React.Fragment key={notification.id}>
          {renderNotificationItem({ item: notification })}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View className="px-5 pt-12 pb-4 bg-white border-b border-gray-100">
        <View className="flex-row justify-between py-3 items-center">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={()=>navigation.goBack()}
              className="p-1"
            >
              <Ionicons name="chevron-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text className="text-xl font-SF-semibold text-gray-900">Notifications</Text>
          </View>
          {notificationData.length > 0 && (
            <TouchableOpacity 
              onPress={clearAllNotifications}
              className="px-3 py-1 mr-2 rounded-full bg-gray-100"
            >
              <Text className="text-xs font-SF-medium text-gray-600">Clear all</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        {notificationData.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={Object.keys(groupedNotifications)}
            keyExtractor={(date) => date}
            renderItem={renderDateSection}
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Settings button */}
      {notificationData.length > 0 && (
        <View className="absolute bottom-6 right-6">
          <TouchableOpacity className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center shadow-lg">
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default NotificationScreen;