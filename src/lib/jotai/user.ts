import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { User } from '@/models';

const userAtom = atom<User | null>(null);

export const useUser = () => useAtom(userAtom);
export const useUserValue = () => useAtomValue(userAtom);
export const useSetUser = () => useSetAtom(userAtom);