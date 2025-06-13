import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants';
import BottomSheet from './BottomSheet';
import { Typography } from '@/components';

interface SortBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onApply: (sortType: '최신순' | '조회순') => void;
    currentSort: '최신순' | '조회순';
}

const SortBottomSheet = ({ visible, onClose, onApply, currentSort }: SortBottomSheetProps) => {
    const [selectedSort, setSelectedSort] = useState<'최신순' | '조회순'>(currentSort);

    const sortOptions: { label: string; value: '최신순' | '조회순' }[] = [
        { label: '최신순', value: '최신순' },
        { label: '조회순', value: '조회순' },
    ];

    const handleApply = () => {
        onApply(selectedSort);
        onClose();
    };

    return (
        <BottomSheet visible={visible} onClose={onClose} height={300}>
            <View style={styles.container}>
                <Typography style={styles.title}>정렬</Typography>
                <View style={styles.sortList}>
                    {sortOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.sortItem,
                                selectedSort === option.value && styles.selectedSort,
                            ]}
                            onPress={() => setSelectedSort(option.value)}
                            activeOpacity={0.7}
                        >
                            <Typography
                                style={[
                                    styles.sortText,
                                    selectedSort === option.value && styles.selectedSortText,
                                ]}
                            >
                                {option.label}
                            </Typography>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Typography style={styles.cancelButtonText}>취소</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
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
    sortList: {
        flex: 1,
    },
    sortItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: colors.gray100,
    },
    selectedSort: {
        backgroundColor: colors.primary,
    },
    sortText: {
        fontSize: 16,
        color: colors.black,
    },
    selectedSortText: {
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

export default SortBottomSheet; 