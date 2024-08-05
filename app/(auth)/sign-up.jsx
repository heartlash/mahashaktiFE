import { View, Text, ScrollView, SafeAreaView, Image, Alert } from 'react-native'
import {React, useState} from 'react'
import {images} from '../../constants';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { signup } from '@/lib/auth';

const SignUp = () => {

  const [form, setForm] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)


  const submit = async () => {
    if(!form.name || !form.phoneNumber || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields')
    }
    else {
      setIsSubmitting(true);
      try {
        const result = await signup(form.name, form.phoneNumber, form.email.toLowerCase(), form.password);
        if(result == 'SUCCESS')
          router.replace('sign-in')
        else Alert.alert('Error', "Something went wrong")
      } catch(error) {
        Alert.alert('Error', error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Image source={images.logo}
            resizeMode='contain'
            className="w-[115px] h-[35px]" />
            <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
              Sign up to Mahashakti
            </Text>

            <FormField
              title="Name"
              value={form.name}
              handleChangeText={(e) => setForm({...form, name: e})}
              otherStyles="mt-7"
            />
            <FormField
              title="Phone Number"
              value={form.phoneNumber}
              handleChangeText={(e) => setForm({...form, phoneNumber: e})}
              otherStyles="mt-7"
            />
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({...form, email: e})}
              otherStyles="mt-7"
              keyboardType="email-address"
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({...form, password: e})}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Sign Up"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Already Registered? 
              </Text>
              <Link href="/sign-in" className="text-lg font-psemibold text-secondary">Sign Up</Link>

            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp