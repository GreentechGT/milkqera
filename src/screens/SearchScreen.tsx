import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, ChevronLeft } from 'lucide-react-native';
import tw from '../lib/tailwind';
import { useNavigation } from '@react-navigation/native';
import { PRODUCTS } from '../data/mockData';
import ProductCard from '../components/ProductCard';

const SearchScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            {/* Header with Search Input */}
            <View style={tw`flex-row items-center px-4 py-3 border-b border-gray-100`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-3`}>
                    <ChevronLeft size={24} color="#374151" />
                </TouchableOpacity>
                <View style={tw`flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 py-2`}>
                    <Search size={20} color="#9ca3af" />
                    <TextInput
                        placeholder="Search for products..."
                        placeholderTextColor="#9ca3af"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={tw`flex-1 ml-2 text-black font-interMedium`}
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={18} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Results */}
            <FlatList
                data={searchQuery ? filteredProducts : []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ProductCard
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        image={item.image}
                        category={item.category}
                        defaultQuantity={item.defaultQuantity}
                    />
                )}
                contentContainerStyle={tw`p-4`}
                ListEmptyComponent={
                    <View style={tw`flex-1 justify-center items-center mt-20`}>
                        {searchQuery ? (
                            <Text style={tw`text-gray-400 font-interMedium`}>No products found.</Text>
                        ) : (
                            <View style={tw`items-center`}>
                                <Search size={48} color="#e5e7eb" style={tw`mb-4`} />
                                <Text style={tw`text-gray-400 font-interMedium`}>Search for milk, curd, etc.</Text>
                            </View>
                        )}
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default SearchScreen;
