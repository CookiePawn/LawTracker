import { Alert, FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BillStatusTag, Typography } from '@/components';
import { colors } from '@/constants';
import { useState } from 'react';
import { SearchIcon } from '@/assets';
import { Law } from '@/models';
import { searchLaws, createCommunityPost } from '@/services';
import { useUserValue } from '@/lib';
import { createUid, getTime } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';

const PostWrite = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const user = useUserValue();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tag, setTag] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [relatedLaw, setRelatedLaw] = useState('');
    const [bill, setBill] = useState<Law | null>(null);
    const [relatedLaws, setRelatedLaws] = useState<Law[]>([]);
    const [isVote, setIsVote] = useState(false);
    const [voteQuestion, setVoteQuestion] = useState('');
    const [voteOptions, setVoteOptions] = useState(['', '']); // 최소 2개 선택지
    const [voteError, setVoteError] = useState('');

    const searchBill = async () => {
        const response = await searchLaws({
            searchQuery: relatedLaw,
        });

        console.log(JSON.stringify(response, null, 2));

        // 중복 제거 (BILL_ID 기준)
        const uniqueLaws = response.filter((law, index, self) =>
            index === self.findIndex(l => l.TITLE === law.TITLE)
        );

        setRelatedLaws(uniqueLaws);
        setBill(null);
        setRelatedLaw('');
    }

    const handleSubmit = async () => {
        // 투표 유효성 검사
        if (isVote && voteQuestion.length > 0) {
            // 투표가 활성화되어 있고 질문이 입력된 경우
            const filledOptions = voteOptions.filter(option => option.trim() !== '');
            
            // 최소 2개 선택지가 필요
            if (filledOptions.length < 2) {
                setVoteError('투표는 최소 2개의 선택지가 필요합니다.');
                return;
            }
            
            // 중간에 빈 선택지가 있는지 확인
            for (let i = 0; i < voteOptions.length; i++) {
                if (voteOptions[i].trim() === '' && i < voteOptions.length - 1) {
                    // 마지막 선택지가 아닌데 빈 선택지가 있으면 중간에 빈 선택지가 있는 것
                    setVoteError('투표 선택지는 순서대로 입력해주세요. 중간에 빈 선택지가 있습니다.');
                    return;
                }
            }
        }

        // 에러가 없으면 초기화
        setVoteError('');

        const formattedDate = getTime();

        const post: any = {
            uid: `postUid_${createUid()}`,
            userUid: user?.id,
            nickname: user?.nickname,
            profileImage: user?.profileImage,
            title: title,
            content: content,
            createdAt: formattedDate,
            updatedAt: formattedDate,
        };

        // undefined가 아닌 필드만 추가
        if (bill?.BILL_ID) {
            post.billID = bill.BILL_ID;
        }
        
        if (tag.length > 0) {
            post.tags = tag;
        }
        
        if (isVote && voteQuestion.length > 0 && voteOptions[0].length > 0 && voteOptions[1].length > 0) {
            const voteData: any = {
                title: voteQuestion,
                item1: voteOptions[0],
                item2: voteOptions[1]
            };
            
            // 선택지 3, 4, 5는 입력된 경우에만 추가
            if (voteOptions[2] && voteOptions[2].trim() !== '') {
                voteData.item3 = voteOptions[2];
            }
            if (voteOptions[3] && voteOptions[3].trim() !== '') {
                voteData.item4 = voteOptions[3];
            }
            if (voteOptions[4] && voteOptions[4].trim() !== '') {
                voteData.item5 = voteOptions[4];
            }
            
            post.vote = voteData;
        }

        const result = await createCommunityPost(post);
        if (result) {
            navigation.navigate('Tab', { screen: 'Community' });
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography style={styles.headerTitle}>새 글 작성</Typography>
            </View>
            <ScrollView>
                <Typography style={styles.title}>제목</Typography>
                <TextInput
                    style={styles.titleInput}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="제목을 입력하세요"
                    placeholderTextColor={colors.gray400}
                    multiline={false}
                />
                {title.length === 0 && <Typography style={styles.errorText}>제목이 입력되지 않았습니다.</Typography>}   
                <Typography style={styles.title}>내용</Typography>
                <TextInput
                    style={styles.contentInput}
                    value={content}
                    onChangeText={setContent}
                    placeholder="내용을 입력하세요"
                    placeholderTextColor={colors.gray400}
                    multiline={true}
                />
                {content.length === 0 && <Typography style={styles.errorText}>내용이 입력되지 않았습니다.</Typography>}   
                <Typography style={styles.title}>태그 선택</Typography>
                <TextInput
                    style={styles.tagInput}
                    value={tagInput}
                    onChangeText={setTagInput}
                    placeholder="태그를 입력하세요 (최대 5개)"
                    placeholderTextColor={colors.gray400}
                    multiline={false}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                        if (tagInput.trim() && tag.length < 5) {
                            setTag([...tag, tagInput.trim()]);
                            setTagInput('');
                        }
                    }}
                />
                <View style={styles.tagContainer}>
                    {tag.map((t, index) => (
                        <TouchableOpacity key={index} style={styles.tagItem} onPress={() => {
                            setTag(tag.filter((_, i) => i !== index));
                        }}>
                            <Typography style={styles.tagItemText}>{t}</Typography>
                        </TouchableOpacity>
                    ))}
                </View>
                <Typography style={styles.title}>관련 법안</Typography>
                <View style={styles.relatedLawContainer}>
                    <TextInput
                        style={styles.relatedLawInput}
                        placeholder="관련 법안을 입력하세요"
                        placeholderTextColor={colors.gray400}
                        value={relatedLaw}
                        onChangeText={setRelatedLaw}
                        onSubmitEditing={searchBill}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={searchBill}>
                        <SearchIcon />
                    </TouchableOpacity>
                </View>
                {!bill && (
                    <FlatList
                        scrollEnabled={false}
                        data={relatedLaws}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.billContainer} onPress={() => setBill(item)}>
                                <View style={styles.billTextContainer}>
                                    <Typography style={styles.billTitle}>{item?.TITLE}</Typography>
                                </View>
                                <BillStatusTag status={item?.ACT_STATUS || ''} />
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                    />
                )}
                {bill && (
                    <TouchableOpacity style={styles.billContainer} onPress={() => setBill(null)}>
                        <View style={styles.billTextContainer}>
                            <Typography style={styles.billText}>선택된 법안</Typography>
                            <Typography style={styles.billTitle}>{bill?.TITLE}</Typography>
                        </View>
                        <BillStatusTag status={bill?.ACT_STATUS || ''} />
                    </TouchableOpacity>
                )}
                <Typography style={styles.title}>투표 추가</Typography>
                {isVote ? (
                    <View style={styles.voteContainer}>
                        <TouchableOpacity style={styles.voteRemoveContainer} onPress={() => {
                            setIsVote(!isVote);
                            setVoteQuestion('');
                            setVoteOptions(['', '']);
                            setVoteError('');
                        }}>
                            <Typography style={styles.voteRemoveText}>투표 제거</Typography>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.voteInput}
                            value={voteQuestion}
                            onChangeText={setVoteQuestion}
                            placeholder="투표 질문"
                            placeholderTextColor={colors.gray500}
                        />
                        {voteOptions.map((option, index) => (
                            <TextInput
                                key={index}
                                style={styles.voteOptionInput}
                                value={option}
                                onChangeText={(text) => {
                                    const newOptions = [...voteOptions];
                                    newOptions[index] = text;
                                    setVoteOptions(newOptions);
                                }}
                                placeholder={`선택지 ${index + 1}`}
                                placeholderTextColor={colors.gray500}
                            />
                        ))}
                        {voteOptions.length < 5 && (
                            <TouchableOpacity
                                style={styles.addOptionButton}
                                onPress={() => setVoteOptions([...voteOptions, ''])}
                            >
                                <Typography style={styles.addOptionText}>선택지 추가</Typography>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <TouchableOpacity style={styles.voteAddContainer} onPress={() => setIsVote(!isVote)}>
                        <Typography style={styles.voteAddText}>+</Typography>
                    </TouchableOpacity>
                )}
                {voteError.length > 0 && <Typography style={styles.errorText}>{voteError}</Typography>}
                <View style={styles.submitContainer}>
                    <TouchableOpacity style={[styles.submitButton, { opacity: title.length === 0 || content.length === 0 ? 0.5 : 1 }]} onPress={handleSubmit} disabled={title.length === 0 || content.length === 0}>
                        <Typography style={styles.submitText}>등록</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                        <Typography style={styles.cancelText}>취소</Typography>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
    },
    header: {
        padding: 16,
        backgroundColor: colors.white,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 14,
        color: colors.gray500,
        marginTop: 16,
    },
    titleInput: {
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: 8,
        padding: 10,
        color: colors.gray500,
    },
    contentInput: {
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: 8,
        padding: 10,
        height: 200,
        textAlignVertical: 'top',
        color: colors.gray500,
    },
    tagInput: {
        backgroundColor: colors.gray100,
        borderRadius: 8,
        padding: 10,
        color: colors.gray500,
        marginBottom: 8,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tagItem: {
        backgroundColor: colors.gray100,
        paddingHorizontal: 10,
        borderRadius: 16,
    },
    tagItemText: {
        fontSize: 14,
        color: colors.gray500,
    },
    relatedLawContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderRadius: 8,
        backgroundColor: colors.gray100,
        marginBottom: 8,
    },
    relatedLawInput: {
        flex: 1,
        padding: 10,
        color: colors.gray500,
    },
    searchButton: {
        padding: 10,
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
    relatedLawList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    relatedLawItem: {
        width: '100%',
        backgroundColor: colors.gray100,
        padding: 10,
        borderRadius: 10,
    },
    relatedLawItemText: {
        fontSize: 12,
    },
    voteContainer: {
        padding: 10,
        backgroundColor: colors.gray100,
        borderRadius: 8,
    },
    voteInput: {
        borderRadius: 8,
        padding: 10,
        color: colors.gray500,
        backgroundColor: colors.white,
        marginBottom: 16,
    },
    voteAddContainer: {
        backgroundColor: colors.gray100,
        borderRadius: 8,
        alignItems: 'center',
    },
    voteAddText: {
        fontSize: 24,
        color: colors.gray500,
    },
    voteRemoveContainer: {
        position: 'absolute',
        right: 0,
        top: -24,
    },
    voteRemoveText: {
        fontSize: 12,
        color: colors.primary,
    },
    voteOptionInput: {
        borderRadius: 8,
        padding: 10,
        color: colors.gray500,
        backgroundColor: colors.white,
        marginBottom: 8,
    },
    addOptionButton: {
        flex: 1,
        backgroundColor: colors.gray300,
        borderRadius: 8,
        alignItems: 'center',
        paddingVertical: 10,
    },
    addOptionText: {
        fontSize: 12,
        color: colors.white,
    },
    submitContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 40,
        gap: 10,
    },
    submitButton: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: colors.gray100,
        padding: 10,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        fontSize: 14,
        color: colors.white,
    },
    cancelText: {
        fontSize: 14,
        color: colors.gray500,
    },
    errorText: {
        fontSize: 12,
        color: colors.red,
    },
});

export default PostWrite;
