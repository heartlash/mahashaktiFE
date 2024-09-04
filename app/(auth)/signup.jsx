import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native'
import { React, useState } from 'react'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { icons } from '../../constants';
import { StatusBar } from 'react-native-bars';
import { Link, router } from 'expo-router';
import { validateEmail, validatePassword, validatePhoneNumber } from '@/lib/validation';

const Signup = () => {

    const [form, setForm] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        password: ''
    })


    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const submit = () => {

        if (form.name == '' || form.phoneNumber == '' || form.email == '' || form.password == '') {
            Alert.alert("Please fill empty field.")
            return
        }

        if (!validatePhoneNumber(form.phoneNumber)) {
            Alert.alert("Invalid Phone Number")
            return
        }

        if (!validateEmail(form.email)) {
            Alert.alert("Invalid Email Address")
            return
        }


        if (!validatePassword) {
            Alert.alert("Minimum Password Length: 8")
            return
        }

        else {
            router.push({
                pathname: 'userSignupVerification',
                params: {
                    name: form.name,
                    phoneNumber: form.phoneNumber,
                    email: form.email,
                    password: form.password,

                }
            })
        }

    }



    return (
<KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView 
            contentContainerStyle={{flex: 1}} 
            bounces={false}
            >
        <View className="bg-white h-full w-full">
            <StatusBar style="light" />
            <Image className="h-full w-full absolute" source={require('../../assets/images/background.jpeg')} />

            <View className="flex-row justify-around w-full absolute">
                <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className="h-[225] w-[90]" source={require('../../assets/images/light.png')} />
                <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()} className="h-[160] w-[65]" source={require('../../assets/images/light.png')} />
            </View>

            <View className="w-full flex justify-around pt-60 pb-10">


                <View className="flex items-center">
                    <Animated.Text entering={FadeInUp.duration(1000).springify()} className="text-white mb-10 font-bold tracking-wider text-3xl">MAHASHAKTI</Animated.Text>
                </View>
                
                <View className="flex items-center mx-4 space-y-4">
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-black/10 p-5 rounded-2xl w-full">
                        <TextInput
                            className="font-psemibold"
                            placeholder='Name'
                            placeholderTextColor={'gray'}
                            onChangeText={(e) => setForm({ ...form, name: e })}
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="bg-black/10 p-5 rounded-2xl w-full">
                        <TextInput
                            className="font-psemibold"
                            placeholder='Phone Number'
                            placeholderTextColor={'gray'}
                            onChangeText={(e) => setForm({ ...form, phoneNumber: e })}
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="bg-black/10 p-5 rounded-2xl w-full">
                        <TextInput
                            className="font-psemibold"
                            placeholder='Email'
                            placeholderTextColor={'gray'}
                            onChangeText={(e) => setForm({ ...form, email: e })}
                            keyboardType="email-address"
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} className="bg-black/10 p-5 rounded-2xl w-full items-center flex-row">
                        <TextInput
                            className="flex-1 font-psemibold"
                            placeholder='Password'
                            placeholderTextColor={'gray'}
                            secureTextEntry={!showPassword}
                            onChangeText={(e) => setForm({ ...form, password: e })}
                        />

                        <TouchableOpacity onPress={() =>
                            setShowPassword(!showPassword)}>
                            <Image source={!showPassword ? icons.eye :
                                icons.eyeHide} className="w-6 h-6" resizeMode='contain' />
                        </TouchableOpacity>

                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(1000).duration(1000).springify()} className="w-full">
                        <TouchableOpacity
                            className={`w-full bg-sky-400 p-3 rounded-2xl mb-3 ${isSubmitting ? 'opacity-50' : ''}`}
                            onPress={() => submit()}>
                            <Text className="text-xl font-bold text-white text-center">Sign Up</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(1200).duration(1000).springify()} className="flex-row justify-center items-center">
                        <Text className="text-md justify-center">Already Registered? </Text>
                        <Link href="/login" className="mx-1 text-md font-psemibold text-sky-400">Login</Link>
                    </Animated.View>
                </View>

            </View>

        </View>
        </ScrollView>
                        </KeyboardAvoidingView>


    );
}

export default Signup
