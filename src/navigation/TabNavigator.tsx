import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, LawCalendar } from '@/screens';
import { TabBar } from '@/components';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <TabBar {...props} />}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="LawCalendar" component={LawCalendar} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
