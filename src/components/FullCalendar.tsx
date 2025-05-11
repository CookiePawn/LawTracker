import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { ChevronLeftIcon } from '@/assets/icons';
import { Picker } from '@react-native-picker/picker';
import { laws } from '@/constants';

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

  const days = ['일', '월', '화', '수', '목', '금', '토'];

  const datesWithBills = new Set<string>();
  laws.forEach(bill => {
    if (bill.DATE) {
      datesWithBills.add(bill.DATE);
    }
  });

  const MIN_YEAR = 2024;
  const MIN_MONTH = 5;
  const MAX_YEAR = today.getFullYear();
  const MAX_MONTH = today.getMonth() + 1;
  const years = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const isDateSelectable = (year: number, month: number) => {
    if (year < MIN_YEAR) return false;
    if (year === MIN_YEAR && month < MIN_MONTH) return false;
    if (year > MAX_YEAR) return false;
    if (year === MAX_YEAR && month > MAX_MONTH) return false;
    return true;
  };

  const handleYearMonthSelect = () => {
    if (!isDateSelectable(selectedYear, selectedMonth)) return;
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
    
    // 2024년 5월 이전이나 현재 월 이후로는 이동할 수 없도록 체크
    if (newDate.getFullYear() < MIN_YEAR || 
        (newDate.getFullYear() === MIN_YEAR && newDate.getMonth() + 1 < MIN_MONTH) ||
        newDate.getFullYear() > MAX_YEAR ||
        (newDate.getFullYear() === MAX_YEAR && newDate.getMonth() + 1 > MAX_MONTH)) {
      return;
    }
    
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
    setIsModalVisible(true);
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
          <Text style={styles.monthText}>
            {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
          </Text>
          <ChevronLeftIcon style={{ transform: [{ rotate: '270deg' }], marginTop: 7 }} width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeMonth(1)}
          style={styles.monthButton}
        >
          <ChevronLeftIcon style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>년월 선택</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButton}>닫기</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.pickerContainer}>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={(value: number) => setSelectedYear(value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {years.map((year) => {
                    // 해당 년도에 선택 가능한 월이 있는지 확인
                    const hasSelectableMonth = months.some(month => isDateSelectable(year, month));
                    if (!hasSelectableMonth) return null;
                    
                    return (
                      <Picker.Item 
                        key={year} 
                        label={`${year}년`} 
                        value={year}
                        color="#000"
                      />
                    );
                  })}
                </Picker>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={(value: number) => setSelectedMonth(value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {months.map((month) => {
                    if (!isDateSelectable(selectedYear, month)) return null;
                    
                    return (
                      <Picker.Item 
                        key={month} 
                        label={`${month}월`} 
                        value={month}
                        color="#000"
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleYearMonthSelect}
            >
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                  onPress={() => handleDateSelect(date)}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#5046E6',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderRadius: 8,
  },
  pickerWrapper: {
    width: '49%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    minWidth: 250,
    height: 60,
  },
  pickerItem: {
    fontSize: 16,
    height: 50,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#5046E6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FullCalendar; 