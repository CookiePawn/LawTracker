import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants';

const Search = () => {
    return (
        <View style={styles.container}>
            <Text>Search</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});

export default Search;


