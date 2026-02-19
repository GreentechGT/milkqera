import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import tw from '../lib/tailwind';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface CategoryBadgeProps {
    name: string;
    icon: any; // Using any to support both remote URIs (string) and local requires (number)
    isSelected?: boolean;
    onPress?: () => void;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ name, icon, isSelected = false, onPress }) => {
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                tw`mr-3 flex-row items-center px-4 py-2 rounded-full border mb-1`,
                isSelected
                    ? tw`bg-blue-600 border-blue-600`
                    : tw`${isDarkMode ? 'bg-gray-800 border-slate-700' : 'bg-white border-gray-200'}`
            ]}
        >
            <Image
                source={typeof icon === 'string' ? { uri: icon } : icon}
                style={[tw`w-5 h-5 mr-2`, isSelected && { tintColor: 'white' }]}
                resizeMode="contain"
            />
            <Text style={[
                tw`font-interMedium text-sm`,
                isSelected ? tw`text-white` : tw`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`
            ]}>
                {name}
            </Text>
        </TouchableOpacity>
    );
};

export default CategoryBadge;
