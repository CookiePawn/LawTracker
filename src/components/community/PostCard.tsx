import { colors } from '@/constants';
import { View, StyleSheet, Image } from 'react-native';
import { Typography } from '@/components';
import { useLayoutEffect, useState } from 'react';
import { fetchBillDetail } from '@/services';

interface PostCardProps {
    item: any;
}

const PostCard = ({ item }: PostCardProps) => {
    const [bill, setBill] = useState<any>(null);

    useLayoutEffect(() => {
        const fetchBill = async () => {
            const bill = await fetchBillDetail(item.billID);
            console.log(bill);
        }
        fetchBill();
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileContainer}>
                    <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
                    <View style={styles.profileInfo}>
                        <Typography style={styles.nickname}>{item.nickname}</Typography>
                        <Typography style={styles.createdAt}>{item.createdAt.split('T')[0]} {item.createdAt.split('T')[1].split('.')[0].slice(0, 5)}</Typography>
                    </View>
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Typography style={styles.title}>{item.title}</Typography>
                <Typography style={styles.content} numberOfLines={2}>{item.content}</Typography>
                <View style={styles.tagsContainer}>
                    {item.tags.map((tag: string) => (
                        <View style={styles.tag}>
                            <Typography style={styles.tagText}>{tag}</Typography>
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.billContainer}>

            </View>
        </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
})

export default PostCard;