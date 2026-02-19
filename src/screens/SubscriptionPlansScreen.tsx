
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, Platform, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import tw from '../lib/tailwind';
import { MaterialIcons } from '@expo/vector-icons';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { RootState } from '../store/store';
import DateTimePicker from '@react-native-community/datetimepicker';

const SubscriptionPlansScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
    const dispatch = useDispatch();
    const [selectedFrequency, setSelectedFrequency] = useState('Daily');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null); // Using any for simplicity with mock data updates
    const [deliveryTime, setDeliveryTime] = useState(new Date()); // Date object
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [deliveryDay, setDeliveryDay] = useState('Monday');

    const handleSubscribePress = (plan: any) => {
        setSelectedPlan(plan);
        const defaultTime = new Date();
        defaultTime.setHours(7, 0, 0, 0); // Default 7:00 AM
        setDeliveryTime(defaultTime);
        setDeliveryDay('Monday'); // Default
        setModalVisible(true);
    };

    const onTimeChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || deliveryTime;
        setShowTimePicker(Platform.OS === 'ios');
        setDeliveryTime(currentDate);
    };

    const handleConfirmSubscription = () => {
        if (selectedPlan && selectedPlan.products) {
            selectedPlan.products.forEach((product: any) => {
                dispatch(addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: product.quantity
                }));
            });
            setModalVisible(false);
            // Navigate to Cart via Tabs
            // @ts-ignore - Navigation type mismatch workaround for nested navigator
            navigation.navigate('Tabs', { screen: 'Cart' });
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const frequencies = ['Daily', 'Weekly'];

    // Filter and group plans by category
    // Filter plans by frequency
    const filteredPlans = SUBSCRIPTION_PLANS.filter(plan => plan.frequency === selectedFrequency);

    const getSectionTitle = () => {
        switch (selectedFrequency) {
            case 'Daily': return 'Daily Essentials';
            case 'Weekly': return 'Weekly Essentials';
            default: return 'Subscription Plans';
        }
    };

    return (
        <View style={tw`flex-1 ${isDarkMode ? 'bg-[#101722]' : 'bg-[#f5f7f8]'}`}>
            <SafeAreaView style={tw`flex-1`} edges={['top', 'left', 'right']}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#0f172a' : '#ffffff'} />

                <View style={tw`flex-1 w-full mx-auto overflow-hidden`}>
                    {/* Header */}
                    <View style={tw`flex-row items-center justify-between px-4 pb-2 pt-4 border-b ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <TouchableOpacity onPress={handleBack} style={tw`w-10 h-10 items-center justify-center`}>
                            <MaterialIcons name="arrow-back" size={24} color={isDarkMode ? "#f1f5f9" : "#0f172a"} />
                        </TouchableOpacity>
                        <Text style={tw`text-lg font-geistBold flex-1 text-center ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Subscription Plans</Text>
                        <View style={tw`w-10 items-center justify-end`}>
                            <TouchableOpacity style={tw`w-10 h-10 items-center justify-center rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <MaterialIcons name="help-outline" size={24} color={isDarkMode ? "#f1f5f9" : "#0f172a"} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Frequency Toggle */}
                    <View style={tw`z-40 px-4 py-4 ${isDarkMode ? 'bg-[#101722]/95' : 'bg-[#f5f7f8]/95'}`}>
                        <View style={tw`flex-row h-12 items-center justify-center rounded-xl p-1.5 shadow-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                            {frequencies.map((freq) => (
                                <TouchableOpacity
                                    key={freq}
                                    onPress={() => setSelectedFrequency(freq)}
                                    style={tw`flex-1 h-full items-center justify-center rounded-lg px-2 ${selectedFrequency === freq ? (isDarkMode ? 'bg-slate-700 shadow-sm' : 'bg-white shadow-sm') : ''}`}
                                >
                                    <Text style={tw`text-sm font-geistMedium ${selectedFrequency === freq ? 'text-blue-500' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>
                                        {freq}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Content Area */}
                    <ScrollView style={tw`flex-1 px-4`} contentContainerStyle={tw`pb-24`} showsVerticalScrollIndicator={false}>

                        <View style={tw`mt-4`}>
                            <View style={tw`flex-row items-center justify-between pb-3`}>
                                <Text style={tw`text-xl font-geistBold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{getSectionTitle()}</Text>
                                <View style={tw`px-2 py-1 bg-blue-500/10 rounded-full`}>
                                    <Text style={tw`text-xs font-geistBold text-blue-500`}>{filteredPlans.length} Plans</Text>
                                </View>
                            </View>

                            <View style={tw`gap-4`}>
                                {filteredPlans.map((plan) => (
                                    <View key={plan.id} style={tw`flex-col overflow-hidden rounded-xl shadow-sm border ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100'}`}>
                                        <View style={tw`relative w-full h-40`}>
                                            <Image
                                                source={{ uri: plan.image }}
                                                style={tw`w-full h-full`}
                                                resizeMode="cover"
                                            />
                                            {plan.isBestValue && (
                                                <View style={tw`absolute top-3 right-3 bg-blue-500 px-2 py-1 rounded-full shadow-lg`}>
                                                    <Text style={tw`text-white text-[10px] font-geistBold uppercase tracking-wider`}>Best Value</Text>
                                                </View>
                                            )}
                                            {plan.discount && !plan.isBestValue && (
                                                <View style={tw`absolute top-3 right-3 bg-emerald-500 px-2 py-1 rounded-full shadow-lg`}>
                                                    <Text style={tw`text-white text-[10px] font-geistBold uppercase tracking-wider`}>{plan.discount}</Text>
                                                </View>
                                            )}
                                        </View>

                                        <View style={tw`p-4 flex-col gap-3`}>
                                            <View>
                                                <Text style={tw`text-lg font-geistBold leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{plan.title}</Text>
                                                <Text style={tw`text-sm font-inter mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</Text>
                                            </View>

                                            <View style={tw`flex-row items-center justify-between pt-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                                                <View style={tw`flex-col`}>
                                                    <View style={tw`flex-row items-center gap-2`}>
                                                        {plan.originalPrice && (
                                                            <Text style={tw`text-sm font-inter line-through text-slate-400`}>{plan.originalPrice}₹</Text>
                                                        )}
                                                        <Text style={tw`text-blue-500 text-xl font-geistBold`}>{plan.price.toFixed(2)}₹</Text>
                                                    </View>
                                                    <Text style={tw`text-[10px] uppercase font-geistBold tracking-widest text-slate-400`}>{plan.unit}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => handleSubscribePress(plan)}
                                                    style={tw`h-10 items-center justify-center rounded-lg bg-blue-500 px-6 shadow-md shadow-blue-500/20 active:scale-95`}
                                                >
                                                    <Text style={tw`text-white text-sm font-geistBold`}>Subscribe</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                                {filteredPlans.length === 0 && (
                                    <View style={tw`p-8 items-center justify-center`}>
                                        <Text style={tw`${isDarkMode ? 'text-slate-500' : 'text-slate-400'} font-inter text-center`}>No plans available for this frequency.</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                    </ScrollView>
                </View>
            </SafeAreaView>

            {/* Subscription Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={tw`flex-1 justify-end bg-black/50`}>
                        <TouchableWithoutFeedback>
                            <View style={tw`w-full ${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'} rounded-t-3xl p-6 h-[85%]`}>
                                <View style={tw`w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6 opacity-50`} />

                                {selectedPlan && (
                                    <>
                                        <Text style={tw`text-2xl font-geistBold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedPlan.title}</Text>
                                        <Text style={tw`text-sm font-inter mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selectedPlan.description}</Text>

                                        {/* Total Price Calculation */}
                                        {/* Subscription Price */}
                                        <View style={tw`mb-6`}>
                                            <Text style={tw`text-2xl font-geistBold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                ₹{selectedPlan.price.toFixed(2)}
                                                <Text style={tw`text-sm font-inter ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}> / {selectedPlan.frequency === 'Daily' ? 'day' : 'week'}</Text>
                                            </Text>
                                        </View>

                                        {/* Delivery Schedule Options */}
                                        <View style={tw`mb-6`}>
                                            <Text style={tw`text-base font-geistBold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Customize Schedule:</Text>

                                            {/* Weekly Day Selection */}
                                            {selectedPlan.frequency === 'Weekly' && (
                                                <View style={tw`mb-4`}>
                                                    <Text style={tw`text-xs font-geistMedium mb-2 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select Delivery Day</Text>
                                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-2`}>
                                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                                            <TouchableOpacity
                                                                key={day}
                                                                onPress={() => setDeliveryDay(day)}
                                                                style={tw`px-4 py-2 rounded-lg border ${deliveryDay === day ? 'bg-blue-500 border-blue-500' : (isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50')}`}
                                                            >
                                                                <Text style={tw`text-xs font-geistBold ${deliveryDay === day ? 'text-white' : (isDarkMode ? 'text-slate-400' : 'text-slate-600')}`}>{day.slice(0, 3)}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>
                                                </View>
                                            )}

                                            {/* Time Selection */}
                                            <View>
                                                <Text style={tw`text-xs font-geistMedium mb-2 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select Delivery Time</Text>
                                                <TouchableOpacity
                                                    onPress={() => setShowTimePicker(true)}
                                                    style={tw`flex-row items-center justify-between p-3 rounded-xl border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}
                                                >
                                                    <View style={tw`flex-row items-center gap-2`}>
                                                        <MaterialIcons name="access-time" size={20} color={isDarkMode ? '#94a3b8' : '#64748b'} />
                                                        <Text style={tw`text-sm font-geistBold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                            {deliveryTime instanceof Date ? deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}
                                                        </Text>
                                                    </View>
                                                    <Text style={tw`text-xs font-geistBold text-blue-500`}>Change</Text>
                                                </TouchableOpacity>

                                                {showTimePicker && (
                                                    <DateTimePicker
                                                        value={deliveryTime instanceof Date ? deliveryTime : new Date()}
                                                        mode="time"
                                                        is24Hour={false}
                                                        display="default"
                                                        onChange={onTimeChange}
                                                    />
                                                )}
                                            </View>
                                        </View>


                                        <Text style={tw`text-base font-geistBold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Includes:</Text>

                                        <ScrollView style={tw`flex-1 mb-6`} showsVerticalScrollIndicator={false}>
                                            {selectedPlan.products && selectedPlan.products.map((product: any, index: number) => (
                                                <View key={index} style={tw`flex-row items-center mb-4 p-3 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                                    <Image source={{ uri: product.image }} style={tw`w-12 h-12 rounded-lg bg-gray-200`} />
                                                    <View style={tw`flex-1 ml-3`}>
                                                        <Text style={tw`font-geistMedium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{product.name}</Text>
                                                        <Text style={tw`text-xs font-inter ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Qty: {product.quantity} {product.unit}</Text>
                                                    </View>
                                                    <Text style={tw`font-geistBold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>₹{product.price}</Text>
                                                </View>
                                            ))}
                                        </ScrollView>

                                        <View style={tw`pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                                            <TouchableOpacity
                                                onPress={handleConfirmSubscription}
                                                style={tw`w-full h-14 bg-blue-500 rounded-xl items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95`}
                                            >
                                                <Text style={tw`text-white font-geistBold text-lg`}>Confirm Subscription • ₹{selectedPlan.price}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback >
            </Modal >
        </View >
    );
};

export default SubscriptionPlansScreen;
