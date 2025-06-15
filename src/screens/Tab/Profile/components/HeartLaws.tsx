import { Typography, BillStatusTag } from '@/components';
import { colors } from '@/constants/colors';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useUser } from '@/lib';
import { loadLawById, toggleFavoriteLaw } from '@/services';
import { Law } from '@/models';
import { BookmarkIcon, EyeIcon } from '@/assets';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';


const ITEMS_PER_PAGE = 10;

const HeartLaws = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [user, setUser] = useUser();
    const [laws, setLaws] = useState<Law[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadLaws = async (pageNum: number) => {
        if (!user?.FAVORITE_LAWS || loading || !hasMore) return;

        setLoading(true);
        const start = pageNum * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const currentPageLaws = user.FAVORITE_LAWS.slice(start, end);

        if (currentPageLaws.length === 0) {
            setHasMore(false);
            setLoading(false);
            return;
        }

        const newLaws: Law[] = [];
        for (const lawId of currentPageLaws) {
            const isDuplicate = laws.some(law => law.BILL_ID === lawId);
            if (!isDuplicate) {
                const law = await loadLawById(lawId);
                newLaws.push(law);
            }
        }

        setLaws(prev => [...prev, ...newLaws]);
        setPage(pageNum);
        setLoading(false);
    };

    useEffect(() => {
        loadLaws(0);
    }, [user?.FAVORITE_LAWS]);

    const handleEndReached = () => {
        if (!loading && hasMore) {
            loadLaws(page + 1);
        }
    };

    const handleHeartPress = async (item: Law) => {
        if (user) {
            await toggleFavoriteLaw(user.id, item.BILL_ID);
            setLaws(laws.filter(law => law.BILL_ID !== item.BILL_ID));
            setUser({ ...user, FAVORITE_LAWS: user.FAVORITE_LAWS?.includes(item.BILL_ID) ? user.FAVORITE_LAWS?.filter(id => id !== item.BILL_ID) : [...(user.FAVORITE_LAWS || []), item.BILL_ID] });
        }
    }

    const renderItem = ({ item }: { item: Law }) => {
        return (
            <View style={styles.item}>
                <TouchableOpacity style={styles.itemBookmarkButton} onPress={() => handleHeartPress(item)}>
                    <BookmarkIcon width={20} height={20} color={colors.gray300} fill={colors.gray300} />
                </TouchableOpacity>
                <View style={styles.itemHeader}>
                    <BillStatusTag status={item.ACT_STATUS} />
                </View>
                <Typography style={styles.itemTitle}>{item.TITLE}</Typography>
                <View style={styles.itemInfo}>
                    <Typography style={styles.itemAgent}>{item.AGENT}</Typography>
                    <Typography style={styles.itemDate}>발의일:{item.DATE}</Typography>
                </View>
                <Typography style={styles.itemSummary} numberOfLines={2}>{item.SUMMARY}</Typography>
                <View style={styles.itemFooter}>
                    <View style={styles.itemFooterLeft}>
                        <EyeIcon width={14} height={14} color={colors.gray500} />
                        <Typography style={styles.itemViewCount}>{item.VIEW_COUNT}</Typography>
                    </View>
                    <TouchableOpacity style={styles.itemFavoriteButton} onPress={() => {
                        navigation.navigate('LawDetail', {
                            law: item,
                        });
                    }}>
                        <Typography style={styles.itemFavoriteButtonText}>자세히 보기</Typography>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <FlatList
            style={styles.list}
            data={laws}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Typography>관심 법안이 없습니다.</Typography>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 16,
    },
    separator: {
        height: 12,
    },
    item: {
        padding: 10,
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: 16,
    },
    itemBookmarkButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    itemHeader: {
        flexDirection: 'row',
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 6
    },
    itemDate: {
        fontSize: 10,
        color: colors.gray500,
    },
    itemAgent: {
        fontSize: 10,
        color: colors.gray500,
    },
    itemInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemSummary: {
        fontSize: 12,
        color: colors.gray700,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemFooterLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    itemViewCount: {
        fontSize: 11,
        color: colors.gray500,
    },
    itemFavoriteButton: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 5,
        backgroundColor: colors.skyblue,
    },
    itemFavoriteButtonText: {
        fontSize: 12,
        color: colors.primary,
    },
    emptyContainer: {
        flex: 1,
        minHeight: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HeartLaws;