import { colors } from '@/constants';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';

const LawDetail = ({ route }: { route: RouteProp<RootStackParamList, 'LawDetail'> }) => {
    const { law } = route.params;

    return (
        <View style={styles.container}>
            <Text>{law.TITLE}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    }
})

export default LawDetail;

