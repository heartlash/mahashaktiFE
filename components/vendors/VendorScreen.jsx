import { View, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getVendorsData } from '@/lib/vendor';
import CreateVendor from './CreateVendor';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import CustomModal from '../CustomModal';
import VendorList from './VendorList';


const VendorScreen = () => {

    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);

    const [createVendor, setCreateVendor] = useState(false)

    const [vendorData, setVendorData] = useState([]);

    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [failureModalVisible, setFailureModalVisible] = useState(false)
    const [submitModalVisible, setSubmitModalVisible] = useState(false)

    const [refresh, setRefresh] = useState(false);
    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchVendorData().then(() => setRefreshing(false));
    }, []);

    const fetchVendorData = async () => {
        const result = await getVendorsData();
        setVendorData(result.data);
        setLoading(false)
    }

    useEffect(() => {
        fetchVendorData();

    }, [refresh])

    if (loading) {
        return <AnimatedActivityIndicator />
    }

    return (
        <View>

            <CustomModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} theme="success" />
            <CustomModal modalVisible={failureModalVisible} setModalVisible={setFailureModalVisible} theme="failure" />
            <CustomModal modalVisible={submitModalVisible} setModalVisible={setSubmitModalVisible} theme="submit" />

            <View className="mx-2 my-1">
                <MaterialIcons name="arrow-back-ios-new" size={24} color="black" onPress={() => navigation.goBack()} />
            </View>

            <VendorList
                listHeaderComponent={<View>

                    <View style={styles.container} className="p-10 justify-center items-center mb-4">
                        <Text className="text-xl font-bold text-black">Total Registered Venders: {vendorData?.length || 0}</Text>
                    </View>

                    {createVendor ? (
                        <CreateVendor
                            onClose={() => setCreateVendor(false)}
                            vendorData={vendorData}
                            onRefreshOnChange={onRefreshOnChange}
                            setSuccessModalVisible={setSuccessModalVisible}
                            setFailureModalVisible={setFailureModalVisible}
                            setSubmitModalVisible={setSubmitModalVisible}
                        />
                    ) : (
                        <View className="mb-3">
                            <Ionicons name="add-circle" className="mb-3" size={45} style={{ alignSelf: 'center' }} color="black" onPress={() => setCreateVendor(true)} />
                        </View>

                    )}
                </View>

                }


                setVendorData={setVendorData}
                vendorData={vendorData}
                onRefreshOnChange={onRefreshOnChange}
                onRefresh={onRefresh}
                refreshing={refreshing}
                setSuccessModalVisible={setSuccessModalVisible}
                setFailureModalVisible={setFailureModalVisible}
                setSubmitModalVisible={setSubmitModalVisible}
            />

        </View>

    )
};

export default VendorScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDD0',
    },
    text: {
        color: 'black',
        fontSize: 24,
        paddingTop: 10,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
    },
});

