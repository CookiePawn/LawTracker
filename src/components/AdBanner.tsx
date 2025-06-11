import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { GOOGLE_ADMOB_HOME_BANNER_KEY, GOOGLE_ADMOB_LIST_BANNER_KEY} from '@env';

const adUnitId = (mode: 'home' | 'list') => {
  if (mode === 'home') {
    return __DEV__ 
      ? TestIds.BANNER 
      : GOOGLE_ADMOB_HOME_BANNER_KEY;
  }
  return __DEV__ 
    ? TestIds.BANNER 
    : GOOGLE_ADMOB_LIST_BANNER_KEY;
};

const AdBanner = ({ mode }: { mode: 'home' | 'list' }) => {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId(mode)}
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