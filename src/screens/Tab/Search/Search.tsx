import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, SafeAreaView, FlatList, Dimensions } from 'react-native';
import { colors } from '@/constants';
import { ChevronLeftIcon, EyeIcon, SearchIcon } from '@/assets';
import { Law, BillStatus } from '@/types';
import DateFilterBottomSheet from '@/components/DateFilterBottomSheet';
import BillTypeBottomSheet from '@/components/BillTypeBottomSheet';
import BillStatusBottomSheet from '@/components/BillStatusBottomSheet';
import SortBottomSheet from '@/components/SortBottomSheet';
import { getViewCount, incrementViewCount } from '@/utils/viewCount';
import { RouteProp } from '@react-navigation/native';
import { RootTabParamList } from '@/types';
import { laws } from '@/constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { BillStatusTag } from '@/components';

interface SearchProps {
    route: RouteProp<RootTabParamList, 'Search'>;
}

const Search = ({ route }: SearchProps) => {
    
    const stackNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { type = 'latest' } = route.params || {};
    const [searchQuery, setSearchQuery] = useState('');
    const [isDateFilterVisible, setIsDateFilterVisible] = useState(false);
    const [isBillTypeFilterVisible, setIsBillTypeFilterVisible] = useState(false);
    const [isStatusFilterVisible, setIsStatusFilterVisible] = useState(false);
    const [isSortFilterVisible, setIsSortFilterVisible] = useState(false);
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [selectedPeriod, setSelectedPeriod] = useState<string>('전체');
    const [selectedBillType, setSelectedBillType] = useState<string>('전체');
    const [selectedStatus, setSelectedStatus] = useState<string>('전체');
    const [selectedFilter, setSelectedFilter] = useState<string>('최신순');
    const [viewCounts, setViewCounts] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        if (type === 'random') {
            setSelectedFilter('조회순');
        } else {
            setSelectedFilter('최신순');
        }
    }, [type]);

    const getFilterText = () => {
        if (selectedFilter === '최신순') return '최신순';
        return `조회순`;
    };

    const getPeriodText = () => {
        if (selectedPeriod === '전체') return '기간';
        return `최근 ${selectedPeriod}`;
    };

    const getBillTypeText = () => {
        if (selectedBillType === '전체') return '의안구분';
        return selectedBillType;
    };

    const getStatusText = () => {
        if (selectedStatus === '전체') return '상태';
        return selectedStatus;
    };

    const filteredBills = useMemo(() => {
        let filtered = laws
            .filter((bill) => {
                const searchLower = searchQuery.toLowerCase();
                const titleMatch = bill.TITLE.toLowerCase().includes(searchLower);
                const proposerMatch = bill.AGENT.toLowerCase().includes(searchLower);
                const committeeMatch = bill.COMMITTEE?.toLowerCase().includes(searchLower);

                // 날짜 필터링
                if (dateRange.start && dateRange.end) {
                    const billDate = new Date(bill.DATE);
                    const startDate = new Date(dateRange.start);
                    const endDate = new Date(dateRange.end);
                    endDate.setHours(23, 59, 59, 999);

                    if (billDate < startDate || billDate > endDate) {
                        return false;
                    }
                }

                // 의안구분 필터링
                if (selectedBillType !== '전체' && bill.TAG !== selectedBillType) {
                    return false;
                }

                // 상태 필터링
                if (selectedStatus !== '전체' && bill.ACT_STATUS !== selectedStatus) {
                    return false;
                }

                return titleMatch || proposerMatch || committeeMatch;
            });

        // 정렬 적용
        if (selectedFilter === '최신순') {
            filtered.sort((a, b) => new Date(b.DATE).getTime() - new Date(a.DATE).getTime());
        } else {
            filtered.sort((a, b) => (viewCounts[b.BILL_ID] || 0) - (viewCounts[a.BILL_ID] || 0));
        }

        return filtered;
    }, [searchQuery, dateRange, selectedBillType, selectedStatus, selectedFilter, viewCounts]);

    const handleDateFilterApply = (startDate: string, endDate: string, period: string) => {
        setDateRange({ start: startDate, end: endDate });
        setSelectedPeriod(period);
    };

    const handleBillTypeApply = (billType: string) => {
        setSelectedBillType(billType);
    };

    const handleStatusApply = (status: string) => {
        setSelectedStatus(status);
    };

    useEffect(() => {
        const loadViewCounts = async () => {
            const counts: { [key: string]: number } = {};
            for (const bill of laws) {
                counts[bill.BILL_ID] = await getViewCount(bill.BILL_ID);
            }
            setViewCounts(counts);
        };
        loadViewCounts();
    }, []);

    const handleBillPress = async (bill: Law) => {
        const newCount = await incrementViewCount(bill.BILL_ID);
        setViewCounts(prev => ({
            ...prev,
            [bill.BILL_ID]: newCount
        }));
        stackNavigation.navigate('LawDetail', { law: bill });
    };

    const renderBillItem = ({ item }: { item: Law }) => {
        return (
            <TouchableOpacity
                style={styles.lawItem}
                onPress={() => handleBillPress(item)}
                activeOpacity={0.7}
            >
                <View style={styles.lawItemHeader}>
                    <Text style={styles.lawItemDate}>{item.DATE}</Text>
                    <Text style={styles.lawItemProposer}>발의자: {item.AGENT.length > 15 ? item.AGENT.slice(0, 15) + '...' : item.AGENT}</Text>
                </View>
                <Text
                    style={styles.lawTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >{item.TITLE}</Text>
                <View style={styles.lawItemTagContent}>
                    <Text style={styles.lawItemTagText}>{item.TAG}</Text>
                    <BillStatusTag status={item.ACT_STATUS} />
                </View>
                <View style={styles.lawItemFooterContainer}>
                    <Text style={styles.lawItemCommitteeText}>{item.COMMITTEE || '-'}</Text>
                    <View style={styles.lawItemFooterIconContainer}>
                        <EyeIcon width={14} height={14} color={colors.gray400} />
                        <Text style={styles.lawItemFooterIconText}>{viewCounts[item.BILL_ID] || 0}</Text>
                    </View>
                </View>
            </TouchableOpacity>
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
            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterChipContainer}
                >
                    <TouchableOpacity
                        style={[styles.filterChip, styles.selectedFilter]}
                        onPress={() => {
                            setIsSortFilterVisible(true);
                        }}
                    >
                        <Text style={[styles.filterText, styles.selectedFilterText]}>
                            {getFilterText()}
                        </Text>
                        <ChevronLeftIcon width={12} height={12} color={colors.gray500} style={styles.filterIcon} />
                    </TouchableOpacity>
                    <View style={styles.filterChipSeparator} />
                    <TouchableOpacity
                        style={[styles.filterChip, selectedBillType === '전체' && selectedPeriod === '전체' && selectedStatus === '전체' && styles.selectedFilter]}
                        onPress={() => {
                            setDateRange({ start: '', end: '' });
                            setSelectedPeriod('전체');
                            setSelectedBillType('전체');
                            setSelectedStatus('전체');
                        }}
                    >
                        <Text style={[styles.filterText, selectedBillType === '전체' && selectedPeriod === '전체' && selectedStatus === '전체' && styles.selectedFilterText]}>전체</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedPeriod !== '전체' && styles.selectedFilter]}
                        onPress={() => {
                            setIsDateFilterVisible(true);
                        }}
                    >
                        <Text style={[styles.filterText, selectedPeriod !== '전체' && styles.selectedFilterText]}>
                            {getPeriodText()}
                        </Text>
                        <ChevronLeftIcon width={12} height={12} color={colors.gray500} style={styles.filterIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedBillType !== '전체' && styles.selectedFilter]}
                        onPress={() => {
                            setIsBillTypeFilterVisible(true);
                        }}
                    >
                        <Text style={[styles.filterText, selectedBillType !== '전체' && styles.selectedFilterText]}>
                            {getBillTypeText()}
                        </Text>
                        <ChevronLeftIcon width={12} height={12} color={colors.gray500} style={styles.filterIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedStatus !== '전체' && styles.selectedFilter]}
                        onPress={() => {
                            setIsStatusFilterVisible(true);
                        }}
                    >
                        <Text style={[styles.filterText, selectedStatus !== '전체' && styles.selectedFilterText]}>
                            {getStatusText()}
                        </Text>
                        <ChevronLeftIcon width={12} height={12} color={colors.gray500} style={styles.filterIcon} />
                    </TouchableOpacity>
                </ScrollView>
            </View>

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

            {/* 기간 필터 바텀 시트 */}
            <DateFilterBottomSheet
                visible={isDateFilterVisible}
                onClose={() => setIsDateFilterVisible(false)}
                onApply={handleDateFilterApply}
            />

            {/* 의안구분 필터 바텀 시트 */}
            <BillTypeBottomSheet
                visible={isBillTypeFilterVisible}
                onClose={() => setIsBillTypeFilterVisible(false)}
                onApply={handleBillTypeApply}
            />

            {/* 상태 필터 바텀 시트 */}
            <BillStatusBottomSheet
                visible={isStatusFilterVisible}
                onClose={() => setIsStatusFilterVisible(false)}
                onApply={handleStatusApply}
            />

            {/* 정렬 필터 바텀 시트 */}
            <SortBottomSheet
                visible={isSortFilterVisible}
                onClose={() => setIsSortFilterVisible(false)}
                onApply={setSelectedFilter}
                currentSort={selectedFilter}
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
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
    },
    filterChipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 8,
    },
    filterChipSeparator: {
        width: 1,
        height: 30,
        backgroundColor: colors.gray200,
    },
    filterChip: {
        height: 30,
        backgroundColor: colors.gray100,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 12,
        paddingRight: 8,
        flexDirection: 'row',
    },
    filterText: {
        color: colors.black,
        fontSize: 12,
        marginRight: 5,
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
        marginBottom: 10,
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
    lawItemFooterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lawItemFooterIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    lawItemFooterIconText: {
        fontSize: 12,
        color: colors.gray400,
    },
});

export default Search;


