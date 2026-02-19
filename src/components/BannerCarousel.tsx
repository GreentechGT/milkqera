import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions, ViewToken } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import tw from '../lib/tailwind';
import { BANNERS } from '../data/mockData';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const { width } = Dimensions.get('window');

const BannerCarousel = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [activeIndex, setActiveIndex] = useState(0);
    const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

    return (
        <View style={tw`mb-2`}>
            <FlatList
                data={BANNERS}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
                snapToInterval={width - 32} // Card width (width - 48) + gap (16)
                snapToAlignment="start"
                decelerationRate="fast"
                keyExtractor={(item) => item.id.toString()}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('OfferScreen', {
                            bannerId: item.id,
                            title: item.title,
                            subtitle: item.subtitle,
                            color: item.color,
                            image: item.image,
                            productIds: item.productIds
                        })}
                    >
                        <View
                            style={[
                                tw`relative h-48 ${item.color} rounded-3xl overflow-hidden shadow-lg`,
                                { width: width - 48 }
                            ]}
                        >
                            {/* Visual background gradient simulation using a nested absolute view */}
                            <View style={tw`absolute inset-0 bg-white opacity-10`} />

                            <View style={tw`p-6 flex-row justify-between h-full items-center`}>
                                <View style={tw`max-w-[150px]`}>
                                    <View style={tw`bg-white/20 px-2 py-1 rounded-full self-start mb-2`}>
                                        <Text style={tw`text-white text-[10px] font-geistBold uppercase tracking-wider`}>Limited Offer</Text>
                                    </View>
                                    <Text style={tw`text-white text-2xl font-geistBold`}>{item.title}</Text>
                                    <Text style={tw`text-white/80 text-xs mt-1 font-geistMedium`}>{item.subtitle}</Text>
                                </View>

                                <View style={tw`relative`}>
                                    <View style={tw`bg-white/10 rounded-2xl absolute inset-0 -rotate-6 translate-y-1`} />
                                    <Image
                                        source={{ uri: item.image }}
                                        style={tw`w-24 h-32 rounded-xl border-2 border-white rotate-12 -translate-y-2`}
                                        resizeMode="cover"
                                    />
                                </View>
                            </View>

                        </View>
                    </TouchableOpacity>
                )}
            />
            <View style={tw`flex-row justify-center mt-2`}>
                {BANNERS.map((banner, index) => (
                    <View
                        key={index}
                        style={tw`mx-1 rounded-full ${activeIndex === index
                            ? `w-2 md:w-3 h-2 md:h-3 ${banner.color.replace('bg-', 'bg-')}` // Ensure color class works or use inline style
                            : `w-2 h-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`
                            }`}
                    />
                ))}
            </View>
        </View>
    );
};

export default BannerCarousel;
