import { NavigatorScreenParams } from "@react-navigation/native";
import { Law } from "./bills";

export type RootStackParamList = {
    Tab: NavigatorScreenParams<RootTabParamList>;
    Notification: undefined;
    Terms: undefined;
    PrivacyPolicy: undefined;
    ApiPolicy: undefined;
    Tutorial: undefined;
    LawDetail: { law: Law };
};



export type RootTabParamList = {
    Home: undefined;
    LawCalendar: undefined;
    Profile: undefined;
    Search: { type?: 'random' | 'latest' };
};