import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants';
import { Law, BillStatus } from '@/types';

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

    const getStatusDate = (status: BillStatus) => {
        switch (status) {
            case BillStatus.INTRODUCTION:
                return law.ACT_INTRODUCTION_DATE;
            case BillStatus.SUBMISSION:
                return law.ACT_SUBMISSION_DATE;
            case BillStatus.COMMITTEE_REVIEW:
                return law.ACT_COMMITTEE_REVIEW_DATE;
            case BillStatus.COMMITTEE_MEETING:
                return law.ACT_COMMITTEE_MEETING_DATE;
            case BillStatus.MEETING:
                return law.ACT_MEETING_DATE;
            case BillStatus.APPROVAL:
                return law.ACT_APPROVAL_DATE;
            case BillStatus.VOTE:
                return law.ACT_VOTE_DATE;
            case BillStatus.GOVERNMENT_TRANSFER:
                return law.ACT_GOVERNMENT_TRANSFER_DATE;
            case BillStatus.PROCESSING:
                return law.ACT_PROCESSING_DATE;
            case BillStatus.PROMULGATION:
                return law.ACT_PROMULGATION_DATE;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.lawStatusTitle}>진행 경과</Text>
            <View style={styles.progressContainer}>
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
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: 10,
        padding: 15,
    },
    lawStatusTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.gray800,
        marginBottom: 0,
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
        marginLeft: -2.5,
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
    statusText: {
        fontSize: 12,
    },
    completedText: {
        color: colors.black,
    },
    currentText: {
        color: colors.primary,
    },
    statusTextRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
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
        left: 5,
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
