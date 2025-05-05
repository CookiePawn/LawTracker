import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Nqfvrbsdafrmuzixe } from '@/types/bills';
import bills from './nqfvrbsdafrmuzixe.json';

interface FullCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const FullCalendar: React.FC<FullCalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const screenWidth = Dimensions.get('window').width;

  const datesWithBills = new Set<string>();
  (bills as Nqfvrbsdafrmuzixe[]).forEach(bill => {
    if (bill.DT) {
      datesWithBills.add(bill.DT);
    }
  });

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => changeMonth(-1)}
          style={styles.monthButton}
        >
          <Text style={styles.monthButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </Text>
        <TouchableOpacity 
          onPress={() => changeMonth(1)}
          style={styles.monthButton}
        >
          <Text style={styles.monthButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.daysHeader}>
        {days.map((day, index) => (
          <Text
            key={day}
            style={[
              styles.dayHeader,
              index === 0 && styles.sunday,
              index === 6 && styles.saturday
            ]}
          >
            {day}
          </Text>
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
                  onPress={() => onDateSelect(date)}
                >
                  <Text
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
                  </Text>
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
    width: `${100/7}%`,
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
});

export default FullCalendar; 