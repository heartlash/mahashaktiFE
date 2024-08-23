import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '@/components/TabBar';

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
            }}
            tabBar={props => <TabBar {...props} />}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,

                }}
            />

            <Tabs.Screen
                name="production"
                options={{
                    title: "Production",
                    headerShown: false,

                }}
            />

            <Tabs.Screen
                name="sale"
                options={{
                    title: "Sale",
                    headerShown: false,

                }}
            />

            <Tabs.Screen
                name="material"
                options={{
                    title: "Material",
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