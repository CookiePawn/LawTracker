import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants';
import BottomSheet from './BottomSheet';

interface SortBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onApply: (sortType: string) => void;
    currentSort: string;
}

const SortBottomSheet = ({ visible, onClose, onApply, currentSort }: SortBottomSheetProps) => {
    const [selectedSort, setSelectedSort] = useState<string>(currentSort);

    const sortOptions = [
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
                <Text style={styles.title}>정렬</Text>
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
                            <Text
                                style={[
                                    styles.sortText,
                                    selectedSort === option.value && styles.selectedSortText,
                                ]}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
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