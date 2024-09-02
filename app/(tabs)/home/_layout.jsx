import React from 'react'
import { Stack } from "expo-router";


const HomeLayout = () => {
    return (
        <Stack>
        <Stack.Screen 
          name="index"
          options={{
              title: "",
              headerShown: false, // Hides the header
            }}
        />
        <Stack.Screen 
          name="flock"
          options={{
            headerShown: false, // Hides the header
          }}
        />
      </Stack>

    )
}

export default HomeLayout