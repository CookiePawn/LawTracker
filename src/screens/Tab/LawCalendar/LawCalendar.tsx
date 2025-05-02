import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { BillScheduleList, Calendar } from '@/components';
import { BellIcon } from '@/assets';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';

const LawCalendar = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>오늘의 법안 현황</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <BellIcon width={20} height={20} />
        </TouchableOpacity>
      </View>
      <Calendar 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      <BillScheduleList selectedDate={selectedDate} />
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

export default LawCalendar;

