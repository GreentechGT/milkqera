import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import tw from '../lib/tailwind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, Check, Phone, CheckCircle, XCircle, Trash2, Clock, MapPin, Bike, User, ChevronLeft, Package, FileText, Home } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/types';
import Svg, { Circle } from 'react-native-svg';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { cancelOrder } from '../store/userSlice';
import { addNotification } from '../store/notificationSlice';

const TrackOrderScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'TrackOrder'>>();
    const dispatch = useDispatch();
    const orders = useSelector((state: RootState) => state.user.orders);
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

    // Get order ID from params or default to first order
    const orderId = route.params?.orderId;
    const currentOrder = orderId
        ? orders.find(o => o.id === orderId)
        : (orders.length > 0 ? orders[0] : null);

    if (!currentOrder) {
        return (
            <SafeAreaView style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <View style={tw`flex-row items-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
                        <ArrowLeft size={24} color={isDarkMode ? "white" : "#000"} />
                    </TouchableOpacity>
                    <Text style={tw`flex-1 text-center font-geistBold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Track Order</Text>
                    <View style={tw`w-10`} />
                </View>
                <View style={tw`flex-1 items-center justify-center p-6`}>
                    <Text style={tw`font-geistBold text-xl ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>No Active Order</Text>
                    <Text style={tw`font-geist ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                        You haven't placed any orders yet.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // Determine current step index based on status of *currentOrder*
    // This logic maps the order status to the timeline steps
    const getStepStatus = (status: string) => {
        switch (status) {
            case 'Confirmed': return 0;
            case 'Prepared': return 1;
            case 'Shipped': return 2;
            case 'OutForDelivery': return 3;
            case 'Delivered': return 4;
            case 'Cancelled': return -1;
            default: return 0;
        }
    };

    const currentStepIndex = getStepStatus(currentOrder.status);
    const isCancelled = currentOrder.status === 'Cancelled';

    const steps = [
        { title: 'Order Confirmed', time: currentOrder.date, subtitle: 'Payment received' },
        { title: 'Packed', time: 'In Progress', subtitle: 'Quality checked & sealed' },
        { title: 'Picked up from Dairy', time: 'Pending', subtitle: 'Handed over to Rajesh' },
        { title: 'Out for Delivery', time: 'Pending', subtitle: 'Rajesh is on his way' },
        { title: 'Arriving at your doorstep', subtitle: `Estimated by ${currentOrder.estimatedArrival}` },
    ];

    const getVisualStatus = (status: string) => {
        switch (status) {
            case 'Confirmed':
                return { progress: 15, color: 'text-blue-500', borderColor: 'border-blue-500', Icon: FileText, bgColor: isDarkMode ? 'bg-blue-900/40' : 'bg-blue-50' };
            case 'Prepared':
                return { progress: 35, color: 'text-blue-500', borderColor: 'border-blue-500', Icon: Package, bgColor: isDarkMode ? 'bg-blue-900/40' : 'bg-blue-50' };
            case 'Shipped':
                return { progress: 55, color: 'text-blue-600', borderColor: 'border-blue-600', Icon: Bike, bgColor: isDarkMode ? 'bg-blue-900/40' : 'bg-blue-50' };
            case 'OutForDelivery':
                return { progress: 80, color: 'text-blue-600', borderColor: 'border-blue-600', Icon: MapPin, bgColor: isDarkMode ? 'bg-blue-900/40' : 'bg-blue-50' };
            case 'Delivered':
                return { progress: 100, color: 'text-green-500', borderColor: 'border-green-500', Icon: CheckCircle, bgColor: isDarkMode ? 'bg-green-900/40' : 'bg-green-50' };
            case 'Cancelled':
                return { progress: 100, color: 'text-red-500', borderColor: 'border-red-500', Icon: XCircle, bgColor: isDarkMode ? 'bg-red-900/40' : 'bg-red-50' };
            default:
                return { progress: 0, color: 'text-gray-400', borderColor: 'border-gray-400', Icon: Clock, bgColor: isDarkMode ? 'bg-gray-800' : 'bg-gray-50' };
        }
    };

    const visualStatus = getVisualStatus(currentOrder.status);
    const StatusIcon = visualStatus.Icon;

    const CircularProgress = ({
        size = 80,
        strokeWidth = 8,
        progress = 0,
        color = '#3b82f6',
        children
    }: any) => {

        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;

        const clampedProgress = Math.min(Math.max(progress, 0), 100);
        const strokeDashoffset =
            circumference - (circumference * clampedProgress) / 100;

        return (
            <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
                <Svg width={size} height={size}>
                    {/* Gray Background Circle */}
                    <Circle
                        stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />

                    {/* Blue Progress Circle */}
                    <Circle
                        stroke={color}
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        originX={size / 2}
                        originY={size / 2}
                    />
                </Svg>

                {/* Center Content */}
                <View style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {children}
                </View>
            </View>
        );
    };
    return (
        <SafeAreaView style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Header */}
            <View style={tw`flex-row justify-between items-center px-4 py-3 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-b`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
                    <ArrowLeft size={24} color={isDarkMode ? "white" : "#000"} />
                </TouchableOpacity>
                <View style={tw`flex-row items-center justify-center`}>
                    <Text style={tw`font-geistBold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} mr-5 `}>Order #{currentOrder.id}</Text>
                </View>

            </View>

            <ScrollView contentContainerStyle={tw`pb-45`}>
                {/* Status Circle */}
                <View style={tw`items-center py-10 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <View style={tw`mb-6`}>
                        <CircularProgress
                            size={180}
                            strokeWidth={8}
                            progress={visualStatus.progress}
                            colorClass={visualStatus.borderColor}
                        >
                            <View style={tw`${visualStatus.bgColor} w-full h-full rounded-full items-center justify-center`}>
                                <StatusIcon size={64} color={isCancelled ? "#EF4444" : (currentOrder.status === 'Delivered' ? "#22c55e" : "#3b82f6")} strokeWidth={2} />
                            </View>
                        </CircularProgress>
                    </View>
                    <Text style={tw`font-geistBold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {isCancelled ? 'Order Cancelled' : (currentStepIndex >= 3 ? 'Out for Delivery' : steps[Math.max(0, currentStepIndex)].title)}
                    </Text>
                    <Text style={tw`font-geist ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-base`}>
                        {isCancelled ? 'This order was cancelled' : 'Your fresh product is arriving soon!'}
                    </Text>
                </View>

                {/* Timeline */}
                <View style={tw`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} pt-8 pb-4 px-6 rounded-t-[30px]`}>
                    {steps.map((step, index) => {
                        let isCompleted = index < currentStepIndex;
                        let isActive = index === currentStepIndex;

                        if (isCancelled) {
                            isCompleted = false;
                            isActive = false;
                        }

                        const isLast = index === steps.length - 1;

                        return (
                            <View key={index} style={tw`flex-row relative mb-8`}>
                                {/* Connector Line */}
                                {!isLast && (
                                    <View style={tw`absolute left-[13px] top-7 bottom-[-32px] w-[2px] ${isCompleted ? 'bg-blue-500' : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')} z-0`} />
                                )}

                                {/* Icon/Dot */}
                                <View style={tw`mr-4 z-10`}>
                                    {isCompleted ? (
                                        <View style={tw`w-7 h-7 bg-blue-500 rounded-full items-center justify-center`}>
                                            <Check size={16} color="white" strokeWidth={3} />
                                        </View>
                                    ) : isActive ? (
                                        <View style={tw`w-7 h-7 ${isDarkMode ? 'bg-blue-900 border-blue-500' : 'bg-blue-100 border-blue-500'} rounded-full items-center justify-center border-2`}>
                                            <View style={tw`w-2.5 h-2.5 bg-blue-500 rounded-full`} />
                                        </View>
                                    ) : (
                                        <View style={tw`w-7 h-7 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full items-center justify-center`}>
                                            <View style={tw`w-2.5 h-2.5 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} rounded-full`} />
                                        </View>
                                    )}
                                </View>

                                {/* Content */}
                                <View style={tw`flex-1 pt-0.5`}>
                                    <Text style={tw`font-geistBold text-base ${isActive ? 'text-blue-600' : (isDarkMode ? 'text-gray-200' : 'text-gray-900')}`}>
                                        {step.title}
                                    </Text>
                                    <View style={tw`flex-row items-center mt-1`}>
                                        {step.time && (
                                            <Text style={tw`font-geist text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-1`}>{step.time} {(step.subtitle && !isActive) ? '•' : ''}</Text>
                                        )}
                                        {step.subtitle && (
                                            <Text style={tw`font-geist text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{step.subtitle}</Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        );
                    })}

                </View>
            </ScrollView>

            <View style={tw`absolute bottom-0 left-0 right-0 z-50 mx-1 mb-4`}>
                {/* Delivery Partner Card */}
                {!isCancelled && (
                    <View style={tw`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-7 rounded-2xl shadow-lg border mb-1`}>
                        <View style={tw`flex-row justify-between items-center mb-4`}>
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'} p-2 rounded-xl mr-3`}>
                                    <Clock size={20} color="#2563EB" />
                                </View>
                                <Text style={tw`font-geistBold text-lg text-blue-600`}>Arriving in 12 Mins</Text>
                            </View>
                            <View style={tw`${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} px-3 py-1 rounded-full`}>
                                <Text style={tw`font-geistBold text-xs ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>ON TIME</Text>
                            </View>
                        </View>

                        <View style={tw`flex-row items-center justify-between`}>
                            <View style={tw`flex-row items-center flex-1`}>
                                <View style={tw`${isDarkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-100 border-yellow-200'} w-12 h-12 rounded-full items-center justify-center mr-3 overflow-hidden border`}>
                                    <User size={24} color="#D97706" fill="#D97706" />
                                </View>
                                <View>
                                    <View style={tw`flex-row items-center`}>
                                        <Text style={tw`font-geistBold text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} mr-2`}>Rajesh Kumar</Text>
                                        <View style={tw`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} px-1.5 py-0.5 rounded flex-row items-center`}>
                                            <Text style={tw`text-xs font-geistBold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>★ 4.9</Text>
                                        </View>
                                    </View>
                                    <Text style={tw`font-geist text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your delivery partner</Text>
                                </View>
                            </View>

                            <View style={tw`flex-row`}>
                                <TouchableOpacity
                                    style={tw`w-10 h-10 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-full items-center justify-center mr-3`}
                                    onPress={() => Linking.openURL('tel:+91123654789')}
                                >
                                    <Phone size={20} color="#2563EB" />
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                )}

                {/* Cancel Order Button */}
                {!isCancelled && currentOrder.status !== 'Delivered' && (
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                "Cancel Order",
                                "Are you sure you want to cancel this order?",
                                [
                                    { text: "No", style: "cancel" },
                                    {
                                        text: "Yes, Cancel",
                                        style: "destructive",
                                        onPress: () => {
                                            dispatch(cancelOrder(currentOrder.id));
                                            dispatch(addNotification({
                                                title: 'Order Cancelled',
                                                message: `Your order #${currentOrder.id} has been cancelled as per your request.`,
                                                type: 'order_cancelled',
                                            }));
                                        }
                                    }
                                ]
                            );
                        }}
                        style={tw`flex-row items-center justify-center py-4 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} rounded-b-3xl backdrop-blur-sm`}
                    >
                        <XCircle size={18} color="#9ca3af" style={tw`mr-2`} />
                        <Text style={tw`font-geistBold text-gray-400 text-base`}>Cancel Order</Text>
                    </TouchableOpacity>
                )}
            </View>

        </SafeAreaView >
    );
};

export default TrackOrderScreen;
