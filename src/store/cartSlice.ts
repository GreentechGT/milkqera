import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    category?: string; // Optional, just in case
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Partial<CartItem> & { id: number; name: string; price: number; image: string; quantity?: number }>) => {
            const itemExists = state.items.find((item) => item.id === action.payload.id);
            const quantityToAdd = action.payload.quantity || 1;

            if (itemExists) {
                itemExists.quantity += quantityToAdd;
            } else {
                // Ensure all strict properties of CartItem are present when adding new
                // We assume payload has them if it's a new item, or we cast/spread cautiously
                // For now, retaining the spread which likely includes name, price, image
                state.items.push({ ...action.payload, quantity: quantityToAdd } as CartItem);
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        incrementQuantity: (state, action: PayloadAction<number>) => {
            const item = state.items.find((item) => item.id === action.payload);
            if (item) {
                item.quantity += 1;
            }
        },
        decrementQuantity: (state, action: PayloadAction<number>) => {
            const item = state.items.find((item) => item.id === action.payload);
            if (item) {
                if (item.quantity === 1) {
                    state.items = state.items.filter((i) => i.id !== action.payload);
                } else {
                    item.quantity -= 1;
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
