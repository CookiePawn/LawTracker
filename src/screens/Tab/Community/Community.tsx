import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '@/components';
import { colors } from '@/constants';
import { PenIcon } from '@/assets';

const Community = () => {
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Typography style={styles.headerTitle}>커뮤니티</Typography>
            <TouchableOpacity style={styles.headerButton}>
              <PenIcon width={16} height={16} fill={colors.white} color={colors.white} />
              <Typography style={styles.headerButtonText}>글쓰기</Typography>
            </TouchableOpacity>
        </View>
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
});

export default Community;