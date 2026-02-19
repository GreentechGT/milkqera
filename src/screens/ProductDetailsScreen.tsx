import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Alert, StatusBar } from 'react-native';
import QuantitySelectionModal from '../components/QuantitySelectionModal';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import tw from '../lib/tailwind';
import { useToast } from '../context/ToastContext';
import { ChevronLeft, Heart, Minus, Plus, Star, MapPin, Truck, Tag, Store } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addToCart, decrementQuantity } from '../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'Details'>;

const ProductDetailsScreen = () => {
    const route = useRoute<ProductDetailsRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { product } = route.params;
    const dispatch = useDispatch();
    const { showToast } = useToast();

    const cartItem = useSelector((state: RootState) => state.cart.items.find((item) => item.id === product.id));
    const quantity = cartItem ? cartItem.quantity : 0;
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const isLiked = wishlistItems.some((item) => item.id === product.id);
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

    const [isQuantityModalVisible, setQuantityModalVisible] = useState(false);

    const handleBuyNow = () => {
        dispatch(addToCart({ ...product, quantity: 1 }));
        navigation.navigate('Checkout');
    };

    const confirmAddToCart = (qty: number) => {
        dispatch(addToCart({ ...product, quantity: qty }));
        setQuantityModalVisible(false);
        showToast("Product added to cart", "success");
    };

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, quantity: 1 }));
        showToast("Product added to cart", "success");
    };

    const toggleWishlist = () => {
        if (isLiked) {
            dispatch(removeFromWishlist(product.id));
        } else {
            dispatch(addToWishlist(product));
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
            <View style={tw`flex-1`}>
                {/* Header Image */}
                <ScrollView contentContainerStyle={tw`pb-24`}>
                    <View style={tw`relative`}>
                        <Image
                            source={typeof product.image === 'string' ? { uri: product.image } : product.image}
                            style={tw`w-full h-80 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-b-[40px]`}
                            resizeMode="cover"
                        />
                        <View style={tw`absolute top-4 left-4 right-4 flex-row justify-between items-center z-10`}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={tw`${isDarkMode ? 'bg-black/50' : 'bg-white/80'} p-3 rounded-full shadow-sm`}
                            >
                                <ChevronLeft size={24} color={isDarkMode ? "white" : "#1f2937"} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={toggleWishlist}
                                style={tw`${isDarkMode ? 'bg-black/50' : 'bg-white/80'} p-3 rounded-full shadow-sm`}
                            >
                                <Heart
                                    size={24}
                                    color={isLiked ? "#ef4444" : (isDarkMode ? "white" : "#1f2937")}
                                    fill={isLiked ? "#ef4444" : "transparent"}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={tw`px-6 pt-6`}>
                        <View style={tw`flex-row justify-between items-start mb-2`}>
                            <View style={tw`flex-1 mr-4`}>
                                <Text style={tw`font-geistBold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{product.name}</Text>
                                <Text style={tw`font-interMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{product.category || 'Category'}</Text>
                            </View>
                            <Text style={tw`font-geistBold text-2xl text-blue-600`}>₹{product.price.toFixed(2)}</Text>
                        </View>

                        {/* Rating Mockup */}
                        <View style={tw`flex-row items-center mb-6`}>
                            <Star size={16} color="#fbbf24" fill="#fbbf24" />
                            <Text style={tw`font-geistBold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} ml-1`}>4.8</Text>
                        </View>

                        <Text style={tw`font-geistBold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Description</Text>
                        <Text style={tw`font-inter ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} leading-6 mb-6`}>
                            {product.description}
                            {'\n\n'}
                            Rich in calcium and protein, this fresh {product.name.toLowerCase()} is sourced directly from local farms. Perfect for your daily needs, whether for drinking, cooking, or making delicious desserts.
                        </Text>

                        {/* Delivery Info */}
                        <View style={tw`flex-row justify-between mb-8`}>
                            {/* First View: Offers */}
                            <View style={tw`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-2xl mr-3 items-center`}>
                                <Tag size={24} color="#d97706" style={tw`mb-2`} />
                                <Text style={tw`font-geistBold text-yellow-500 text-sm`}>Available Offers</Text>
                                <Text style={tw`font-inter text-yellow-600 text-xs mt-1 text-center`}>
                                    Use CODE: FRESH20
                                </Text>
                            </View>

                            {/* Second View: Product Origin */}
                            <View style={tw`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-2xl items-center`}>
                                <Store size={24} color="#059669" style={tw`mb-2`} />
                                <Text style={tw`font-geistBold text-green-500 text-sm`}>Product Origin</Text>
                                <Text style={tw`font-inter text-green-600 text-xs mt-1 text-center`}>
                                    Nashik, Maharashtra
                                </Text>
                            </View>
                        </View>

                        {/* Nutrition Info Mockup */}
                        <Text style={tw`font-geistBold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Nutrition (per 100g)</Text>
                        <View style={tw`flex-row justify-between ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-2xl`}>
                            <View style={tw`items-center`}>
                                <Text style={tw`font-geistBold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>60</Text>
                                <Text style={tw`font-inter text-gray-400 text-xs`}>Calories</Text>
                            </View>
                            <View style={tw`w-[1px] ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} h-full`} />
                            <View style={tw`items-center`}>
                                <Text style={tw`font-geistBold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>3.2g</Text>
                                <Text style={tw`font-inter text-gray-400 text-xs`}>Protein</Text>
                            </View>
                            <View style={tw`w-[1px] ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} h-full`} />
                            <View style={tw`items-center`}>
                                <Text style={tw`font-geistBold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>4.5g</Text>
                                <Text style={tw`font-inter text-gray-400 text-xs`}>Fat</Text>
                            </View>
                            <View style={tw`w-[1px] ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} h-full`} />
                            <View style={tw`items-center`}>
                                <Text style={tw`font-geistBold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>4.8g</Text>
                                <Text style={tw`font-inter text-gray-400 text-xs`}>Carbs</Text>
                            </View>
                        </View>
                    </View>
                    {/* Bottom Action Bar */}
                    <View style={tw`w-full ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} p-3 border-t`}>
                        <View style={tw`flex-row items-center justify-between gap-3`}>
                            <TouchableOpacity
                                style={tw`flex-1 ${isDarkMode ? 'bg-gray-800 border-blue-500' : 'bg-white border-blue-600'} border py-3 rounded-xl shadow-sm items-center`}
                                onPress={() => setQuantityModalVisible(true)}
                            >
                                <Text style={tw`font-interBold text-blue-600 text-lg`}>Add to Cart</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={tw`flex-1 bg-blue-600 py-3 rounded-xl shadow-lg items-center`}
                                onPress={handleBuyNow}
                            >
                                <Text style={tw`font-interBold text-white text-lg`}>Buy Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <QuantitySelectionModal
                    visible={isQuantityModalVisible}
                    onClose={() => setQuantityModalVisible(false)}
                    product={product}
                    onAddToCart={confirmAddToCart}
                />
            </View>
        </SafeAreaView>
    );
};

export default ProductDetailsScreen;
