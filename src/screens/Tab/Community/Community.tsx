import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography, PostCard } from '@/components';
import { colors } from '@/constants';
import { PenIcon } from '@/assets';
import { useEffect, useState } from 'react';
import { getCommunityPosts } from '@/services';
import { CommunityPost } from '@/models';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { StackNavigationProp } from '@react-navigation/stack';

const Community = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [selectedCategory, setSelectedCategory] = useState('최신순');
    const [data, setData] = useState<CommunityPost[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCommunityPosts();
            setData(data as CommunityPost[]);
        }
        fetchData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        const data = await getCommunityPosts();
        setData(data as CommunityPost[]);
        setRefreshing(false);
    }

    const handleVoteUpdate = async (postUid: string, updatedVotes: string[]) => {
        // 데이터 새로 패치
        const data = await getCommunityPosts();
        setData(data as CommunityPost[]);
    };

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
                <TouchableOpacity style={[styles.categoryItem, selectedCategory === '최신순' && styles.selectedCategoryItem]} onPress={() => setSelectedCategory('최신순')}>
                    <Typography style={[styles.categoryItemText, selectedCategory === '최신순' && styles.selectedCategoryItemText]}>최신순</Typography>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.categoryItem, selectedCategory === '인기순' && styles.selectedCategoryItem]} onPress={() => setSelectedCategory('인기순')}>
                    <Typography style={[styles.categoryItemText, selectedCategory === '인기순' && styles.selectedCategoryItemText]}>인기순</Typography>
                </TouchableOpacity>
            </View>
            <FlatList
                data={data}
                style={styles.list}
                keyExtractor={item => item.uid}
                renderItem={({ item }) => <PostCard item={item} onVoteUpdate={handleVoteUpdate} />}
                ListEmptyComponent={<Typography style={styles.emptyText}>게시글이 없습니다.</Typography>}
                contentContainerStyle={styles.postContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
});

export default Community;