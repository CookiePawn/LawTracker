import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { BillScheduleList, Calendar } from '@/components';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
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
});

export default App;

