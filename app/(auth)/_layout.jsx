import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false
          }} />

        <Stack.Screen
          name="signup"
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name="userSignupVerification"
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name="resetPassword"
          options={{
            headerShown: false
          }} />
        <Stack.Screen
          name="forgotPassword"
          options={{
            headerShown: false
          }} />

      </Stack>
    </>
  )
}

export default AuthLayout