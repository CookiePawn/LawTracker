import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography, PostCard } from '@/components';
import { colors } from '@/constants';
import { PenIcon } from '@/assets';
import { useState } from 'react';

const Community = () => {
    const [selectedCategory, setSelectedCategory] = useState('최신순');

    const data = [
        {
            uid: '1',
            nickname: '홍길동',
            profileImage: 'https://img1.kakaocdn.net/thumb/R640x640.q70/?fname=https://t1.kakaocdn.net/account_images/default_profile.jpeg',
            billID: 'PRC_D2E5D0D5B2C7J1I7J0H3H0G9G2P1P1',
            title: '디지털 플랫폼 규제법에 대한 의견',
            content: '최근 발의된 디지털 플랫폼 규제법에 대해 IT 업계 종사자로서 몇 가지 우려 사항이 있습니다. 특히 스타트업',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            viewCount: 10,
            tags: ['IT/과학', '규제', '스타트업'],
            likes: [
              'userUid_bisju7gopcktd8b9ldbg5ji3mez03n',
            ],
            comments: [
                {
                    uid: '1',
                    content: '디지털 플랫폼 규제법에 대한 의견',
                    createdAt: new Date().toISOString(),
                },
            ],
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography style={styles.headerTitle}>커뮤니티</Typography>
                <TouchableOpacity style={styles.headerButton}>
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
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => <PostCard item={item} />}
                ListEmptyComponent={<Typography style={styles.emptyText}>게시글이 없습니다.</Typography>}
                contentContainerStyle={styles.postContainer}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 20,
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
});

export default Community;