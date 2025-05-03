import React, { useEffect, useRef, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  StatusBar,
  SafeAreaView,
  StyleSheet
} from "react-native";
import { Video } from "expo-av";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  // Use useFocusEffect to handle screen focus and blur properly
  useFocusEffect(
    React.useCallback(() => {
      // Set status bar for welcome screen when focused
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("transparent");
      StatusBar.setTranslucent(true);
      
      // Delay animations slightly to ensure proper rendering order
      setTimeout(() => {
        // Animation sequence
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            delay: 100,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
            delay: 100,
          }),
          Animated.spring(logoScale, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
            delay: 100,
          }),
        ]).start();
      }, 50);

      // Cleanup function when screen loses focus
      return () => {
        // Reset status bar to default values when navigating away
        StatusBar.setBarStyle("dark-content");
        StatusBar.setBackgroundColor("#FFFFFF");
        StatusBar.setTranslucent(false);
        
        // Stop and unload video
        if (videoRef.current) {
          videoRef.current.stopAsync();
        }
        
        // Reset animations
        fadeAnim.setValue(0);
        slideAnim.setValue(50);
        logoScale.setValue(0.8);
      };
    }, [])
  );

  // Cleanup video when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);

  const toggleMute = () => {
    setMuted(!muted);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    videoContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.1)'
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20
    },
    logo: {
      width: 176, 
      height: 176, 
      marginBottom: 20,
      resizeMode: "contain"
    },
    blurContainer: {
      borderRadius: 8, 
      padding: 16, 
      marginBottom: 20, 
      overflow: 'hidden',
      maxWidth: width * 0.8, 
      alignSelf: 'center'
    },
    blurText: {
      fontSize: 16,
      color: 'white',
      textAlign: 'center',
      fontFamily: 'SF-semibold',
      lineHeight: 24
    },
    servicesContainer: {
      paddingVertical: 16,
      paddingHorizontal: 20
    },
    servicesRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20
    },
    serviceItem: {
      alignItems: 'center'
    },
    serviceIcon: {
      width: 64, 
      height: 64, 
      borderRadius: 32, 
      backgroundColor: 'rgba(219, 234, 254, 0.8)', 
      alignItems: 'center', 
      justifyContent: 'center', 
      marginBottom: 4
    },
    serviceText: {
      fontSize: 12,
      color: 'white',
      fontFamily: 'SF-Medium'
    },
    bottomContainer: {
      width: '100%',
      paddingHorizontal: 20,
      paddingBottom: 32,
      // Ensure the container itself doesn't have shadow properties
      // so that it doesn't show before content
    },
    buttonContainer: {
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      // Added backgroundColor to prevent transparent shadow container
      backgroundColor: 'transparent'
    },
    gradient: {
      padding: 18,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      // Make sure gradient fills entire button area
      width: '100%'
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontFamily: 'SF-medium'
    },
    loginButton: {
      borderRadius: 12,
      padding: 18,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      alignItems: 'center',
      justifyContent: 'center'
    },
    loginText: {
      color: '#2563eb',
      fontSize: 16,
      fontFamily: 'SF-medium'
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="light-content" translucent backgroundColor="transparent" /> */}
      
      {/* Video Background */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={require("../assets/video/bg-video.mp4")}
          style={{width: '100%', height: '100%'}}
          resizeMode="cover"
          shouldPlay
          isLooping
          rate={1.0}
          volume={1.0}
          muted={muted}
        />
      </View>

      {/* Subtle dark overlay to make text more readable */}
      <View style={styles.overlay} />

      {/* Content Section */}
      <Animated.View 
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: logoScale }
            ]
          }
        ]}
      >
        <Image
          source={require("../assets/images/logos/urbanAidlogo1.png")}
          style={styles.logo}
        />
        
        <BlurView 
          intensity={30} 
          tint="dark" 
          style={styles.blurContainer}
        >
          <Text style={styles.blurText}>
            Over 200,000 home service pros in 50+ industries trust us
          </Text>
        </BlurView>
      </Animated.View>

      {/* Services Preview */}
      <View style={styles.servicesContainer}>
        <View style={styles.servicesRow}>
          {/* Sample service icons - replace with your actual services */}
          {['Cleaning', 'Plumbing', 'Electrical', 'Gardening'].map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <View style={styles.serviceIcon}>
                <MaterialIcons name={
                  index === 0 ? "cleaning-services" : 
                  index === 1 ? "plumbing" : 
                  index === 2 ? "electrical-services" : 
                  "grass"
                } size={30} color="#3b82f6" />
              </View>
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Section - Now using a single Animated.View for both buttons to ensure synchronized animation */}
      <Animated.View 
        style={[
          styles.bottomContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Get Started Button with shadow contained within the animated view */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("signuppage")}
            activeOpacity={0.8}
            style={{width: '100%', borderRadius: 12, overflow: 'hidden'}}
          >
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>
                Get Started
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("loginpage")}
          activeOpacity={0.8}
        >
          <Text style={styles.loginText}>
            Already have an account? Log In
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;