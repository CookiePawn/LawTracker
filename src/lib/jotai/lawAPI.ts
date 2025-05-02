import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

interface Bill {
    CONF_ID: string;
    ERACO: string;
    SESS: string;
    DGR: string;
    BILL_ID: string;
    BILL_NM: string;
    LINK_URL: string;
}

const billListAtom = atom<Bill[]>([]);

export const useBillList = () => useAtom(billListAtom);
export const useBillListValue = () => useAtomValue(billListAtom);
export const useSetBillList = () => useSetAtom(billListAtom);