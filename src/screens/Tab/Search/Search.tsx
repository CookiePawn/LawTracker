import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { colors } from '@/constants';
import { ChevronLeftIcon, SearchIcon } from '@/assets';
import bills from '../../../components/nqfvrbsdafrmuzixe.json';
import { Nqfvrbsdafrmuzixe, BillStatus } from '@/types';

const Search = () => {
    const [selectedFilter, setSelectedFilter] = useState<string>('전체');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBills = useMemo(() => {
        return bills
            .filter((bill) => {
                const searchLower = searchQuery.toLowerCase();
                const titleMatch = bill.BILL_NM.toLowerCase().includes(searchLower);
                const proposerMatch = bill.BILL_NM.toLowerCase().includes(searchLower);
                const committeeMatch = bill.COMMITTEE?.toLowerCase().includes(searchLower);
                
                return titleMatch || proposerMatch || committeeMatch;
            })
            .sort((a, b) => new Date(b.DT).getTime() - new Date(a.DT).getTime()) as Nqfvrbsdafrmuzixe[];
    }, [searchQuery]);

    const renderBillItem = ({ item }: { item: Nqfvrbsdafrmuzixe }) => {
        const [title, proposer] = item.BILL_NM.split('(');
        const cleanProposer = proposer?.replace(')', '');

        return (
            <View style={styles.lawItem}>
                <View style={styles.lawItemHeader}>
                    <Text style={styles.lawItemDate}>{item.DT}</Text>
                    <Text style={styles.lawItemProposer}>발의자: {cleanProposer.length > 15 ? cleanProposer.slice(0, 15) + '...' : cleanProposer}</Text>
                </View>
                <Text
                    style={styles.lawTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >{title}</Text>
                <View style={styles.lawItemTagContent}>
                    <Text style={styles.lawItemTagText}>{item.BILL_KIND}</Text>
                    <Text style={[styles.lawItemTagText,
                    {
                        backgroundColor:
                            item.ACT_STATUS === BillStatus.MEETING ? '#EFF6FF' :
                                item.ACT_STATUS === BillStatus.APPROVAL ? '#CAFFE0' :
                                    item.ACT_STATUS === BillStatus.PROCESSING ? '#FFDAB1' :
                                        item.ACT_STATUS === BillStatus.GOVERNMENT_TRANSFER ? '#E7BEFF' :
                                            item.ACT_STATUS === BillStatus.COMMITTEE_MEETING ? '#92A3F8' :
                                                item.ACT_STATUS === BillStatus.VOTE ? '#FFC8C8' :
                                                    item.ACT_STATUS === BillStatus.COMMITTEE_REVIEW ? '#EEC979' :
                                                        item.ACT_STATUS === BillStatus.PROMULGATION ? '#A1C3A9' :
                                                            item.ACT_STATUS === BillStatus.INTRODUCTION ? '#FDF9D1' :
                                                                item.ACT_STATUS === BillStatus.SUBMISSION ? '#FF7DFD' : '#DFDFDF'
                    },
                    {
                        color:
                            item.ACT_STATUS === BillStatus.MEETING ? '#519AFA' :
                                item.ACT_STATUS === BillStatus.APPROVAL ? '#6CC58B' :
                                    item.ACT_STATUS === BillStatus.PROCESSING ? '#DE9440' :
                                        item.ACT_STATUS === BillStatus.GOVERNMENT_TRANSFER ? '#B04DEA' :
                                            item.ACT_STATUS === BillStatus.COMMITTEE_MEETING ? '#3756F0' :
                                                item.ACT_STATUS === BillStatus.VOTE ? '#DE3939' :
                                                    item.ACT_STATUS === BillStatus.COMMITTEE_REVIEW ? '#BD8E29' :
                                                        item.ACT_STATUS === BillStatus.PROMULGATION ? '#088B24' :
                                                            item.ACT_STATUS === BillStatus.INTRODUCTION ? '#DCAE46' :
                                                                item.ACT_STATUS === BillStatus.SUBMISSION ? '#CD16CA' : '#B1B1B1'
                    }
                    ]}>{item.ACT_STATUS}</Text>
                </View>
                <Text style={styles.lawItemCommitteeText}>{item.COMMITTEE || '-'}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>법안 검색</Text>
            </View>
            {/* 검색 헤더 */}
            <View style={styles.searchHeader}>
                <View style={styles.searchBar}>
                    <SearchIcon width={18} height={18} color={colors.gray500} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="법안명, 발의자, 위원회 검색"
                        placeholderTextColor={colors.gray500}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* 필터 섹션 */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
            >
                <TouchableOpacity style={[styles.filterChip, selectedFilter === '전체' && styles.selectedFilter]} onPress={() => setSelectedFilter('전체')}>
                    <Text style={[styles.filterText, selectedFilter === '전체' && styles.selectedFilterText]}>전체</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterChip, selectedFilter === '기간' && styles.selectedFilter]} onPress={() => setSelectedFilter('기간')}>
                    <Text style={[styles.filterText, selectedFilter === '기간' && styles.selectedFilterText]}>기간</Text>
                    <ChevronLeftIcon width={12} height={12} color={colors.gray500} style={styles.filterIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterChip, selectedFilter === '의안구분' && styles.selectedFilter]} onPress={() => setSelectedFilter('의안구분')}>
                    <Text style={[styles.filterText, selectedFilter === '의안구분' && styles.selectedFilterText]}>의안구분</Text>
                    <ChevronLeftIcon width={12} height={12} color={colors.gray500} style={styles.filterIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterChip, selectedFilter === '상태' && styles.selectedFilter]} onPress={() => setSelectedFilter('상태')}>
                    <Text style={[styles.filterText, selectedFilter === '상태' && styles.selectedFilterText]}>상태</Text>
                    <ChevronLeftIcon width={12} height={12} color={colors.gray500} style={styles.filterIcon} />
                </TouchableOpacity>
            </ScrollView>

            {/* 법안 리스트 */}
            <FlatList
                style={styles.billList}
                data={filteredBills}
                ItemSeparatorComponent={() => <View style={styles.billItemSeparator} />}
                renderItem={renderBillItem}
                keyExtractor={(_, index) => index.toString()}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    searchHeader: {
        padding: 16,
        backgroundColor: colors.white,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.gray100,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 13,
        color: colors.black,
    },
    filterContainer: {
        maxHeight: 40,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
    },
    filterChip: {
        height: 30,
        backgroundColor: colors.gray100,
        borderRadius: 100,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 12,
        paddingRight: 8,
        flexDirection: 'row',
        gap: 2,
    },
    filterText: {
        color: colors.black,
        fontSize: 12,
    },
    filterIcon: { 
        transform: [{ rotate: '270deg' }],
    },
    selectedFilter: {
        backgroundColor: colors.primary,
    },
    selectedFilterText: {
        color: colors.white,
    },
    billList: {
        flex: 1,
        padding: 16,
    },
    billItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
    },
    billItemSeparator: {
        height: 1,
        marginVertical: 10,
        borderBottomColor: colors.gray100,
        borderBottomWidth: 1,
    },
    lawItem: {

    },
    lawTitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
    },
    lawInfo: {
        fontSize: 12,
        color: '#666',
    },
    lawItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    lawItemDate: {
        fontSize: 12,
        color: colors.gray500,
    },
    lawItemProposer: {
        fontSize: 12,
        color: colors.gray500,
    },
    lawItemTagContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    lawItemTagText: {
        fontSize: 10,
        color: colors.gray500,
        borderRadius: 100,
        paddingHorizontal: 7,
        paddingVertical: 3,
        backgroundColor: colors.gray100,
    },
    lawItemCommitteeText: {
        fontSize: 12,
        color: colors.gray500,
        marginTop: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 14,
        color: colors.gray500,
    },
});

export default Search;


