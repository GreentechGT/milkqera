import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert, KeyboardAvoidingView, Platform, Keyboard, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Phone, Calendar, CreditCard, Wallet, Banknote, CheckCircle2 } from 'lucide-react-native';
import tw from '../lib/tailwind';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { placeOrder } from '../store/userSlice';
import { clearCart } from '../store/cartSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useToast } from '../context/ToastContext';
import { addNotification } from '../store/notificationSlice';

const CheckoutScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const user = useSelector((state: RootState) => state.user);
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
    const { showToast } = useToast();
    const dispatch = useDispatch();

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 2.00 : 0;
    const total = subtotal + deliveryFee;

    // Get default address and payment method safely
    const addresses = user?.addresses || [];
    const paymentMethods = user?.paymentMethods || [];

    const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
    const defaultPayment = paymentMethods.find(pm => pm.isDefault) || paymentMethods[0];

    const [selectedPayment, setSelectedPayment] = useState(defaultPayment ? 'card' : 'cod');
    const [upiId, setUpiId] = useState('');
    const [address, setAddress] = useState(defaultAddress ? `${defaultAddress.street}, ${defaultAddress.city} - ${defaultAddress.zipCode}` : '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [date, setDate] = useState(new Date().toDateString());

    React.useEffect(() => {
        console.log("CheckoutScreen mounted");
        console.log("User state:", user);
    }, []);

    // Effect to update local state if defaults change (optional, but good for UX)
    React.useEffect(() => {
        if (defaultAddress) {
            setAddress(`${defaultAddress.street}, ${defaultAddress.city} - ${defaultAddress.zipCode}`);
        }
        if (defaultPayment) {
            setSelectedPayment('card');
        }
    }, [defaultAddress, defaultPayment]);

    const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

    const handlePlaceOrder = () => {
        Keyboard.dismiss();
        if (!cartItems.length) {
            Alert.alert("Cart Empty", "Your cart is empty!");
            return;
        }

        const newOrder = {
            id: `ORD-${Date.now()}`,
            items: cartItems,
            total: total,
            date: new Date().toDateString(),
            status: 'Confirmed' as const,
            estimatedArrival: 'Today, 5:00 PM' // Mock estimation
        };

        dispatch(placeOrder(newOrder));
        dispatch(addNotification({
            title: 'Order Placed Successfully',
            message: `Your order #${newOrder.id} has been placed successfully. Amount: ₹${total.toFixed(2)}`,
            type: 'order_placed',
        }));
        dispatch(clearCart());
        setIsOrderConfirmed(true);
    };

    return (
        <SafeAreaView style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <View style={tw`flex-row items-center p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} shadow-sm z-10 border-b`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 mr-2`}>
                    <ChevronLeft size={24} color={isDarkMode ? "white" : "#374151"} />
                </TouchableOpacity>
                <Text style={tw`font-geistBold text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Checkout</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`flex-1`}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <ScrollView contentContainerStyle={tw`p-4 pb-24`} showsVerticalScrollIndicator={false}>

                    {/* Delivery Details Section */}
                    <View style={tw`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-2xl mb-4 shadow-sm`}>
                        <Text style={tw`font-geistBold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Delivery Details</Text>

                        {/* Address */}
                        <View style={tw`flex-row items-start mb-4`}>
                            <View style={tw`${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} p-2 rounded-full mr-3`}>
                                <MapPin size={20} color="#2563eb" />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`font-interMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>Delivery Address</Text>
                                <TextInput
                                    style={tw`font-inter ${isDarkMode ? 'text-gray-200 border-gray-700' : 'text-gray-800 border-gray-100'} border-b pb-1`}
                                    value={address}
                                    onChangeText={setAddress}
                                    multiline
                                    placeholder="Enter Address"
                                    placeholderTextColor={isDarkMode ? "#6b7280" : "#9ca3af"}
                                />
                            </View>
                        </View>

                        {/* Phone */}
                        <View style={tw`flex-row items-center mb-4`}>
                            <View style={tw`${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'} p-2 rounded-full mr-3`}>
                                <Phone size={20} color="#059669" />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`font-interMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>Phone Number</Text>
                                <TextInput
                                    style={tw`font-inter ${isDarkMode ? 'text-gray-200 border-gray-700' : 'text-gray-800 border-gray-100'} border-b pb-1`}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    placeholder="Enter Phone Number"
                                    placeholderTextColor={isDarkMode ? "#6b7280" : "#9ca3af"}
                                />
                            </View>
                        </View>

                        {/* Date */}
                        <View style={tw`flex-row items-center`}>
                            <View style={tw`${isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50'} p-2 rounded-full mr-3`}>
                                <Calendar size={20} color="#ea580c" />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`font-interMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>Delivery Date</Text>
                                <Text style={tw`font-inter ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{date}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Order Summary Section */}
                    <View style={tw`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-2xl mb-4 shadow-sm`}>
                        <Text style={tw`font-geistBold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Order Summary</Text>
                        {cartItems.map((item) => (
                            <View key={item.id} style={tw`flex-row justify-between items-center mb-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-50'} border-b pb-2 last:border-0`}>
                                <View style={tw`flex-row items-center flex-1`}>
                                    <View style={tw`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} w-8 h-8 rounded-full items-center justify-center mr-3`}>
                                        <Text style={tw`font-geistBold text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.quantity}x</Text>
                                    </View>
                                    <Text style={tw`font-inter ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex-1`} numberOfLines={1}>{item.name}</Text>
                                </View>
                                <Text style={tw`font-geistBold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>₹{(item.price * item.quantity).toFixed(2)}</Text>
                            </View>
                        ))}

                        <View style={tw`mt-2 pt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                            <View style={tw`flex-row justify-between mb-1`}>
                                <Text style={tw`font-inter ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Subtotal</Text>
                                <Text style={tw`font-geist ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>₹{subtotal.toFixed(2)}</Text>
                            </View>
                            <View style={tw`flex-row justify-between mb-1`}>
                                <Text style={tw`font-inter ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Delivery Fee</Text>
                                <Text style={tw`font-geist ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>₹{deliveryFee.toFixed(2)}</Text>
                            </View>
                            <View style={tw`flex-row justify-between mt-2 pt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                <Text style={tw`font-geistBold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Total</Text>
                                <Text style={tw`font-geistBold text-lg text-blue-500`}>₹{total.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Payment Method Section */}
                    {/* Payment Method Section */}
                    <View style={tw`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-2xl mb-4 shadow-sm`}>
                        <Text style={tw`font-geistBold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Payment Method</Text>

                        <View style={tw`mb-2 border ${selectedPayment === 'upi' ? (isDarkMode ? 'border-blue-500 bg-blue-900/30' : 'border-blue-600 bg-blue-50') : (isDarkMode ? 'border-gray-700' : 'border-gray-200')} rounded-xl overflow-hidden`}>
                            <TouchableOpacity
                                onPress={() => setSelectedPayment('upi')}
                                style={tw`flex-row items-center justify-between p-3`}
                            >
                                <View style={tw`flex-row items-center`}>
                                    <Wallet size={20} color={selectedPayment === 'upi' ? '#2563eb' : (isDarkMode ? '#9ca3af' : '#6b7280')} style={tw`mr-3`} />
                                    <Text style={tw`font-interMedium ${selectedPayment === 'upi' ? (isDarkMode ? 'text-blue-400' : 'text-blue-800') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')}`}>UPI ID</Text>
                                </View>
                                {selectedPayment === 'upi' && <CheckCircle2 size={20} color="#2563eb" />}
                            </TouchableOpacity>
                            {selectedPayment === 'upi' && (
                                <View style={tw`px-3 pb-3`}>
                                    <Text style={tw`font-inter text-xs text-blue-500 mb-1 ml-1`}>Enter UPI ID</Text>
                                    <TextInput
                                        style={tw`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-200 text-gray-800'} border rounded-lg p-2 font-inter`}
                                        placeholder="example@upi"
                                        placeholderTextColor={isDarkMode ? "#6b7280" : "#9ca3af"}
                                        value={upiId}
                                        onChangeText={setUpiId}
                                        autoCapitalize="none"
                                    />
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={() => setSelectedPayment('card')}
                            style={tw`flex-row items-center justify-between p-3 rounded-xl border ${selectedPayment === 'card' ? (isDarkMode ? 'border-blue-500 bg-blue-900/30' : 'border-blue-600 bg-blue-50') : (isDarkMode ? 'border-gray-700' : 'border-gray-200')} mb-2`}
                        >
                            <View style={tw`flex-row items-center flex-1`}>
                                <CreditCard size={20} color={selectedPayment === 'card' ? '#2563eb' : (isDarkMode ? '#9ca3af' : '#6b7280')} style={tw`mr-3`} />
                                <View>
                                    <Text style={tw`font-interMedium ${selectedPayment === 'card' ? (isDarkMode ? 'text-blue-400' : 'text-blue-800') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')}`}>Credit / Debit Card</Text>
                                    {selectedPayment === 'card' && defaultPayment && (
                                        <Text style={tw`font-inter text-xs text-blue-500 mt-0.5`}>
                                            {defaultPayment.type} ending with {defaultPayment.last4}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            {selectedPayment === 'card' && <CheckCircle2 size={20} color="#2563eb" />}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setSelectedPayment('cod')}
                            style={tw`flex-row items-center justify-between p-3 rounded-xl border ${selectedPayment === 'cod' ? (isDarkMode ? 'border-blue-500 bg-blue-900/30' : 'border-blue-600 bg-blue-50') : (isDarkMode ? 'border-gray-700' : 'border-gray-200')}`}
                        >
                            <View style={tw`flex-row items-center`}>
                                <Banknote size={20} color={selectedPayment === 'cod' ? '#2563eb' : (isDarkMode ? '#9ca3af' : '#6b7280')} style={tw`mr-3`} />
                                <Text style={tw`font-interMedium ${selectedPayment === 'cod' ? (isDarkMode ? 'text-blue-400' : 'text-blue-800') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')}`}>Cash on Delivery</Text>
                            </View>
                            {selectedPayment === 'cod' && <CheckCircle2 size={20} color="#2563eb" />}
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView >

            {/* Bottom Button */}
            <View style={tw`absolute bottom-0 left-0 right-0 p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-t`}>
                <TouchableOpacity
                    onPress={handlePlaceOrder}
                    style={tw`bg-blue-600 py-4 rounded-xl shadow-lg items-center`}
                >
                    <Text style={tw`font-geistBold text-white text-lg`}>Place Order • ₹{total.toFixed(2)}</Text>
                </TouchableOpacity>
            </View>

            {/* Order Confirmed Modal */}
            <Modal
                visible={isOrderConfirmed}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsOrderConfirmed(false)}
            >
                <View style={[tw`flex-1 justify-end`, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <View style={tw`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl p-6 pb-10`}>
                        <View style={tw`items-center justify-center`}>
                            <View style={tw`${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} p-4 rounded-full mb-4`}>
                                <CheckCircle2 size={48} color={isDarkMode ? "#4ade80" : "#059669"} />
                            </View>
                            <Text style={tw`font-geistBold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Order Confirmed!</Text>
                            <Text style={tw`font-geist ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-8`}>
                                Your order has been placed successfully.{'\n'}You can track the delivery status.
                            </Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setIsOrderConfirmed(false);
                                    navigation.replace('TrackOrder');
                                }}
                                style={tw`bg-blue-600 w-full py-4 rounded-xl items-center mb-3`}
                            >
                                <Text style={tw`font-geistBold text-white text-lg`}>Track Order</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setIsOrderConfirmed(false);
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Tabs' }],
                                    });
                                }}
                                style={tw`p-4`}
                            >
                                <Text style={tw`font-geistBold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Back to Home</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default CheckoutScreen;
