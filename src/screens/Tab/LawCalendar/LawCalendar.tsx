import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { BillScheduleList, Calendar, FullCalendar } from '@/components';
import { BellIcon, CalendarIcon } from '@/assets';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';
import { Nqfvrbsdafrmuzixe } from '@/types/bills';
import bills from '@/components/nqfvrbsdafrmuzixe.json';

const LawCalendar = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFullCalendar, setIsFullCalendar] = useState(false);

  const handleDateSelect = (date: Date) => {
    // Set the time to noon UTC to avoid timezone issues
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
    setSelectedDate(utcDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>오늘의 법안 현황</Text>
        <TouchableOpacity onPress={() => setIsFullCalendar(!isFullCalendar)}>
          <CalendarIcon width={20} height={20} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        {isFullCalendar ? (
          <FullCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        ) : (
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        )}

        <BillScheduleList
          selectedDate={selectedDate}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
});

export default LawCalendar;

