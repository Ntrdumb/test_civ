// hooks/useChartData.js
import { useState, useEffect } from 'react';

export default function useChartData(setBalanceSelectedKeys, setExpenseSelectedTypes) {
  const [chartData, setChartData] = useState({ balance: {}, payments: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("IM USING THE EFFECT FROM THE HOOKS");
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching data
      const cachedData = localStorage.getItem('cachedChartData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setChartData(parsedData);
        setBalanceSelectedKeys(Object.keys(parsedData.balance));

        // Set all expense types as default selected options
        const allExpenseTypes = [...new Set(Object.values(parsedData.payments).map(payment => payment.expense_type))];
        setExpenseSelectedTypes(allExpenseTypes); // Set default selected expense types
      } else {
        try {
          const response = await fetch('/api/chat');
          const data = await response.json();
          setChartData(data);
          setBalanceSelectedKeys(Object.keys(data.balance));

          // Set all expense types as default selected options
          const allExpenseTypes = [...new Set(Object.values(data.payments).map(payment => payment.expense_type))];
          setExpenseSelectedTypes(allExpenseTypes); // Set default selected expense types
          localStorage.setItem('cachedChartData', JSON.stringify(data));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      setLoading(false); // Data is fetched, set loading to false
    };
    fetchData();
  }, [setBalanceSelectedKeys, setExpenseSelectedTypes]);

  return { chartData, loading };
}
