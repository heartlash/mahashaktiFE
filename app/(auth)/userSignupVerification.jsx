import { View, Text, Image, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { React, useState, useEffect } from 'react'
import { Link, router, useGlobalSearchParams } from 'expo-router';
import { userVerification, signup } from '@/lib/auth';
import { StatusBar } from 'react-native-bars';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import OtpInput from '@/components/OtpInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AnimatedActivityIndicator from '@/components/AnimatedActivityIndicator';
import { useNavigation } from '@react-navigation/native';
import CustomModal from '@/components/CustomModal';


const UserSignupVerification = () => {

    const navigation = useNavigation();

    const { name, phoneNumber, email, password } = useGlobalSearchParams();

    const [rightEmailOtp, setRightEmailOtp] = useState('')
    const [rightPhoneOtp, setrightPhoneOtp] = useState('')

    const [loading, setLoading] = useState(true)



    const [otpEmailInput, setOtpEmailInput] = useState('');
    const [otpPhoneNumberInput, setOtpPhoneNumberInput] = useState('');


    const handleEmailOtpChange = (inputOtp) => {
        setVerificationMessage('')
        setOtpEmailInput(inputOtp);
    };

    const handlePhoneNumberOtpChange = (inputOtp) => {
        setVerificationMessage('')
        setOtpPhoneNumberInput(inputOtp);
    };


    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false);

    const [verificationMessage, setVerificationMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);


    const fetchUserVerification = async () => {
        setLoading(true)
        const result = await userVerification(email, phoneNumber)
        if (result.errorMessage == null) {
            setRightEmailOtp(result.data.emailOtp)
            setrightPhoneOtp(result.data.phoneNumberOtp)
            setLoading(false)
        }
        else {
            setRightEmailOtp('')
            setrightPhoneOtp('')
        }
    }

    useEffect(() => {
        fetchUserVerification();
    }, [])

    if (loading)
        return <AnimatedActivityIndicator />


    const submit = async () => {

        setIsSubmitting(true)

        if (rightEmailOtp != otpEmailInput) {

        //if (rightEmailOtp != otpEmailInput || rightPhoneOtp != otpPhoneNumberInput) {
            setVerificationMessage("Wrong OTP!")
            setIsSubmitting(false)
            return
        }

        try {
            if (password == null) {
                setSuccess(true)
                setVerificationMessage('Successfully Verified');
                setTimeout(() => {
                    router.push({
                        pathname: 'resetPassword',
                        params: {
                            email: email,
                        }
                    })
                }, 2000);

            }
            else {
                const result = await signup(name, phoneNumber, email.toLowerCase(), password);

                if (result.data == 'SUCCESS') {
                    setModalVisible(true);

                    setTimeout(() => {
                        setModalVisible(false);
                        router.replace('/login');
                    }, 2000);

                }
            }
        } catch (error) {
            Alert.alert('Error', error.message);
            setVerificationMessage("Sign Up Failed")
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
                <CustomModal modalVisible={modalVisible} setModalVisible={setModalVisible} theme="celebrate" mainText="Successfully Signed Up!" secondaryText={""} />

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

                    <View className="h-2/3 w-full flex justify-around pt-40 pb-10">

                        <View className="flex items-center mx-4 space-y-4">

                            <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-black/10 p-5 rounded-2xl">
                                <Text className="text-xl text-center text-white text-semibold mt-2 font-psemibold">
                                    OTP SENT TO
                                </Text>
                                <Text className="text-xl text-center text-black text-semibold mt-2 mb-2 font-psemibold">
                                    {email}
                                </Text>
                                <OtpInput onOtpChange={handleEmailOtpChange} />
                            </Animated.View>
                            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-black/10 p-5 rounded-2xl">
                                <Text className="text-xl text-center text-white text-semibold mt-2 font-psemibold">
                                    OTP SENT TO
                                </Text>
                                <Text className="text-xl text-center text-black text-semibold mt-2 mb-2 font-psemibold">
                                    {phoneNumber}
                                </Text>
                                <OtpInput onOtpChange={handlePhoneNumberOtpChange} />
                            </Animated.View>

                            <Text className={`text-md mt-10 font-psemibold ${success ? 'text-black' : 'text-red-600'}`}>
                                {verificationMessage}
                            </Text>

                            <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="w-full">
                                <TouchableOpacity
                                    className={`w-full bg-sky-400 p-3 rounded-2xl mb-3 ${isSubmitting ? 'opacity-50' : ''}`}
                                    onPress={submit}>
                                    <Text className="text-xl font-bold text-white text-center">Verify</Text>
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="flex-row justify-center">
                                <Text>Don't have an account? </Text>
                                <Link href="/signup" className="text-md font-psemibold text-sky-400">Sign Up</Link>
                            </Animated.View>
                        </View>
                    </View>

                </View >
            </ScrollView>

        </KeyboardAvoidingView >
    )
}

export default UserSignupVerification