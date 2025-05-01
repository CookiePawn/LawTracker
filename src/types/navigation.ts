import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Detail: undefined;
};

export type SearchStackParamList = {
  SearchMain: undefined;
  Detail: undefined;
};