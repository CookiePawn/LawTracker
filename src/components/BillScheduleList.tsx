import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import bills from './bills.json';
import { Bill } from '@/types';
import { LawIcon } from '@/assets';

interface ScheduleItemProps {
  time: string;
  ppsr: string;
  title: string;
  description: string;
  result: string;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ time, ppsr, title, description, result }) => (
  <TouchableOpacity style={styles.itemContainer}>
    <View style={styles.profileContainer}>
      <View style={styles.profileImageContainer}>
        <Image source={LawIcon} style={styles.profileImage} />
      </View>
      <View style={styles.horizontalLine} />
    </View>
    <View style={styles.billContainer}>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.ppsr}>발의자: {ppsr.length > 15 ? ppsr.slice(0, 15) + '...' : ppsr}</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[
            styles.result, 
            { backgroundColor: result === '수정가결' ? '#D8FBE5' : '#EFF6FF' },
            { color: result === '수정가결' ? '#6CC58B' : '#6A97F6' }
            ]}>{result}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
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
    flexDirection: 'row',
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
  },
  horizontalLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#111111',
    marginHorizontal: 10,
  },
  billContainer: {
    flex: 1,
    paddingLeft: 10,
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
    color: '#666',
    fontWeight: '400',
  },
  ppsr: {
    fontSize: 10,
    color: '#666',
    fontWeight: '400',
  },
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    maxWidth: '75%',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  result: {
    height: 20,
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '400',
    backgroundColor: '#0064FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  description: {
    fontSize: 12,
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