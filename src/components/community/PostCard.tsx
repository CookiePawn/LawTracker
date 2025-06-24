import { colors } from '@/constants';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { BillStatusTag, Typography } from '@/components';
import { useLayoutEffect, useState } from 'react';
import { loadLawById } from '@/services';
import { ChatIcon, HeartIcon, ShareIcon } from '@/assets';
import { CommunityPost, Law } from '@/models';

interface PostCardProps {
    item: CommunityPost;
}

const PostCard = ({ item }: PostCardProps) => {
    const [bill, setBill] = useState<Law | null>(null);

    useLayoutEffect(() => {
        const fetchBill = async () => {
            const bill = await loadLawById(item.billID);
            setBill(bill);
        }
        fetchBill();
    }, []);


    return (
        <TouchableOpacity style={styles.container}>
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
                <Typography style={styles.content} numberOfLines={2}>{item.content}</Typography>
                <View style={styles.tagsContainer}>
                    {item.tags && item.tags.map((tag: string, index: number) => (
                        <View key={`${tag}-${index}`} style={styles.tag}>
                            <Typography style={styles.tagText}>#{tag}</Typography>
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.billContainer}>
                <View>
                    <Typography style={styles.billText}>관련 법안</Typography>
                    <Typography style={styles.billTitle}>{bill?.TITLE}</Typography>
                </View>
                <BillStatusTag status={bill?.ACT_STATUS || ''} />
            </View>
            <View style={styles.footer}>
                <View style={styles.footerItem}>
                    <HeartIcon width={16} height={16} color={colors.red} fill={colors.red} />
                    <Typography style={styles.footerText}>{item.likes ? item.likes.length : 0}</Typography>
                </View>
                <View style={styles.footerItem}>
                    <ChatIcon width={16} height={16} color={colors.primary} fill={colors.primary} />
                    <Typography style={styles.footerText}>{item.comments ? item.comments.length : 0}</Typography>
                </View>
                <TouchableOpacity style={styles.footerItemRight}>
                    <ShareIcon width={14} height={14} color={colors.primary} fill={colors.primary} />
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