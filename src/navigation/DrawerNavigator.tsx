import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import Sidebar from '../components/Sidebar';
import { useWindowDimensions } from 'react-native';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ openCart }: { openCart: () => void }) => {
    const dimensions = useWindowDimensions();
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

    return (
        <Drawer.Navigator
            drawerContent={(props) => <Sidebar {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
                drawerStyle: {
                    width: 280,
                    backgroundColor: 'transparent',
                },
                overlayColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
            }}
        >
            <Drawer.Screen name="BottomTabs">
                {(props) => <BottomTabNavigator {...props} openCart={openCart} />}
            </Drawer.Screen>
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
