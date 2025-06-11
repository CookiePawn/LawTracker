import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { RootStackParamList } from '@/types';
import { LawIcon } from '@/assets';
import { AdBanner, BillStatusTag, Typography } from '@/components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { loadLaws } from '@/services';
import { Law } from '@/models';

interface BillScheduleListProps {
  selectedDate?: Date;
}

const windowHeight = Dimensions.get('window').height;

const ScheduleItem: React.FC<{ item: Law }> = ({ item }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('LawDetail', { law: item })}>
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image source={LawIcon} style={styles.profileImage} />
        </View>
        <View style={styles.horizontalLine} />
      </View>
      <View style={styles.billContainer}>
        <View style={styles.timeContainer}>
          <Typography style={styles.time}>{item.DATE}</Typography>
          <Typography style={styles.ppsr}>발의자: {item.AGENT.length > 15 ? item.AGENT.slice(0, 15) + '...' : item.AGENT}</Typography>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Typography style={styles.title}>{item.TITLE}</Typography>
            {item.ACT_STATUS && <BillStatusTag status={item.ACT_STATUS} />}
          </View>
          <Typography style={styles.description} numberOfLines={2}>
            {item.COMMITTEE}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BillScheduleList: React.FC<BillScheduleListProps> = ({ selectedDate }) => {
  const [laws, setLaws] = useState<Law[]>([]);
  const isToday = selectedDate && selectedDate.toDateString() === new Date().toDateString();

  useEffect(() => { 
    const loadLawsSync = async () => {
      const lawList = await loadLaws(selectedDate?.toISOString().split('T')[0]);
      setLaws(lawList);
    };
    loadLawsSync();
  }, [selectedDate]);

  const renderItem = ({ item }: { item: Law }) => {
    return (
      <ScheduleItem
        item={item}
      />
    );
  };

  return (
    <>
      <AdBanner mode='list' />
      {isToday && (
        <View style={styles.warningContainer}>
          <Typography style={styles.warningText}>
            ⚠️ 데이터는 매일 00시에 업데이트됩니다.{'\n'}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;국회 데이터 업로드에 따라 차이가 발생할 수 있습니다.
          </Typography>
        </View>
      )}
      <FlatList
        style={styles.container}
        data={laws}
        renderItem={renderItem}
        keyExtractor={(item) => item.BILL_ID}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography style={styles.emptyText}>해당 날짜의 법안이 없습니다.</Typography>
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