import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import tw from '../lib/tailwind';
import { ArrowLeft, Search, ChevronDown, Plus, X } from 'lucide-react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const FAQS = [
    {
        id: 1,
        question: "Where is my morning delivery?",
        answer: "Your morning delivery is usually scheduled between 5:00 AM and 7:00 AM. You can track your order in the 'Orders' section for real-time updates."
    },
    {
        id: 2,
        question: "How do I cancel an order?",
        answer: "You can cancel your order up to 8 hours before your delivery slot. Just go to your Order History, select the active order, and tap 'Cancel Order'."
    },
    {
        id: 3,
        question: "When will I receive my refund?",
        answer: "Refunds are processed within 24-48 hours of cancellation. The amount will be credited back to your original payment method."
    },
    {
        id: 4,
        question: "Changing delivery frequency",
        answer: "You can change your delivery frequency from the 'Subscription Plans' section in your profile. Select your active plan and choose 'Modify Frequency'."
    },
    {
        id: 5,
        question: "Updating my delivery address",
        answer: "Go to 'Profile' > 'Manage Address' to add or update your delivery address. Ensure you do this before 8:00 PM for the next day's delivery."
    }
];

const HelpSupportScreen = () => {
    const navigation = useNavigation();
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Bottom Sheet
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['75%'], []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
    };

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const filteredFaqs = FAQS.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={tw`flex-1 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <SafeAreaView edges={['top']} style={tw`flex-1`}>
                    {/* Header */}
                    <View style={tw`px-6 py-4 flex-row items-center gap-4 z-10`}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={tw`p-2 -ml-2 rounded-full ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                        >
                            <ArrowLeft size={24} color={isDarkMode ? '#ffffff' : '#0f172a'} />
                        </TouchableOpacity>
                        <Text style={tw`text-xl font-geistBold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Help & Support
                        </Text>
                    </View>

                    {/* Search Bar */}
                    <View style={tw`px-6 pb-2`}>
                        <View style={tw`relative`}>
                            <View style={tw`absolute left-4 top-4 z-10`}>
                                <Search size={20} color="#94a3b8" />
                            </View>
                            <TextInput
                                style={tw`w-full pl-12 pr-4 py-3.5 border-2 ${isDarkMode ? 'bg-slate-800 border-transparent text-white focus:bg-slate-900' : 'bg-white border-transparent text-slate-900 focus:bg-white'} rounded-2xl font-inter text-base`}
                                placeholder="Search for answers..."
                                placeholderTextColor="#94a3b8"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    {/* FAQ List */}
                    <ScrollView
                        style={tw`flex-1 px-6 pt-4`}
                        contentContainerStyle={tw`pb-32`}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={tw`mb-4 text-xs font-geistBold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest px-1`}>
                            Frequently Asked Questions
                        </Text>

                        <View style={tw`gap-3`}>
                            {filteredFaqs.map((faq) => (
                                <View
                                    key={faq.id}
                                    style={tw`${isDarkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-white border-slate-100'} border rounded-3xl overflow-hidden ${expandedId === faq.id ? 'border-blue-500/30' : ''}`}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => toggleExpand(faq.id)}
                                        style={tw`px-4 py-5 flex-row items-center justify-between`}
                                    >
                                        <Text style={tw`text-md font-geistBold ${expandedId === faq.id ? 'text-blue-500' : (isDarkMode ? 'text-white' : 'text-slate-900')}`}>
                                            {faq.question}
                                        </Text>
                                        <ChevronDown
                                            size={20}
                                            color={expandedId === faq.id ? '#3b82f6' : '#94a3b8'}
                                            style={{ transform: [{ rotate: expandedId === faq.id ? '180deg' : '0deg' }] }}
                                        />
                                    </TouchableOpacity>
                                    {expandedId === faq.id && (
                                        <View style={tw`px-4 pb-5`}>
                                            <Text style={tw`text-sm font-inter ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                                                {faq.answer}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Floating Action Button */}
                    <TouchableOpacity
                        onPress={openBottomSheet}
                        style={tw`absolute bottom-10 right-6 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 z-20`}
                        activeOpacity={0.9}
                    >
                        <Plus size={32} color="#ffffff" />
                    </TouchableOpacity>

                </SafeAreaView>

                {/* Bottom Sheet for Query */}
                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    backdropComponent={renderBackdrop}
                    backgroundStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', borderRadius: 40 }}
                    handleIndicatorStyle={{ backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', width: 48 }}
                >
                    <BottomSheetView style={tw`flex-1 px-6 pt-2 pb-8`}>
                        <View style={tw`flex-row justify-between items-center mb-6`}>
                            <Text style={tw`text-2xl font-geistBold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Submit New Query
                            </Text>
                            {/* <TouchableOpacity onPress={closeBottomSheet} style={tw`p-1`}>
                                <X size={24} color={isDarkMode ? '#94a3b8' : '#64748b'} />
                            </TouchableOpacity> */}
                        </View>

                        <View style={tw`gap-4`}>
                            <View>
                                <Text style={tw`text-xs font-geistBold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider mb-2 ml-1`}>
                                    Full Name
                                </Text>
                                <TextInput
                                    style={tw`w-full p-4 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'} rounded-2xl font-inter text-base`}
                                    placeholder="John Doe"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>

                            <View>
                                <Text style={tw`text-xs font-geistBold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider mb-2 ml-1`}>
                                    Email Address
                                </Text>
                                <TextInput
                                    style={tw`w-full p-4 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'} rounded-2xl font-inter text-base`}
                                    placeholder="john@example.com"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="email-address"
                                />
                            </View>

                            <View>
                                <Text style={tw`text-xs font-geistBold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider mb-2 ml-1`}>
                                    Your Query
                                </Text>
                                <TextInput
                                    style={tw`w-full p-4 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'} rounded-2xl font-inter text-base h-32`}
                                    placeholder="How can we help you today?"
                                    placeholderTextColor="#94a3b8"
                                    multiline={true}
                                    textAlignVertical="top"
                                />
                            </View>

                            <TouchableOpacity
                                style={tw`w-full py-4 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/25 items-center justify-center mt-4`}
                                onPress={closeBottomSheet}
                            >
                                <Text style={tw`text-white font-geistBold text-base`}>Submit Ticket</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={tw`w-full py-3 items-center justify-center`}
                                onPress={closeBottomSheet}
                            >
                                <Text style={tw`text-sm font-interMedium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
};

export default HelpSupportScreen;
