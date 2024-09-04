import { View, Text, Image, Alert, TextInput, TouchableOpacity } from 'react-native'
import { React, useState } from 'react'
import { Link, router } from 'expo-router';
import { login } from '@/lib/auth';
import { StatusBar } from 'react-native-bars';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { icons } from '../../constants';
import { validateEmail, validatePassword } from '@/lib/validation';



const Login = () => {

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [loginMessage, setLoginMessage] = useState(null);


    const submit = async () => {

        if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields')
            return
        }

        if (!validateEmail(form.email)) {
            Alert.alert("Invalid Email Address")
            return
        }
        if (!validatePassword(form.password)) {
            Alert.alert("Minimum Password Length: 8")
            return
        }

        setIsSubmitting(true);

        try {
            const result = await login(form.email.toLowerCase(), form.password);
            if (result == 'SUCCESS')
                router.replace('/home')
            else setLoginMessage('Login Failed')
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }

    }

    return (

        <View className="bg-white h-full w-full">
            <StatusBar style="light" />
            <Image className="h-full w-full absolute" source={require('../../assets/images/background.jpeg')} />

            <View className="flex-row justify-around w-full absolute">
                <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className="h-[225] w-[90]" source={require('../../assets/images/light.png')} />
                <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()} className="h-[160] w-[65]" source={require('../../assets/images/light.png')} />
            </View>

            <View className="w-full flex justify-around pt-60 pb-10">

                <View className="flex items-center mx-4 space-y-4">

                    <View className="flex items-center">
                        <Animated.Text entering={FadeInUp.duration(1000).springify()} className="text-white mb-5 font-bold tracking-wider text-3xl">MAHASHAKTI</Animated.Text>
                    </View>

                    <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-black/10 p-5 rounded-2xl w-full">
                        <TextInput
                            className="font-psemibold"
                            placeholder='Email'
                            placeholderTextColor={'gray'}
                            onChangeText={(e) => {
                                setLoginMessage('')
                                setForm({ ...form, email: e })
                            }}
                            keyboardType="email-address"
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-black/10 p-5 rounded-2xl w-full items-center flex-row">
                        <TextInput
                            className="flex-1 font-psemibold"
                            placeholder='Password'
                            placeholderTextColor={'gray'}
                            secureTextEntry={!showPassword}
                            onChangeText={(e) => {
                                setLoginMessage('')
                                setForm({ ...form, password: e })
                            }}
                        />

                        <TouchableOpacity onPress={() =>
                            setShowPassword(!showPassword)}>
                            <Image source={!showPassword ? icons.eye :
                                icons.eyeHide} className="w-6 h-6" resizeMode='contain' />
                        </TouchableOpacity>
                    </Animated.View>

                    <Text className="text-base text-red-400 text-bold mt-10 font-psemibold">
                        {loginMessage}
                    </Text>

                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="w-full">
                        <TouchableOpacity
                            className={`w-full bg-sky-400 p-3 rounded-2xl mb-3 ${isSubmitting ? 'opacity-50' : ''}`}
                            onPress={submit}>
                            <Text className="text-xl font-bold text-white text-center">Login</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="flex-row justify-center">
                        <Link href="/forgotPassword" className="text-md font-psemibold text-sky-400">Forgot Password?</Link>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(800).duration(1000).springify()}
                        className="flex-row justify-center items-center"
                    >
                        <Text className="justify-center">Don't have an account? </Text>
                        <Link href="/signup" className=" mx-1 text-md font-psemibold text-sky-400">Sign Up</Link>
                    </Animated.View>


                </View>
            </View>

        </View>
    )
}

export default Login