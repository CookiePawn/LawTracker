import { colors } from '@/constants';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  } from 'react-native';
import { useSetAlert } from '@/lib';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel';
  }>;
}

const { width, height } = Dimensions.get('window');

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons,
}) => {
  if (!visible) return null;
  const setAlert = useSetAlert();

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === 'cancel' ? styles.cancelButton : styles.defaultButton,
                  index > 0 && { marginLeft: 10 },
                ]}
                onPress={() => {
                  button.onPress?.();
                  setAlert({
                    visible: false,
                    title: '',
                    message: '',
                    buttons: [],
                  });
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    button.style === 'cancel'
                      ? styles.cancelButtonText
                      : styles.defaultButtonText,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    width: width,
    height: height * 1.1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.gray500,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  defaultButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.gray200,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  defaultButtonText: {
    color: colors.white,
  },
  cancelButtonText: {
    color: colors.white,
  },
});

export default CustomAlert; 