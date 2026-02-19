import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
    type: 'order_placed' | 'order_cancelled' | 'promotional' | 'info';
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
}

const initialState: NotificationState = {
    notifications: [
        {
            id: '1',
            title: 'Welcome!',
            message: 'Welcome to MilkQera! Get started by adding products to your cart.',
            date: new Date().toISOString(),
            read: false,
            type: 'info'
        },
        {
            id: '2',
            title: 'Special Offer',
            message: 'Get 20% off on your first order with code WELCOME20',
            date: new Date().toISOString(),
            read: false,
            type: 'promotional'
        }
    ],
    unreadCount: 2,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'date' | 'read'>>) => {
            const newNotification: Notification = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                read: false,
                ...action.payload,
            };
            state.notifications.unshift(newNotification);
            state.unreadCount += 1;
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(notification => {
                notification.read = true;
            });
            state.unreadCount = 0;
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.read) {
                notification.read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
    },
});

export const { addNotification, markAllAsRead, markAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
