import React, { useCallback, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
    PanResponder,
} from 'react-native';
import { colors } from '@/constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    height?: number;
}

const BottomSheet = ({ visible, onClose, children, height = SCREEN_HEIGHT * 0.7 }: BottomSheetProps) => {
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // 수직 방향으로의 움직임이 더 클 때만 패닝 처리
                const isVerticalSwipe = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
                const isDownSwipe = gestureState.dy > 0;
                return isVerticalSwipe && isDownSwipe;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > height * 0.3) {
                    closeBottomSheet();
                } else {
                    resetPosition();
                }
            },
        })
    ).current;

    const openBottomSheet = useCallback(() => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
        }).start();
    }, [translateY]);

    const closeBottomSheet = useCallback(() => {
        Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    }, [translateY, onClose]);

    const resetPosition = useCallback(() => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
        }).start();
    }, [translateY]);

    useEffect(() => {
        if (visible) {
            openBottomSheet();
        }
    }, [visible, openBottomSheet]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={closeBottomSheet}
        >
            <TouchableWithoutFeedback onPress={closeBottomSheet}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.bottomSheet,
                                {
                                    height,
                                    transform: [{ translateY }],
                                },
                            ]}
                            {...panResponder.panHandlers}
                        >
                            <View style={styles.handle} />
                            {children}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 12,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: colors.gray200,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 12,
    },
});

export default BottomSheet; 