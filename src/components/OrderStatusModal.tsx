import { View, Text, Modal, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import tw from '../lib/tailwind';
import { X, CheckCircle2, Circle, Truck, Package, MapPin, Trash2, XCircle } from 'lucide-react-native';

import { useDispatch } from 'react-redux';
import { cancelOrder } from '../store/userSlice';
import { addNotification } from '../store/notificationSlice';

interface OrderStatusModalProps {
    visible: boolean;
    onClose: () => void;
    order: any;
}

const OrderStatusModal = ({ visible, onClose, order }: OrderStatusModalProps) => {
    const dispatch = useDispatch();

    if (!order) return null;

    const isCancelled = order.status === 'Cancelled';

    // If cancelled, we might want to override the steps or just show a cancelled state.
    // Let's modify the steps dynamically if cancelled.

    const steps = [
        { title: 'Order Confirmed', date: order.date, completed: true, icon: CheckCircle2 },
        { title: 'Product Prepared', date: 'In Progress', completed: false, icon: Package },
        { title: 'Shipped', date: 'Pending', completed: false, icon: Truck },
        { title: 'Out for Delivery', date: 'Pending', completed: false, icon: MapPin },
        { title: 'Delivered', date: order.estimatedArrival, completed: false, icon: CheckCircle2 },
    ];



    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={[tw`flex-1 justify-end`, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <View style={tw`bg-white rounded-t-3xl h-[85%]`}>
                    {/* Header */}
                    <View style={tw`flex-row items-center justify-between p-4 border-b border-gray-100`}>
                        <View style={tw`flex-1`}>
                            <Text style={tw`font-geistBold text-xl text-gray-800`}>Track Order #{order.id}</Text>
                            {isCancelled && <Text style={tw`font-geistBold text-red-600 text-sm`}>This order is Cancelled</Text>}
                        </View>
                        <TouchableOpacity onPress={onClose} style={tw`p-2 bg-gray-100 rounded-full ml-4`}>
                            <X size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={tw`p-4 pb-10`}>
                        {/* Order Summary */}
                        <View style={tw`mb-6`}>
                            <Text style={tw`font-geistBold text-gray-800 mb-2`}>Items</Text>
                            {order.items.map((item: any, index: number) => (
                                <View key={index} style={tw`flex-row items-center mb-3 bg-gray-50 p-2 rounded-xl`}>
                                    <Image
                                        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                                        style={tw`w-12 h-12 rounded-lg bg-gray-200 mr-3`}
                                    />
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`font-geistMedium text-gray-800`}>{item.name}</Text>
                                        <Text style={tw`font-geist text-gray-500 text-xs`}>{item.quantity} x ₹{item.price}</Text>
                                    </View>
                                    <Text style={tw`font-geistBold text-gray-800`}>₹{(item.quantity * item.price).toFixed(2)}</Text>
                                </View>
                            ))}
                            <View style={tw`flex-row justify-between mt-2 pt-2 border-t border-gray-100`}>
                                <Text style={tw`font-geistBold text-gray-800`}>Total Amount</Text>
                                <Text style={tw`font-geistBold text-blue-600 text-lg`}>₹{order.total.toFixed(2)}</Text>
                            </View>
                        </View>

                        {/* Stepper */}
                        <View style={tw`bg-white p-4 rounded-2xl border border-gray-100`}>
                            {steps.map((step, index) => {

                                const isStepCompleted = isCancelled && index > 0 ? false : step.completed;

                                return (
                                    <View key={index} style={tw`flex-row mb-8 relative z-10 last:mb-0`}>
                                        {/* Line connector */}
                                        {index !== steps.length - 1 && (
                                            <View style={tw`absolute left-[15px] top-8 bottom-[-32px] w-[2px] ${isStepCompleted ? 'bg-blue-600' : 'bg-gray-200'} z-0`} />
                                        )}

                                        <View style={tw`items-center mr-4 z-10`}>
                                            <View style={tw`w-8 h-8 rounded-full items-center justify-center ${isStepCompleted ? 'bg-blue-600' : (isCancelled && index > 0 ? 'bg-red-50 border border-red-200' : 'bg-gray-100 border border-gray-300')}`}>
                                                {isStepCompleted ? (
                                                    <CheckCircle2 size={16} color="white" />
                                                ) : isCancelled && index > 0 ? (
                                                    <X size={16} color="#ef4444" />
                                                ) : (
                                                    <Circle size={12} color="#9ca3af" />
                                                )}
                                            </View>
                                        </View>

                                        <View style={tw`flex-1`}>
                                            <Text style={tw`font-geistBold text-base ${isStepCompleted ? 'text-gray-800' : (isCancelled ? 'text-gray-400' : 'text-gray-400')}`}>
                                                {step.title}
                                            </Text>
                                            <Text style={tw`font-geist text-sm text-gray-500 mt-1`}>
                                                {isCancelled && index > 0 ? 'Cancelled' : step.date}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                        {/* Cancel Order Button */}
                        {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
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
                                                    dispatch(cancelOrder(order.id));
                                                    dispatch(addNotification({
                                                        title: 'Order Cancelled',
                                                        message: `Your order #${order.id} has been cancelled as per your request.`,
                                                        type: 'order_cancelled',
                                                    }));
                                                }
                                            }
                                        ]
                                    );
                                }}
                                style={tw`bg-red-50 border border-red-200 p-4 rounded-xl flex-row items-center justify-center mt-6 shadow-sm active:bg-red-100`}
                            >
                                <Trash2 size={20} color="#dc2626" style={tw`mr-2`} />
                                <Text style={tw`font-geistBold text-red-600 text-lg`}>Cancel Order</Text>
                            </TouchableOpacity>
                        )}

                        {order.status === 'Cancelled' && (
                            <View style={tw`bg-gray-100 p-6 rounded-xl items-center mt-6 border border-gray-200`}>
                                <XCircle size={32} color="#9ca3af" style={tw`mb-2`} />
                                <Text style={tw`font-geistBold text-gray-500 text-lg`}>Order Cancelled</Text>
                                <Text style={tw`font-geist text-gray-400 text-center mt-1`}>
                                    You requested to cancel this order.
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default OrderStatusModal;
