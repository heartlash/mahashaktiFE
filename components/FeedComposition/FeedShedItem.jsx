import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { updateFeedQuantity } from '@/lib/feed';
import FeedCompositionList from './FeedCompositionList';
import { getUserInfo } from '@/lib/auth';
import { PencilSquareIcon } from 'react-native-heroicons/solid';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { checkAllowedToCreate } from '@/lib/auth';

const FeedShedItem = ({ item, isExpanded, onPress, isEditing, setEditItemId, onRefreshOnChange, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible }) => {

  const [edited, setEdited] = useState(item);

  const handleEditChange = (field, value) => {
    setEdited((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSavePress = async () => {
    setSubmitModalVisible(true);
    const userInfo = await getUserInfo();
    const updatedItem = { ...edited, updatedBy: userInfo.name };

    const result = await updateFeedQuantity(updatedItem); // Update this with your API function
    setSubmitModalVisible(false);
    if (!result.errorMessage) {
      setEditItemId(null);
      setSuccessModalVisible(true);
      setTimeout(() => {
        onRefreshOnChange();
        setSuccessModalVisible(false);
      }, 2000);
    } else {
      setFailureModalVisible(true);
      setTimeout(() => setFailureModalVisible(false), 2000);
    }
  };

  const [allowedToCreate, setAllowedToCreate] = useState(false);

  useEffect(() => {
    const fetchAllowedToCreate = async () => {
      const result = await checkAllowedToCreate();
      setAllowedToCreate(result);
    };

    fetchAllowedToCreate();
  }, []); // Empty array means it runs only on mount


  const shedStatus = item.active === true ? 'Active' : 'In Active'
  const shedkStatusColor = item.active === true ? 'bg-green-500' : 'bg-blue-500';  // Color for "In Stock"

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 mx-2 rounded-lg shadow-sm mb-4 border border-gray-200"
    >

      <Animated.View
        entering={FadeInDown.duration(1000).springify()}
      >
        <View className="flex-row justify-between mb-3">
          <Text className="text-xl font-semibold text-gray-800">{item.name}</Text>
          <View className="flex-row items-center ml-2">
            {item.baby === true && (
              <View className="bg-red-400 px-2 py-1 rounded-lg mr-1">
                <Text className="font-bold text-white">Baby</Text>
              </View>
            )}
            <View className={`${shedkStatusColor} px-2 py-1 rounded-lg`}>
              <Text className="font-bold text-white">{shedStatus}</Text>
            </View>
          </View>
        </View>
        <View className="flex-row justify-between items-center mb-3">

          <Text className="text-gray-700 font-semibold flex-shrink mr-2">Feed Per Bird</Text>
          <View className="flex-row items-center">
            {isEditing ? (
              <TextInput
                className="border border-gray-300 px-3 py-1 rounded-lg text-gray-700 mr-2"
                value={edited.quantityPerBird.toString()}
                onChangeText={(text) => handleEditChange('quantityPerBird', text)}
                keyboardType="numeric"
                style={{ width: 80 }}
              />
            ) : (
              <Text className="text-gray-700 mr-2">{item.quantityPerBird}</Text>
            )}
            <Text className="text-gray-700">grams</Text>
          </View>
        </View>


        {isExpanded && (<>
          <View className="flex-row justify-end space-x-4 mt-2 mb-2">

            {allowedToCreate && (
              isEditing ? (
                <View className="flex-1 flex-row justify-between">
                  <MaterialIcons name="cancel" size={26} color="black" onPress={() => setEditItemId(null)} />
                  <Entypo name="save" size={26} color="black" onPress={handleSavePress} />
                </View>
              ) : (
                <View className="flex-1 flex-row justify-end">
                  <TouchableOpacity onPress={() => setEditItemId(item.id)}>
                    <PencilSquareIcon size={26} color="black" />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
          <View className="flex-1 flex-row justify-between mt-5 mb-5">
            <Text className="text-gray-700 font-semibold ml-2">Material</Text>
            <Text className="text-gray-700 font-semibold mr-3">Quantity Per Tonne</Text>
          </View></>
        )}
        {isExpanded && (
          <FeedCompositionList
            shedId={item.shedId}
            setSuccessModalVisible={setSuccessModalVisible}
            setFailureModalVisible={setFailureModalVisible}
            setSubmitModalVisible={setSubmitModalVisible}
          />)}
      </Animated.View>
    </TouchableOpacity>

  );
};

export default FeedShedItem;
