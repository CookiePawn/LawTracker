import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import bills from './bills.json';
import { Bill } from '@/types';

interface ScheduleItemProps {
  time: string;
  ppsr: string;
  title: string;
  description: string;
  result: string;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ time, ppsr, title, description, result }) => (
  <TouchableOpacity style={styles.itemContainer}>
    <View style={styles.timeContainer}>
      <Text style={styles.time}>{time}</Text>
      <Text style={styles.ppsr}>발의자: {ppsr.length > 15 ? ppsr.slice(0, 15) + '...' : ppsr}</Text>
    </View>
    <View style={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.result}>{result}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
    </View>
  </TouchableOpacity>
);

const BillScheduleList: React.FC = () => {
  const billList = useMemo(() => bills as unknown as Bill[], []);

  const renderItem = ({ item: bill }: { item: Bill }) => (
    <ScheduleItem
      time={bill.RGS_RSLN_DT || bill.LAW_PROC_DT || bill.JRCMIT_PROC_DT || bill.PPSL_DT}
      ppsr={bill.PPSR}
      title={bill.BILL_NM.replace(/^\d+\.\s*/, '').split('(')[0].trim()}
      description={bill.JRCMIT_NM}
      result={bill.RGS_CONF_RSLT}
    />
  );

  return (
    <FlatList
      style={styles.container}
      data={billList}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  time: {
    fontSize: 10,
    color: '#000',
    fontWeight: '600',
  },
  ppsr: {
    fontSize: 10,
    color: '#666',
    fontWeight: '400',
  },
  contentContainer: {
    flex: 1,
    paddingRight: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    maxWidth: '80%',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  result: {
    fontSize: 10,
    color: '#666',
    fontWeight: '400',
    backgroundColor: '#0064F',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
  },
  arrowContainer: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 20,
    color: '#666',
    fontWeight: '300',
  },
}); 


export default BillScheduleList;