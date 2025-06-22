import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Config from 'react-native-config';

const adUnitId = () => {
  return __DEV__ 
    ? TestIds.BANNER 
    : Config.GOOGLE_ADMOB_BANNER_KEY || '';
};

const AdBanner = () => {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId()}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
});

export default AdBanner; 