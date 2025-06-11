import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Guide1, Guide2, Guide3, Guide4 } from '@/assets';
import { STORAGE_KEY } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Typography } from '@/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const guideImages = [
  Guide4,
  Guide1,
  Guide2,
  Guide3,
];

const Tutorial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem(STORAGE_KEY.TUTORIAL);
      if (hasLaunched === 'true') {
        navigation.navigate('Tab' as never);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const handleNext = async () => {
    if (currentIndex < guideImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      try {
        await AsyncStorage.setItem(STORAGE_KEY.TUTORIAL, 'true');
        navigation.navigate('Tab' as never);
      } catch (error) {
        console.error('Error saving launch status:', error);
      }
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY.TUTORIAL, 'true');
      navigation.navigate('Tab' as never);
    } catch (error) {
      console.error('Error saving launch status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={guideImages[currentIndex]}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {guideImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Typography style={styles.buttonText}>
            {currentIndex === guideImages.length - 1 ? '시작하기' : '다음'}
          </Typography>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Typography style={styles.skipButtonText}>건너뛰기</Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  apiInfoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  apiInfoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  apiLinkText: {
    fontSize: 14,
    color: '#5046E6',
    textDecorationLine: 'underline',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D1D1',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#5046E6',
    width: 20,
  },
  button: {
    backgroundColor: '#5046E6',
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    color: '#999',
    fontSize: 14,
  },
});

export default Tutorial; 