import React, { useState } from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { colors } from '@/constants/colors';
import { HeartLaws, MyPost } from '.';

const TabViewComponent = () => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: '0', title: '관심 법안' },
        { key: '1', title: '최근 조회' },
        { key: '2', title: '내 게시글' },
    ]);

    const renderScene = ({ route }: { route: { key: string; title: string } }) => {
        switch (route.key) {
            case '0':
                return <HeartLaws />;
            case '1':
                return <View style={{ flex: 1, backgroundColor: 'blue' }} />;
            case '2':
                return <MyPost />;
        }
    };

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            style={styles.tabBar}
            indicatorStyle={styles.indicator}
            labelStyle={styles.label}
            activeColor={colors.primary}
            inactiveColor="#666666"
            indicatorContainerStyle={styles.indicatorContainer}
        />
    );

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFFFFF',
        elevation: 0, // 안드로이드 그림자 제거
        shadowOpacity: 0, // iOS 그림자 제거
    },
    indicatorContainer: {
        alignItems: 'center',
    },
    indicator: {
        backgroundColor: colors.primary,
        height: 2,
        width: '26%',
        marginHorizontal: '3.5%', // 좌우 여백을 동일하게 설정
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'none', // 대문자 변환 제거
    },
});

export default TabViewComponent;