import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

interface CustomTextProps extends TextProps {}

const Typography: React.FC<CustomTextProps> = ({ style, ...rest }) => {
  const styles = StyleSheet.flatten(style);

  const getFontFamily = () => {
    switch (styles?.fontWeight) {
      case '900':
        return 'MinSans-Black';
      case '800':
        return 'MinSans-ExtraBold';
      case 'bold':
      case '700':
        return 'MinSans-Bold';
      case '600':
        return 'MinSans-SemiBold';
      case '500':
        return 'MinSans-Medium';
      case '400':
      case 'normal':
        return 'MinSans-Regular';
      case '300':
        return 'MinSans-Light';
      case '200':
        return 'MinSans-ExtraLight';
      case '100':
        return 'MinSans-Thin';
      default:
        return 'MinSans-Regular';
    }
  };

  return (
    <RNText 
      style={[
        { fontFamily: getFontFamily() },
        style,
        { fontWeight: undefined },
      ]} 
      {...rest} 
    />
  );
};

export default Typography; 