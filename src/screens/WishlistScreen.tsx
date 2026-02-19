import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import ProductCard from '../components/ProductCard';
import tw from '../lib/tailwind';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WishlistScreen() {
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

    return (
        <SafeAreaView style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4`}>
            <Text style={tw`font-geistBold text-2xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>My Wishlist ({wishlistItems.length})</Text>

            {wishlistItems.length === 0 ? (
                <View style={tw`flex-1 justify-center items-center`}>
                    <View style={tw`${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} p-6 rounded-full mb-6`}>
                        <Heart size={48} color="#ef4444" fill={isDarkMode ? "#7f1d1d" : "#fee2e2"} />
                    </View>
                    <Text style={tw`font-interBold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-center px-10`}>
                        Tap the heart icon on any product to save it for later!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={wishlistItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={tw`mb-4`}>
                            <ProductCard
                                id={item.id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                                category={item.category}
                            // ProductCard should handle its own dark mode, assuming it connects to redux or uses twrnc classes appropriately
                            // If ProductCard accepts style props, we might need to pass them, but based on previous files it seems self-contained.
                            />
                        </View>
                    )}
                    contentContainerStyle={tw`pb-10`}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}
