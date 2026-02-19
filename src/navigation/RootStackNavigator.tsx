import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import AllCategoriesScreen from '../screens/AllCategoriesScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AddPaymentMethodScreen from '../screens/AddPaymentMethodScreen';
import TrackOrderScreen from '../screens/TrackOrderScreen';
import OrdersHistoryScreen from '../screens/OrdersHistoryScreen';
import OfferScreen from '../screens/OfferScreen';
import NotificationPage from '../screens/NotificationPage';
import ProfileScreen from '../screens/ProfileScreen';
import SubscriptionPlansScreen from '../screens/SubscriptionPlansScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = ({ openCart }: { openCart: () => void }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs">
                {(props) => <DrawerNavigator {...props} openCart={openCart} />}
            </Stack.Screen>
            <Stack.Screen name="AllCategories" component={AllCategoriesScreen} />
            <Stack.Screen name="Details" component={ProductDetailsScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} options={{ headerShown: true, title: 'Add Payment Method' }} />
            <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
            <Stack.Screen name="OrdersHistory" component={OrdersHistoryScreen} />
            <Stack.Screen name="OfferScreen" component={OfferScreen} />
            <Stack.Screen name="NotificationPage" component={NotificationPage} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlansScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        </Stack.Navigator>
    );
};

export default RootStackNavigator;
