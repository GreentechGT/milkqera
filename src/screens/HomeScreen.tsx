import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, StatusBar } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import tw from '../lib/tailwind';
import { Bell, MapPin, ChevronDown, Menu } from 'lucide-react-native';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import BannerCarousel from '../components/BannerCarousel';
import ProductCard from '../components/ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setActiveCategory } from '../store/uiSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const user = useSelector((state: RootState) => state.user);
    const activeCategory = useSelector((state: RootState) => state.ui.activeCategory);
    const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
    const dispatch = useDispatch();
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [user.image]);

    const filteredProducts = PRODUCTS.filter(p => p.category === activeCategory);

    // If no products found (e.g. init state mismatch), show all or handled gracefully
    const displayProducts = filteredProducts.length > 0 ? filteredProducts : PRODUCTS;

    const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];

    const renderFixedHeader = () => (
        <View style={tw`flex-row justify-between items-center px-6 py-4 ${isDarkMode ? 'bg-primary border-slate-700' : 'bg-white border-gray-100'} z-10 pt-6 border-b shadow-sm`}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
            <View style={tw`flex-row items-center gap-3`}>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={tw`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} p-2.5 rounded-full shadow-sm border relative`}>
                    <Menu size={24} color={isDarkMode ? "#e2e8f0" : "#1f2937"} />
                </TouchableOpacity>


                <View style={tw`flex-row items-center ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'} px-3 py-1.5 rounded-full`}>
                    <MapPin size={14} color={isDarkMode ? "#3B82F6" : "#2563eb"} fill={isDarkMode ? "#3B82F6" : "#2563eb"} />
                    <Text style={tw`font-interMedium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} ml-2 text-xs tracking-wide`}>
                        {defaultAddress ? `${defaultAddress.city}, India` : 'Select Location'}
                    </Text>
                    <ChevronDown size={12} color={isDarkMode ? "#94a3b8" : "#6b7280"} style={tw`ml-2`} />
                </View>

            </View>

            <TouchableOpacity
                style={tw`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} p-2.5 rounded-full shadow-sm border relative`}
                onPress={() => navigation.navigate('NotificationPage')}
            >
                <Bell size={20} color={isDarkMode ? "#e2e8f0" : "#1f2937"} />
                {unreadCount > 0 && (
                    <View style={tw`absolute top-0 right-0 bg-red-500 rounded-full min-w-[16px] h-[16px] items-center justify-center border-2 ${isDarkMode ? 'border-primary' : 'border-white'} z-10`}>
                        <Text style={tw`text-white text-[9px] font-bold`}>
                            {unreadCount > 0 ? unreadCount : '9+'}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );

    const renderScrollableContent = () => (
        <View>
            {/* Title Section */}
            <View style={tw`px-6 mt-3 mb-6`}>
                <Text style={tw`font-interMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} text-base tracking-wide`}>Get your milk products</Text>
                <Text style={tw`font-geistBold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-4xl mt-2 leading-tight`}>Delivered!</Text>
            </View>

            {/* Banner Section */}
            <BannerCarousel />

            {/* Categories Section */}
            <View style={tw`px-6 mb-4 mt-6`}>
                <View style={tw`flex-row justify-between items-end mb-5`}>
                    <Text style={tw`text-xl font-geistBold ${isDarkMode ? 'text-white' : 'text-gray-900'} tracking-tight`}>Categories</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AllCategories', { initialCategory: 'Milk' })}>
                        <Text style={tw`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-sm font-interMedium`}>View all</Text>
                    </TouchableOpacity>
                </View>

                <View style={tw`flex-row flex-wrap gap-3`}>
                    {CATEGORIES.slice(0, 4).map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => dispatch(setActiveCategory(cat.name))}
                            style={tw`px-4 py-3 rounded-full ${activeCategory === cat.name
                                ? 'bg-blue-600 shadow-lg shadow-blue-500/30'
                                : 'bg-white dark:bg-gray-800 shadow-sm shadow-gray-200 border border-gray-50'
                                } mb-2`}
                        >
                            <Text style={tw`font-interMedium text-sm ${activeCategory === cat.name ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                                }`}>
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={tw`flex-1 ${isDarkMode ? 'bg-primary' : 'bg-white'}`} edges={['top', 'left', 'right']}>
            {renderFixedHeader()}
            <FlatList
                style={tw`flex-1 ${isDarkMode ? 'bg-primary' : 'bg-gray-50/50'}`}
                data={displayProducts}
                renderItem={({ item }) => (
                    <ProductCard
                        {...item}
                        variant="grid"
                        category={item.category}
                        defaultQuantity={item.defaultQuantity}
                    />
                )}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={tw`justify-between px-6 gap-4`}
                contentContainerStyle={tw`pb-32 pt-4`}
                ListHeaderComponent={renderScrollableContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default HomeScreen;
