import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { ArrowLeftIcon, ChevronLeftIcon, HeartIcon, ShareIcon } from '@/assets/icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BillStatusTag, LawStatus, LawVote } from '@/components';
import { colors } from '@/constants';
import { toggleFavoriteLaw, increaseViewCount } from '@/services';
import { useUser } from '@/lib';
import Share from 'react-native-share';


const LawDetail = ({ route }: { route: RouteProp<RootStackParamList, 'LawDetail'> }) => {
    const { law } = route.params;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [isHearted, setIsHearted] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [user, setUser] = useUser();

    useEffect(() => {
        const increaseView = async () => {
            setIsHearted(user?.FAVORITE_LAWS?.includes(law.BILL_ID) || false);
            await increaseViewCount(law.BILL_ID);
        }
        increaseView();
    }, [law]);

    const handleHeartPress = async () => {
        if (user) {
            await toggleFavoriteLaw(user.id, law.BILL_ID);
            setIsHearted(!isHearted);
            setUser({ ...user, FAVORITE_LAWS: user.FAVORITE_LAWS?.includes(law.BILL_ID) ? user.FAVORITE_LAWS?.filter(id => id !== law.BILL_ID) : [...(user.FAVORITE_LAWS || []), law.BILL_ID] });
        }
    }

    const handleSharePress = async () => {
        await Share.open({
            message: `법안 상세 페이지: ${law.TITLE}`,
            url: 'https://play.google.com/store/apps/details?id=com.lawtracker',
        })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                err && console.log(err);
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon width={24} height={24} color={colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>법안 상세</Text>
                <TouchableOpacity style={styles.headerShareIconContainer} onPress={handleSharePress}>
                    <ShareIcon width={20} height={20} color={colors.black} fill={colors.black} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={styles.lawTagContainer}>
                    <BillStatusTag status={law.ACT_STATUS} size="large" />
                    <TouchableOpacity onPress={handleHeartPress}>
                        <HeartIcon width={18} height={18} color={isHearted ? colors.red : colors.gray400} fill={isHearted ? colors.red : 'none'} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.lawTitle}>{law.TITLE}</Text>
                <View style={styles.lawInfo1Container}>
                    <View style={styles.lawInfo1AgentContainer}>
                        <Text style={styles.lawInfo1AgentTitle}>발의자</Text>
                        <Text style={styles.lawInfo1AgentName}>{law.AGENT}</Text>
                    </View>
                    <View style={styles.lawInfo1AgentContainer}>
                        <Text style={styles.lawInfo1AgentTitle}>소속 정당</Text>
                        <Text style={styles.lawInfo1AgentName}>{law.AGENT}</Text>
                    </View>
                    <View style={styles.lawInfo1AgentContainer}>
                        <Text style={styles.lawInfo1AgentTitle}>발의일</Text>
                        <Text style={styles.lawInfo1AgentName}>{law.DATE}</Text>
                    </View>
                    <View style={styles.lawInfo1AgentContainer}>
                        <Text style={styles.lawInfo1AgentTitle}>분야</Text>
                        <Text style={styles.lawInfo1AgentName}>{law.TAG}</Text>
                    </View>
                </View>
                <View style={styles.lawSummaryContainer}>
                    <Text style={styles.lawSummaryTitle}>주요 내용</Text>
                    {isSummaryExpanded && law.SUMMARY ? (
                        <Text style={styles.lawSummaryContent}>{law.SUMMARY}</Text>
                    ) : (
                        <Text style={styles.lawSummaryContent}>{law.SUMMARY ? law.SUMMARY.slice(0, 100) : ''}...</Text>
                    )}
                    <TouchableOpacity style={styles.lawSummaryMoreContainer} onPress={() => setIsSummaryExpanded(!isSummaryExpanded)}>
                        <Text style={styles.lawSummaryMore}>{isSummaryExpanded ? '접기' : '더보기'}</Text>
                        <ChevronLeftIcon style={[styles.lawSummaryMoreIcon, { transform: [{ rotate: isSummaryExpanded ? '90deg' : '270deg' }] }]} width={18} height={18} color={colors.primary} />
                    </TouchableOpacity>
                </View>
                <LawStatus law={law} />
                <LawVote law={law} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        gap: 15,
    },
    headerTitle: {
        fontSize: 18,
        color: colors.black,
        marginBottom: 5
    },
    headerShareIconContainer: {
        position: 'absolute',
        right: 0,
    },
    lawTagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    lawTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 20,
    },
    lawInfo1Container: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    lawInfo1AgentContainer: {
        width: '50%',
        marginBottom: 15,
    },
    lawInfo1AgentTitle: {
        fontSize: 14,
        color: colors.gray400,
        marginBottom: 2,
    },
    lawInfo1AgentName: {
        fontSize: 14,
        color: colors.black,
    },
    lawSummaryContainer: {
        marginBottom: 20,
    },
    lawSummaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 10,
    },
    lawSummaryContent: {
        fontSize: 14,
        color: colors.gray600,
    },
    lawSummaryMoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0,
    },
    lawSummaryMore: {
        fontSize: 14,
        color: colors.primary,
        marginTop: 10,
    },
    lawSummaryMoreIcon: {
        marginTop: 15,
    },
})

export default LawDetail;

