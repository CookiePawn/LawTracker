import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = 60;
  const itemMargin = 5;
  const totalItemWidth = itemWidth + (itemMargin * 2);

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
    return { month, day, dayOfWeek };
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
          const { month, day, dayOfWeek } = formatDate(date);
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
});

export default Calendar; 