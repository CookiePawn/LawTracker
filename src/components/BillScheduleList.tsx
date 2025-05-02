import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface ScheduleItemProps {
  time: string;
  title: string;
  description: string;
  type: 'hearing' | 'vote' | 'proposal';
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ time, title, description, type }) => (
  <TouchableOpacity style={styles.itemContainer}>
    <View style={styles.timeContainer}>
      <Text style={styles.time}>{time}</Text>
    </View>
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
      <View style={styles.tagContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{type}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const BillScheduleList: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <ScheduleItem
        time="09:30"
        title="디지털 기본법 개정안"
        description="디지털 전환 가속화에 따른 기본권 보장 및 데이터 활용 기반 마련"
        type="hearing"
      />
      <ScheduleItem
        time="11:00"
        title="정보통신기본법 시행령 개정안"
        description="정보 주권 보장 제도를 위한 종합검토체계 검토 회의"
        type="vote"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeContainer: {
    width: 60,
  },
  time: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#6E41E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
  },
}); 


export default BillScheduleList;