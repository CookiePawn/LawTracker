import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography, PostCard } from '@/components';
import { colors } from '@/constants';
import { PenIcon } from '@/assets';
import { useCallback, useEffect, useState } from 'react';
import { getCommunityPosts, migrateLikeCount } from '@/services';
import { CommunityPost } from '@/models';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { StackNavigationProp } from '@react-navigation/stack';

const Community = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [selectedCategory, setSelectedCategory] = useState('최신순');
    const [data, setData] = useState<CommunityPost[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async (isRefresh: boolean = false) => {
        if (loading) return;
        
        setLoading(true);
        try {
            const orderByField = selectedCategory === '최신순' ? 'createdAt' : 'likes';
            const result = await getCommunityPosts(undefined, undefined, 10, isRefresh ? null : lastDoc, orderByField);
            
            if (result && 'posts' in result && 'lastDoc' in result && 'hasMore' in result) {
                if (isRefresh) {
                    setData(result.posts);
                    setLastDoc(result.lastDoc);
                    setHasMore(result.hasMore);
                } else {
                    setData(prev => [...prev, ...result.posts]);
                    setLastDoc(result.lastDoc);
                    setHasMore(result.hasMore);
                }
            }
        } catch (error) {
            console.error('데이터 로드 오류:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData(true);
        }, [selectedCategory])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData(true);
        setRefreshing(false);
    };

    const onEndReached = () => {
        if (hasMore && !loading) {
            fetchData();
        }
    };

    const handleVoteUpdate = async (postUid: string, updatedVotes: string[]) => {
        // 데이터 새로 패치
        await fetchData(true);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    // 마이그레이션 실행 (한 번만)
    useEffect(() => {
        migrateLikeCount();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography style={styles.headerTitle}>커뮤니티</Typography>
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('PostWrite')}>
                    <PenIcon width={14} height={14} fill={colors.white} color={colors.white} />
                    <Typography style={styles.headerButtonText}>글쓰기</Typography>
                </TouchableOpacity>
            </View>
            <View style={styles.categoryContainer}>
                <TouchableOpacity style={[styles.categoryItem, selectedCategory === '최신순' && styles.selectedCategoryItem]} onPress={() => handleCategoryChange('최신순')}>
                    <Typography style={[styles.categoryItemText, selectedCategory === '최신순' && styles.selectedCategoryItemText]}>최신순</Typography>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.categoryItem, selectedCategory === '인기순' && styles.selectedCategoryItem]} onPress={() => handleCategoryChange('인기순')}>
                    <Typography style={[styles.categoryItemText, selectedCategory === '인기순' && styles.selectedCategoryItemText]}>인기순</Typography>
                </TouchableOpacity>
            </View>
            <FlatList
                data={data}
                style={styles.list}
                keyExtractor={item => item.uid}
                renderItem={({ item }) => <PostCard item={item} onVoteUpdate={handleVoteUpdate} />}
                ListEmptyComponent={<Typography style={styles.emptyText}>게시글이 없습니다.</Typography>}
                ListFooterComponent={loading && hasMore ? <Typography style={styles.loadingText}>로딩 중...</Typography> : null}
                contentContainerStyle={styles.postContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    headerButtonText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    categoryContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    categoryItem: {
        backgroundColor: colors.gray100,
        paddingHorizontal: 15,
        paddingVertical: 4,
        borderRadius: 10,
    },
    categoryItemText: {
        fontSize: 12,
        color: colors.gray500,
    },
    selectedCategoryItem: {
        backgroundColor: colors.primary,
        color: colors.white,
    },
    selectedCategoryItemText: {
        color: colors.white,
    },
    postContainer: {
        gap: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.gray500,
        marginTop: 150,
    },
    list: {
        marginBottom: 20,
    },
    loadingText: {
        textAlign: 'center',
        color: colors.gray500,
        marginTop: 10,
    },
});

export default Community;