import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import bills from './nqfvrbsdafrmuzixe.json';
import { BillStatus, Nqfvrbsdafrmuzixe } from '@/types/bills';
import { LawIcon } from '@/assets';

interface BillScheduleItem extends Nqfvrbsdafrmuzixe {
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

const windowHeight = Dimensions.get('window').height;

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
              { backgroundColor: 
                result === BillStatus.APPROVAL ? '#D8FBE5' : 
                result === BillStatus.COMMITTEE_MEETING ? '#EFF6FF' : 
                result === BillStatus.PROCESSING ? '#FDF9D1' : 
                result === BillStatus.GOVERNMENT_TRANSFER ? '#FDF9D1' : 
                result === BillStatus.COMMITTEE_REVIEW ? '#FDF9D1' : 
                result === BillStatus.PROMULGATION ? '#FDF9D1' : '#FDF9D1' },
              { color: 
                result === BillStatus.APPROVAL ? '#6CC58B' : 
                result === BillStatus.COMMITTEE_MEETING ? '#6A97F6' : 
                result === BillStatus.PROCESSING ? '#DCAE46' : 
                result === BillStatus.GOVERNMENT_TRANSFER ? '#DCAE46' : 
                result === BillStatus.COMMITTEE_REVIEW ? '#DCAE46' : 
                result === BillStatus.PROMULGATION ? '#DCAE46' : '#DCAE46' }
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
  const isToday = selectedDate && selectedDate.toDateString() === new Date().toDateString();

  const filteredBills = (bills as Nqfvrbsdafrmuzixe[]).map(bill => ({
    ...bill,
    time: bill.DT,
    result: bill.ACT_STATUS
  })).filter(bill => {
    if (!selectedDate) return true;
    return bill.DT === selectedDate.toISOString().split('T')[0];
  });

  const renderItem = ({ item: bill }: { item: BillScheduleItem }) => {
    // 법안명에서 괄호 부분을 분리
    const titleMatch = bill.BILL_NM.match(/(.*?)\s*\((.*?)\)/);
    const title = titleMatch ? titleMatch[1].replace(/^\d+\.\s*/, '').trim() : bill.BILL_NM.replace(/^\d+\.\s*/, '').trim();
    const ppsr = titleMatch ? titleMatch[2] : bill.BILL_KIND;

    return (
      <ScheduleItem
        time={bill.time}
        ppsr={ppsr}
        title={title}
        description={bill.COMMITTEE || ''}
        result={bill.result || ''}
      />
    );
  };

  return (
    <>
      {isToday && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ 데이터는 매일 00시에 업데이트됩니다.{'\n'}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;국회 데이터 업로드에 따라 차이가 발생할 수 있습니다.
          </Text>
        </View>
      )}
      <FlatList<BillScheduleItem>
        style={styles.container}
        data={filteredBills}
        renderItem={renderItem}
        keyExtractor={(item) => item.SEQ.toString()}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>해당 날짜의 법안이 없습니다.</Text>
          </View>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    height: windowHeight - 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#bdbdbd',
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
    fontWeight: 500,
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
  warningContainer: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#E65100',
    lineHeight: 18,
  },
});

export default BillScheduleList;