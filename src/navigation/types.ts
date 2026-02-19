export type BottomTabParamList = {
    Home: undefined;
    Orders: undefined;
    Search: undefined;
    Wishlist: undefined;
    Cart: undefined;
    Profile: undefined;
};

export type RootStackParamList = {
    Tabs: undefined;
    AllCategories: { initialCategory?: string } | undefined;
    Details: { product: any };
    Checkout: undefined;
    AddPaymentMethod: undefined;
    TrackOrder: { orderId?: string } | undefined;
    OrdersHistory: undefined;
    OfferScreen: { bannerId: number; title: string; color: string; subtitle: string; image: string; productIds: number[] };
    NotificationPage: undefined;
    Profile: { openSheet?: 'edit-profile' | 'address' | 'payment' } | undefined;
    SubscriptionPlans: undefined;
    HelpSupport: undefined;
};
