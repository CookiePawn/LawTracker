import { PostCard, Typography } from "@/components";
import { CommunityPost } from "@/models";
import { getCommunityPosts } from "@/services/firebase/community";
import { FlatList, StyleSheet, View } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import { useUser } from "@/lib";
import { colors } from "@/constants";

const MyPost = () => {
    const [user] = useUser();
    const [posts, setPosts] = useState<CommunityPost[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const posts = await getCommunityPosts(user?.id);
            setPosts(posts);
        };
        fetchPosts();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={({ item }: { item: CommunityPost }) => <PostCard item={item} />}
                keyExtractor={(item) => item.uid}
                ListEmptyComponent={<Typography style={styles.emptyText}>게시글이 없습니다.</Typography>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.gray500,
        marginTop: 150,
    },
});

export default MyPost;
