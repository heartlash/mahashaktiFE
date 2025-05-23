import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import TabBarButton from './TabBarButton';
import { getUserRole } from '@/lib/auth';

const TabBar = ({ state, descriptors, navigation }) => {

    const [role, setRole] = useState("VIEWER");

    const fetchUserRole = async () => {
        const userRole = await getUserRole();
        if (userRole != null) {
            setRole(userRole);
        }
    };

    useEffect(() => {
        fetchUserRole();
    }, []);

    const primaryColor = '#0891b2';
    const greyColor = '#737373';
    return (
        <View style={styles.tabbar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                if (['_sitemap', '+not-found'].includes(route.name)) return null;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                // Hide "Money" tab for non-admin/non-owner roles
                if ((role !== 'ADMIN' && role !== 'OWNER') && route.name === 'money') {
                    return null;
                }

                 // Hide "Sales" tab for doctor roles
                 if (role == 'DOCTOR' && route.name === 'sale') {
                    return null;
                }

                return (
                    <TabBarButton
                        key={route.name}
                        style={styles.tabbarItem}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        isFocused={isFocused}
                        routeName={route.name}
                        color={isFocused ? primaryColor : greyColor}
                        label={label}
                    />
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 25,
        borderCurve: 'continuous',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        shadowOpacity: 0.1
    }
})

export default TabBar