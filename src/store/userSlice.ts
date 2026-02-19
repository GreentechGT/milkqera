import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Address {
    id: string;
    type: string;
    street: string;
    city: string;
    zipCode: string;
    isDefault?: boolean;
}

export interface PaymentMethod {
    id: string;
    type: 'Visa' | 'Mastercard' | 'Amex';
    last4: string;
    expiry: string; // MM/YY
    holderName: string;
    isDefault: boolean;
}

interface Order {
    id: string;
    items: any[];
    total: number;
    date: string;
    status: 'Confirmed' | 'Prepared' | 'Shipped' | 'OutForDelivery' | 'Delivered' | 'Cancelled';
    estimatedArrival: string;
}

interface UserState {
    name: string;
    email: string;
    phone: string;
    image: string;
    addresses: Address[];
    paymentMethods: PaymentMethod[];
    orders: Order[];
}

const initialState: UserState = {
    name: 'Arkan Shaikh',
    email: 'arkan@example.com',
    phone: '+1 234 567 8900',
    image: 'https://via.placeholder.com/150',
    addresses: [
        { id: '1', type: 'Home', street: '123 Main St', city: 'Nashik', zipCode: '422001', isDefault: true },
    ],
    paymentMethods: [
        { id: '1', type: 'Visa', last4: '4242', expiry: '12/24', holderName: 'Arkan Shaikh', isDefault: true },
    ],
    orders: [],
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload };
        },
        addAddress: (state, action: PayloadAction<Address>) => {
            if (state.addresses.length === 0) {
                action.payload.isDefault = true;
            }
            state.addresses.push(action.payload);
        },
        removeAddress: (state, action: PayloadAction<string>) => {
            state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
        },
        setDefaultAddress: (state, action: PayloadAction<string>) => {
            state.addresses.forEach(addr => {
                addr.isDefault = addr.id === action.payload;
            });
        },
        addPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
            // If new method is default, remove default from others
            if (action.payload.isDefault) {
                state.paymentMethods.forEach(pm => pm.isDefault = false);
            }
            state.paymentMethods.push(action.payload);
        },
        setDefaultPaymentMethod: (state, action: PayloadAction<string>) => {
            state.paymentMethods.forEach(pm => {
                pm.isDefault = pm.id === action.payload;
            });
        },
        removePaymentMethod: (state, action: PayloadAction<string>) => {
            state.paymentMethods = state.paymentMethods.filter(pm => pm.id !== action.payload);
        },
        placeOrder: (state, action: PayloadAction<Order>) => {
            state.orders.unshift(action.payload); // Add new order to the beginning
        },
        cancelOrder: (state, action: PayloadAction<string>) => {
            const order = state.orders.find(o => o.id === action.payload);
            if (order) {
                order.status = 'Cancelled' as any;
            }
        },
        logout: (state) => {
            return initialState;
        }
    },
});

export const {
    updateUser,
    addAddress,
    removeAddress,
    setDefaultAddress,
    addPaymentMethod,
    setDefaultPaymentMethod,
    removePaymentMethod,
    placeOrder,
    cancelOrder,
    logout
} = userSlice.actions;

export default userSlice.reducer;
