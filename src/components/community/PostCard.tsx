import { colors } from '@/constants';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { BillStatusTag, Typography } from '@/components';
import { useCallback, useLayoutEffect, useState } from 'react';
import { loadLawById } from '@/services';
import { ChatIcon, HeartIcon, MoreIcon, ShareIcon } from '@/assets';
import { CommunityPost, Law } from '@/models';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useUserValue } from '@/lib';
import { updateCommunityPostVote, updateCommunityPostLike } from '@/services';
import { MoreBox } from '.';

interface PostCardProps {
    item: CommunityPost;
    border?: boolean;
    onVoteUpdate?: (postUid: string, updatedVotes: string[]) => void;
}

const PostCard = ({ item, border = true, onVoteUpdate }: PostCardProps) => {
    const [bill, setBill] = useState<Law | null>(null);
    const [showMoreBox, setShowMoreBox] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const user = useUserValue();

    useLayoutEffect(() => {
        const fetchBill = async () => {
            if (item.billID) {
                const bill = await loadLawById(item.billID);
                setBill(bill);
            }
        }
        fetchBill();
    }, []);

    useFocusEffect(
        useCallback(() => {
            setShowMoreBox(false);
        }, [])
    );

    const handleMoreIconPress = () => {
        setShowMoreBox(!showMoreBox);
    };

    const handleVote = async (voteIndex: number) => {
        if (!user?.id || !item.vote) return;

        const voteKey = `${user.id}-${voteIndex + 1}`;
        const currentVotes = item.vote.count || [];

        // 현재 사용자가 이미 투표했는지 확인
        const existingVoteIndex = currentVotes.findIndex(vote => vote.startsWith(user.id));

        let updatedVotes: string[];

        if (existingVoteIndex !== -1) {
            // 이미 투표한 경우: 기존 투표 제거 후 새로운 투표 추가
            const votesWithoutUser = currentVotes.filter(vote => !vote.startsWith(user.id));
            updatedVotes = [...votesWithoutUser, voteKey];
        } else {
            // 처음 투표하는 경우: 새로운 투표 추가
            updatedVotes = [...currentVotes, voteKey];
        }

        // Firebase 업데이트
        const success = await updateCommunityPostVote(item.uid, updatedVotes);

        if (success && onVoteUpdate) {
            // 부모 컴포넌트에 업데이트 알림
            onVoteUpdate(item.uid, updatedVotes);
        }
    };

    const handleLike = async () => {
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

        // Firebase 업데이트
        const success = await updateCommunityPostLike(item.uid, updatedLikes);

        if (success && onVoteUpdate) {
            // 부모 컴포넌트에 업데이트 알림 (좋아요도 같은 콜백 사용)
            onVoteUpdate(item.uid, updatedLikes);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, { borderWidth: border ? 1 : 0 }]}
            disabled={!border}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
        >
            <TouchableOpacity style={styles.moreIconContainer} onPress={handleMoreIconPress} hitSlop={10}>
                <MoreIcon width={20} height={20} color={colors.gray300} fill={colors.gray300} />
            </TouchableOpacity>
            {showMoreBox && <MoreBox isUser={user?.id === item.userUid} />}
            <View style={styles.header}>
                <View style={styles.profileContainer}>
                    <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
                    <View style={styles.profileInfo}>
                        <Typography style={styles.nickname}>{item.nickname}</Typography>
                        <Typography style={styles.createdAt}>{item.createdAt.split(' ')[0]} {item.createdAt.split(' ')[1].split('.')[0].slice(0, 5)}</Typography>
                    </View>
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Typography style={styles.title}>{item.title}</Typography>
                <Typography style={styles.content} numberOfLines={border ? 2 : 0}>{item.content}</Typography>
                <View style={styles.tagsContainer}>
                    {item.tags && item.tags.map((tag: string, index: number) => (
                        <View key={index} style={styles.tag}>
                            <Typography style={styles.tagText}>#{tag}</Typography>
                        </View>
                    ))}
                </View>
            </View>
            {item.billID && (
                <TouchableOpacity style={styles.billContainer} onPress={() => bill && navigation.navigate('LawDetail', { law: bill })}>
                    <View style={styles.billTextContainer}>
                        <Typography style={styles.billText}>관련 법안</Typography>
                        <Typography style={styles.billTitle}>{bill?.TITLE}</Typography>
                    </View>
                    <BillStatusTag status={bill?.ACT_STATUS || ''} />
                </TouchableOpacity>
            )}
            {item.vote && (
                <View style={styles.voteContainer}>
                    <Typography style={styles.voteTitle}>{item.vote.title}</Typography>
                    {[item.vote.item1, item.vote.item2, item.vote.item3, item.vote.item4, item.vote.item5]
                        .filter(voteItem => voteItem && voteItem.trim() !== '')
                        .map((voteItem, index) => {
                            const itemVoteCount = item.vote?.count ?
                                item.vote.count.filter(countItem => {
                                    const voteNumber = parseInt(countItem.split('-')[1]);
                                    return voteNumber === index + 1;
                                }).length : 0;

                            const totalVotes = item.vote?.count ? item.vote.count.length : 0;
                            const percentage = totalVotes > 0 ? ((itemVoteCount / totalVotes) * 100).toFixed(1) : '0.0';

                            // 현재 사용자가 이 항목에 투표했는지 확인
                            const userVotedForThis = item.vote?.count?.some(vote =>
                                vote.startsWith(user?.id || '') && vote.endsWith(`-${index + 1}`)
                            );

                            return (
                                <TouchableOpacity
                                    key={`vote-${item.uid}-${index}`}
                                    style={[
                                        styles.voteItemContainer,
                                        userVotedForThis && styles.voteItemSelected
                                    ]}
                                    onPress={() => handleVote(index)}
                                >
                                    <View style={styles.voteItemBackground}>
                                        <View style={[styles.voteItemPercentBar, { width: `${parseFloat(percentage)}%` }]} />
                                    </View>
                                    <View style={styles.voteItemContent}>
                                        <Typography style={styles.voteItemText}>{voteItem}</Typography>
                                        <Typography style={styles.voteItemPercent}>{percentage}%</Typography>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    <Typography style={styles.voteCount}>총 {item.vote?.count && item.vote.count.length || 0}명 참여</Typography>
                </View>
            )}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerItem} onPress={handleLike}>
                    <HeartIcon
                        width={16}
                        height={16}
                        color={item.likes?.includes(user?.id || '') ? colors.red : colors.gray400}
                        fill={item.likes?.includes(user?.id || '') ? colors.red : colors.white}
                    />
                    <Typography style={styles.footerText}>{item.likes ? item.likes.length : 0}</Typography>
                </TouchableOpacity>
                <View style={styles.footerItem}>
                    <ChatIcon width={16} height={16} color={colors.gray200} fill={colors.gray200} />
                    <Typography style={styles.footerText}>{item.comments ? item.comments.length : 0}</Typography>
                </View>
                <TouchableOpacity style={styles.footerItemRight}>
                    <ShareIcon width={14} height={14} color={colors.gray300} fill={colors.gray300} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.gray100,
        gap: 10,
    },
    moreIconContainer: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    profileInfo: {
        flexDirection: 'column',
    },
    nickname: {
        fontSize: 14,
        lineHeight: 20,
    },
    createdAt: {
        fontSize: 10,
        color: colors.gray400,
    },
    contentContainer: {
        gap: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        fontSize: 14,
        color: colors.gray500,
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 5,
        marginTop: 10,
    },
    tag: {
        backgroundColor: colors.gray100,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    tagText: {
        fontSize: 10,
        color: colors.gray500,
    },
    billContainer: {
        backgroundColor: colors.skyblue,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    billTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    billText: {
        fontSize: 11,
        color: colors.primary,
        lineHeight: 16,
    },
    billTitle: {
        fontSize: 12,
    },
    billContent: {
        fontSize: 12,
    },
    voteContainer: {
        backgroundColor: colors.gray50,
        padding: 10,
        borderRadius: 16,
        gap: 10,
    },
    voteTitle: {
        fontSize: 12,
    },
    voteItemContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.gray150,
        borderRadius: 10,
        overflow: 'hidden',
        minHeight: 40,
    },
    voteItemSelected: {
        backgroundColor: colors.skyblue,
    },
    voteItemTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    voteItemText: {
        fontSize: 12,
        color: colors.black,
        flex: 1,
        paddingLeft: 10,
        paddingVertical: 10,
        zIndex: 1,
    },
    voteItemBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: colors.gray150,
        borderRadius: 10,
    },
    voteItemPercentBar: {
        height: '100%',
        backgroundColor: colors.primary,
        opacity: 0.3,
        borderRadius: 10,
    },
    voteItemPercent: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: 'bold',
        paddingRight: 10,
        paddingVertical: 10,
        zIndex: 1,
    },
    voteItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        zIndex: 1,
    },
    voteCount: {
        fontSize: 10,
        color: colors.gray500,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    footerText: {
        fontSize: 12,
        color: colors.gray500,
    },
    footerItemRight: {
        marginLeft: 'auto',
    },
})

export default PostCard;