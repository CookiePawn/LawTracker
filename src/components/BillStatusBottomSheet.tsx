import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants';
import BottomSheet from './BottomSheet';
import { BillStatus } from '@/models';

interface BillStatusBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onApply: (status: string) => void;
}

const BillStatusBottomSheet = ({ visible, onClose, onApply }: BillStatusBottomSheetProps) => {
    const [selectedStatus, setSelectedStatus] = useState<string>('전체');

    const statusList = [
        { label: '전체', value: '전체' },
        { label: BillStatus.INTRODUCTION, value: BillStatus.INTRODUCTION },
        { label: BillStatus.SUBMISSION, value: BillStatus.SUBMISSION },
        { label: BillStatus.GOVERNMENT_TRANSFER, value: BillStatus.GOVERNMENT_TRANSFER },
        { label: BillStatus.COMMITTEE_REVIEW, value: BillStatus.COMMITTEE_REVIEW },
        { label: BillStatus.COMMITTEE_MEETING, value: BillStatus.COMMITTEE_MEETING },
        { label: BillStatus.MEETING, value: BillStatus.MEETING },
        { label: BillStatus.APPROVAL, value: BillStatus.APPROVAL },
        { label: BillStatus.PROCESSING, value: BillStatus.PROCESSING },
        { label: BillStatus.VOTE, value: BillStatus.VOTE },
        { label: BillStatus.PROMULGATION, value: BillStatus.PROMULGATION },
    ];

    const handleApply = () => {
        onApply(selectedStatus);
        onClose();
    };

    return (
        <BottomSheet visible={visible} onClose={onClose} height={500}>
            <View style={styles.container}>
                <Text style={styles.title}>상태 선택</Text>
                <View style={styles.statusList}>
                    <ScrollView
                        style={styles.statusList}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                        scrollEventThrottle={16}
                        nestedScrollEnabled={true}
                    >
                        {statusList.map((status) => (
                            <TouchableOpacity
                                key={status.value}
                            style={[
                                styles.statusItem,
                                selectedStatus === status.value && styles.selectedStatus,
                            ]}
                            onPress={() => setSelectedStatus(status.value)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    selectedStatus === status.value && styles.selectedStatusText,
                                ]}
                            >
                                {status.label}
                            </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => {
                        setSelectedStatus('전체');
                        onClose();
                    }}>
                        <Text style={styles.cancelButtonText}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.applyButton} onPress={() => {
                        handleApply();
                        setSelectedStatus('전체');
                    }}>
                        <Text style={styles.applyButtonText}>적용</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        color: colors.black,
    },
    statusList: {
        flex: 1,
        marginBottom: 10,
    },
    statusItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: colors.gray100,
    },
    selectedStatus: {
        backgroundColor: colors.primary,
    },
    statusText: {
        fontSize: 16,
        color: colors.black,
    },
    selectedStatusText: {
        color: colors.white,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: colors.gray100,
        alignItems: 'center',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: colors.black,
    },
    applyButtonText: {
        fontSize: 16,
        color: colors.white,
    },
});

export default BillStatusBottomSheet; 