import { ChevronLeftIcon } from '@/assets';
import { colors } from '@/constants';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { RootTabParamList, RootStackParamList } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BillStatusTag, Typography } from '@/components';
import { loadLatestLaws, loadViewLaws } from '@/services';
import { Law } from '@/models';

interface LawListProps {
    type: 'random' | 'latest';
}

const LawList = ({ type = 'random' }: LawListProps) => {
    const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
    const stackNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [laws, setLaws] = useState<Law[]>([]);

    useEffect(() => {
        const loadLawsSync = async () => {
            const lawList = await loadLatestLaws();
            setLaws(lawList);
        };
        const loadViewLawsSync = async () => {
            const lawList = await loadViewLaws();
            setLaws(lawList);
        };
        if (type === 'latest') {
            loadLawsSync();
        } else if (type === 'random') {
            loadViewLawsSync();
        }
    }, [type]);
    

    return (
        <View style={styles.container}>
            <View style={styles.newsTitleContainer}>
                <Typography style={styles.newsTitle}>{type === 'random' ? '주목받는 법안' : '최신 법안'}</Typography>
                <TouchableOpacity style={styles.newsTitleMore} onPress={() => navigation.navigate('Search', { type: type })}>
                    <Typography style={styles.newsTitleMoreTitle}>더보기</Typography>
                    <ChevronLeftIcon style={styles.newsTitleMoreIcon} width={17} height={17} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <View style={styles.lawListContainer}>
                {laws.map((bill, index) => {
                    return (
                        <TouchableOpacity key={index} style={styles.lawItem} onPress={() => stackNavigation.navigate('LawDetail', { law: bill })}>
                            <View style={styles.lawItemHeader}>
                                <Typography style={styles.lawItemDate}>{bill.DATE}</Typography>
                                <Typography style={styles.lawItemProposer}>발의자: {bill.AGENT.length > 15 ? bill.AGENT.slice(0, 15) + '...' : bill.AGENT}</Typography>
                            </View>
                            <Typography 
                                style={styles.lawTitle}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >{bill.TITLE}</Typography>         
                            <View style={styles.lawItemTagContent}>
                                <Typography style={styles.lawItemTagText}>{bill.TAG}</Typography>
                                <BillStatusTag status={bill.ACT_STATUS} />
                            </View>  
                            <Typography style={styles.lawItemCommitteeText}>{bill.COMMITTEE || '-'}</Typography>
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
        paddingHorizontal: 20,
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