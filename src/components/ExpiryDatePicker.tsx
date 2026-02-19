import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import tw from '../lib/tailwind';
import { X } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface ExpiryDatePickerProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (month: string, year: string) => void;
}

const ExpiryDatePicker = ({ visible, onClose, onSelect }: ExpiryDatePickerProps) => {
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Generate months 01-12
    const months = Array.from({ length: 12 }, (_, i) => {
        const m = i + 1;
        return m < 10 ? `0${m}` : `${m}`;
    });

    // Generate next 20 years
    const years = Array.from({ length: 20 }, (_, i) => (currentYear + i).toString());

    const [selectedMonth, setSelectedMonth] = useState(currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`);
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());

    const handleConfirm = () => {
        onSelect(selectedMonth, selectedYear.slice(-2)); // Return YY format
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
                <View style={tw`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl p-6`}>
                    <View style={tw`flex-row justify-between items-center mb-6`}>
                        <Text style={tw`font-geistBold text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Select Expiry Date</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={isDarkMode ? "white" : "#374151"} />
                        </TouchableOpacity>
                    </View>

                    <View style={tw`flex-row justify-between mb-8`}>
                        {/* Month Selection */}
                        <View style={tw`w-[48%] h-48`}>
                            <Text style={tw`text-center font-geistMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Month</Text>
                            <ScrollView style={tw`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl`} showsVerticalScrollIndicator={false}>
                                {months.map((month) => (
                                    <TouchableOpacity
                                        key={month}
                                        onPress={() => setSelectedMonth(month)}
                                        style={tw`p-3 items-center ${selectedMonth === month ? (isDarkMode ? 'bg-blue-900' : 'bg-blue-100') : ''}`}
                                    >
                                        <Text style={tw`font-geistBold text-lg ${selectedMonth === month ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-gray-300' : 'text-gray-600')}`}>
                                            {month}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Year Selection */}
                        <View style={tw`w-[48%] h-48`}>
                            <Text style={tw`text-center font-geistMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Year</Text>
                            <ScrollView style={tw`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl`} showsVerticalScrollIndicator={false}>
                                {years.map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        onPress={() => setSelectedYear(year)}
                                        style={tw`p-3 items-center ${selectedYear === year ? (isDarkMode ? 'bg-blue-900' : 'bg-blue-100') : ''}`}
                                    >
                                        <Text style={tw`font-geistBold text-lg ${selectedYear === year ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-gray-300' : 'text-gray-600')}`}>
                                            {year}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleConfirm}
                        style={tw`bg-blue-600 p-4 rounded-xl items-center`}
                    >
                        <Text style={tw`text-white font-geistBold text-lg`}>Confirm Date</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ExpiryDatePicker;
