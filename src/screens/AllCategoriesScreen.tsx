import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, TextInput, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search, Plus } from 'lucide-react-native';
import tw from '../lib/tailwind';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { useToast } from '../context/ToastContext';
import { MaterialIcons } from '@expo/vector-icons';
import { RootState } from '../store/store';

// Map categories to icons (using MaterialIcons for now)
const CATEGORY_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    'Milk': 'water-drop',
    'Ghee': 'set-meal', // Approximation
    'Butter': 'bakery-dining',
    'Curd': 'icecream',
    'Eggs': 'egg',
    'Organic': 'eco',
    'Paneer': 'restaurant-menu' // Fallback
};

const AllCategoriesScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { initialCategory } = route.params as any || {};
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Milk');
    const [searchQuery, setSearchQuery] = useState('');

    const dispatch = useDispatch();
    const { showToast } = useToast();
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

    React.useEffect(() => {
        if (initialCategory) {
            setSelectedCategory(initialCategory);
        }
    }, [initialCategory]);

    // Filter products
    const filteredProducts = PRODUCTS.filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory || (selectedCategory === 'Milk' && p.category === 'Milk'); // Default to Milk if needed or handle All

        return p.category === selectedCategory && p.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleAddToCart = (product: any) => {
        dispatch(addToCart({ ...product, quantity: 1 }));
        showToast("Added to cart", "success");
    };

    const renderCategoryItem = (cat: any) => {
        const isSelected = selectedCategory === cat.name;
        const iconName = CATEGORY_ICONS[cat.name] || 'category';

        return (
            <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.name)}
                style={[
                    tw`flex-col items-center justify-center py-6 px-2 gap-2 border-l-4`,
                    isSelected
                        ? tw`border-blue-500 bg-white dark:bg-gray-800`
                        : tw`border-transparent ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`
                ]}
            >
                <View style={[
                    tw`w-10 h-10 rounded-full flex items-center justify-center`,
                    isSelected
                        ? tw`${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`
                        : tw`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`
                ]}>
                    <MaterialIcons
                        name={iconName}
                        size={20}
                        color={isSelected ? "#3b82f6" : (isDarkMode ? "#94a3b8" : "#9ca3af")}
                    />
                </View>
                <Text style={[
                    tw`text-[11px] font-interBold text-center`,
                    isSelected
                        ? tw`text-blue-500`
                        : tw`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
                ]}>
                    {cat.name}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderProductItem = ({ item }: { item: any }) => (
        <View style={tw`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-2.5 rounded-[1.5rem] border shadow-sm flex-1 m-1.5`}>
            <View style={tw`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-2 mb-2 flex justify-center h-24 items-center overflow-hidden`}>
                <Image
                    source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                    style={tw`h-20 w-20`}
                    resizeMode="contain"
                />
            </View>
            <View style={tw`px-1`}>
                <Text style={tw`font-geistBold text-[13px] ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-0.5`} numberOfLines={1}>{item.name}</Text>
                <Text style={tw`${isDarkMode ? 'text-gray-400' : 'text-gray-400'} font-interMedium text-[10px] mb-2`}>{item.defaultQuantity}</Text>
                <View style={tw`flex-row items-center justify-between`}>
                    <Text style={tw`font-geistBold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-sm`}>₹{item.price}</Text>
                    <TouchableOpacity
                        onPress={() => handleAddToCart(item)}
                        style={tw`w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-blue-200`}
                    >
                        <Plus size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

            {/* Header */}
            <View style={tw`px-6 py-4 flex-row items-center gap-4`}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={tw`w-10 h-10 flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-full shadow-sm`}
                >
                    <ChevronLeft size={20} color={isDarkMode ? "#cbd5e1" : "#475569"} />
                </TouchableOpacity>
                <Text style={tw`text-xl font-geistBold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>All Categories</Text>
            </View>

            {/* Search */}
            <View style={tw`px-6 mb-4`}>
                <View style={tw`relative flex-row items-center`}>
                    <Search size={20} color="#94a3b8" style={tw`absolute left-4 z-10`} />
                    <TextInput
                        placeholder="Search milk, ghee, butter..."
                        placeholderTextColor="#94a3b8"
                        style={tw`w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border-0 rounded-2xl py-3.5 pl-12 pr-4 text-sm shadow-sm font-inter`}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Main Content */}
            <View style={tw`flex-1 flex-row overflow-hidden`}>
                {/* Sidebar */}
                <ScrollView
                    style={[tw`border-r ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'}`, { width: 80, flexGrow: 0, flexShrink: 0 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={tw`flex-col pb-20`}>
                        {CATEGORIES.map(renderCategoryItem)}
                    </View>
                </ScrollView>

                {/* Product Class Grid */}
                <View style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <View style={tw`py-4 px-4 flex-row justify-between items-center`}>
                        <Text style={tw`text-lg font-geistBold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCategory || 'Products'}</Text>
                        <View style={tw`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} px-2 py-1 rounded-full`}>
                            <Text style={tw`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} font-interBold uppercase tracking-wider`}>
                                {filteredProducts.length} Items
                            </Text>
                        </View>
                    </View>

                    <FlatList
                        data={filteredProducts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderProductItem}
                        numColumns={2}
                        contentContainerStyle={tw`px-2 pb-24`}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={tw`justify-between`}
                        ListEmptyComponent={
                            <View style={tw`flex-1 justify-center items-center mt-10`}>
                                <Text style={tw`font-interMedium text-gray-400`}>No products found.</Text>
                            </View>
                        }
                    />
                </View>
            </View>

            {/* Note: Bottom Nav is handled by the Tab Navigator in the main app structure */}
        </SafeAreaView>
    );
};

export default AllCategoriesScreen;
