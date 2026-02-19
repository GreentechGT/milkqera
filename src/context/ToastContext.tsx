import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';
import { View, Text, Animated, Dimensions, Platform } from 'react-native';
import tw from '../lib/tailwind';
import { CheckCircle, XCircle, Info } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('success');
    const [isVisible, setIsVisible] = useState(false);

    // Animation value (starts off-screen top)
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const showToast = useCallback((msg: string, t: ToastType = 'success') => {
        setMessage(msg);
        setType(t);
        setIsVisible(true);

        // Animate In
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                friction: 5,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();

        // Auto Hide after 3 seconds
        setTimeout(hideToast, 3000);
    }, []);

    const hideToast = useCallback(() => {
        // Animate Out
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            setIsVisible(false);
        });
    }, []);

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={24} color="#10b981" fill="#ecfdf5" />; // Green
            case 'error': return <XCircle size={24} color="#ef4444" fill="#fef2f2" />; // Red
            case 'info': return <Info size={24} color="#3b82f6" fill="#eff6ff" />; // Blue
            default: return <CheckCircle size={24} color="#10b981" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success': return 'border-green-100';
            case 'error': return 'border-red-100';
            case 'info': return 'border-blue-100';
            default: return 'border-gray-100';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {/* Custom Toast Component */}
            <View style={[tw`absolute top-0 left-0 right-0 z-50 items-center`, { pointerEvents: 'none' }]}>
                <SafeAreaView>
                    <Animated.View
                        style={[
                            tw`flex-row items-center bg-white px-4 py-3 rounded-full shadow-lg border mt-2 mx-5`,
                            tw`${getBorderColor()}`,
                            {
                                transform: [{ translateY }],
                                opacity,
                                minWidth: Dimensions.get('window').width * 0.8,
                            }
                        ]}
                    >
                        {getIcon()}
                        <Text style={tw`font-geistMedium text-gray-800 ml-3 text-sm flex-1`}>{message}</Text>
                    </Animated.View>
                </SafeAreaView>
            </View>
        </ToastContext.Provider>
    );
};
