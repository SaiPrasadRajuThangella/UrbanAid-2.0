import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Animated,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const options = {
  rooms: ["1", "2", "3", "4", "Custom"],
  washrooms: ["1", "2", "3", "4", "Custom"],
  residents: ["1", "2", "3", "4", "Custom"],
  homeSize: ["<500", "500 - 999", "1000 - 1999", "2000 - 2999", "3000 - 4999", "5000+"],
};

const HomeDetailsScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [selected, setSelected] = useState({
    rooms: null,
    washrooms: null,
    residents: null,
    homeSize: null,
  });
  
  // State for custom values
  const [customValues, setCustomValues] = useState({
    rooms: "",
    washrooms: "",
    residents: "",
  });
  
  // State for managing custom input modal
  const [customModal, setCustomModal] = useState({
    visible: false,
    category: null,
  });
  
  // State for success/redirect modal
  const [successModal, setSuccessModal] = useState(false);
  
  // State for skip confirmation modal
  const [skipConfirmModal, setSkipConfirmModal] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const buttonSlideAnim = useRef(new Animated.Value(40)).current;
  
  // Reference for text input
  const inputRef = useRef(null);

  useEffect(() => {
    // Start animations when component mounts
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonSlideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSelect = (category, value) => {
    if (value === "Custom") {
      // Open custom input modal
      setCustomModal({
        visible: true,
        category: category,
      });
    } else {
      setSelected({ ...selected, [category]: value });
      
      // Create a small "pop" animation when an option is selected
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.8, duration: 50, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleCustomInput = (text) => {
    // Only allow numeric input
    const numericValue = text.replace(/[^0-9]/g, '');
    
    setCustomValues({
      ...customValues,
      [customModal.category]: numericValue,
    });
  };

  const saveCustomValue = () => {
    const { category } = customModal;
    const value = customValues[category];
    
    if (!value) {
      Alert.alert("Invalid Input", "Please enter a valid number.");
      return;
    }
    
    // Just store the number value itself instead of "Custom (value)"
    setSelected({ ...selected, [category]: value });
    setCustomModal({ visible: false, category: null });
    
    // Create a small "pop" animation when a custom option is selected
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.8, duration: 50, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const cancelCustomValue = () => {
    setCustomModal({ visible: false, category: null });
  };

  // Check if all required fields are selected
  const allFieldsSelected = Object.values(selected).every((value) => value !== null);

  const handleSave = () => {
    if (allFieldsSelected) {
      setSuccessModal(true);
      setTimeout(() => {
        setSuccessModal(false);
        router.push("./HomeScreenTabs/HomeScreenLayout");
      }, 2000);
    } else {
      // Highlight missing fields
      Alert.alert(
        "Incomplete Information",
        "Please fill in all the fields to continue.",
        [{ text: "OK" }]
      );
    }
  };

  const handleSkipRequest = () => {
    setSkipConfirmModal(true);
  };

  const handleSkipConfirm = () => {
    setSkipConfirmModal(false);
    setSuccessModal(true);
    setTimeout(() => {
      setSuccessModal(false);
      router.push("./HomeScreenTabs/HomeScreenLayout");
    }, 2000);
  };

  const renderSectionTitle = (title, icon) => (
    <View style={styles.sectionTitleContainer}>
      <Ionicons name={icon} size={20} color="#3B82F6" />
      <Text style={styles.sectionTitle}>
        {title}
      </Text>
    </View>
  );

  // Function to render selection options with visual improvements
  const renderOptions = (category, options) => (
    <View style={styles.optionsContainer}>
      {options.map((item) => {
        // Changed isSelected logic since we now store only the number for custom values
        const isSelected = 
          item === "Custom" 
            ? selected[category] && !options.slice(0, -1).includes(selected[category])
            : selected[category] === item;
         
        // Display the custom number value instead of "Custom" when selected
        const displayText = 
          (item === "Custom" && isSelected) 
            ? selected[category]
            : item;
          
        return (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionButton,
              isSelected ? styles.selectedOption : styles.unselectedOption
            ]}
            onPress={() => handleSelect(category, item)}
          >
            <Text
              style={[
                styles.optionText,
                isSelected ? styles.selectedOptionText : styles.unselectedOptionText
              ]}
            >
              {displayText}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header with Skip button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkipRequest}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Title & Description */}
      <Animated.View 
        style={[
          styles.titleContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <Text style={styles.titleText}>
          Tell Us About Your Home
        </Text>
        <Text style={styles.descriptionText}>
          These details help us tailor our service to your needs
        </Text>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        {/* Rooms Section */}
        <Animated.View 
          style={[
            styles.sectionCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          {renderSectionTitle("Rooms & Spaces", "bed-outline")}
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              Number of Rooms {selected.rooms ? `(${selected.rooms})` : ""}
            </Text>
            {renderOptions("rooms", options.rooms)}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              Number of Washrooms {selected.washrooms ? `(${selected.washrooms})` : ""}
            </Text>
            {renderOptions("washrooms", options.washrooms)}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              Number of Residents {selected.residents ? `(${selected.residents})` : ""}
            </Text>
            {renderOptions("residents", options.residents)}
          </View>
        </Animated.View>

        {/* Home Size Section */}
        <Animated.View
          style={[
            styles.sectionCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          {renderSectionTitle("Property Size", "home-outline")}
          
          <Text style={styles.fieldLabel}>
            Approximate Size of Your Home (sqft.)
          </Text>
          <View style={styles.optionsContainer}>
            {options.homeSize.map((size) => {
              const isSelected = selected.homeSize === size;
              
              return (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOptionButton,
                    isSelected ? styles.selectedOption : styles.unselectedOption
                  ]}
                  onPress={() => handleSelect("homeSize", size)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected ? styles.selectedOptionText : styles.unselectedOptionText
                    ]}
                    numberOfLines={1}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {Object.keys(selected).map((key, index) => (
            <View 
              key={index}
              style={[
                styles.progressDot,
                selected[key] !== null ? styles.progressDotActive : styles.progressDotInactive
              ]}
            />
          ))}
        </View>

        {/* Save Button */}
        <Animated.View
          style={[
            styles.saveButtonContainer,
            {
              transform: [{ translateY: buttonSlideAnim }],
              opacity: fadeAnim
            }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.saveButton,
              allFieldsSelected ? styles.saveButtonEnabled : styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!allFieldsSelected}
          >
            <Text style={styles.saveButtonText}>
              {allFieldsSelected ? "Save Home Details" : "Complete All Fields"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Custom Value Input Modal */}
      <Modal
        transparent={true}
        visible={customModal.visible}
        animationType="fade"
        onRequestClose={cancelCustomValue}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Enter Custom {customModal.category === "rooms" 
                  ? "Room" 
                  : customModal.category === "washrooms" 
                    ? "Washroom" 
                    : "Resident"} Count
              </Text>
              
              <TextInput
                ref={inputRef}
                style={styles.customInput}
                placeholder="Enter number"
                keyboardType="number-pad"
                value={customValues[customModal.category]}
                onChangeText={handleCustomInput}
                maxLength={2}
                autoFocus
              />
              
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={cancelCustomValue}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={saveCustomValue}
                >
                  <Text style={styles.modalSaveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Skip Confirmation Modal */}
      <Modal
        transparent={true}
        visible={skipConfirmModal}
        animationType="fade"
        onRequestClose={() => setSkipConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Skip this step?
            </Text>
            <Text style={styles.modalMessage}>
              You can always complete your home details later from your profile settings.
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setSkipConfirmModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSkipConfirm}
              >
                <Text style={styles.modalSaveButtonText}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success/Redirect Modal */}
      <Modal
        transparent={true}
        visible={successModal}
        animationType="fade"
        onRequestClose={() => setSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <LottieView
              source={require("../assets/animations/success.json")}
              autoPlay
              loop={false}
              style={styles.lottieAnimation}
            />
            <Text style={styles.successTitle}>
              SIGNED IN
            </Text>
            <Text style={styles.successMessage}>
              It generally takes a few minutes to redirect. Please do not refresh.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop:10,
    paddingBottom:20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EBF5FF',
  },
  skipButtonText: {
    color: '#3B82F6',
    fontFamily: 'SF-semibold',
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  titleText: {
    fontSize: 24,
    fontFamily: 'SF-bold',
    color: '#111827',
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'SF-regular',
    color: '#6B7280',
    marginTop: 8,
  },
  scrollContent: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'SF-semibold',
    color: '#1F2937',
    marginLeft: 8,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: 'SF-medium',
    color: '#4B5563',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  optionButton: {
    width: '18%',
    height: 36,
    paddingVertical: 0,
    marginRight: 6,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeOptionButton: {
    width: '45%',
    height: 36,
    paddingVertical: 0,
    paddingHorizontal: 4,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  unselectedOption: {
    backgroundColor: '#F3F4F6',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'SF-medium',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  unselectedOptionText: {
    color: '#4B5563',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  progressDot: {
    height: 8,
    width: 40,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  progressDotActive: {
    backgroundColor: '#3B82F6',
  },
  progressDotInactive: {
    backgroundColor: '#E5E7EB',
  },
  saveButtonContainer: {
    marginBottom: 20,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  saveButtonEnabled: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowColor: '#9CA3AF',
  },
  saveButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'SF-semibold',
  },
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    maxWidth: 320,
  },
  successModalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'SF-bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'SF-regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontFamily: 'SF-regular',
    marginBottom: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  modalCancelButtonText: {
    color: '#6B7280',
    fontFamily: 'SF-medium',
    fontSize: 16,
  },
  modalSaveButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'SF-medium',
    fontSize: 16,
  },
  lottieAnimation: {
    width: 100,
    height: 100,
  },
  successTitle: {
    fontSize: 20,
    fontFamily: 'SF-bold',
    color: '#1F2937',
    marginTop: 16,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: 'SF-regular',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default HomeDetailsScreen;