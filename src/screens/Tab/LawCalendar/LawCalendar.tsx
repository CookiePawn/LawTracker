import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { BillScheduleList, Calendar, FullCalendar, Typography } from '@/components';
import { CalendarIcon } from '@/assets';

const LawCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFullCalendar, setIsFullCalendar] = useState(false);

  const handleDateSelect = (date: Date) => {
    // Set the time to noon UTC to avoid timezone issues
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
    setSelectedDate(utcDate);
  };

  const renderHeader = () => (
    <>
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
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.headerText}>오늘의 법안 현황</Typography>
        <TouchableOpacity onPress={() => setIsFullCalendar(!isFullCalendar)}>
          <CalendarIcon width={20} height={20} />
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.content}
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <BillScheduleList
            selectedDate={selectedDate}
          />
        }
      />
    </View>
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

