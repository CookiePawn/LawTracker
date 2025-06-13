import { Typography } from '@/components';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { RootStackParamList } from '@/types';
import { Law } from '@/models';
import { BillStatusTag } from '@/components';
import { EyeIcon } from '@/assets';
import { colors } from '@/constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const BillItem = ({ item }: { item: Law }) => {
    const stackNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleBillPress = async (bill: Law) => {
        stackNavigation.navigate('LawDetail', { law: bill });
    };
    return (
        <TouchableOpacity
            style={styles.lawItem}
            onPress={() => handleBillPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.lawItemHeader}>
                <Typography style={styles.lawItemDate}>{item.DATE}</Typography>
                <Typography style={styles.lawItemProposer}>발의자: {item.AGENT.length > 15 ? item.AGENT.slice(0, 15) + '...' : item.AGENT}</Typography>
            </View>
            <Typography
                style={styles.lawTitle}
                numberOfLines={2}
                ellipsizeMode="tail"
            >{item.TITLE}</Typography>
            <View style={styles.lawItemTagContent}>
                <Typography style={styles.lawItemTagText}>{item.TAG}</Typography>
                <BillStatusTag status={item.ACT_STATUS} />
            </View>
            <View style={styles.lawItemFooterContainer}>
                <Typography style={styles.lawItemCommitteeText}>{item.COMMITTEE || '-'}</Typography>
                <View style={styles.lawItemFooterIconContainer}>
                    <EyeIcon width={14} height={14} color={colors.gray400} />
                    <Typography style={styles.lawItemFooterIconText}>{item.VIEW_COUNT || 0}</Typography>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
    lawItemFooterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lawItemFooterIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    lawItemFooterIconText: {
        fontSize: 12,
        color: colors.gray400,
    },
});

export default BillItem;