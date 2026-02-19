import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import tw from '../lib/tailwind';
import { ShoppingBag, ArrowRight } from 'lucide-react-native';

interface EmptyCartModalProps {
    visible: boolean;
    onClose: () => void;
}

const EmptyCartModal: React.FC<EmptyCartModalProps> = ({ visible, onClose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={tw`flex-1 justify-center items-center bg-black/60`}>
                <View style={tw`bg-white w-[85%] rounded-[32px] p-8 items-center shadow-2xl`}>
                    <View style={tw`bg-red-50 p-6 rounded-full mb-6`}>
                        <ShoppingBag size={48} color="#ef4444" />
                    </View>

                    <Text style={tw`font-geistBold text-2xl text-gray-900 text-center mb-3`}>
                        Your Cart is Empty!
                    </Text>

                    <Text style={tw`font-geist text-gray-500 text-center mb-8 px-4 leading-6`}>
                        Looks like you haven't added anything to your cart yet. Go explore our products!
                    </Text>


                    <TouchableOpacity
                        onPress={onClose}
                        style={tw`mt-3 py-2`}
                    >
                        <Text style={tw`font-geistBold text-blue-600 text-md`}>Go to Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default EmptyCartModal;
