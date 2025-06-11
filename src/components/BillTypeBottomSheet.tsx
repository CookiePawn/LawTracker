import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants';
import BottomSheet from './BottomSheet';
import { Typography } from '@/components';

interface BillTypeBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onApply: (billType: string) => void;
}

const BillTypeBottomSheet = ({ visible, onClose, onApply }: BillTypeBottomSheetProps) => {
    const [selectedType, setSelectedType] = useState<string>('전체');

    const billTypes = [
        { label: '전체', value: '전체' },
        { label: '법률안', value: '법률안' },
        { label: '예산안', value: '예산안' },
    ];

    const handleApply = () => {
        onApply(selectedType);
        onClose();
    };

    return (
        <BottomSheet visible={visible} onClose={onClose} height={350}>
            <View style={styles.container}>
                <Typography style={styles.title}>의안구분 선택</Typography>
                <View style={styles.typeList}>
                    {billTypes.map((type) => (
                        <TouchableOpacity
                            key={type.value}
                            style={[
                                styles.typeItem,
                                selectedType === type.value && styles.selectedType,
                            ]}
                            onPress={() => setSelectedType(type.value)}
                            activeOpacity={0.7}
                        >
                            <Typography
                                style={[
                                    styles.typeText,
                                    selectedType === type.value && styles.selectedTypeText,
                                ]}
                            >
                                {type.label}
                            </Typography>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => {
                        setSelectedType('전체');
                        onClose();
                    }}>
                        <Typography style={styles.cancelButtonText}>취소</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.applyButton} onPress={() => {
                        handleApply();
                        setSelectedType('전체');
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
    typeList: {
        flex: 1,
    },
    typeItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: colors.gray100,
    },
    selectedType: {
        backgroundColor: colors.primary,
    },
    typeText: {
        fontSize: 16,
        color: colors.black,
    },
    selectedTypeText: {
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

export default BillTypeBottomSheet; 