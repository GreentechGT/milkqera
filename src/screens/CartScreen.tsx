import React from 'react';
import { View, Text, Button } from 'react-native';
import tw from '../lib/tailwind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const CartScreen = () => {
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

    return (
        <View style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} items-center justify-center`}>
            <Text style={tw`font-geistBold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Your Cart is Empty</Text>
            <Text style={tw`font-inter ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Add some products to get started</Text>
        </View>
    );
};

export default CartScreen;
