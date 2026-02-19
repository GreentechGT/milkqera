import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import tw from '../lib/tailwind';
import { Minus, Plus } from 'lucide-react-native';

interface Product {
    id: number;
    name: string;
    price: number;
    category?: string;
    defaultQuantity?: string;
}

interface QuantitySelectionModalProps {
    visible: boolean;
    onClose: () => void;
    product: Product;
    onAddToCart: (quantity: number) => void;
}

const QuantitySelectionModal: React.FC<QuantitySelectionModalProps> = ({ visible, onClose, product, onAddToCart }) => {
    const [tempQuantity, setTempQuantity] = useState(1);

    useEffect(() => {
        if (visible) {
            setTempQuantity(1);
        }
    }, [visible]);

    const getCategoryUnit = (category: string) => {
        const lowerCat = category?.toLowerCase() || '';
        if (lowerCat.includes('milk') || lowerCat.includes('cream') || lowerCat.includes('oil')) return 'Litres';
        if (lowerCat.includes('curd') || lowerCat.includes('butter') || lowerCat.includes('paneer')) return 'gram';
        return 'Pack';
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={tw`flex-1 justify-end bg-black/50`}>
                <View style={tw`bg-white rounded-t-[32px] p-6 pb-10`}>
                    <View style={tw`flex-row justify-between items-center mb-6`}>
                        <Text style={tw`font-geistBold text-xl text-gray-900`}>
                            How much {product.category}?
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={tw`font-interMedium text-gray-500`}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={tw`flex-row items-center justify-between mb-8`}>
                        <View>
                            <Text style={tw`font-inter text-gray-500 mb-1`}>Quantity ({product.defaultQuantity || getCategoryUnit(product.category || '')})</Text>
                            <Text style={tw`font-geistBold text-3xl text-gray-900`}>{tempQuantity}</Text>

                        </View>

                        <View style={tw`flex-row items-center bg-gray-50 rounded-full p-2 border border-gray-100`}>
                            <TouchableOpacity
                                style={tw`p-3 bg-white rounded-full shadow-sm`}
                                onPress={() => setTempQuantity(Math.max(1, tempQuantity - 1))}
                            >
                                <Minus size={20} color="#1f2937" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={tw`p-3 bg-blue-600 rounded-full shadow-lg ml-4`}
                                onPress={() => setTempQuantity(tempQuantity + 1)}
                            >
                                <Plus size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => onAddToCart(tempQuantity)}
                        activeOpacity={0.8}
                    >
                        <View style={tw`bg-blue-600 py-1 px-3 rounded-t-full w-25 ml-7 items-center justify-center`}>
                            <Text style={tw`font-geistBold text-white`}>
                                ₹{(product.price * tempQuantity).toFixed(2)}
                            </Text>
                        </View>
                        <View style={tw`w-full bg-blue-600 py-4 rounded-full shadow-lg flex-row justify-center px-6 items-center`}>
                            <Text style={tw`font-geistBold text-white text-lg`}>Add to Cart</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default QuantitySelectionModal;
