import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category?: string;
}

interface WishlistState {
    items: WishlistItem[];
}

const initialState: WishlistState = {
    items: [],
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
            const itemExists = state.items.find((item) => item.id === action.payload.id);
            if (!itemExists) {
                state.items.push(action.payload);
            }
        },
        removeFromWishlist: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
    },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
