import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { icons } from "../../constants";
import TabBar from '@/components/TabBar';
const TabsLayout = () => {
  return (
    <Tabs
        screenOptions={{
          tabBarShowLabel: false,

        }}
        tabBar={props=> <TabBar {...props} />}
    >
        <Tabs.Screen
            name="home"
            options={{
                title: "Home",
                headerShown: false,

            }}
        />
        <Tabs.Screen
            name="profits"
            options={{
                title: "Profits",
                headerShown: false,

            }}
        />
        
        <Tabs.Screen
            name="profile"
            options={{
                title: "Profile",
                headerShown: false,

            }}
        />
    </Tabs>
   
  )
}

export default TabsLayout