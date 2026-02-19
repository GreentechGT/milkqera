
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Switch, TextInput, FlatList } from 'react-native';
import tw from '../lib/tailwind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { User, LogOut, Briefcase, Settings, ChevronRight, CreditCard, Bell, MapPin, Heart, Plus, Check, Trash2, Camera, X, Package, Clock, HelpCircle, Shield, Info } from 'lucide-react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { updateUser, addAddress, removeAddress, setDefaultAddress, setDefaultPaymentMethod, removePaymentMethod, Address } from '../store/userSlice';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as ImagePicker from 'expo-image-picker';

interface ProfileOptionProps {
    icon: any;
    title: string;
    subtitle?: string;
    isRed?: boolean;
    hasSwitch?: boolean;
    onPress?: () => void;
}

const ProfileOption = ({ icon: Icon, title, subtitle, isRed = false, hasSwitch = false, onPress }: ProfileOptionProps) => {
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

    return (
        <TouchableOpacity
            style={tw`flex-row items-center p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} mb-2 rounded-2xl border shadow-sm`}
            disabled={hasSwitch}
            onPress={onPress}
        >
            <View style={tw`p-3 rounded-full ${isRed ? (isDarkMode ? 'bg-red-900/30' : 'bg-red-50') : (isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50')} mr-4`}>
                <Icon size={22} color={isRed ? '#ef4444' : '#2563eb'} />
            </View>
            <View style={tw`flex-1`}>
                <Text style={tw`font-interBold text-base ${isRed ? 'text-red-500' : (isDarkMode ? 'text-white' : 'text-gray-800')}`}>{title}</Text>
                {subtitle && <Text style={tw`font-inter text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>{subtitle}</Text>}
            </View>
            {hasSwitch ? (
                <Switch
                    trackColor={{ false: "#767577", true: "#bfdbfe" }}
                    thumbColor={true ? "#2563eb" : "#f4f3f4"}
                />
            ) : (
                <ChevronRight size={20} color={isDarkMode ? "#9ca3af" : "#9ca3af"} />
            )}
        </TouchableOpacity>
    );
};

const ProfileScreen = () => {
    const user = useSelector((state: RootState) => state.user);
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Profile'>>();

    // Refs
    const editProfileSheetRef = useRef<BottomSheet>(null);
    const addressSheetRef = useRef<BottomSheet>(null);
    const paymentSheetRef = useRef<BottomSheet>(null);

    useEffect(() => {
        if (route.params?.openSheet) {
            const sheet = route.params.openSheet;
            // Small timeout to ensure sheet is ready/mounted
            setTimeout(() => {
                if (sheet === 'edit-profile') {
                    editProfileSheetRef.current?.expand();
                } else if (sheet === 'address') {
                    addressSheetRef.current?.expand();
                } else if (sheet === 'payment') {
                    paymentSheetRef.current?.expand();
                }
            }, 500);
        }
    }, [route.params]);

    // Snap Points
    const snapPoints = useMemo(() => ['50%', '85%'], []);

    // Local State for Edit Profile
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    // Local State for New Address
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddressStreet, setNewAddressStreet] = useState('');
    const [newAddressCity, setNewAddressCity] = useState('');
    const [newAddressZip, setNewAddressZip] = useState('');
    const [newAddressType, setNewAddressType] = useState<string>('Home');
    const [customAddressType, setCustomAddressType] = useState('');
    const [addressError, setAddressError] = useState('');

    // Handlers
    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            dispatch(updateUser({ image: result.assets[0].uri }));
        }
    };

    const handleSaveProfile = () => {
        let isValid = true;

        if (!/^[a-zA-Z\s]+$/.test(name)) {
            setNameError('Name must contain only alphabets');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!email.includes('@')) {
            setEmailError('Invalid email address');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!/^\d{10}$/.test(phone)) {
            setPhoneError('Phone number must be 10 digits');
            isValid = false;
        } else {
            setPhoneError('');
        }

        if (isValid) {
            dispatch(updateUser({ name, email, phone }));
            editProfileSheetRef.current?.close();
        }
    };

    const handleSaveAddress = () => {
        let isValid = true;
        let errorMessage = '';

        if (!newAddressStreet || !newAddressCity || !newAddressZip) {
            errorMessage = 'Please fill in all fields';
            isValid = false;
        }

        if (isValid && !/^\d+$/.test(newAddressZip)) {
            errorMessage = 'Zip code must contain only numbers';
            isValid = false;
        }

        if (isValid && newAddressType === 'Other' && !customAddressType.trim()) {
            errorMessage = 'Please specify address type';
            isValid = false;
        }

        if (isValid) {
            const finalType = newAddressType === 'Other' ? customAddressType : newAddressType;
            const newAddr: Address = {
                id: Date.now().toString(),
                type: finalType,
                street: newAddressStreet,
                city: newAddressCity,
                zipCode: newAddressZip
            };
            dispatch(addAddress(newAddr));
            setIsAddingAddress(false);
            setNewAddressStreet('');
            setNewAddressCity('');
            setNewAddressZip('');
            setCustomAddressType('');
            setAddressError('');
        } else {
            setAddressError(errorMessage);
        }
    };

    const renderBackdrop = (props: any) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    );

    return (
        <SafeAreaView style={tw`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <ScrollView contentContainerStyle={tw`pb-10`}>
                {/* Header */}
                <View style={tw`items-center py-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} mb-4 rounded-b-3xl shadow-sm`}>
                    <View style={tw`relative`}>
                        {user.image && user.image !== 'https://via.placeholder.com/150' ? (
                            <Image
                                source={{ uri: user.image }}
                                style={tw`w-28 h-28 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-blue-50'} rounded-full mb-4 border-4`}
                            />
                        ) : (
                            <View style={tw`w-28 h-28 ${isDarkMode ? 'bg-blue-900 border-gray-700' : 'bg-blue-100 border-blue-50'} rounded-full mb-4 border-4 items-center justify-center`}>
                                <Text style={tw`font-geistBold text-blue-600 text-5xl`}>
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity
                            onPress={() => editProfileSheetRef.current?.expand()}
                            style={tw`absolute bottom-4 right-0 bg-blue-600 p-2 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}
                        >
                            <Settings size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={tw`font-geistBold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</Text>
                    <Text style={tw`font-geistMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.phone}</Text>

                    <View style={tw`flex-row mt-4`}>
                        <View style={tw`items-center px-6 border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                            <Text style={tw`font-geistBold text-lg text-blue-600`}>{user.orders.length}</Text>
                            <Text style={tw`font-interBold text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} uppercase`}>Orders</Text>
                        </View>
                        <View style={tw`items-center px-6`}>
                            <Text style={tw`font-geistBold text-lg text-blue-600`}>₹{user.orders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}</Text>
                            <Text style={tw`font-interBold text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} uppercase`}>Spent</Text>
                        </View>
                    </View>
                </View>

                <View style={tw`px-4`}>
                    <Text style={tw`font-geistBold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 ml-2`}>Account</Text>
                    <ProfileOption
                        icon={User}
                        title="Edit Profile"
                        subtitle="Name, Email, Phone"
                        onPress={() => {
                            setName(user.name);
                            setEmail(user.email);
                            setPhone(user.phone);
                            editProfileSheetRef.current?.expand();
                        }}
                    />
                    <ProfileOption
                        icon={MapPin}
                        title="Saved Addresses"
                        subtitle="Home, Office"
                        onPress={() => addressSheetRef.current?.expand()}
                    />



                    <Text style={tw`font-geistBold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 ml-2 mt-4`}>General</Text>
                    <ProfileOption icon={Briefcase} title="Become a Partner" subtitle="Sell on MilkQera" />
                    <ProfileOption icon={Info} title="About Us" subtitle="Know more about MilkQera" />
                    <ProfileOption icon={LogOut} title="Logout" isRed={true} />
                </View>
            </ScrollView>

            {/* Edit Profile Bottom Sheet */}
            <BottomSheet
                ref={editProfileSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backdropComponent={renderBackdrop}
                backgroundStyle={tw`${isDarkMode ? 'bg-gray-900 icon-white' : 'bg-white'} rounded-t-3xl`}
                handleIndicatorStyle={tw`${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
            >
                <BottomSheetScrollView contentContainerStyle={tw`p-5 pb-10`}>
                    <Text style={tw`font-geistBold text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 text-center`}>Edit Profile</Text>

                    <TouchableOpacity onPress={handlePickImage} style={tw`self-center mb-6`}>
                        <View style={tw`relative`}>
                            {user.image && user.image !== 'https://via.placeholder.com/150' ? (
                                <Image source={{ uri: user.image }} style={tw`w-24 h-24 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                            ) : (
                                <View style={tw`w-24 h-24 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} items-center justify-center`}>
                                    <Text style={tw`font-geistBold text-blue-600 text-4xl`}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </Text>
                                </View>
                            )}
                            <View style={tw`absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}>
                                <Camera size={16} color="white" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <Text style={tw`mb-2 font-geistMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Full Name</Text>
                    <BottomSheetTextInput
                        style={tw`border ${nameError ? 'border-red-500' : (isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-gray-50 text-gray-800')} rounded-xl p-4 mb-1 font-geist`}
                        value={name}
                        onChangeText={(text) => { setName(text); setNameError(''); }}
                        placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                    />
                    {nameError ? <Text style={tw`text-red-500 text-xs mb-3 ml-1`}>{nameError}</Text> : <View style={tw`mb-4`} />}

                    <Text style={tw`mb-2 font-geistMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Email Address</Text>
                    <BottomSheetTextInput
                        style={tw`border ${emailError ? 'border-red-500' : (isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-gray-50 text-gray-800')} rounded-xl p-4 mb-1 font-geist`}
                        value={email}
                        onChangeText={(text) => { setEmail(text); setEmailError(''); }}
                        keyboardType="email-address"
                        placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                    />
                    {emailError ? <Text style={tw`text-red-500 text-xs mb-3 ml-1`}>{emailError}</Text> : <View style={tw`mb-4`} />}

                    <Text style={tw`mb-2 font-geistMedium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Phone Number</Text>
                    <View style={tw`flex-row items-center border ${phoneError ? 'border-red-500' : (isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50')} rounded-xl mb-1`}>
                        <View style={tw`pl-4 pr-2 border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                            <Text style={tw`font-geist ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>+91</Text>
                        </View>
                        <BottomSheetTextInput
                            style={tw`flex-1 p-4 font-geist ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                            value={phone}
                            onChangeText={(text) => { setPhone(text.replace(/[^0-9]/g, '')); setPhoneError(''); }}
                            keyboardType="phone-pad"
                            maxLength={10}
                            placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                        />
                    </View>
                    {phoneError ? <Text style={tw`text-red-500 text-xs mb-8 ml-1`}>{phoneError}</Text> : <View style={tw`mb-8`} />}

                    <TouchableOpacity onPress={handleSaveProfile} style={tw`bg-blue-600 p-4 rounded-xl items-center`}>
                        <Text style={tw`text-white font-geistBold text-lg`}>Save Changes</Text>
                    </TouchableOpacity>
                </BottomSheetScrollView>
            </BottomSheet>

            {/* Addresses Bottom Sheet */}
            <BottomSheet
                ref={addressSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backdropComponent={renderBackdrop}
                backgroundStyle={tw`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl`}
                handleIndicatorStyle={tw`${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
            >
                <BottomSheetScrollView contentContainerStyle={tw`p-5 pb-10`}>
                    <View style={tw`flex-row justify-between items-center mb-6`}>
                        <Text style={tw`font-geistBold text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Saved Addresses</Text>
                        <TouchableOpacity onPress={() => setIsAddingAddress(!isAddingAddress)}>
                            {isAddingAddress ? <X size={24} color={isDarkMode ? "#9ca3af" : "gray"} /> : <Plus size={24} color="#2563eb" />}
                        </TouchableOpacity>
                    </View>

                    {isAddingAddress ? (
                        <View style={tw`mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-xl`}>
                            <Text style={tw`font-geistBold text-base mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Add New Address</Text>
                            <BottomSheetTextInput
                                placeholder="Street Address"
                                placeholderTextColor={isDarkMode ? '#9ca3af' : 'grey'}
                                style={tw`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'} p-3 rounded-lg border mb-3`}
                                value={newAddressStreet}
                                onChangeText={setNewAddressStreet}
                            />
                            <View style={tw`flex-row justify-between mb-3`}>
                                <BottomSheetTextInput
                                    placeholder="City"
                                    placeholderTextColor={isDarkMode ? '#9ca3af' : 'grey'}
                                    style={tw`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'} p-3 rounded-lg border w-[48%]`}
                                    value={newAddressCity}
                                    onChangeText={setNewAddressCity}
                                />
                                <BottomSheetTextInput
                                    placeholder="Zip Code"
                                    placeholderTextColor={isDarkMode ? '#9ca3af' : 'grey'}
                                    style={tw`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'} p-3 rounded-lg border w-[48%]`}
                                    value={newAddressZip}
                                    onChangeText={(text) => { setNewAddressZip(text.replace(/[^0-9]/g, '')); setAddressError(''); }}
                                    keyboardType="numeric"
                                    maxLength={6}
                                />
                            </View>
                            <View style={tw`flex-row justify-between mb-4`}>
                                {['Home', 'Office', 'Other'].map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => setNewAddressType(type as any)}
                                        style={tw`px-4 py-2 rounded-full border ${newAddressType === type
                                                ? 'bg-blue-600 border-blue-600'
                                                : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200')
                                            }`}
                                    >
                                        <Text style={tw`${newAddressType === type ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')}`}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {newAddressType === 'Other' && (
                                <BottomSheetTextInput
                                    placeholder="e.g. Grandma's House"
                                    placeholderTextColor={isDarkMode ? '#9ca3af' : 'grey'}
                                    style={tw`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'} p-3 rounded-lg border mb-3`}
                                    value={customAddressType}
                                    onChangeText={setCustomAddressType}
                                />
                            )}

                            {addressError ? <Text style={tw`text-red-500 text-xs mb-3 text-center`}>{addressError}</Text> : null}

                            <TouchableOpacity onPress={handleSaveAddress} style={tw`bg-blue-600 p-3 rounded-lg items-center`}>
                                <Text style={tw`text-white font-geistBold`}>Save Address</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {user.addresses.map((addr) => (
                        <TouchableOpacity
                            key={addr.id}
                            onPress={() => dispatch(setDefaultAddress(addr.id))}
                            style={tw`flex-row items-center justify-between p-4 border ${addr.isDefault
                                    ? (isDarkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50')
                                    : (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100')
                                } rounded-xl mb-3 shadow-sm`}
                        >
                            <View style={tw`flex-row items-center flex-1`}>
                                <View style={tw`${addr.isDefault ? (isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100') : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')} p-2 rounded-full mr-3`}>
                                    <MapPin size={20} color={addr.isDefault ? '#2563eb' : '#6b7280'} />
                                </View>
                                <View>
                                    <Text style={tw`font-geistBold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{addr.type}</Text>
                                    <Text style={tw`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{addr.street}, {addr.city} {addr.zipCode}</Text>
                                </View>
                            </View>
                            {addr.isDefault && (
                                <View style={tw`bg-blue-600 p-1 rounded-full mr-2`}>
                                    <Check size={12} color="white" />
                                </View>
                            )}
                            <TouchableOpacity onPress={() => dispatch(removeAddress(addr.id))} style={tw`p-2`}>
                                <Trash2 size={18} color="#ef4444" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </BottomSheetScrollView>
            </BottomSheet>

            {/* Payment Methods Bottom Sheet */}
            <BottomSheet
                ref={paymentSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backdropComponent={renderBackdrop}
                backgroundStyle={tw`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl`}
                handleIndicatorStyle={tw`${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
            >
                <BottomSheetScrollView contentContainerStyle={tw`p-5 pb-10`}>
                    <View style={tw`flex-row justify-between items-center mb-6`}>
                        <Text style={tw`font-geistBold text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Payment Methods</Text>
                        <TouchableOpacity onPress={() => {
                            paymentSheetRef.current?.close();
                            navigation.navigate('AddPaymentMethod');
                        }}>
                            <Plus size={24} color="#2563eb" />
                        </TouchableOpacity>
                    </View>

                    {user.paymentMethods.map((pm) => (
                        <TouchableOpacity
                            key={pm.id}
                            onPress={() => dispatch(setDefaultPaymentMethod(pm.id))}
                            style={tw`flex-row items-center justify-between p-4 border ${pm.isDefault
                                    ? (isDarkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50')
                                    : (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100')
                                } rounded-xl mb-3 shadow-sm`}
                        >
                            <View style={tw`flex-row items-center flex-1`}>
                                <View style={tw`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded-lg mr-3`}>
                                    <CreditCard size={24} color={isDarkMode ? "#9ca3af" : "#374151"} />
                                </View>
                                <View>
                                    <Text style={tw`font-geistBold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{pm.type} •••• {pm.last4}</Text>
                                    <Text style={tw`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Expires {pm.expiry}</Text>
                                </View>
                            </View>
                            {pm.isDefault && (
                                <View style={tw`bg-blue-600 p-1 rounded-full mr-2`}>
                                    <Check size={12} color="white" />
                                </View>
                            )}
                            <TouchableOpacity onPress={() => dispatch(removePaymentMethod(pm.id))} style={tw`p-2`}>
                                <Trash2 size={18} color="#ef4444" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </BottomSheetScrollView>
            </BottomSheet>
        </SafeAreaView>
    );
};

export default ProfileScreen;
