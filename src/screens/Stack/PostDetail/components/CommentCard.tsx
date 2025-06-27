import { HeartIcon, UserIcon } from "@/assets";
import { Typography } from "@/components";
import { colors } from "@/constants";
import { Comment } from "@/models";
import { updateCommentLike } from "@/services";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useUserValue } from "@/lib";

interface CommentCardProps {
    item: Comment;
    postUid: string;
    onCommentUpdate?: () => void;
}

const CommentCard = ({ item, postUid, onCommentUpdate }: CommentCardProps) => {
    const user = useUserValue();

    const handleLikeComment = async () => {
        if (!user?.id) return;
        
        const currentLikes = item.likes || [];
        const hasLiked = currentLikes.includes(user.id);
        
        let updatedLikes: string[];
        
        if (hasLiked) {
            // 좋아요 취소
            updatedLikes = currentLikes.filter(like => like !== user.id);
        } else {
            // 좋아요 추가
            updatedLikes = [...currentLikes, user.id];
        }
        
        const success = await updateCommentLike(postUid, item.uid, updatedLikes);
        
        if (success) {
            // 부모 컴포넌트에 업데이트 알림
            if (onCommentUpdate) {
                onCommentUpdate();
            }
        }
    }

    const isLiked = item.likes?.includes(user?.id || '');
    const likeCount = item.likes?.length || 0;

    return (
        <View style={styles.container}>
            <View style={styles.commentHeader}>
                <View style={styles.commentHeaderLeft}>
                    {item.profileImage ? 
                        <Image source={{ uri: item.profileImage }} style={styles.commentHeaderImage} /> : 
                        <UserIcon width={20} height={20} color={colors.gray300} style={styles.commentHeaderImage} />
                    }
                </View>
                <View>
                    <Typography style={styles.commentNicknameText}>{item.nickname}</Typography>
                    <Typography style={styles.commentText}>{item.createdAt}</Typography>
                </View>
            </View>
            <Typography style={styles.commentContentText}>{item.content}</Typography>
            <View style={styles.commentFooter}>
                <TouchableOpacity style={styles.commentFooterLikeButton} onPress={handleLikeComment}>
                    <HeartIcon width={14} height={14} color={isLiked ? colors.red : colors.gray500} fill={isLiked ? colors.red : 'none'} />
                    <Typography style={styles.commentFooterLikeText}>{likeCount}</Typography>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({  
    container: {
        gap: 10,
        marginVertical: 20,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    commentHeaderLeft: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderRadius: 100,
        backgroundColor: colors.gray150,
    },
    commentHeaderImage: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    commentNicknameText: {
        fontSize: 14,
        lineHeight: 14,
    },
    commentText: {
        fontSize: 10,
        color: colors.gray500,
    },
    commentContentText: {
        fontSize: 12,
        color: colors.gray600,
    },
    commentFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    commentFooterLikeButton: {  
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    commentFooterLikeText: {
        fontSize: 12,
        color: colors.gray500,
    },

})

export default CommentCard;