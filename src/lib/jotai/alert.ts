import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  buttons: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel';
  }>;
}

const alertAtom = atom<AlertState>({
  visible: false,
  title: '',
  message: '',
  buttons: [],
});

export const useAlert = () => useAtom(alertAtom);
export const useAlertValue = () => useAtomValue(alertAtom);
export const useSetAlert = () => useSetAtom(alertAtom); 