import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import tw from '../lib/tailwind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Bell, Package, XCircle, Info, Trash2 } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { markAllAsRead, clearNotifications } from '../store/notificationSlice';

const NotificationPage = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { notifications } = useSelector((state: RootState) => state.notifications);
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

    useEffect(() => {
        // Mark all as read when screen is opened
        dispatch(markAllAsRead());
    }, [dispatch]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'order_placed':
                return <Package size={24} color="#2563eb" />;
            case 'order_cancelled':
                return <XCircle size={24} color="#dc2626" />;
            case 'promotional':
                return <Bell size={24} color="#eab308" />;
            default:
                return <Info size={24} color={isDarkMode ? "#9ca3af" : "#6b7280"} />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'order_placed':
                return isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100';
            case 'order_cancelled':
                return isDarkMode ? 'bg-red-900/30' : 'bg-red-100';
            case 'promotional':
                return isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100';
            default:
                return isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={tw`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-50'} p-4 rounded-2xl mb-3 shadow-sm flex-row items-center border`}>
            <View style={tw`${getBgColor(item.type)} p-3 rounded-full mr-4`}>
                {getIcon(item.type)}
            </View>
            <View style={tw`flex-1`}>
                <View style={tw`flex-row justify-between items-center mb-1`}>
                    <Text style={tw`font-geistBold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-base`}>{item.title}</Text>
                    <Text style={tw`font-geist ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-xs`}>
                        {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <Text style={tw`font-geistMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm leading-5`}>{item.message}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <View style={tw`flex-row items-center justify-between p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm z-10`}>
                <View style={tw`flex-row items-center`}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 mr-2`}>
                        <ChevronLeft size={24} color={isDarkMode ? "white" : "#374151"} />
                    </TouchableOpacity>
                    <Text style={tw`font-geistBold text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Notifications</Text>
                </View>
                {notifications.length > 0 && (
                    <TouchableOpacity onPress={() => dispatch(clearNotifications())} style={tw`p-2`}>
                        <Trash2 size={20} color="#ef4444" />
                    </TouchableOpacity>
                )}
            </View>

            {notifications.length === 0 ? (
                <View style={tw`flex-1 items-center justify-center p-8`}>
                    <View style={tw`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-6 rounded-full mb-4`}>
                        <Bell size={48} color={isDarkMode ? "#4b5563" : "#9ca3af"} />
                    </View>
                    <Text style={tw`font-geistBold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xl mb-2`}>No Notifications</Text>
                    <Text style={tw`font-geist ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-center`}>
                        You're all caught up! Check back later for updates.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={tw`p-4 pb-10`}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

export default NotificationPage;
