import { useLayoutEffect } from 'react';
import AppNavigator from './src/navigation/StackNavigator';
import { fetchBillsByMeeting } from '@/services';
import { useSetBillList } from '@/lib';

export default function App() {
  const setBillList = useSetBillList();
  
  useLayoutEffect(() => {
    const fetchBills = async () => {
      const bills = await fetchBillsByMeeting();
      setBillList(bills);
    };
    fetchBills();
  }, []);
  
  return <AppNavigator />;
}

