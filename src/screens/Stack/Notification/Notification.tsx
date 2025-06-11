import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from '@/assets';
import { Typography } from '@/components';

interface NotificationItem {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
}

const NotificationScreen = () => {
  const navigation = useNavigation();

  // 임시 데이터
  const notifications: NotificationItem[] = [
    {
      id: '1',
      title: '법안 심의 일정 알림',
      content: '오늘 14:00에 법사위에서 "개인정보보호법 일부개정법률안"이 심의됩니다.',
      date: '2024-05-02 10:00',
      isRead: false,
    },
    {
      id: '2',
      title: '법안 통과 알림',
      content: '어제 심의된 "공공데이터의 제공 및 이용 활성화에 관한 법률안"이 본회의에서 통과되었습니다.',
      date: '2024-05-01 15:30',
      isRead: true,
    },
  ];

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
      onPress={() => {
        // 알림 상세 페이지로 이동
      }}
    >
      <View style={styles.notificationContent}>
        <Typography style={styles.notificationTitle}>{item.title}</Typography>
        <Typography style={styles.notificationText} numberOfLines={2}>{item.content}</Typography>
        <Typography style={styles.notificationDate}>{item.date}</Typography>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Typography style={styles.headerTitle}>알림</Typography>
        <TouchableOpacity>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography style={styles.emptyText}>알림이 없습니다.</Typography>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  unreadItem: {
    backgroundColor: '#F8F9FF',
    borderColor: '#E6E9FF',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0064FF',
    marginLeft: 8,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#bdbdbd',
  },
});

export default NotificationScreen; 