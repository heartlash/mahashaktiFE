import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { updateFeedComposition } from '@/lib/feed';
import { getUserInfo } from '@/lib/auth';
import { PencilSquareIcon } from 'react-native-heroicons/solid';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const FeedCompositionItem = ({
    item, isExpanded, isEditing, onPress, setEditItemId,
    onRefreshOnChange, setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible
}) => {
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

        const result = await updateFeedComposition(updatedItem); // Update this with your API function
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

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white p-4 mx-2 rounded-lg shadow-sm mb-4 border border-gray-200"
        >
            <Animated.View entering={FadeInDown.duration(1000)}>
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-gray-700 font-semibold flex-shrink mr-2">{item.materialName}</Text>
                    <View className="flex-row items-center">
                        {isEditing ? (
                            <TextInput
                                className="border border-gray-300 px-3 py-1 rounded-lg text-gray-700 mr-2"
                                value={edited.quantityPerTonne.toString()}
                                onChangeText={(text) => handleEditChange('quantityPerTonne', text)}
                                keyboardType="numeric"
                                style={{ width: 80 }}
                            />
                        ) : (
                            <Text className="text-gray-700 mr-2">{item.quantityPerTonne}</Text>
                        )}
                        <Text className="text-gray-700">{item.materialUnit}</Text>
                    </View>
                </View>


                {isExpanded && (
                    <View className="flex-row justify-end space-x-4">
                        {isEditing ? (
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
                        )}
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

export default FeedCompositionItem;
