import { FlatList, RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types";
import { PostCard, Typography } from "@/components";
import { getCommunityPosts, getComments } from "@/services";
import { useEffect, useState } from "react";
import { Comment, CommunityPost } from "@/models";
import { colors } from "@/constants";
import { ArrowLeftIcon, ChevronLeftIcon } from "@/assets";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommentCard } from "./components";
import { addCommentToPost } from '@/services';
import { createUid, getTime } from '@/utils';
import { useUserValue } from '@/lib';

interface PostDetailProps {
    route: RouteProp<RootStackParamList, 'PostDetail'>;
}

const PostDetail = ({ route }: PostDetailProps) => {
    const { post: routePost } = route.params;
    const [post, setPost] = useState<CommunityPost>(routePost);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [commentInput, setCommentInput] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [lastCommentUid, setLastCommentUid] = useState<string | null>(null);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [totalCommentCount, setTotalCommentCount] = useState(0);
    const user = useUserValue();

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

    const fetchComments = async (isRefresh: boolean = false) => {
        if (commentLoading) return;
        
        setCommentLoading(true);
        try {
            const result = await getComments(post.uid, 10, isRefresh ? undefined : lastCommentUid || undefined);
            
            if (isRefresh) {
                setComments(result.comments);
                setLastCommentUid(result.lastCommentUid);
                setHasMoreComments(result.hasMore);
                setTotalCommentCount(result.totalCount);
            } else {
                setComments(prev => [...prev, ...result.comments]);
                setLastCommentUid(result.lastCommentUid);
                setHasMoreComments(result.hasMore);
            }
        } catch (error) {
            console.error('댓글을 불러오는데 실패했습니다:', error);
        } finally {
            setCommentLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
        fetchComments(true);
    }, [routePost.uid]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPost();
        await fetchComments(true);
        setRefreshing(false);
    };

    const onCommentEndReached = () => {
        if (hasMoreComments && !commentLoading) {
            fetchComments();
        }
    };

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

    const handleCommentUpdate = async () => {
        // 댓글 업데이트 시 댓글 목록 새로고침
        await fetchComments(true);
    };

    const handleAddComment = async () => {
        if (!commentInput.trim()) return;
        if (!user) return;
        setCommentLoading(true);
        const comment: Comment = {
            uid: `commentUid_${createUid()}`,
            nickname: user.nickname,
            profileImage: user.profileImage,
            content: commentInput.trim(),
            createdAt: getTime(),
            likes: [],
            likeCount: 0,
        };
        const result = await addCommentToPost(post.uid, comment);
        if (result) {
            setCommentInput('');
            // 전체 화면 새로고침
            await fetchPost();
            await fetchComments(true);
        }
        setCommentLoading(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon width={24} height={24} color={colors.gray700} />
                </TouchableOpacity>
                <Typography style={styles.headerText}>뒤로가기</Typography>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <PostCard item={post} border={false} onVoteUpdate={handleVoteUpdate} />
                <View style={styles.commentContainer}>
                    <View style={styles.commentHeader}>
                        <Typography style={styles.commentHeaderText}>댓글 {totalCommentCount}개</Typography>
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
                            value={commentInput}
                            onChangeText={setCommentInput}
                            editable={!commentLoading}
                            maxLength={100}
                            multiline={true}
                        />
                        <TouchableOpacity style={styles.commentInputButton} onPress={handleAddComment} disabled={commentLoading || !commentInput.trim()}>
                            <Typography style={styles.commentInputButtonText}>등록</Typography>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        scrollEnabled={false}
                        data={comments}
                        renderItem={({ item }: { item: Comment }) => <CommentCard item={item} postUid={post.uid} onCommentUpdate={handleCommentUpdate} />}
                        keyExtractor={(_, index) => index.toString()}
                        ListEmptyComponent={<Typography style={styles.commentEmptyText}>댓글이 없습니다.</Typography>}
                        ListFooterComponent={commentLoading && hasMoreComments ? <Typography style={styles.commentLoadingText}>로딩 중...</Typography> : null}
                        onEndReached={onCommentEndReached}
                        onEndReachedThreshold={0.5}
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
        alignItems: 'flex-start',
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
        marginTop: 4,
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
    commentLoadingText: {
        fontSize: 12,
        color: colors.primary,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default PostDetail;