import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/constants';
import { Law, BillStatus } from '@/models';

const STATUS_ORDER = [
    BillStatus.INTRODUCTION,
    BillStatus.SUBMISSION,
    BillStatus.COMMITTEE_REVIEW,
    BillStatus.COMMITTEE_MEETING,
    BillStatus.MEETING,
    BillStatus.APPROVAL,
    BillStatus.VOTE,
    BillStatus.GOVERNMENT_TRANSFER,
    BillStatus.PROCESSING,
    BillStatus.PROMULGATION,
];

const LawStatus = ({ law }: { law: Law }) => {
    const currentStatusIndex = STATUS_ORDER.indexOf(law.ACT_STATUS as BillStatus);

    return (
        <View style={styles.container}>
            <Text style={styles.lawStatusTitle}>진행 경과</Text>
            <View style={styles.progressContainer}>
                <ScrollView 
                    style={styles.scrollView} 
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                >
                    {STATUS_ORDER.map((status, index) => {
                        const isCompleted = index < currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;

                        return (
                            <View key={status} style={styles.statusItem}>
                                <View style={styles.statusContent}>
                                    <View style={styles.dotContainer}>
                                        <View style={[
                                            styles.statusDot,
                                            isCompleted && styles.completedDot,
                                            isCurrent && styles.currentDot,
                                            !isCompleted && !isCurrent && styles.pendingDot
                                        ]} />
                                        {isCurrent && <View style={styles.currentDotBorder} />}
                                    </View>
                                    <View style={styles.statusTextContainer}>
                                        <View style={styles.statusTextRowContainer}>
                                            <Text style={[
                                                styles.statusText,
                                                isCompleted && styles.completedText,
                                                isCurrent && styles.currentText,
                                                !isCompleted && !isCurrent && styles.pendingText
                                            ]}>{status}</Text>
                                            {isCurrent && (
                                                <Text style={styles.currentTagText}>
                                                    현재
                                                </Text>
                                            )}
                                        </View>
                                        <Text style={styles.dateText}>
                                            {isCompleted ? '완료' : isCurrent ? law.DATE : '예정'}
                                        </Text>
                                    </View>
                                </View>
                                {index < STATUS_ORDER.length - 1 && (
                                    <View style={[
                                        styles.line,
                                        isCompleted && styles.completedLine,
                                        !isCompleted && styles.pendingLine
                                    ]} />
                                )}
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: 16,
        padding: 15,
        marginBottom: 20,
    },
    scrollView: {
        height: 250,
    },
    lawStatusTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.gray800,
        marginBottom: 5,
    },
    progressContainer: {
        flexDirection: 'column',
        paddingLeft: 10,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
        position: 'relative',
    },
    statusContent: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 120,
        paddingTop: 10,
        paddingBottom: 5,
        marginLeft: 3,
    },
    dotContainer: {
        width: 15,
        height: 15,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusDot: {
        width: 15,  
        height: 15,
        borderRadius: 100,
    },
    currentDotBorder: {
        position: 'absolute',
        width: 21,
        height: 21,
        borderRadius: 9,
        borderWidth: 3,
        borderColor: '#E3F2FD',
    },
    completedDot: {
        backgroundColor: colors.primary,
    },
    currentDot: {
        backgroundColor: colors.primary,
    },
    pendingDot: {
        backgroundColor: colors.gray200,
    },
    statusTextContainer: {
        flexDirection: 'column',
    },
    statusTextRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    statusText: {
        fontSize: 12,
    },
    completedText: {
        color: colors.primary,
    },
    currentText: {
        color: colors.primary,
    },
    currentTagText: {
        fontSize: 10,
        color: colors.primary,
        borderRadius: 100,
        paddingHorizontal: 8,
        paddingVertical: 1,
        backgroundColor: '#E3F2FD',
    },
    pendingText: {
        color: colors.gray400,
    },
    dateText: {
        fontSize: 10,
        color: colors.gray600,
        marginTop: 2,
    },
    line: {
        position: 'absolute',
        left: 10.,
        top: 27,
        width: 1,
        height: 45,
        zIndex: -1,
    },
    completedLine: {
        backgroundColor: colors.gray200,
    },
    pendingLine: {
        backgroundColor: colors.gray200,
    },
});

export default LawStatus;
