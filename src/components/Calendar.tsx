import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Law } from '@/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '@/constants';

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

  const [isActive, setIsActive] = useState<string[]>([]);

  useEffect(() => {
    const loadLawsList = async () => {
      const laws = await AsyncStorage.getItem(STORAGE_KEY.CALENDAR);
      setIsActive(laws ? JSON.parse(laws) : []);
    };
    loadLawsList();
  }, []);

  const datesWithBills = useMemo(() => {
    const billDates = new Set<string>();
    isActive.forEach(date => {
      if (date) {
        billDates.add(date);
      }
    });
    return billDates;
  }, [isActive]);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);

    for (let i = 0; i < 60; i++) {
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
    const dateStr = `${date.getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasBill = datesWithBills.has(dateStr);
    return { month, day, dayOfWeek, hasBill };
  };

  const calculateScrollPosition = (date: Date) => {
    const index = dates.findIndex(d => d.toDateString() === date.toDateString());
    if (index === -1) return 0;
    
    const centerPosition = (screenWidth - totalItemWidth) / 2;
    const targetPosition = Math.max(0, (index * totalItemWidth) - centerPosition + 10);
    return targetPosition;
  };

  const scrollToDate = (date: Date) => {
    if (!scrollViewRef.current) return;
    
    const targetPosition = calculateScrollPosition(date);
    scrollViewRef.current.scrollTo({
      x: targetPosition,
      animated: true
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
    scrollToDate(date);
  };

  const initialScrollPosition = useMemo(() => {
    const initialDate = propSelectedDate || new Date();
    return calculateScrollPosition(initialDate);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="normal"
        contentOffset={{ x: initialScrollPosition, y: 0 }}
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
    position: 'relative',
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
    position: 'absolute',
    bottom: 5,
  },
  selectedDot: {
    backgroundColor: '#fff',
  },
});

export default Calendar; 