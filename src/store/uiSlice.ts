import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    activeCategory: string;
    activeTab: string;
    isSidebarOpen: boolean;
    isDarkMode: boolean;
}

const initialState: UiState = {
    activeCategory: 'Milk',
    activeTab: 'Home',
    isSidebarOpen: false,
    isDarkMode: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setActiveCategory: (state, action: PayloadAction<string>) => {
            state.activeCategory = action.payload;
        },
        setActiveTab: (state, action: PayloadAction<string>) => {
            state.activeTab = action.payload;
        },
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode;
        },
    },
});

export const { setActiveCategory, setActiveTab, toggleSidebar, toggleDarkMode } = uiSlice.actions;

export default uiSlice.reducer;
