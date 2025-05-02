import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
    Tab: NavigatorScreenParams<RootTabParamList>;
    Notification: undefined;
};



export type RootTabParamList = {
    Home: undefined;
    LawCalendar: undefined;
};