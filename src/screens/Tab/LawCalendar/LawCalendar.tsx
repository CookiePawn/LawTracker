import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { BillScheduleList, Calendar } from '@/components';
import { BellIcon } from '@/assets';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>오늘의 법안 현황</Text>
        <BellIcon width={20} height={20} />
      </View>
      <Calendar />
      <BillScheduleList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    marginTop: 16,
    borderRadius: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;

