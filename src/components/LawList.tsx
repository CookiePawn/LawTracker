import { ChevronLeftIcon } from '@/assets';
import { colors, laws } from '@/constants';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BillStatus, RootTabParamList, RootStackParamList } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BillStatusTag } from '@/components';

interface LawListProps {
    type: 'random' | 'latest';
}

const LawList = ({ type = 'random' }: LawListProps) => {
    const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
    const stackNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const randomBills = useMemo(() => {
        const shuffled = [...laws].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2);
    }, []);

    const latestBills = useMemo(() => {
        const sorted = [...laws].sort((a, b) => new Date(b.DATE).getTime() - new Date(a.DATE).getTime());
        return sorted.slice(0, 2);
    }, []);
    

    return (
        <View style={styles.container}>
            <View style={styles.newsTitleContainer}>
                <Text style={styles.newsTitle}>{type === 'random' ? '주목받는 법안' : '최신 법안'}</Text>
                <TouchableOpacity style={styles.newsTitleMore} onPress={() => navigation.navigate('Search', { type: type })}>
                    <Text style={styles.newsTitleMoreTitle}>더보기</Text>
                    <ChevronLeftIcon style={styles.newsTitleMoreIcon} width={17} height={17} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <View style={styles.lawListContainer}>
                {(type === 'latest' ? latestBills : randomBills).map((bill, index) => {
                    return (
                        <TouchableOpacity key={index} style={styles.lawItem} onPress={() => stackNavigation.navigate('LawDetail', { law: bill })}>
                            <View style={styles.lawItemHeader}>
                                <Text style={styles.lawItemDate}>{bill.DATE}</Text>
                                <Text style={styles.lawItemProposer}>발의자: {bill.AGENT.length > 15 ? bill.AGENT.slice(0, 15) + '...' : bill.AGENT}</Text>
                            </View>
                            <Text 
                                style={styles.lawTitle}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >{bill.TITLE}</Text>         
                            <View style={styles.lawItemTagContent}>
                                <Text style={styles.lawItemTagText}>{bill.TEG}</Text>
                                <BillStatusTag status={bill.ACT_STATUS} />
                            </View>  
                            <Text style={styles.lawItemCommitteeText}>{bill.COMMITTEE || '-'}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
        marginTop: 10,
        gap: 15,
    },
    lawItem: {
        
    },
    lawTitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
    },
    lawInfo: {
        fontSize: 12,
        color: '#666',
    },
    lawItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    lawItemDate: {
        fontSize: 12,
        color: colors.gray500,
    },
    lawItemProposer: {
        fontSize: 12,
        color: colors.gray500,
    },
    lawItemTagContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    lawItemTagText: {
        fontSize: 10,
        color: colors.gray500,
        borderRadius: 100,
        paddingHorizontal: 7,
        paddingVertical: 3,
        backgroundColor: colors.gray100,
    },
    lawItemCommitteeText: {
        fontSize: 12,
        color: colors.gray500,
        marginTop: 5,  
    },
})

export default LawList;