import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants';
import BottomSheet from './BottomSheet';
import { Typography } from '@/components';

interface DateFilterBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onApply: (startDate: string, endDate: string, period: string) => void;
}

const DateFilterBottomSheet = ({ visible, onClose, onApply }: DateFilterBottomSheetProps) => {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('전체');

    const periods = [
        { label: '전체', value: '전체' },
        { label: '최근 1주일', value: '1주일' },
        { label: '최근 1개월', value: '1개월' },
        { label: '최근 3개월', value: '3개월' },
        { label: '최근 6개월', value: '6개월' },
        { label: '최근 1년', value: '1년' },
    ];

    const calculateDateRange = (period: string) => {
        const today = new Date();
        let startDate = new Date();

        switch (period) {
            case '1주일':
                startDate.setDate(today.getDate() - 7);
                break;
            case '1개월':
                startDate.setMonth(today.getMonth() - 1);
                break;
            case '3개월':
                startDate.setMonth(today.getMonth() - 3);
                break;
            case '6개월':
                startDate.setMonth(today.getMonth() - 6);
                break;
            case '1년':
                startDate.setFullYear(today.getFullYear() - 1);
                break;
            default:
                return { start: '', end: '' };
        }

        return {
            start: startDate.toISOString().split('T')[0],
            end: today.toISOString().split('T')[0],
        };
    };

    const handleApply = () => {
        const dateRange = calculateDateRange(selectedPeriod);
        onApply(dateRange.start, dateRange.end, selectedPeriod);
        onClose();
    };

    return (
        <BottomSheet visible={visible} onClose={onClose} height={400}>
            <View style={styles.container}>
                <Typography style={styles.title}>기간 선택</Typography>
                <ScrollView 
                    style={styles.periodList}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    scrollEventThrottle={16}
                    nestedScrollEnabled={true}
                >
                    {periods.map((period) => (
                        <TouchableOpacity
                            key={period.value}
                            style={[
                                styles.periodItem,
                                selectedPeriod === period.value && styles.selectedPeriod,
                            ]}
                            onPress={() => setSelectedPeriod(period.value)}
                            activeOpacity={0.7}
                        >
                            <Typography
                                style={[
                                    styles.periodText,
                                    selectedPeriod === period.value && styles.selectedPeriodText,
                                ]}
                            >
                                {period.label}
                            </Typography>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => {
                        setSelectedPeriod('전체');
                        onClose();
                    }}>
                        <Typography style={styles.cancelButtonText}>취소</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.applyButton} onPress={() => {
                        handleApply();
                        setSelectedPeriod('전체');
                    }}>
                        <Typography style={styles.applyButtonText}>적용</Typography>
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
    periodList: {
        flex: 1,
        marginBottom: 16,
    },
    periodItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: colors.gray100,
    },
    selectedPeriod: {
        backgroundColor: colors.primary,
    },
    periodText: {
        fontSize: 16,
        color: colors.black,
    },
    selectedPeriodText: {
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

export default DateFilterBottomSheet; 