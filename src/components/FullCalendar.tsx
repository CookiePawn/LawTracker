import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { ChevronLeftIcon } from '@/assets/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '@/constants';
import { Typography } from '@/components';

interface FullCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const FullCalendar: React.FC<FullCalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const animatedHeight = useState(new Animated.Value(0))[0];
  const [contentHeight, setContentHeight] = useState(0);

  const days = ['일', '월', '화', '수', '목', '금', '토'];

  const [isActive, setIsActive] = useState<string[]>([]);

  useEffect(() => {
    const loadLawsList = async () => {
      const laws = await AsyncStorage.getItem(STORAGE_KEY.CALENDAR);
      setIsActive(laws ? JSON.parse(laws) : []);
    };
    loadLawsList();
  }, []);

  useEffect(() => {
    Animated.spring(animatedHeight, {
      toValue: isModalVisible ? 1 : 0,
      useNativeDriver: false,
      tension: 65,
      friction: 11
    }).start();
  }, [isModalVisible]);

  const datesWithBills = useMemo(() => {
    const billDates = new Set<string>();
    isActive.forEach(date => {
      if (date) {
        billDates.add(date);
      }
    });
    return billDates;
  }, [isActive]);

  const years = Array.from({ length: today.getFullYear() - 2024 + 1 }, (_, i) => 2024 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleYearMonthSelect = () => {
    const newDate = new Date(selectedYear, selectedMonth - 1, 1);
    setCurrentMonth(newDate);
    setIsModalVisible(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    // 이전 달의 날짜들
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthDays - i));
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // 다음 달의 날짜들 (6주를 채우기 위해)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentMonth(newDate);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const daysInMonth = getDaysInMonth(currentMonth);

  // 주 단위로 날짜를 그룹화하고 현재 달의 날짜가 없는 주는 제외
  const weeks = [];
  for (let i = 0; i < daysInMonth.length; i += 7) {
    const week = daysInMonth.slice(i, i + 7);
    const hasCurrentMonthDay = week.some(date => date.getMonth() === currentMonth.getMonth());
    if (hasCurrentMonthDay) {
      weeks.push(week);
    }
  }

  const handleModalOpen = () => {
    setSelectedYear(currentMonth.getFullYear());
    setSelectedMonth(currentMonth.getMonth() + 1);
    setIsModalVisible(!isModalVisible);
  };

  const handleDateSelect = (date: Date) => {
    // 이전 달의 날짜를 클릭한 경우
    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(date);
    }
    onDateSelect(date);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => changeMonth(-1)}
          style={styles.monthButton}
        >
          <ChevronLeftIcon />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.dateSelector}
          onPress={handleModalOpen}
        >
          <Typography style={styles.monthText}>
            {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
          </Typography>
          <ChevronLeftIcon style={{ transform: [{ rotate: !isModalVisible ? '270deg' : '90deg' }], marginLeft: 5 }} width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeMonth(1)}
          style={styles.monthButton}
        >
          <ChevronLeftIcon style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[
        styles.yearMonthSelector,
        {
          height: animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, contentHeight]
          }),
          opacity: animatedHeight,
          transform: [{
            translateY: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [-10, 0]
            })
          }]
        }
      ]}>
        <View 
          style={styles.yearMonthContent}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setContentHeight(height);
          }}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.yearSelector}
          >
            {years.map((year) => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.yearMonthButton,
                  selectedYear === year && styles.selectedYearMonth
                ]}
                onPress={() => setSelectedYear(year)}
              >
                <Typography style={[
                  styles.yearMonthText,
                  selectedYear === year && styles.selectedYearMonthText
                ]}>
                  {year}년
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.monthSelector}
          >
            {months.map((month) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.yearMonthButton,
                  selectedMonth === month && styles.selectedYearMonth
                ]}
                onPress={() => setSelectedMonth(month)}
              >
                <Typography style={[
                  styles.yearMonthText,
                  selectedMonth === month && styles.selectedYearMonthText
                ]}>
                  {month}월
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleYearMonthSelect}
          >
            <Typography style={styles.confirmButtonText}>확인</Typography>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.daysHeader}>
        {days.map((day, index) => (
          <Typography
            key={day}
            style={[
              styles.dayHeader,
              index === 0 && styles.sunday,
              index === 6 && styles.saturday
            ]}
          >
            {day}
          </Typography>
        ))}
      </View>

      <View style={styles.daysContainer}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((date) => {
              const dateStr = formatDate(date);
              const isSelected = selectedDate.toDateString() === date.toDateString();
              const isToday = new Date().toDateString() === date.toDateString();
              const hasBill = datesWithBills.has(dateStr);
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const isSunday = date.getDay() === 0;
              const isSaturday = date.getDay() === 6;

              return (
                <TouchableOpacity
                  key={dateStr}
                  style={[
                    styles.dayCell,
                    isSelected && styles.selectedDay,
                    isToday && !isSelected && styles.today
                  ]}
                  onPress={() => handleDateSelect(date)}
                >
                  <Typography
                    style={[
                      styles.dayText,
                      isSunday && styles.sundayText,
                      isSaturday && styles.saturdayText,
                      !isCurrentMonth && styles.otherMonthText,
                      isSelected && styles.selectedText,
                      isToday && !isSelected && styles.todayText
                    ]}
                  >
                    {date.getDate()}
                  </Typography>
                  {hasBill && isCurrentMonth && (
                    <View style={[
                      styles.dot,
                      isSelected && styles.selectedDot,
                      isToday && !isSelected && styles.todayDot
                    ]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 8,
  },
  monthButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthButtonText: {
    fontSize: 20,
    color: '#767676',
    fontWeight: '600',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#D8E4FF',
    borderRadius: 8,
    paddingVertical: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  daysContainer: {
    width: '100%',
  },
  weekRow: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  dayCell: {
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'relative',
    width: `${100 / 7}%`,
    padding: 4,
  },
  dayText: {
    position: 'absolute',
    top: 5,
    left: 10,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  otherMonthText: {
    opacity: 0.5,
  },
  selectedDay: {
    backgroundColor: '#D8E4FF',
    borderRadius: 5,
  },
  selectedText: {

  },
  today: {
    backgroundColor: 'transparent',
  },
  todayText: {
    position: 'absolute',
    top: 5,
    left: 4,
    fontSize: 15,
    color: 'white',
    fontWeight: '500',
    backgroundColor: '#5046E6',
    paddingHorizontal: 6,
    borderRadius: 100,
  },
  sunday: {
    color: '#FF4B4B',
  },
  saturday: {
    color: '#4B4BFF',
  },
  sundayText: {
    color: '#FF4B4B',
  },
  saturdayText: {
    color: '#4B4BFF',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2,
    backgroundColor: '#5046E6',
    position: 'absolute',
    bottom: 6,
    left: '53%',
  },
  selectedDot: {
    backgroundColor: 'white',
  },
  todayDot: {
    backgroundColor: '#5046E6',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearMonthSelector: {
    overflow: 'hidden',
    borderRadius: 8,
    marginBottom: 12,
  },
  yearMonthContent: {
    position: 'absolute',
    width: '100%',
  },
  yearSelector: {
    flexDirection: 'row',
    padding: 8,
    paddingRight: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    padding: 8,
    paddingRight: 16,
  },
  yearMonthButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  selectedYearMonth: {
    backgroundColor: '#5046E6',
    borderColor: '#5046E6',
  },
  yearMonthText: {
    fontSize: 14,
    color: '#495057',
  },
  selectedYearMonthText: {
    color: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: '#5046E6',
    padding: 10,
    margin: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FullCalendar; 