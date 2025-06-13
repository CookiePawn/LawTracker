import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { colors } from '@/constants';
import { ChevronLeftIcon, SearchIcon } from '@/assets';
import { DateFilterBottomSheet, BillTypeBottomSheet, BillStatusBottomSheet, SortBottomSheet } from '@/components';
import { RouteProp } from '@react-navigation/native';
import { RootTabParamList } from '@/types';
import { Typography } from '@/components';
import { Law } from '@/models';
import { searchLaws, loadLatestLaws, loadViewLaws } from '@/services';
import { BillItem } from './components';

interface SearchProps {
    route: RouteProp<RootTabParamList, 'Search'>;
}

const Search = ({ route }: SearchProps) => {
    const { type } = route.params || {};
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [isDateFilterVisible, setIsDateFilterVisible] = useState(false);
    const [isBillTypeFilterVisible, setIsBillTypeFilterVisible] = useState(false);
    const [isStatusFilterVisible, setIsStatusFilterVisible] = useState(false);
    const [isSortFilterVisible, setIsSortFilterVisible] = useState(false);
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [selectedPeriod, setSelectedPeriod] = useState<string>('전체');
    const [selectedBillType, setSelectedBillType] = useState<'전체' | '법률안' | '예산안' | '기타'>('전체');
    const [selectedStatus, setSelectedStatus] = useState<string>('전체');
    const [selectedFilter, setSelectedFilter] = useState<'최신순' | '조회순'>('최신순');
    const [originalResults, setOriginalResults] = useState<Law[]>([]);
    const [searchResults, setSearchResults] = useState<Law[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [lastDoc, setLastDoc] = useState<any>(null);

    // 컴포넌트 마운트 시 초기화
    useEffect(() => {
        const initialFilter = type === 'random' ? '조회순' : '최신순';
        setSelectedFilter(initialFilter);
        setPage(1);
        setHasMore(true);
        setLastDoc(null);
        setOriginalResults([]);
        setSearchResults([]);
        setSearchQuery('');
        setDebouncedSearchQuery('');
        setDateRange({ start: '', end: '' });
        setSelectedPeriod('전체');
        setSelectedBillType('전체');
        setSelectedStatus('전체');
        fetchResults(true);
    }, []);

    // type 변경 시 처리
    useEffect(() => {
        const newFilter = type === 'random' ? '조회순' : '최신순';
        if (selectedFilter !== newFilter) {
            setSelectedFilter(newFilter);
            setPage(1);
            setHasMore(true);
            setLastDoc(null);
            setOriginalResults([]);
            setSearchResults([]);
            fetchResults(true);
        }
    }, [type]);

    const fetchResults = async (isInitial: boolean = false) => {
        if (isLoading || !hasMore) return;
        
        setIsLoading(true);
        try {
            const limit = 10;
            let results: { laws: Law[], lastDoc: any };
            
            if (debouncedSearchQuery) {
                const searchResults = await searchLaws({
                    searchQuery: debouncedSearchQuery,
                });
                results = {
                    laws: searchResults,
                    lastDoc: null
                };
            } else {
                const currentFilter = type === 'random' ? '조회순' : '최신순';
                if (currentFilter === '최신순') {
                    results = await loadLatestLaws(limit, isInitial ? null : lastDoc);
                } else {
                    results = await loadViewLaws(limit, isInitial ? null : lastDoc);
                }
            }

            if (isInitial) {
                setOriginalResults(results.laws);
                setSearchResults(results.laws);
            } else {
                setOriginalResults(prev => [...prev, ...results.laws]);
                setSearchResults(prev => [...prev, ...results.laws]);
            }
            setLastDoc(results.lastDoc);
            setHasMore(results.laws.length === limit);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 검색어로 데이터 가져오기
    useEffect(() => {
        if (debouncedSearchQuery) {
            setPage(1);
            setHasMore(true);
            setLastDoc(null);
            fetchResults(true);
        }
    }, [debouncedSearchQuery]);

    // 필터 변경시 데이터 초기화
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setLastDoc(null);
        fetchResults(true);
    }, [selectedFilter]);

    // 모든 필터 적용
    useEffect(() => {
        let filteredResults = [...originalResults];

        // 기간 필터
        if (dateRange.start !== '' && dateRange.end !== '') {
            filteredResults = filteredResults.filter((law) =>
                law.DATE >= dateRange.start && law.DATE <= dateRange.end
            );
        }

        // 의안구분 필터
        if (selectedBillType !== '전체') {
            filteredResults = filteredResults.filter((law) =>
                law.TAG === selectedBillType
            );
        }

        // 상태 필터
        if (selectedStatus !== '전체') {
            filteredResults = filteredResults.filter((law) =>
                law.ACT_STATUS === selectedStatus
            );
        }

        setSearchResults(filteredResults);
    }, [originalResults, dateRange, selectedBillType, selectedStatus]);

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            setPage(prev => prev + 1);
            fetchResults();
        }
    };

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

    const handleDateFilterApply = (startDate: string, endDate: string, period: string) => {
        setDateRange({ start: startDate, end: endDate });
        setSelectedPeriod(period);
    };

    const handleBillTypeApply = (billType: string) => {
        setSelectedBillType(billType as '전체' | '법률안' | '예산안' | '기타');
    };

    const handleStatusApply = (status: string) => {
        setSelectedStatus(status);
    };

    const handleSearchSubmit = () => {
        setDebouncedSearchQuery(searchQuery);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Typography style={styles.headerText}>법안 검색</Typography>
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
                        onSubmitEditing={handleSearchSubmit}
                        returnKeyType="search"
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
                        <Typography style={[styles.filterText, styles.selectedFilterText]}>
                            {getFilterText()}
                        </Typography>
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
                        <Typography style={[styles.filterText, selectedBillType === '전체' && selectedPeriod === '전체' && selectedStatus === '전체' && styles.selectedFilterText]}>전체</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedPeriod !== '전체' && styles.selectedFilter]}
                        onPress={() => {
                            setIsDateFilterVisible(true);
                        }}
                    >
                        <Typography style={[styles.filterText, selectedPeriod !== '전체' && styles.selectedFilterText]}>
                            {getPeriodText()}
                        </Typography>
                        <ChevronLeftIcon width={12} height={12} color={colors.gray500} style={styles.filterIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedBillType !== '전체' && styles.selectedFilter]}
                        onPress={() => {
                            setIsBillTypeFilterVisible(true);
                        }}
                    >
                        <Typography style={[styles.filterText, selectedBillType !== '전체' && styles.selectedFilterText]}>
                            {getBillTypeText()}
                        </Typography>
                        <ChevronLeftIcon width={12} height={12} color={colors.gray500} style={styles.filterIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedStatus !== '전체' && styles.selectedFilter]}
                        onPress={() => {
                            setIsStatusFilterVisible(true);
                        }}
                    >
                        <Typography style={[styles.filterText, selectedStatus !== '전체' && styles.selectedFilterText]}>
                            {getStatusText()}
                        </Typography>
                        <ChevronLeftIcon width={12} height={12} color={colors.gray500} style={styles.filterIcon} />
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* 법안 리스트 */}
            <FlatList
                style={styles.billList}
                data={searchResults}
                ItemSeparatorComponent={() => <View style={styles.billItemSeparator} />}
                renderItem={({ item }) => <BillItem item={item} />}
                keyExtractor={(_, index) => index.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Typography style={styles.emptyText}>검색 결과가 없습니다</Typography>
                    </View>
                }
                ListFooterComponent={
                    isLoading ? (
                        <View style={styles.loadingContainer}>
                            <Typography style={styles.loadingText}>로딩중...</Typography>
                        </View>
                    ) : null
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
    loadingContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        color: colors.gray500,
    },
});

export default Search;


