import { ChevronLeftIcon } from '@/assets';
import { colors } from '@/constants/colors';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import bills from './nqfvrbsdafrmuzixe.json';
import { BillStatus } from '@/types';

interface LawListProps {
    type: 'random' | 'latest';
}

const LawList = ({ type = 'random' }: LawListProps) => {

    const randomBills = useMemo(() => {
        const shuffled = [...bills].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2);
    }, []);

    const latestBills = useMemo(() => {
        const sorted = [...bills].sort((a, b) => new Date(b.DT).getTime() - new Date(a.DT).getTime());
        return sorted.slice(0, 2);
    }, []);
    

    return (
        <View style={styles.container}>
            <View style={styles.newsTitleContainer}>
                <Text style={styles.newsTitle}>{type === 'random' ? '주목받는 법안' : '최신 법안'}</Text>
                <View style={styles.newsTitleMore}>
                    <Text style={styles.newsTitleMoreTitle}>더보기</Text>
                    <ChevronLeftIcon style={styles.newsTitleMoreIcon} width={17} height={17} color={colors.primary} />
                </View>
            </View>
            <View style={styles.lawListContainer}>
                {(type === 'latest' ? latestBills : randomBills).map((bill, index) => {
                    const [title, proposer] = bill.BILL_NM.split('(');
                    const cleanProposer = proposer?.replace(')', '');
                    
                    return (
                        <View key={index} style={styles.lawItem}>
                            <View style={styles.lawItemHeader}>
                                <Text style={styles.lawItemDate}>{bill.DT}</Text>
                                <Text style={styles.lawItemProposer}>발의자: {cleanProposer}</Text>
                            </View>
                            <Text 
                                style={styles.lawTitle}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >{title}</Text>         
                            <View style={styles.lawItemTagContent}>
                                <Text style={styles.lawItemTagText}>{bill.BILL_KIND}</Text>
                                <Text style={[styles.lawItemTagText, 
                                    { backgroundColor: 
                                        bill.ACT_STATUS === BillStatus.MEETING ? '#EFF6FF' : 
                                        bill.ACT_STATUS === BillStatus.APPROVAL ? '#CAFFE0' : 
                                        bill.ACT_STATUS === BillStatus.PROCESSING ? '#FFDAB1' : 
                                        bill.ACT_STATUS === BillStatus.GOVERNMENT_TRANSFER ? '#E7BEFF' :
                                        bill.ACT_STATUS === BillStatus.COMMITTEE_MEETING ? '#92A3F8' :
                                        bill.ACT_STATUS === BillStatus.VOTE ? '#FFC8C8' : 
                                        bill.ACT_STATUS === BillStatus.COMMITTEE_REVIEW ? '#EEC979' : 
                                        bill.ACT_STATUS === BillStatus.PROMULGATION ? '#A1C3A9' : 
                                        bill.ACT_STATUS === BillStatus.INTRODUCTION ? '#FDF9D1' : 
                                        bill.ACT_STATUS === BillStatus.SUBMISSION ? '#FF7DFD' : '#DFDFDF' },
                                      { color: 
                                        bill.ACT_STATUS === BillStatus.MEETING ? '#519AFA' : 
                                        bill.ACT_STATUS === BillStatus.APPROVAL ? '#6CC58B' :
                                        bill.ACT_STATUS === BillStatus.PROCESSING ? '#DE9440' : 
                                        bill.ACT_STATUS === BillStatus.GOVERNMENT_TRANSFER ? '#B04DEA' : 
                                        bill.ACT_STATUS === BillStatus.COMMITTEE_MEETING ? '#3756F0' : 
                                        bill.ACT_STATUS === BillStatus.VOTE ? '#DE3939' : 
                                        bill.ACT_STATUS === BillStatus.COMMITTEE_REVIEW ? '#BD8E29' : 
                                        bill.ACT_STATUS === BillStatus.PROMULGATION ? '#088B24' : 
                                        bill.ACT_STATUS === BillStatus.INTRODUCTION ? '#DCAE46' : 
                                        bill.ACT_STATUS === BillStatus.SUBMISSION ? '#CD16CA' : '#B1B1B1' }
                                ]}>{bill.ACT_STATUS}</Text>
                            </View>  
                            <Text style={styles.lawItemCommitteeText}>{bill.COMMITTEE || '-'}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 30,
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