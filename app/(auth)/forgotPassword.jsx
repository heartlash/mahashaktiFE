import { View, Text, Image, Alert, TextInput, TouchableOpacity } from 'react-native'
import { React, useState, useEffect } from 'react'
import { Link, router, useGlobalSearchParams } from 'expo-router';
import { getUserDetails } from '@/lib/auth';
import { StatusBar } from 'react-native-bars';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AnimatedActivityIndicator from '@/components/AnimatedActivityIndicator';
import { useNavigation } from '@react-navigation/native';
import { validateEmail } from '@/lib/validation';



const ForgotPassword = () => {

    const navigation = useNavigation();

    const [email, setEmail] = useState('')

    const [loading, setLoading] = useState(false)


    const [isSubmitting, setIsSubmitting] = useState(false)
   
    const [verificationMessage, setVerificationMessage] = useState('');

    const handleEmailChange =  (emailChange) => {
        setVerificationMessage('')
        setEmail(emailChange)
    }   



    const fetchUserDetails = async () => {

        if(email == '' || !validateEmail(email)) {
            Alert.alert("Invalid Email Address!")
            return 
        }
        setLoading(true)
        const result = await getUserDetails(email)

        if (result.errorMessage == null) {
            router.push({
                pathname: 'userSignupVerification',
                params: {
                    name: result.data.name,
                    phoneNumber: result.data.phoneNumber,
                    email: result.data.email,
                    password: null,

                }
            })
            setLoading(false)
        }
        else {
            setVerificationMessage("Failed")
        }
        setLoading(false)

    }

    if (loading)
        return <AnimatedActivityIndicator />


    return (

        <View className="bg-white h-full w-full">
            <StatusBar style="light" />
            <Image className="h-full w-full absolute" source={require('../../assets/images/background.jpeg')} />

            <View className="mx-3 pt-20 mb-1" style={{ zIndex: 10 }}>
                <TouchableOpacity onPress={() => {
                    console.log("pressed");
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
                <View className="flex items-center">
                    <Animated.Text entering={FadeInUp.duration(1000).springify()} className="text-white font-bold tracking-wider text-2xl">Forgot Password</Animated.Text>
                </View>
                <View className="flex items-center mx-4 space-y-4">

                    <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full">
                        <TextInput
                            className="font-psemibold"
                            placeholder='Enter Email'
                            placeholderTextColor={'gray'}
                            onChangeText={(e) => handleEmailChange(e)}
                        />
                    </Animated.View>

                    <Text className="text-base text-red-400 text-bold mt-10 font-psemibold">
                        {verificationMessage}
                    </Text>

                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="w-full">
                        <TouchableOpacity
                            className={`w-full bg-sky-400 p-3 rounded-2xl mb-3 ${isSubmitting ? 'opacity-50' : ''}`}
                            onPress={fetchUserDetails}>
                            <Text className="text-xl font-bold text-white text-center">Verify</Text>
                        </TouchableOpacity>
                    </Animated.View>

                </View>
            </View>

        </View >
    )
}

export default ForgotPassword