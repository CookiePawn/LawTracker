import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import bills from './bills.json';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate: propSelectedDate }) => {
  const [selectedDate, setSelectedDate] = useState(propSelectedDate || new Date());
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = 60;
  const itemMargin = 5;
  const totalItemWidth = itemWidth + (itemMargin * 2);

  const datesWithBills = useMemo(() => {
    const billDates = new Set<string>();
    bills.forEach(bill => {
      const date = bill.RGS_RSLN_DT || bill.LAW_PROC_DT || bill.JRCMIT_PROC_DT || bill.PPSL_DT;
      if (date) {
        billDates.add(date);
      }
    });
    return billDates;
  }, []);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30); // 30일 전부터

    for (let i = 0; i < 60; i++) { // 60일치 데이터
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const dates = generateDates();

  const formatDate = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];
    const dateStr = date.toISOString().split('T')[0];
    const hasBill = datesWithBills.has(dateStr);
    return { month, day, dayOfWeek, hasBill };
  };

  const scrollToDate = (date: Date) => {
    const index = dates.findIndex(d => d.toDateString() === date.toDateString());
    if (index !== -1 && scrollViewRef.current) {
      const centerPosition = (screenWidth - totalItemWidth) / 2;
      const targetPosition = (index * totalItemWidth) - centerPosition + 10;
      
      scrollViewRef.current.scrollTo({
        x: targetPosition,
        animated: true
      });
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    scrollToDate(date);
    onDateSelect?.(date);
  };

  const scrollToToday = () => {
    scrollToDate(new Date());
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onLayout={scrollToToday}
        decelerationRate="normal"
      >
        {dates.map((date, index) => {
          const { month, day, dayOfWeek, hasBill } = formatDate(date);
          const isSelected = selectedDate.toDateString() === date.toDateString();
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <TouchableOpacity
              key={index}
              style={[styles.dateItem, isSelected && styles.selectedDate]}
              onPress={() => handleDateSelect(date)}
            >
              <Text style={[
                styles.date,
                isToday && !isSelected && styles.todayText,
                isSelected && styles.selectedText
              ]}>
                {day}
              </Text>
              <Text style={[
                styles.month,
                isToday && !isSelected && styles.todayText,
                isSelected && styles.selectedText
              ]}>
                {month}월
              </Text>
              {hasBill && <View style={[
                styles.dot,
                isSelected && styles.selectedDot
              ]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  dateItem: {
    width: 60,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
  },
  selectedDate: {
    backgroundColor: '#5046E6',
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  month: {
    fontSize: 12,
    color: '#999',
  },
  todayText: {
    color: '#5046E6',
    fontWeight: '600',
  },
  selectedText: {
    color: '#fff',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5046E6',
    marginTop: 4,
  },
  selectedDot: {
    backgroundColor: '#fff',
  },
});

export default Calendar; 