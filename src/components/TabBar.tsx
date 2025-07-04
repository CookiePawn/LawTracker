import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CalendarIcon, HomeIcon, SearchIcon, UserIcon, ChatIcon } from '@/assets';
import { colors } from '@/constants';
import { Typography } from '@/components';

const TabBar = ({ state, navigation }: any) => {
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
                                <CalendarIcon width={20} height={20} fill='white' color={isFocused ? colors.tab_active : colors.tab_no_active} />
                                <Typography style={[styles.tabText, isFocused && styles.tabTextFocused]}>
                                    타임라인
                                </Typography>
                            </View>
                        ) : route.name === 'Search' ? (
                            <View style={styles.iconContainer}>
                                <SearchIcon width={20} height={20} fill='white' color={isFocused ? colors.tab_active : colors.tab_no_active} />
                                <Typography style={[styles.tabText, isFocused && styles.tabTextFocused]}>
                                    검색
                                </Typography>
                            </View>
                        ) : route.name === 'Home' ? (
                            <View style={styles.iconContainer}>
                                <HomeIcon width={20} height={20} fill='white' color={isFocused ? colors.tab_active : colors.tab_no_active} />
                                <Typography style={[styles.tabText, isFocused && styles.tabTextFocused]}>
                                    홈
                                </Typography>
                            </View>
                        ) : route.name === 'Profile' ? (
                            <View style={styles.iconContainer}>
                                <UserIcon width={20} height={20} fill='white' color={isFocused ? colors.tab_active : colors.tab_no_active} />
                                <Typography style={[styles.tabText, isFocused && styles.tabTextFocused]}>
                                    프로필
                                </Typography>
                            </View>
                        ) : route.name === 'Community' ? (
                            <View style={styles.iconContainer}>
                                <ChatIcon width={20} height={20} fill={isFocused ? colors.tab_active : colors.tab_no_active} color={isFocused ? colors.tab_active : colors.tab_no_active} />
                                <Typography style={[styles.tabText, isFocused && styles.tabTextFocused]}>
                                    커뮤니티
                                </Typography>
                            </View>
                        ) : (
                            <Typography style={[styles.tabText, isFocused && styles.tabTextFocused]}>
                                {route.name}
                            </Typography>
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
        color: colors.tab_no_active,
    },
    tabTextFocused: {
        color: colors.tab_active,
        fontWeight: '600',
    },
});

export default TabBar;

