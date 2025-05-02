import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import bills from './bills.json';
import { Bill } from '@/types';
import { LawIcon } from '@/assets';

interface BillScheduleItem extends Bill {
  type: 'JRCMIT' | 'LAW' | 'RGS';
  time: string;
  result: string | null;
}

interface ScheduleItemProps {
  time: string;
  ppsr: string;
  title: string;
  description: string;
  result: string;
}

interface BillScheduleListProps {
  selectedDate?: Date;
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
          {result && (
            <Text style={[
              styles.result, 
              { backgroundColor: result === '수정가결' ? '#D8FBE5' : result === '원안가결' ? '#EFF6FF' : '#FDF9D1' },
              { color: result === '수정가결' ? '#6CC58B' : result === '원안가결' ? '#6A97F6' : '#DCAE46' }
            ]}>{result}</Text>
          )}
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const BillScheduleList: React.FC<BillScheduleListProps> = ({ selectedDate }) => {
  const filteredBills = (bills as Bill[]).flatMap(bill => {
    if (!selectedDate) {
      const items: BillScheduleItem[] = [];
      
      // 소관 위원회
      if (bill.JRCMIT_PROC_DT) {
        items.push({
          ...bill,
          type: 'JRCMIT',
          time: bill.JRCMIT_PROC_DT,
          result: bill.JRCMIT_PROC_RSLT
        });
      }
      
      // 법사위 체계자구심사
      if (bill.LAW_PROC_DT) {
        items.push({
          ...bill,
          type: 'LAW',
          time: bill.LAW_PROC_DT,
          result: bill.LAW_PROC_RSLT
        });
      }
      
      // 본회의 심의
      if (bill.RGS_RSLN_DT) {
        items.push({
          ...bill,
          type: 'RGS',
          time: bill.RGS_RSLN_DT,
          result: bill.RGS_CONF_RSLT
        });
      }
      
      return items;
    }
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const items: BillScheduleItem[] = [];
    
    // JRCMIT 심의
    if (bill.JRCMIT_PROC_DT === dateStr) {
      items.push({
        ...bill,
        type: 'JRCMIT',
        time: bill.JRCMIT_PROC_DT || '',
        result: bill.JRCMIT_PROC_RSLT
      });
    }
    
    // LAW 심의
    if (bill.LAW_PROC_DT === dateStr) {
      items.push({
        ...bill,
        type: 'LAW',
        time: bill.LAW_PROC_DT || '',
        result: bill.LAW_PROC_RSLT
      });
    }
    
    // RGS 심의
    if (bill.RGS_RSLN_DT === dateStr) {
      items.push({
        ...bill,
        type: 'RGS',
        time: bill.RGS_RSLN_DT || '',
        result: bill.RGS_CONF_RSLT
      });
    }
    
    return items;
  });

  const renderItem = ({ item: bill }: { item: BillScheduleItem }) => (
    <ScheduleItem
      time={bill.time}
      ppsr={bill.PPSR}
      title={`${bill.BILL_NM.replace(/^\d+\.\s*/, '').trim()} (${bill.type === 'JRCMIT' ? '소관위' : bill.type === 'LAW' ? '법사위' : '본회의'})`}
      description={bill.JRCMIT_NM || ''}
      result={bill.result || ''}
    />
  );

  return (
    <FlatList<BillScheduleItem>
      style={styles.container}
      data={filteredBills}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>해당 날짜의 법안이 없습니다.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
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
    width: 1,
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