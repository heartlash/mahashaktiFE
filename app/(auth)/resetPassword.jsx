
import { View, Text, Image, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { React, useState } from 'react'
import { router, useGlobalSearchParams } from 'expo-router';
import { resetPassword } from '@/lib/auth';
import { StatusBar } from 'react-native-bars';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import { icons } from '../../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AnimatedActivityIndicator from '@/components/AnimatedActivityIndicator';
import { useNavigation } from '@react-navigation/native';
import { validatePassword } from '@/lib/validation';
import CustomModal from '@/components/CustomModal';


const ResetPassword = () => {

    const navigation = useNavigation();

    const { email } = useGlobalSearchParams();

    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)



    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);

    const [success, setSuccess] = useState(false);

    const [resetMessage, setResetMessage] = useState('');

    if (loading)
        return <AnimatedActivityIndicator />


    const submit = async () => {

        if (password == '') {
            Alert.alert("Invalid Password!")
            return
        }

        if (!validatePassword(password)) {
            Alert.alert("Minimum Password Length: 8")
            return
        }


        try {
            setIsSubmitting(true)
            const result = await resetPassword(email, password)

            if (result.errorMessage == null) {
                setModalVisible(true)

                setTimeout(() => {
                    setModalVisible(false);
                    router.replace('/login');
                }, 2000);

            } else {
                setSuccess(false)
                setResetMessage('Reset Failed');
            }

        } catch (error) {
            Alert.alert('Error', error.message);
            setVerificationMessage("Reset Password Failed")
        } finally {
            setIsSubmitting(false);
        }

    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                bounces={false}
            >
                <CustomModal modalVisible={modalVisible} setModalVisible={setModalVisible} mainText="Password Successfully Reset!" secondaryText={""} />

                <View className="bg-white h-full w-full">
                    <StatusBar style="light" />
                    <Image className="h-full w-full absolute" source={require('../../assets/images/background.jpeg')} />

                    <View className="mx-3 pt-20 mb-1" style={{ zIndex: 10 }}>
                        <TouchableOpacity onPress={() => {
                            navigation.goBack();
                        }}>
                            <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-around w-full absolute">
                        <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className="h-[225] w-[90]" source={require('../../assets/images/light.png')} />
                        <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()} className="h-[160] w-[65]" source={require('../../assets/images/light.png')} />
                    </View>

                    <View className="w-full flex justify-around pt-40 pb-10">
                        <View className="flex items-center">
                            <Animated.Text entering={FadeInUp.duration(1000).springify()} className="text-white font-bold tracking-wider mb-10 text-3xl">Reset Password</Animated.Text>
                        </View>
                        <View className="flex items-center mx-4 space-y-4">

                            <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full flex-row">
                                <TextInput
                                    className="flex-1 font-psemibold"
                                    placeholder='New Password'
                                    placeholderTextColor={'gray'}
                                    secureTextEntry={!showPassword}
                                    onChangeText={(e) => {
                                        setResetMessage('')
                                        setPassword(e)
                                    }
                                    }
                                    keyboardType="email-address"
                                />

                                <TouchableOpacity onPress={() =>
                                    setShowPassword(!showPassword)}>
                                    <Image source={!showPassword ? icons.eye :
                                        icons.eyeHide} className="w-6 h-6" resizeMode='contain' />
                                </TouchableOpacity>

                            </Animated.View>



                            <Text className={`text-md mt-10 font-psemibold ${success ? 'text-black' : 'text-red-600'}`}>
                                {resetMessage}
                            </Text>

                            <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="w-full">
                                <TouchableOpacity
                                    className={`w-full bg-sky-400 p-3 rounded-2xl mb-3 ${isSubmitting ? 'opacity-50' : ''}`}
                                    onPress={submit}>
                                    <Text className="text-xl font-bold text-white text-center">Reset</Text>
                                </TouchableOpacity>
                            </Animated.View>

                        </View>
                    </View>

                </View >
            </ScrollView>
        </KeyboardAvoidingView>
    )


}

export default ResetPassword