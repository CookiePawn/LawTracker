import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants';
import { ChevronLeftIcon } from '@/assets/icons';
import { BillStatus, Law } from '@/models';
import { loadLawById } from '@/services';
import { useUser } from '@/lib';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const getProgressPercentage = (status: BillStatus): number => {
    switch (status) {
        case BillStatus.INTRODUCTION:
            return 10;
        case BillStatus.SUBMISSION:
            return 20;
        case BillStatus.COMMITTEE_REVIEW:
            return 30;
        case BillStatus.COMMITTEE_MEETING:
            return 40;
        case BillStatus.MEETING:
            return 50;
        case BillStatus.APPROVAL:
            return 60;
        case BillStatus.PROCESSING:
            return 70;
        case BillStatus.GOVERNMENT_TRANSFER:
            return 80;
        case BillStatus.VOTE:
            return 90;
        case BillStatus.PROMULGATION:
            return 100;
        default:
            return 0;
    }
};

const MyLawCard = () => {
    const [laws, setLaws] = useState<Law[]>([]);
    const [user] = useUser();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const loadLawsList = async () => {
            const favoriteLaws = user?.FAVORITE_LAWS?.slice(0, 3) || [];
            const laws = await Promise.all(favoriteLaws.map(async (billId) => await loadLawById(billId)));
            setLaws(laws as Law[]);
        };
        loadLawsList();
    }, [user]);

    return (
        <View style={styles.container}>
            <View style={styles.newsTitleContainer}>
                <Text style={styles.newsTitle}>나의 관심 법안</Text>
                <TouchableOpacity style={styles.newsTitleMore} onPress={() => navigation.navigate('Tab', { screen: 'Profile' })}>
                    <Text style={styles.newsTitleMoreTitle}>더보기</Text>
                    <ChevronLeftIcon style={styles.newsTitleMoreIcon} width={17} height={17} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <View style={styles.lawListContainer}>
                {laws.length === 0 && (
                    <View style={styles.lawItemEmpty}>
                        <Text style={styles.lawItemEmptyText}>관심 법안이 없습니다.</Text>
                    </View>
                )}
                {laws.map((bill, index) => {
                    const progressPercentage = getProgressPercentage(bill.ACT_STATUS as BillStatus);
                    return (
                        <TouchableOpacity style={styles.lawItem} key={index} onPress={() => navigation.navigate('LawDetail', { law: bill })}>
                            <View style={styles.lawItemHeader}>
                                <Text
                                    style={styles.lawItemTitle}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {bill.TITLE}
                                </Text>
                                <Text style={styles.lawItemTag}>{bill.TAG}</Text>
                            </View>
                            <View style={styles.lawItemStatusContent}>
                                <Text style={styles.lawItemStatusTitle}>진행 상태: <Text style={styles.lawItemStatusPointText}>{bill.ACT_STATUS}</Text></Text>
                                <Text style={styles.lawItemStatusText}>발의일: {bill.DATE}</Text>
                            </View>
                            <View style={styles.lawItemProgressBar}>
                                <View style={[styles.lawItemProgressBarFill, { width: `${progressPercentage}%` }]} />
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20,
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
    lawListContainer: {
        gap: 10,
        marginTop: 10,
    },
    lawItem: {
        flex: 1,
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.gray100,
    },
    lawItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lawItemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.gray700,
        flex: 1,
        maxWidth: '80%',
        marginRight: 10,
    },
    lawItemTag: {
        fontSize: 10,
        color: colors.gray500,
        borderRadius: 100,
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: colors.gray100,
    },
    lawItemStatusContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 7,
    },
    lawItemStatusTitle: {
        fontSize: 12,
        color: colors.gray500,
    },
    lawItemStatusPointText: {
        fontSize: 12,
        color: colors.primary,
    },
    lawItemStatusText: {
        fontSize: 12,
        color: colors.gray500,
    },
    lawItemProgressBar: {
        width: '100%',
        height: 6,
        backgroundColor: colors.gray100,
        borderRadius: 10,
        marginTop: 7,
    },
    lawItemProgressBarFill: {
        height: 6,
        backgroundColor: colors.primary,
        borderRadius: 10,
    },
    lawItemEmpty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lawItemEmptyText: {
        fontSize: 14,
        color: colors.gray500,
        paddingVertical: 50,
    },
});
export default MyLawCard;


