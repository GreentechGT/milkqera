import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import tw from '../lib/tailwind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addPaymentMethod } from '../store/userSlice';
import { useNavigation } from '@react-navigation/native';
import { CreditCard, ChevronLeft } from 'lucide-react-native';
import ExpiryDatePicker from '../components/ExpiryDatePicker';
import { RootState } from '../store/store';

const AddPaymentMethodScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [holderName, setHolderName] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateSelect = (month: string, year: string) => {
        setExpiry(`${month}/${year}`);
        setShowDatePicker(false);
    };

    const handleSave = () => {
        if (!cardNumber || !expiry || !cvv || !holderName) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const newMethod = {
            id: Date.now().toString(),
            type: 'Visa' as const, // Simplified for demo
            last4: cardNumber.slice(-4),
            expiry,
            holderName,
            isDefault: false,
        };

        dispatch(addPaymentMethod(newMethod));
        navigation.goBack();
    };

    return (
        <SafeAreaView style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <View style={tw`flex-row items-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 mr-2`}>
                    <ChevronLeft size={24} color={isDarkMode ? "white" : "#374151"} />
                </TouchableOpacity>
                <Text style={tw`font-geistBold text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Add Payment Method</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`flex-1`}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <ScrollView contentContainerStyle={tw`p-6 pb-50`} keyboardShouldPersistTaps="handled">
                    <View style={tw`items-center mb-8 mt-4`}>
                        <View style={tw`w-full h-48 bg-blue-600 rounded-2xl p-6 justify-between shadow-lg shadow-blue-200/50`}>
                            <View style={tw`flex-row justify-between items-start`}>
                                <CreditCard size={32} color="white" opacity={0.8} />
                                <Text style={tw`text-white font-geistBold text-xl italic opacity-80`}>VISA</Text>
                            </View>
                            <View>
                                <Text style={tw`text-white text-xl font-geistBold mb-6 tracking-widest`}>
                                    {cardNumber || '•••• •••• •••• ••••'}
                                </Text>
                                <View style={tw`flex-row justify-between`}>
                                    <View>
                                        <Text style={tw`text-blue-200 text-[10px] font-geistMedium uppercase mb-1`}>Card Holder</Text>
                                        <Text style={tw`text-white font-geistMedium uppercase text-sm`}>{holderName || 'YOUR NAME'}</Text>
                                    </View>
                                    <View>
                                        <Text style={tw`text-blue-200 text-[10px] font-geistMedium uppercase mb-1`}>Expires</Text>
                                        <Text style={tw`text-white font-geistMedium text-sm`}>{expiry || 'MM/YY'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={tw`mb-4`}>
                        <Text style={tw`mb-2 font-geistMedium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Card Number</Text>
                        <TextInput
                            style={tw`border ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-gray-50 text-gray-800'} rounded-xl p-4 font-geist`}
                            placeholder="0000 0000 0000 0000"
                            placeholderTextColor={isDarkMode ? "#6b7280" : "#9ca3af"}
                            keyboardType="numeric"
                            value={cardNumber}
                            onChangeText={setCardNumber}
                            maxLength={16}
                        />
                    </View>

                    <View style={tw`flex-row justify-between mb-4`}>
                        <View style={tw`w-[48%]`}>
                            <Text style={tw`mb-2 font-geistMedium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Expiry Date</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={tw`border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} rounded-xl p-4 flex-row justify-between items-center`}
                            >
                                <Text style={tw`font-geist ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{expiry || 'MM/YY'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={tw`w-[48%]`}>
                            <Text style={tw`mb-2 font-geistMedium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>CVV</Text>
                            <TextInput
                                style={tw`border ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-gray-50 text-gray-800'} rounded-xl p-4 font-geist`}
                                placeholder="123"
                                placeholderTextColor={isDarkMode ? "#6b7280" : "#9ca3af"}
                                keyboardType="numeric"
                                secureTextEntry
                                value={cvv}
                                onChangeText={setCvv}
                                maxLength={3}
                            />
                        </View>
                    </View>

                    <View style={tw`mb-8`}>
                        <Text style={tw`mb-2 font-geistMedium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Card Holder Name</Text>
                        <TextInput
                            style={tw`border ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-gray-50 text-gray-800'} rounded-xl p-4 font-geist`}
                            placeholder="YOUR NAME"
                            placeholderTextColor={isDarkMode ? "#6b7280" : "#9ca3af"}
                            value={holderName}
                            onChangeText={setHolderName}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSave}
                        style={tw`bg-blue-600 p-4 rounded-xl items-center shadow-lg shadow-blue-500/30`}
                    >
                        <Text style={tw`text-white font-geistBold text-lg`}>Save Card</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
            <ExpiryDatePicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onSelect={handleDateSelect}
            />
        </SafeAreaView>
    );
};

export default AddPaymentMethodScreen;
