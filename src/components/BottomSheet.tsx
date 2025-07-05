import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
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
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    const openBottomSheet = useCallback(() => {
        setIsOverlayVisible(true);
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
        }).start();
    }, [translateY]);

    const closeBottomSheet = useCallback(() => {
        setIsOverlayVisible(false);
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
                <View style={[styles.overlay, { opacity: isOverlayVisible ? 1 : 0 }]}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.bottomSheet,
                                {
                                    height,
                                    transform: [{ translateY }],
                                },
                            ]}
                        >
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