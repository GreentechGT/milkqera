import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import tw from '../lib/tailwind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Calendar } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const OrdersHistoryScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const orders = useSelector((state: RootState) => state.user.orders);
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

    const handleOrderPress = (order: any) => {
        navigation.navigate('TrackOrder', { orderId: order.id });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600';
            case 'Cancelled': return isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600';
            case 'Pending': return isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600';
            default: return isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-50 text-yellow-600';
        }
    };

    const renderOrderItem = ({ item }: { item: any }) => {
        const statusStyle = getStatusColor(item.status);
        const [bgClass, textClass] = statusStyle.split(' ');

        return (
            <TouchableOpacity
                style={tw`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-4 rounded-2xl mb-4 shadow-sm border`}
                onPress={() => handleOrderPress(item)}
            >
                <View style={tw`flex-row justify-between items-center mb-4 pb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <View>
                        <Text style={tw`font-geistBold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-base`}>Order #{item.id}</Text>
                        <View style={tw`flex-row items-center mt-1`}>
                            <Calendar size={12} color={isDarkMode ? "#9ca3af" : "#9ca3af"} style={tw`mr-1`} />
                            <Text style={tw`font-geist ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{item.date}</Text>
                        </View>
                    </View>
                    <View style={tw`${bgClass} px-3 py-2 mt-3 rounded-full`}>
                        <Text style={tw`font-geistBold ${textClass} text-xs`}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                {item.items.map((prod: any, index: number) => (
                    <View key={index} style={tw`flex-row items-center mb-2`}>
                        <Image source={typeof prod.image === 'string' ? { uri: prod.image } : prod.image} style={tw`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} mr-3`} />
                        <View style={tw`flex-1`}>
                            <Text style={tw`font-geistMedium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{prod.name}</Text>
                            <Text style={tw`font-geist ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{prod.quantity} x ₹{prod.price}</Text>
                        </View>
                        <Text style={tw`font-geistBold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>₹{prod.quantity * prod.price}</Text>
                    </View>
                ))}

                <View style={tw`flex-row justify-between items-center mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-50'}`}>
                    <Text style={tw`font-geistMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Amount</Text>
                    <Text style={tw`font-geistBold text-lg text-blue-600`}>₹{item.total.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const validOrders = orders.filter((order: any) => order.status !== 'Cancelled');
    const totalSpent = validOrders.reduce((sum: number, order: any) => sum + order.total, 0);

    return (
        <SafeAreaView style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <View style={tw`flex-row items-center p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm z-10`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 mr-2`}>
                    <ChevronLeft size={24} color={isDarkMode ? "white" : "#374151"} />
                </TouchableOpacity>
                <Text style={tw`font-geistBold text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Orders History</Text>
            </View>

            {/* Stats Header */}
            <View style={tw`flex-row p-4 pb-2`}>
                <View style={tw`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-2xl mr-2 shadow-sm`}>
                    <Text style={tw`text-blue-600 font-geistMedium text-xs uppercase mb-1`}>Total Spent</Text>
                    <Text style={tw`text-blue-600 font-geistBold text-2xl`}>₹{totalSpent.toFixed(0)}</Text>
                </View>
                <View style={tw`flex-1 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-4 rounded-2xl ml-2 shadow-sm border`}>
                    <Text style={tw`${isDarkMode ? 'text-gray-400' : 'text-gray-400'} font-geistMedium text-xs uppercase mb-1`}>Total Orders</Text>
                    <Text style={tw`${isDarkMode ? 'text-white' : 'text-gray-800'} font-geistBold text-2xl`}>{validOrders.length}</Text>
                </View>
            </View>

            {orders.length === 0 ? (
                <View style={tw`flex-1 items-center justify-center p-8`}>
                    <Text style={tw`font-geistMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-lg mb-2`}>No orders yet</Text>
                    <Text style={tw`font-geist ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-center`}>Order something fresh to see it here!</Text>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={tw`p-4 pb-20`}
                    data={orders}
                    keyExtractor={item => item.id}
                    renderItem={renderOrderItem}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

export default OrdersHistoryScreen;
