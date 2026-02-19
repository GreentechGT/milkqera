import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import tw from '../lib/tailwind';
import { useToast } from '../context/ToastContext';
import { Plus } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';
import { RootState } from '../store/store';
import { Heart } from 'lucide-react-native';
import QuantitySelectionModal from './QuantitySelectionModal';

interface ProductCardProps {
    id: number;
    name: string;
    description: string;
    price: number;
    image: any;
    category?: string;
    defaultQuantity?: string;
    variant?: 'list' | 'grid';
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, description, price, image, category, defaultQuantity, variant = 'list' }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
    const isLiked = wishlistItems.some((item) => item.id === id);
    const [isModalVisible, setModalVisible] = useState(false);

    const handleAddToCart = (qty: number = 1) => {
        dispatch(addToCart({
            id,
            name,
            price,
            image,
            category,
            quantity: qty
        }));
        setModalVisible(false);
        showToast("Product added to cart", "success");
    };

    const toggleWishlist = () => {
        if (isLiked) {
            dispatch(removeFromWishlist(id));
            showToast("Product removed from wishlist", "info");
        } else {
            dispatch(addToWishlist({
                id,
                name,
                description,
                price,
                image,
                category
            }));
            showToast("Product added to wishlist", "success");
        }
    };

    const navigateToDetails = () => {
        navigation.navigate('Details', { product: { id, name, description, price, image, category, defaultQuantity } });
    };

    if (variant === 'grid') {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={navigateToDetails}
                style={[
                    tw`${isDarkMode ? 'bg-secondary border-slate-700' : 'bg-white border-gray-100'} rounded-3xl p-3 mb-4 flex-1 shadow-sm border m-1`,
                    { maxWidth: '48%' }
                ]}
            >
                <View style={tw`relative mb-2`}>
                    <TouchableOpacity
                        style={tw`absolute top-2 right-2 z-10 ${isDarkMode ? 'bg-slate-800/80' : 'bg-white/80'} p-1.5 rounded-full`}
                        onPress={toggleWishlist}
                    >
                        <Heart size={16} color={isLiked ? "#ef4444" : (isDarkMode ? "#94a3b8" : "#9ca3af")} fill={isLiked ? "#ef4444" : "transparent"} />
                    </TouchableOpacity>
                    <Image
                        source={typeof image === 'string' ? { uri: image } : image}
                        style={tw`w-full h-32 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'} rounded-2xl`}
                        resizeMode="contain"
                    />
                </View>

                <Text style={tw`font-geistBold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm mb-1 leading-tight`} numberOfLines={1}>{name}</Text>
                <Text style={tw`font-interMedium ${isDarkMode ? 'text-slate-400' : 'text-gray-400'} text-xs mb-3`} numberOfLines={1}>{defaultQuantity || '500 ml'}</Text>

                <View style={tw`flex-row justify-between items-center mt-auto`}>
                    <Text style={tw`font-geistBold text-sm ${isDarkMode ? 'text-blue-400' : 'text-gray-900'}`}>₹{price}</Text>
                    <TouchableOpacity
                        style={tw`bg-blue-600 p-1.5 rounded-full`}
                        onPress={() => setModalVisible(true)}
                    >
                        <Plus size={16} color="white" />
                    </TouchableOpacity>
                </View>

                <QuantitySelectionModal
                    visible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    product={{ id, name, price, category, defaultQuantity }}
                    onAddToCart={handleAddToCart}
                />
            </TouchableOpacity>
        );
    }

    // List Variant (Default)
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={navigateToDetails}
            style={tw`flex-row ${isDarkMode ? 'bg-secondary border-slate-700' : 'bg-white border-gray-100'} p-3 mb-4 rounded-3xl border shadow-sm`}
        >
            <Image
                source={typeof image === 'string' ? { uri: image } : image}
                style={tw`w-24 h-24 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'} rounded-2xl mr-4`}
                resizeMode="contain"
            />
            <View style={tw`flex-1 py-1 justify-between`}>
                <View style={tw`flex-row justify-between items-start`}>
                    <View style={tw`flex-1 mr-2`}>
                        <Text style={tw`font-geistBold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 leading-tight`}>{name}</Text>
                        <Text style={tw`font-interMedium ${isDarkMode ? 'text-slate-400' : 'text-gray-400'} text-xs mb-1`} numberOfLines={2}>{description}</Text>
                    </View>
                    <TouchableOpacity onPress={toggleWishlist}>
                        <Heart size={20} color={isLiked ? "#ef4444" : (isDarkMode ? "#94a3b8" : "#9ca3af")} fill={isLiked ? "#ef4444" : "transparent"} />
                    </TouchableOpacity>
                </View>

                <View style={tw`flex-row justify-between items-center`}>
                    <Text style={tw`font-geistBold text-xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>₹{price.toFixed(2)}</Text>
                    <TouchableOpacity
                        style={tw`bg-blue-600 p-2 rounded-full shadow-sm`}
                        onPress={() => setModalVisible(true)}
                    >
                        <Plus size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <QuantitySelectionModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                product={{ id, name, price, category, defaultQuantity }}
                onAddToCart={handleAddToCart}
            />
        </TouchableOpacity>
    );
};

export default ProductCard;
