
import React from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import tw from '../lib/tailwind';
import { BottomTabParamList } from './types';
import { setActiveTab } from '../store/uiSlice';
import { MaterialIcons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import OrdersHistoryScreen from '../screens/OrdersHistoryScreen';
import SearchScreen from '../screens/SearchScreen';
import WishlistScreen from '../screens/WishlistScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

interface CustomTabBarProps extends BottomTabBarProps {
    openCart: () => void;
}

const CustomTabBar = ({ state, descriptors, navigation, openCart }: CustomTabBarProps) => {
    const dispatch = useDispatch();
    const activeTab = useSelector((state: RootState) => state.ui.activeTab);
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleTabPress = (routeName: keyof BottomTabParamList) => {
        if (routeName === 'Cart') {
            openCart();
            return;
        }
        dispatch(setActiveTab(routeName));
        navigation.navigate(routeName);
    };

    const NavItem = ({ tabName, icon, label, showBadge = false }: { tabName: keyof BottomTabParamList, icon: keyof typeof MaterialIcons.glyphMap, label: string, showBadge?: boolean }) => {
        const isActive = activeTab === tabName;
        return (
            <TouchableOpacity
                onPress={() => handleTabPress(tabName)}
                style={tw`items-center justify-center w-14`}
            >
                <View style={tw`relative items-center mb-1`}>
                    <MaterialIcons
                        name={icon}
                        size={24}
                        style={tw`${isActive ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}
                    />
                    {isActive && (
                        <View style={tw`absolute -top-2 w-1 h-1 bg-blue-600 rounded-full`} />
                    )}
                    {showBadge && cartCount > 0 && (
                        <View style={tw`absolute -top-1 -right-2 bg-red-500 rounded-full w-4 h-4 items-center justify-center border border-white dark:border-gray-900`}>
                            <Text style={tw`text-[8px] text-white font-bold`}>{cartCount}</Text>
                        </View>
                    )}
                </View>
                <Text style={tw`text-[10px] font-geistBold ${isActive ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={tw`absolute bottom-0 w-full ${isDarkMode ? 'bg-secondary border-slate-700' : 'bg-white border-gray-100'} px-6 pt-2 pb-6 flex-row justify-between items-center shadow-lg z-50 border-t`}>
            {/* Left Tabs */}
            <View style={tw`flex-row gap-6`}>
                <NavItem tabName="Home" icon="home" label="Home" />
                <NavItem tabName="Orders" icon="receipt-long" label="Orders" />
            </View>

            {/* Floating Search Button */}
            <View style={tw`-top-8`}>
                <TouchableOpacity
                    onPress={() => handleTabPress('Search')}
                    style={tw`w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-xl shadow-blue-600/40 active:scale-95`}
                >
                    <MaterialIcons name="search" size={28} color="white" />
                </TouchableOpacity>
            </View>

            {/* Right Tabs */}
            <View style={tw`flex-row gap-6`}>
                <NavItem tabName="Wishlist" icon="favorite" label="Wishlist" />
                <NavItem tabName="Cart" icon="shopping-cart" label="Cart" showBadge />
            </View>
        </View>
    );
};

interface BottomTabNavigatorProps {
    openCart: () => void;
}

const BottomTabNavigator = ({ openCart }: BottomTabNavigatorProps) => {
    return (
        <Tab.Navigator
            tabBar={props => <CustomTabBar {...props} openCart={openCart} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Orders" component={OrdersHistoryScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Wishlist" component={WishlistScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
