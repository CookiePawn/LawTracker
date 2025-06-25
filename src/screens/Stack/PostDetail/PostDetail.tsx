import { FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types";
import { PostCard, Typography } from "@/components";
import { getCommunityPosts } from "@/services";
import { useEffect, useState } from "react";
import { Comment, CommunityPost } from "@/models";
import { colors } from "@/constants";
import { ArrowLeftIcon, ChevronLeftIcon } from "@/assets";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommentCard } from "./components";

interface PostDetailProps {
    route: RouteProp<RootStackParamList, 'PostDetail'>;
}

const PostDetail = ({ route }: PostDetailProps) => {
    const { post: routePost } = route.params;
    const [post, setPost] = useState<CommunityPost>(routePost);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const fetchedPost = await getCommunityPosts(undefined, routePost.uid);
                if (fetchedPost) {
                    setPost(fetchedPost as CommunityPost);
                }
            } catch (error) {
                console.error('게시글을 불러오는데 실패했습니다:', error);
            }
        };
        fetchPost();
    }, [routePost.uid]);

    const handleVoteUpdate = async (postUid: string, updatedVotes: string[]) => {
        // 게시글 새로 패치
        try {
            const fetchedPost = await getCommunityPosts(undefined, postUid);
            if (fetchedPost) {
                setPost(fetchedPost as CommunityPost);
            }
        } catch (error) {
            console.error('게시글을 불러오는데 실패했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon width={24} height={24} color={colors.gray700} />
                </TouchableOpacity>
                <Typography style={styles.headerText}>뒤로가기</Typography>
            </View>
            <ScrollView>
                <PostCard item={post} border={false} onVoteUpdate={handleVoteUpdate} />
                <View style={styles.commentContainer}>
                    <View style={styles.commentHeader}>
                        <Typography style={styles.commentHeaderText}>댓글 {post.comments ? Object.keys(post.comments).length : 0}개</Typography>
                        <TouchableOpacity style={styles.commentHeaderSortContainer}>
                            <Typography style={styles.commentHeaderSort}>최신순</Typography>
                            <ChevronLeftIcon width={16} height={16} color={colors.primary} style={{ transform: [{ rotate: '270deg' }] }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.commentInputContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="댓글을 입력하세요"
                            placeholderTextColor={colors.gray400}
                        />
                        <TouchableOpacity style={styles.commentInputButton}>
                            <Typography style={styles.commentInputButtonText}>등록</Typography>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        scrollEnabled={false}
                        data={post.comments ? 
                            Object.values(post.comments).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : 
                            []
                        }
                        renderItem={({ item }: { item: Comment }) => <CommentCard item={item} postUid={post.uid} />}
                        keyExtractor={(item) => item.uid}
                        ListEmptyComponent={<Typography style={styles.commentEmptyText}>댓글이 없습니다.</Typography>}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 16,
    },
    headerText: {
        fontSize: 16,
    },
    commentContainer: {
        padding: 16,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: 12,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    commentInput: {
        flex: 1,
        color: colors.gray700,
    },
    commentInputButton: {
        width: 65,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    commentInputButtonText: {
        color: colors.white,
        fontSize: 12,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    commentHeaderText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    commentHeaderSort: {
        fontSize: 12,
        color: colors.primary,
    },
    commentHeaderSortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentEmptyText: {
        fontSize: 14,
        color: colors.gray400,
        textAlign: 'center',
        marginTop: 150,
    },
});

export default PostDetail;