import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CalendarIcon, HomeIcon, UserIcon } from '@/assets';

const TabBar = ({ state, descriptors, navigation }: any) => {
    return (
        <View style={styles.container}>
            {state.routes.map((route: any, index: number) => {
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.tabItem}
                    >
                        {route.name === 'LawCalendar' ? (
                            <View style={styles.iconContainer}>
                                <CalendarIcon width={20} height={20} fill='white' color={isFocused ? '#007AFF' : '#666'} />
                                <Text style={[styles.tabText, isFocused && styles.tabTextFocused]}>
                                    타임라인
                                </Text>
                            </View>
                        ) : route.name === 'Home' ? (
                            <View style={styles.iconContainer}>
                                <HomeIcon width={20} height={20} fill='white' color={isFocused ? '#007AFF' : '#666'} />
                                <Text style={[styles.tabText, isFocused && styles.tabTextFocused]}>
                                    홈
                                </Text>
                            </View>
                        ) : route.name === 'Profile' ? (
                            <View style={styles.iconContainer}>
                                <UserIcon width={20} height={20} fill='white' color={isFocused ? '#007AFF' : '#666'} />
                                <Text style={[styles.tabText, isFocused && styles.tabTextFocused]}>
                                    프로필
                                </Text>
                            </View>
                        ) : (
                            <Text style={[styles.tabText, isFocused && styles.tabTextFocused]}>
                                {route.name}
                            </Text>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        fontSize: 10,
        color: '#666',
    },
    tabTextFocused: {
        color: '#007AFF',
        fontWeight: '600',
    },
});

export default TabBar;

