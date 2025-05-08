import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
    Tab: NavigatorScreenParams<RootTabParamList>;
    Notification: undefined;
    Terms: undefined;
    PrivacyPolicy: undefined;
    ApiPolicy: undefined;
    Tutorial: undefined;
};



export type RootTabParamList = {
    Home: undefined;
    LawCalendar: undefined;
    Profile: undefined;
    Search: undefined;
};