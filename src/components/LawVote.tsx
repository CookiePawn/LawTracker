import { colors } from '@/constants';
import { Law } from '@/models';
import { increaseVoteCount, loadLawById, toggleVoteLaw } from '@/services';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { PieChart } from 'react-native-chart-kit'
import { useSetAlert, useUser } from '@/lib';

const LawVote = ({ law }: { law: Law }) => {
    const [item, setItem] = useState<Law>(law);
    const [user] = useUser();
    const setAlert = useSetAlert();

    const loadLaw = async () => {
            const newLaw = await loadLawById(law.BILL_ID);
            setItem(newLaw);
        }

    useEffect(() => {
        loadLaw();
    }, [law]);

    const totalVotes = (item.VOTE_TRUE || 0) + (item.VOTE_FALSE || 0);
    const chartData = [
        {
            name: '찬성',
            population: item.VOTE_TRUE || 0,
            color: colors.primary,
            legendFontColor: colors.gray800,
            legendFontSize: 12
        },
        {
            name: '반대',
            population: item.VOTE_FALSE || 0,
            color: colors.red,
            legendFontColor: colors.gray800,
            legendFontSize: 12
        }
    ];

    if (totalVotes === 0) {
        chartData[0].population = 1;
        chartData[1].population = 1;
    }

    const handleVote = async (voteType: 'VOTE_TRUE' | 'VOTE_FALSE') => {
        if (item?.BILL_ID) {
            const result = await increaseVoteCount(user?.id || '', item.BILL_ID, voteType);
            if (result === '200') {
                await loadLaw();
            } else if (result === '402') {
                setAlert({
                    visible: true,
                    title: '안내',
                    message: `이미 투표한 의안입니다. ${voteType === 'VOTE_TRUE' ? '\n찬성' : '\n반대'}로 바꾸시겠습니까?`,
                    buttons: [
                        { text: '확인', onPress: () => {
                            toggleVoteLaw(item.BILL_ID, voteType);
                            loadLaw();
                        } },
                        { text: '취소', style: 'cancel' }
                    ],
                });
            } else {
                setAlert({
                    visible: true,
                    title: '투표 오류',
                    message: '투표 오류가 발생했습니다.',
                    buttons: [{ text: '확인', }],
                });
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.lawStatusTitle}>진행 경과</Text>
            <View style={styles.lawVoteContainer}>
                <View style={styles.lawVoteTrueItem}>
                    <Text style={styles.lawVoteTrueItemPercentText}>
                        {totalVotes === 0 ? '0%' : `${((item.VOTE_TRUE || 0) / totalVotes * 100).toFixed(0)}%`}
                    </Text>
                    <Text style={styles.lawVoteTrueItemText}>찬성</Text>
                    <TouchableOpacity style={styles.lawVoteTrueItemButton} onPress={() => handleVote('VOTE_TRUE')}>
                        <Text style={styles.lawVoteTrueItemButtonText}>찬성하기</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.pieChartContainer}>
                    <PieChart
                        data={chartData}
                        width={100}
                        height={100}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="25"
                        hasLegend={false}
                    />
                    <View style={styles.whiteCircle}/>
                </View>

                <View style={styles.lawVoteFalseItem}>
                    <Text style={styles.lawVoteFalseItemPercentText}>
                        {totalVotes === 0 ? '0%' : `${((item.VOTE_FALSE || 0) / totalVotes * 100).toFixed(0)}%`}
                    </Text>
                    <Text style={styles.lawVoteFalseItemText}>반대</Text>
                    <TouchableOpacity style={styles.lawVoteFalseItemButton} onPress={() => handleVote('VOTE_FALSE')}>
                        <Text style={styles.lawVoteFalseItemButtonText}>반대하기</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.lawVoteSummary}>총 {totalVotes}명이 투표에 참여했습니다.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    lawStatusTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.gray800,
        marginBottom: 5,
    },
    lawVoteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    lawVoteTrueItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lawVoteTrueItemPercentText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary,
    },
    lawVoteTrueItemText: {
        fontSize: 12,
        color: colors.gray800,
        marginBottom: 15,
    },
    lawVoteTrueItemButton: {
        backgroundColor: colors.skyblue,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    lawVoteTrueItemButtonText: {
        fontSize: 12,
        color: colors.primary,
    },
    lawVoteFalseItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lawVoteFalseItemPercentText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.red,
    },
    lawVoteFalseItemText: {
        fontSize: 12,
        color: colors.gray800,
        marginBottom: 15,
    },
    lawVoteFalseItemButton: {
        backgroundColor: colors.skyred,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    lawVoteFalseItemButtonText: {
        fontSize: 12,
        color: colors.red,
    },
    lawVoteSummary: {
        fontSize: 10,
        color: colors.gray400,
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 10,
    },
    pieChartContainer: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    whiteCircle: {
        width: 65,
        height: 65,
        backgroundColor: 'white',
        borderRadius: 100,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -32.5 }, { translateY: -32.5 }],
    },
});

export default LawVote;