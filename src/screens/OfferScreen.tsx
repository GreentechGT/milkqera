import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import tw from '../lib/tailwind';
import { ChevronLeft, Plus, Heart } from 'lucide-react-native';
import { PRODUCTS } from '../data/mockData';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';
import { useToast } from '../context/ToastContext';
import { RootState } from '../store/store';

const OfferScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    const { offerName, offerColor = 'bg-blue-500', discount = '20%' } = route.params as any || {};

    const dispatch = useDispatch();
    const { showToast } = useToast();
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

    const products = PRODUCTS.filter(p => p.discount);

    const handleAddToCart = (product: any) => {
        dispatch(addToCart({ ...product, quantity: 1 }));
        showToast("Added to cart", "success");
    };

    const toggleWishlist = (product: any) => {
        const isLiked = wishlistItems.some(item => item.id === product.id);
        if (isLiked) {
            dispatch(removeFromWishlist(product.id));
            showToast("Removed from wishlist", "info");
        } else {
            dispatch(addToWishlist(product));
            showToast("Added to wishlist", "success");
        }
    };

    const renderProductItem = ({ item }: { item: any }) => {
        const isLiked = wishlistItems.some(w => w.id === item.id);
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={tw`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-3 rounded-[20px] border shadow-sm flex-1 m-2`}
                onPress={() => navigation.navigate('Details', { product: item })} // Navigate to details
            >
                {item.discount && (
                    <View style={tw`absolute top-3 left-3 bg-red-500 px-2 py-0.5 rounded-lg z-10`}>
                        <Text style={tw`text-[10px] font-geistBold text-white uppercase`}>{item.discount} OFF</Text>
                    </View>
                )}
                <TouchableOpacity
                    onPress={() => toggleWishlist(item)}
                    style={tw`absolute top-3 right-3 z-10`}
                >
                    <Heart size={18} color={isLiked ? "#ef4444" : (isDarkMode ? "#94a3b8" : "#9ca3af")} fill={isLiked ? "#ef4444" : "transparent"} />
                </TouchableOpacity>

                <View style={tw`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-4 mb-3 flex items-center justify-center h-32`}>
                    <Image
                        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                        style={tw`h-24 w-24`}
                        resizeMode="contain"
                    />
                </View>

                <View>
                    <Text style={tw`font-geistBold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`} numberOfLines={1}>{item.name}</Text>
                    <Text style={tw`font-interMedium text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>{item.defaultQuantity}</Text>

                    <View style={tw`flex-row items-center justify-between`}>
                        <Text style={tw`font-geistBold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-base`}>₹{item.price}</Text>
                        <TouchableOpacity
                            onPress={() => handleAddToCart(item)}
                            style={tw`w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200`}
                        >
                            <Plus size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <View style={tw`${offerColor} ${isDarkMode ? 'opacity-90' : ''} pt-4 pb-12 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden`}>
                {/* Decorative circles */}
                <View style={tw`absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full`} />
                <View style={tw`absolute top-20 -left-10 w-32 h-32 bg-white/10 rounded-full`} />

                <View style={tw`flex-row items-center gap-4 mb-6`}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={tw`w-10 h-10 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-md`}
                    >
                        <ChevronLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={tw`text-xl font-geistBold text-white`}>{offerName || 'Special Offers'}</Text>
                </View>

                <View>
                    <Text style={tw`text-white/80 font-interMedium text-sm mb-1`}>Limited Time Deal</Text>
                    <Text style={tw`text-3xl font-geistBold text-white leading-tight`}>
                        Get <Text style={tw`text-yellow-300 font-geistBold`}>{discount}</Text> Discount{'\n'}
                        On All Products
                    </Text>
                </View>
            </View>

            {/* Products List */}
            <View style={tw`flex-1 px-2 -mt-8`}>
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProductItem}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={tw`pb-6`}
                    columnWrapperStyle={tw`justify-between`}
                    ListHeaderComponent={<View style={tw`h-2`} />} // Spacing for overlap
                />
            </View>
        </SafeAreaView>
    );
};

export default OfferScreen;
