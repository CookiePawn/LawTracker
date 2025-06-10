import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { NewsImage } from "@/assets";
import { ChevronLeftIcon } from "@/assets";
import { colors } from "@/constants";

const newsData = [
    {
        image: NewsImage,
        title: "2025년 5월 주요 법안 심사 일정",
        text: "이번 달 국회 본회의에서 심사될 주요 법안과 상임위원회 법안 심사 일정을 확인하세요.",
        date: "2025.05.05",
        source: "국회사무처"
    },
    {
        image: NewsImage,
        title: "2025년 6월 입법 동향",
        text: "6월에 예정된 주요 입법 동향을 한눈에 확인하세요.",
        date: "2025.06.01",
        source: "국회사무처"
    },
    {
        image: NewsImage,
        title: "2025년 7월 국회 일정 안내",
        text: "7월 국회 일정과 관련된 주요 뉴스를 안내합니다.",
        date: "2025.07.01",
        source: "국회사무처"
    }
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HEIGHT = 290;

const NewsCard = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <View style={styles.newsSection}>
            <View style={styles.newsTitleContainer}>
                <Text style={styles.newsTitle}>입법 동향</Text>
                <View style={styles.newsTitleMore}>
                    <Text style={styles.newsTitleMoreTitle}>더보기</Text>
                    <ChevronLeftIcon style={styles.newsTitleMoreIcon} width={17} height={17} color={colors.primary} />
                </View>
            </View>
            <Carousel
                width={SCREEN_WIDTH - 40}
                height={CARD_HEIGHT}
                data={newsData}
                scrollAnimationDuration={400}
                onSnapToItem={setCurrentIndex}
                renderItem={({ item }) => (
                    <View style={styles.newsContent}>
                        <Image source={item.image} style={styles.newsContentImage} />
                        <Text style={styles.newsContentTitle}>{item.title}</Text>
                        <Text 
                            style={styles.newsContentText}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >{item.text}</Text>
                        <View style={styles.newsContentDate}>
                            <Text style={styles.newsContentDateText}>{item.date}</Text>
                            <Text style={styles.newsContentDateText}>{item.source}</Text>
                        </View>
                    </View>
                )}
                style={{ marginTop: 10 }}
            />
            <View style={styles.newsIndicator}>
                {newsData.map((_, idx) => (
                    <View
                        key={idx}
                        style={[styles.newsIndicatorItem, idx === currentIndex && styles.newsIndicatorItemActive]}
                    />
                ))}
            </View>
        </View>
    );
};

export default NewsCard;

const styles = StyleSheet.create({
    newsSection: {
        marginVertical: 20,
        paddingHorizontal: 0,
        paddingVertical: 10,
    },
    newsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    newsTitleMore: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    newsTitleMoreIcon: {
        transform: [{ rotate: '180deg' }],
    },
    newsTitleMoreTitle: {
        fontSize: 13,
        color: colors.primary,
        marginBottom: 2,
    },
    newsTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    newsContent: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: 16,
        padding: 10,
        backgroundColor: '#fff',
        width: SCREEN_WIDTH - 40,
        justifyContent: 'flex-start',
    },
    newsIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        gap: 5,
    },
    newsIndicatorItem: {
        width: 7,
        height: 7,
        backgroundColor: colors.gray200,
        borderRadius: 100,
    },
    newsIndicatorItemActive: {
        backgroundColor: colors.primary,
        width: 18,
        borderRadius: 10,
    },
    newsContentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.gray600,
        marginBottom: 5,
    },
    newsContentText: {
        fontSize: 14,
        color: colors.gray500,
        marginBottom: 10,
        minHeight: 50,
    },
    newsContentDate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    newsContentDateText: {
        fontSize: 14,
        color: colors.gray400,
    },
    newsContentImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
});