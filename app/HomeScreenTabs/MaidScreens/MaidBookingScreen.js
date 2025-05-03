import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SelectList } from 'react-native-dropdown-select-list';
import { useRoute } from '@react-navigation/native';

const MaidBookingScreen = ({navigation}) => {
  // Get the maid data passed from MaidProfileScreen
  const route = useRoute();
  const maid = route.params?.maid || {};

  // State for selected options
  const [adults, setAdults] = useState(null);
  const [kids, setKids] = useState(null);
  const [pets, setPets] = useState('');
  const [floors, setFloors] = useState(null);
  const [bathrooms, setBathrooms] = useState(null);
  const [dishwashing, setDishwashing] = useState('');
  const [countertopCleaning, setCountertopCleaning] = useState('');
  const [meals, setMeals] = useState(null);
  const [foodType, setFoodType] = useState(null);
  const [washingMethod, setWashingMethod] = useState(null);
  const [drying, setDrying] = useState('');
  const [ironingFolding, setIroningFolding] = useState('');
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(true);
  // State to track if form was filled manually
  const [filledManually, setFilledManually] = useState(false);

  // Dropdown data
  const adultsData = [...Array(10)].map((_, i) => ({key: `${i+1}`, value: `${i+1}`}));
  const kidsData = [...Array(6)].map((_, i) => ({key: `${i}`, value: `${i}`}));
  const bathroomsData = [...Array(5)].map((_, i) => ({key: `${i+1}`, value: `${i+1}`})).concat({key: '6+', value: '6+'});

  // Function to apply random household data
  const applyRandomData = () => {
    setAdults(Math.floor(Math.random() * 5 + 1).toString());
    setKids(Math.floor(Math.random() * 3).toString());
    setPets(['No Pets', 'Dogs', 'Cats', 'Birds', 'Multiple Types'][Math.floor(Math.random() * 5)]);
    setFloors(['1 Floor', '2 Floors', '3 Floors', '4+ Floors'][Math.floor(Math.random() * 4)]);
    setBathrooms(['1', '2', '3', '4', '5', '6+'][Math.floor(Math.random() * 6)]);
    setDishwashing(['Required', 'Not Required'][Math.floor(Math.random() * 2)]);
    setCountertopCleaning(['Required', 'Not Required'][Math.floor(Math.random() * 2)]);
    setMeals(['1 Meal', '2 Meals', 'All 3 Meals', 'Not Required'][Math.floor(Math.random() * 4)]);
    setFoodType(['Vegetarian', 'Non-Vegetarian', 'Both', 'Not Required'][Math.floor(Math.random() * 4)]);
    setWashingMethod(['Machine Wash', 'Hand Wash', 'Both', 'Not Required'][Math.floor(Math.random() * 4)]);
    setDrying(['Required', 'Not Required'][Math.floor(Math.random() * 2)]);
    setIroningFolding(['Required', 'Not Required'][Math.floor(Math.random() * 2)]);
  };

  // Handle user's choice in the modal
  const handleModalResponse = (applyExistingData) => {
    if (applyExistingData) {
      applyRandomData();
    } else {
      setFilledManually(true);
    }
    setModalVisible(false);
  };

  // Custom Radio Button Component
  const CustomRadioButton = ({ selected, onPress, label }) => (
    <TouchableOpacity 
      onPress={onPress}
      className={`px-4 py-2 my-1 rounded-full border ${selected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
    >
      <Text className={`text-sm font-SF-medium ${selected ? 'text-white' : 'text-gray-700'}`}>{label}</Text>
    </TouchableOpacity>
  );

  // Section Header Component
  const SectionHeader = ({ title, icon }) => (
    <View className="flex-row items-center mb-4 mt-2">
      <Icon name={icon} size={22} color="blue" />
      <Text className="text-lg font-SF-bold text-gray-800 ml-2">{title}</Text>
    </View>
  );

  // Radio Options Component to reduce repetition
  const RadioOptions = ({ label, options, value, setValue }) => (
    <>
      <Text className="text-sm font-SF-semibold mt-2 text-gray-700 mb-2">{label}</Text>
      <View className="flex-row flex-wrap mb-5">
        {options.map((option, index) => (
          <React.Fragment key={option}>
            <CustomRadioButton 
              selected={value === option} 
              onPress={() => setValue(option)} 
              label={option} 
            />
            {index < options.length - 1 && <View className="w-2 my-2" />}
          </React.Fragment>
        ))}
      </View>
    </>
  );

  // Function to handle continue button
  const handleContinue = () => {
    // Create service details object
    const serviceDetails = {
      adults,
      kids,
      pets,
      floors,
      bathrooms,
      dishwashing,
      countertopCleaning,
      meals,
      foodType,
      washingMethod,
      drying,
      ironingFolding
    };
    
    // Navigate to DateAndTimeScreen with both maid info and service details
    navigation.navigate("DateAndTimeScreen", {
      maid,
      serviceDetails
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Household Data Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
          <View className="bg-white rounded-xl p-5 w-4/5 shadow-xl border border-blue-200">
            <Text className="text-xl font-SF-bold text-center mb-3 text-gray-800">Existing Household Data</Text>
            <Text className="text-base font-SF-medium text-gray-500 mb-6 text-center">
              We already have your household data. Would you like to apply it?
            </Text>
            
            <View className="flex-row justify-between">
              <TouchableOpacity 
                className="py-3 px-6 bg-blue-500 rounded-lg"
                onPress={() => handleModalResponse(true)}
              >
                <Text className="text-white font-SF-bold">Yes, Apply</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="py-3 px-6 bg-gray-200 rounded-lg"
                onPress={() => handleModalResponse(false)}
              >
                <Text className="text-gray-700 font-SF-bold">No, I'll Fill Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Title Header */}
      
      <ScrollView className="flex-1">
      <View className="bg--500 px-6 pt-4">
        <Text className="text-2xl font-SF-bold text-black text-">Customizable Household Plan</Text>
      </View>
        <View className="flex-1 p-4">
          {/* Household Information */}
          <View className="bg-white rounded-xl shadow-lg px-4 pt-4 pb-2 mb-4">
            <SectionHeader title="Household Information" icon="home" />
            
            <Text className="text-sm font-SF-semibold text-gray-700 mb-1">Number of Adults</Text>
            <View className="mb-4">
              <SelectList 
                setSelected={setAdults}
                data={adultsData}
                placeholder="Select number of adults"
                boxStyles={{borderColor: '#d1d5db', borderRadius: 8, paddingVertical: 10}}
                dropdownStyles={{borderColor: '#d1d5db', borderRadius: 8}}
                dropdownItemStyles={{paddingVertical: 8}}
                dropdownTextStyles={{fontSize: 14, fontFamily: 'SF-light'}}
                inputStyles={{fontFamily: 'SF-light'}}
                search={false}
                defaultOption={adults ? {key: adults, value: adults} : null}
              />
            </View>
            
            <Text className="text-sm font-SF-semibold text-gray-700 mb-1">Number of Kids</Text>
            <View className="mb-4">
              <SelectList 
                setSelected={setKids}
                data={kidsData}
                placeholder="Select number of kids"
                boxStyles={{borderColor: '#d1d5db', borderRadius: 8, paddingVertical: 10}}
                dropdownStyles={{borderColor: '#d1d5db', borderRadius: 8}}
                dropdownItemStyles={{paddingVertical: 8}}
                dropdownTextStyles={{fontSize: 14, fontFamily: 'SF-light'}}
                inputStyles={{fontFamily: 'SF-light'}}
                search={false}
                defaultOption={kids ? {key: kids, value: kids} : null}
              />
            </View>
            
            <RadioOptions 
              label="Pets in Household" 
              options={['No Pets', 'Dogs', 'Cats', 'Birds', 'Multiple Types']} 
              value={pets} 
              setValue={setPets} 
            />
          </View>

          {/* Cleaning Services */}
          <View className="bg-white rounded-xl shadow-lg p-5 mb-4">
            <SectionHeader title="Cleaning Services" icon="broom" />
            
            <RadioOptions 
              label="Number of Floors" 
              options={['1 Floor', '2 Floors', '3 Floors', '4+ Floors']} 
              value={floors} 
              setValue={setFloors} 
            />
            
            <Text className="text-sm font-SF-semibold mt-2 text-gray-700 mb-2">Number of Bathrooms</Text>
            <View className="mb-4">
              <SelectList 
                setSelected={setBathrooms}
                data={bathroomsData}
                placeholder="Select number of bathrooms"
                boxStyles={{borderColor: '#d1d5db', borderRadius: 8, paddingVertical: 10}}
                dropdownStyles={{borderColor: '#d1d5db', borderRadius: 8}}
                dropdownItemStyles={{paddingVertical: 8}}
                dropdownTextStyles={{fontSize: 14, fontFamily: 'SF-semibold'}}
                inputStyles={{fontFamily: 'SF-semibold'}}
                search={false}
                defaultOption={bathrooms ? {key: bathrooms, value: bathrooms} : null}
              />
            </View>
            
            <View className="bg-blue-50 p-3 rounded-lg mb-3">
              <Text className="text-xs font-SF-medium text-blue-700">
                <Icon name="information" size={14} style={{marginRight: 4}} /> Living areas and bedrooms are included in the standard cleaning service.
              </Text>
            </View>
          </View>

          {/* Kitchen Services */}
          <View className="bg-white rounded-xl shadow-lg p-5 mb-4">
            <SectionHeader title="Kitchen Services" icon="silverware-fork-knife" />
            
            <RadioOptions 
              label="Dishwashing" 
              options={['Required', 'Not Required']} 
              value={dishwashing} 
              setValue={setDishwashing} 
            />
            
            <RadioOptions 
              label="Countertop & Sink Cleaning" 
              options={['Required', 'Not Required']} 
              value={countertopCleaning} 
              setValue={setCountertopCleaning} 
            />
          </View>
            
          {/* Cooking Services */}
          <View className="bg-white rounded-xl shadow-lg p-5 mb-4">
            <SectionHeader title="Cooking Services" icon="chef-hat" />
            
            <RadioOptions 
              label="Meals per Day" 
              options={['1 Meal', '2 Meals', 'All 3 Meals', 'Not Required']} 
              value={meals} 
              setValue={setMeals} 
            />
            
            <RadioOptions 
              label="Food Type" 
              options={['Vegetarian', 'Non-Vegetarian', 'Both', 'Not Required']} 
              value={foodType} 
              setValue={setFoodType} 
            />
          </View>
            
          {/* Laundry Services */}
          <View className="bg-white rounded-xl shadow-lg p-5 mb-4">
            <SectionHeader title="Laundry Services" icon="tshirt-crew" />
            
            <RadioOptions 
              label="Washing Clothes" 
              options={['Machine Wash', 'Hand Wash', 'Both', 'Not Required']} 
              value={washingMethod} 
              setValue={setWashingMethod} 
            />
            
            <RadioOptions 
              label="Drying" 
              options={['Required', 'Not Required']} 
              value={drying} 
              setValue={setDrying} 
            />
            
            <RadioOptions 
              label="Ironing & Folding" 
              options={['Required', 'Not Required']} 
              value={ironingFolding} 
              setValue={setIroningFolding} 
            />
          </View>
          
          {/* Space for fixed buttons at bottom */}
          <View className="h-24"/>
        </View>
      </ScrollView>
      
      {/* Fixed Bottom Buttons */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex-row justify-between shadow-lg">
        <TouchableOpacity 
          className="flex-1 rounded-lg py-3 mr-3 flex-row justify-center items-center brder borderray-300 bg-gray-200"
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={20} color="#6B7280" />
          <Text className="text-gray-700 font-SF-bold ml-2">Maid Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-1 rounded-lg py-3 flex-row justify-center items-center ${filledManually ? 'bg-blue-300' : 'bg-blue-500'}`}
          onPress={handleContinue}
          disabled={filledManually}
        >
          <Icon name="calendar-check" size={20} color="#FFFFFF" />
          <Text className="text-white font-SF-bold ml-1">Continue to Schedule</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MaidBookingScreen;