import 'react-native-gesture-handler';
import React, { useRef, useMemo, useCallback } from 'react';
import { Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootStackNavigator from './src/navigation/RootStackNavigator';
import { GestureHandlerRootView, } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { View, Text, Image } from 'react-native';
import tw from './src/lib/tailwind';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from './src/store/store';
import { incrementQuantity, decrementQuantity } from './src/store/cartSlice';
import { setActiveTab } from './src/store/uiSlice';
import EmptyCartModal from './src/components/EmptyCartModal';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { ToastProvider, useToast } from './src/context/ToastContext';

import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './src/navigation/types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

function AppContent() {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  // Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // variables
  const snapPoints = useMemo(() => ['60%', '90%'], []);

  // calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 2.00 : 0;
  const total = subtotal + deliveryFee;

  // callbacks
  const handleOpenCart = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCheckout = () => {
    bottomSheetRef.current?.close();
    if (cartItems.length === 0) {
      setIsModalVisible(true);
      return;
    }
    if (navigationRef.isReady()) {
      navigationRef.navigate('Checkout');
    }
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
  const arrowOffset = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    // Move arrow right and transition color
    Animated.parallel([
      Animated.spring(arrowOffset, {
        toValue: 8,
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false, // Color doesn't support native driver
      }),
    ]).start();
  };
  const handlePressOut = () => {
    // Reset positions
    Animated.parallel([
      Animated.spring(arrowOffset, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Interpolate color from Blue to a darker Indigo
  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#2563eb', '#1e40af'], // bg-blue-600 to bg-blue-800
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <RootStackNavigator openCart={handleOpenCart} />
        </NavigationContainer>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          backgroundStyle={tw`bg-white rounded-t-3xl shadow-2xl`}
          handleIndicatorStyle={tw`bg-gray-300 w-12 h-1.5`}
        >
          <BottomSheetScrollView contentContainerStyle={tw`p-5 pb-10`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`font-geistBold text-2xl text-gray-800`}>My Cart</Text>
              <Text style={tw`font-interMedium text-gray-400`}>{cartItems.length} Items</Text>
            </View>

            {/* Cart Items from Redux */}
            {cartItems.length === 0 ? (
              <View style={tw`items-center justify-center py-10`}>
                <View style={tw`bg-gray-50 p-6 rounded-full mb-6`}>
                  <ShoppingBag size={48} color="#9ca3af" />
                </View>

                <Text style={tw`font-inter text-gray-400 text-center px-10 mb-8`}>
                  Looks like you haven't added any products yet.
                </Text>

              </View>
            ) : (
              cartItems.map((item) => (
                <View key={item.id} style={tw`flex-row items-center mb-6 bg-white`}>
                  <Image
                    source={{ uri: item.image }}
                    style={tw`w-20 h-20 bg-gray-100 rounded-xl mr-4`}
                  />
                  <View style={tw`flex-1`}>
                    <Text style={tw`font-geistBold text-base text-gray-800 mb-1`}>{item.name}</Text>
                    <Text style={tw`font-inter text-gray-500 text-sm mb-2`}>{item.category || 'Product'}</Text>
                    <View style={tw`flex-row items-center justify-between`}>
                      <Text style={tw`font-geistBold text-lg text-blue-600`}>₹{(item.price * item.quantity).toFixed(2)}</Text>

                      {/* Quantity Controls */}
                      <View style={tw`flex-row items-center bg-gray-50 rounded-lg p-1`}>
                        <TouchableOpacity
                          onPress={() => dispatch(decrementQuantity(item.id))}
                          style={tw`bg-white p-1 rounded-md shadow-sm`}
                        >
                          <Minus size={16} color="#374151" />
                        </TouchableOpacity>
                        <Text style={tw`font-geistBold text-gray-800 mx-3`}>{item.quantity}</Text>
                        <TouchableOpacity
                          onPress={() => dispatch(incrementQuantity(item.id))}
                          style={tw`bg-white p-1 rounded-md shadow-sm`}
                        >
                          <Plus size={16} color="#374151" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                </View>
              ))
            )}

            <View style={tw`mt-4 pt-6 border-t border-gray-100`}>
              <View style={tw`flex-row justify-between mb-3`}>
                <Text style={tw`font-geist text-gray-500`}>Subtotal</Text>
                <Text style={tw`font-geistBold text-gray-800`}>₹{subtotal.toFixed(2)}</Text>
              </View>
              <View style={tw`flex-row justify-between mb-3`}>
                <Text style={tw`font-geist text-gray-500`}>Delivery Fee</Text>
                <Text style={tw`font-geistBold text-gray-800`}>₹{deliveryFee.toFixed(2)}</Text>
              </View>
              <View style={tw`flex-row justify-between mb-6 pt-3 border-t border-gray-100`}>
                <Text style={tw`font-geistBold text-xl text-gray-800`}>Total</Text>
                <Text style={tw`font-geistBold text-xl text-blue-600`}>₹{total.toFixed(2)}</Text>
              </View>

              <View style={tw`my-4`}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPressIn={handlePressIn}
                  onPress={handleCheckout}
                  onPressOut={handlePressOut}
                  style={tw`overflow-hidden w-full`}
                >
                  <Animated.View
                    style={[
                      tw`flex-row items-center justify-center  py-4 rounded-full shadow-md `,
                      { backgroundColor, width: '100%' }, // Responsive full width
                    ]}
                  >
                    <Text style={tw`text-white font-bold text-lg mr-2`}>
                      Proceed to Transaction
                    </Text>

                    <Animated.View style={{ transform: [{ translateX: arrowOffset }] }}>
                      <ArrowRight size={20} color="white" />
                    </Animated.View>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>

          </BottomSheetScrollView>
        </BottomSheet>

        <EmptyCartModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />

        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}


export default function App() {
  let [fontsLoaded] = useFonts({
    "Geist-Regular": require("./assets/fonts/Geist-Regular.ttf"),
    "Geist-Medium": require("./assets/fonts/Geist-Medium.ttf"),
    "Geist-Bold": require("./assets/fonts/Geist-Bold.ttf"),

    // Inter
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Light": require("./assets/fonts/Inter-Light.ttf")
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </Provider>
  );
}
