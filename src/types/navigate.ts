import { NavigatorScreenParams } from "@react-navigation/native";
import { Law } from "@/models";

export type RootStackParamList = {
    Tab: NavigatorScreenParams<RootTabParamList>;
    Notification: undefined;
    Terms: undefined;
    PrivacyPolicy: undefined;
    ApiPolicy: undefined;
    Tutorial: undefined;
    LawDetail: { law: Law };
    SignIn: undefined;
    Setting: undefined;
};



export type RootTabParamList = {
    Home: undefined;
    LawCalendar: undefined;
    Profile: undefined;
    Search: { type?: 'random' | 'latest' };
};