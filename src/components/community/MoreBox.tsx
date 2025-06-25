import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "@/components";
import { colors } from "@/constants";

interface MoreBoxProps {
    isUser: boolean;
}

const MoreBox = ({ isUser }: MoreBoxProps) => {
    return (
        <View style={styles.container}>
            {isUser ? (
                <>
                    <TouchableOpacity style={styles.item}>
                        <Typography style={styles.itemText}>수정</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Typography style={styles.itemText}>삭제</Typography>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity style={styles.item}>
                        <Typography style={styles.itemText}>신고</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Typography style={styles.itemText}>차단</Typography>
                    </TouchableOpacity>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 80,
        position: 'absolute',
        top: 40,
        right: 16,
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray200,
        zIndex: 1000,
    },
    item: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray100,
    },
    itemText: {
        fontSize: 14,
        color: colors.gray700,
    }
})

export default MoreBox;