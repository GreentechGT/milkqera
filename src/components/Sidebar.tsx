import React from 'react';
import { View, Text, TouchableOpacity, Image, Switch, ScrollView } from 'react-native';
import tw from '../lib/tailwind';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/userSlice';
import {
    Home,
    User,
    Calendar,
    History,
    Wallet,
    MapPin,
    Bell,
    HelpCircle,
    LogOut,
    CreditCard,
    Tag,
    Star,
    Settings,
    ChevronDown,
    ChevronUp,
    FileQuestion,
    Moon
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

const Sidebar = (props: DrawerContentComponentProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const [imageError, setImageError] = React.useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
    const { toggleDarkMode } = require('../store/uiSlice'); // Importing action
    // const [darkMode, setDarkMode] = React.useState(false); // Removing local state

    const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);
    const handleToggleDarkMode = () => dispatch(toggleDarkMode());

    const handleNavigation = (screen: string, params?: any) => {
        //props.navigation.closeDrawer();
        navigation.navigate(screen as any, params);
    };

    const handleLogout = () => {
        props.navigation.closeDrawer();
        dispatch(logout());
        // Ideally navigate to login screen if one exists, or just reset state
    };

    return (
        <View style={tw`flex-1 ${isDarkMode ? 'bg-primary' : 'bg-white'}`}>
            <SafeAreaView style={tw`flex-1`} edges={['top', 'bottom', 'left']}>
                {/* Header Profile Section */}
                <View style={tw`pt-6 px-6 pb-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-50'}`}>
                    <View style={tw`w-20 h-20 self-center rounded-full overflow-hidden border-2 border-white shadow-md mb-4 items-center justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-orange-100'}`}>
                        {user.image && !imageError ? (
                            <Image
                                source={{ uri: user.image }}
                                style={tw`w-full h-full`}
                                resizeMode="cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <Text style={tw`text-3xl font-bold text-orange-500`}>
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        )}
                    </View>

                    <View style={tw`flex-col gap-1 items-center justify-center`}>
                        <Text style={tw`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {user.name || 'Guest User'}
                        </Text>

                    </View>
                </View>

                {/* Navigation Links */}
                <ScrollView style={tw`flex-1 px-3`} contentContainerStyle={tw`pb-4`} showsVerticalScrollIndicator={false}>


                    <TouchableOpacity
                        onPress={() => handleNavigation('Profile')}
                        style={tw`flex-row items-center gap-4 px-4 py-3 rounded-2xl mb-1`}
                    >
                        <User size={24} color={isDarkMode ? "#94a3b8" : "#475569"} />
                        <Text style={tw`font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>My Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleNavigation('SubscriptionPlans')}
                        style={tw`flex-row items-center gap-4 px-4 py-3 rounded-2xl mb-1`}
                    >
                        <CreditCard size={24} color={isDarkMode ? "#94a3b8" : "#475569"} />
                        <Text style={tw`font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subscription Plans</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleNavigation('Profile', { openSheet: 'address' })}
                        style={tw`flex-row items-center gap-4 px-4 py-3 rounded-2xl mb-1`}
                    >
                        <Calendar size={24} color={isDarkMode ? "#94a3b8" : "#475569"} />
                        <Text style={tw`font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily Milk Schedule</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleNavigation('Profile', { openSheet: 'payment' })}
                        style={tw`flex-row items-center gap-4 px-4 py-3 rounded-2xl mb-1`}
                    >
                        <Wallet size={24} color={isDarkMode ? "#94a3b8" : "#475569"} />
                        <Text style={tw`font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Payments</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleNavigation('Profile', { openSheet: 'address' })}
                        style={tw`flex-row items-center gap-4 px-4 py-3 rounded-2xl mb-1`}
                    >
                        <Tag size={24} color={isDarkMode ? "#94a3b8" : "#475569"} />
                        <Text style={tw`font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Offers & Coupons</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleNavigation('Profile', { openSheet: 'address' })}
                        style={tw`flex-row items-center gap-4 px-4 py-3 rounded-2xl mb-1`}
                    >
                        <MapPin size={24} color={isDarkMode ? "#94a3b8" : "#475569"} />
                        <Text style={tw`font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage Address</Text>
                    </TouchableOpacity>

                    <View style={tw`flex-row items-center justify-between px-4 py-3 rounded-2xl mb-1`}>
                        <View style={tw`flex-row items-center gap-4`}>
                            <Bell size={24} color={isDarkMode ? "#94a3b8" : "#475569"} />
                            <Text style={tw`font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Notifications</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#2563eb" }}
                            thumbColor={notificationsEnabled ? "#ffffff" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleNotifications}
                            value={notificationsEnabled}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => handleNavigation('Profile', { openSheet: 'address' })}
                        style={tw`flex-row items-center gap-4 px-4 py-3 rounded-2xl mb-1`}
                    >
                        <Star size={24} color={isDarkMode ? "#94a3b8" : "#475569"} />
                        <Text style={tw`font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rate Us</Text>
                    </TouchableOpacity>

                    <View>
                        <TouchableOpacity
                            onPress={() => setIsSettingsOpen(!isSettingsOpen)}
                            style={tw`flex-row items-center justify-between px-4 py-3 rounded-2xl mb-1`}
                        >
                            <View style={tw`flex-row items-center gap-4`}>
                                <Settings size={24} color={isDarkMode ? "#94a3b8" : "#475569"} />
                                <Text style={tw`font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Settings</Text>
                            </View>
                            {isSettingsOpen ? (
                                <ChevronUp size={20} color="#6b7280" />
                            ) : (
                                <ChevronDown size={20} color="#6b7280" />
                            )}
                        </TouchableOpacity>

                        {isSettingsOpen && (
                            <View style={tw`pl-4`}>
                                <TouchableOpacity
                                    // onPress={() => handleNavigation('FAQs')}
                                    style={tw`flex-row items-center gap-4 px-4 py-3 rounded-2xl mb-1`}
                                >
                                    <FileQuestion size={22} color={isDarkMode ? "#94a3b8" : "#475569"} />
                                    <Text style={tw`font-medium text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>FAQs</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleNavigation('HelpSupport')}
                                    style={tw`flex-row items-center gap-4 px-4 py-3 rounded-2xl mb-1`}
                                >
                                    <HelpCircle size={22} color={isDarkMode ? "#94a3b8" : "#475569"} />
                                    <Text style={tw`font-medium text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Help & Support</Text>
                                </TouchableOpacity>

                                <View style={tw`flex-row items-center justify-between px-4 py-3 rounded-2xl mb-1`}>
                                    <View style={tw`flex-row items-center gap-4`}>
                                        <Moon size={22} color={isDarkMode ? "#94a3b8" : "#475569"} />
                                        <Text style={tw`font-medium text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dark Mode</Text>
                                    </View>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#2563eb" }}
                                        thumbColor={isDarkMode ? "#ffffff" : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={handleToggleDarkMode}
                                        value={isDarkMode}
                                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={handleLogout}
                                    style={tw`flex-row items-center gap-4 px-4 py-3 rounded-2xl mb-1`}
                                >
                                    <LogOut size={22} color="#ef4444" />
                                    <Text style={tw`font-medium text-sm text-red-500`}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>




                </ScrollView>


            </SafeAreaView>
        </View>
    );
};

export default Sidebar;
