'use client'
import ChatDisplay from '../components/ChatDisplay';
// import ChatBarchart from '../components/ChatBarchart';
// import ChatLinechart from '@/components/ChatLinechart';
// import ChatPaymentsTable from '@/components/ChatPaymentsTable';
import DateRangeSlider from '@/components/DateRangeSlider';
import MultiSelect from '@/components/MultiSelect';
import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import dynamic from 'next/dynamic';
import useChartData from '@/hooks/useChartData';

const ChatLinechart = dynamic(() => import('../components/ChatLinechart'));
const ChatBarchart = dynamic(() => import('../components/ChatBarchart'));
const ChatPaymentsTable = dynamic(() => import('../components/ChatPaymentsTable'));

// Extend dayjs with the plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function Home() {
  // const [chartData, setChartData] = useState({ balance: {}, payments: {} });
  const [balanceSelectedKeys, setBalanceSelectedKeys] = useState([]);
  const [balanceDateRange, setBalanceDateRange] = useState(null);
  const [paymentsDateRange, setPaymentsDateRange] = useState(null);
  const [expenseSelectedTypes, setExpenseSelectedTypes] = useState([]); // State for expense type filtering
  const [view, setView] = useState('balances');
  // const [loading, setLoading] = useState(true); 
  const { chartData, loading } = useChartData(setBalanceSelectedKeys, setExpenseSelectedTypes);

  const balanceData = chartData.balance;
  const paymentsData = chartData.payments;

  // Extract project numbers for balances
  const balanceProjectOptions = useMemo(() => {
    return balanceData ? Object.keys(balanceData) : [];
  }, [balanceData]);

  // Extract expense types for payments
  const expenseTypeOptions = useMemo(() => {
    return paymentsData ? [...new Set(Object.values(paymentsData).map(payment => payment.expense_type))] : [];
  }, [paymentsData]);

  // Extract all dates from balance for min and max dates
  const balanceDates = useMemo(() => {
    const allDates = balanceData
      ? Object.values(balanceData).flatMap((project) => Object.keys(project))
      : [];
    return allDates.sort((a, b) => (dayjs(a).isBefore(dayjs(b)) ? -1 : 1));
  }, [balanceData]);

  // Extract all dates from payments for min and max dates
  const paymentsDates = useMemo(() => {
    const allDates = paymentsData
      ? Object.values(paymentsData).map((payment) => payment.date)
      : [];
    return allDates.sort((a, b) => (dayjs(a).isBefore(dayjs(b)) ? -1 : 1));
  }, [paymentsData]);

  // // Fetch data from API and cache it in localStorage
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true); // Set loading to true when fetching data
  //     const cachedData = localStorage.getItem('cachedChartData');
  //     if (cachedData) {
  //       const parsedData = JSON.parse(cachedData);
  //       setChartData(parsedData);
  //       setBalanceSelectedKeys(Object.keys(parsedData.balance));

  //       // Set all expense types as default selected options
  //       const allExpenseTypes = [...new Set(Object.values(parsedData.payments).map(payment => payment.expense_type))];
  //       setExpenseSelectedTypes(allExpenseTypes); // Set default selected expense types
  //     } else {
  //       try {
  //         const response = await fetch('/api/chat');
  //         const data = await response.json();
  //         setChartData(data);
  //         setBalanceSelectedKeys(Object.keys(data.balance));

  //         // Set all expense types as default selected options
  //         const allExpenseTypes = [...new Set(Object.values(data.payments).map(payment => payment.expense_type))];
  //         setExpenseSelectedTypes(allExpenseTypes); // Set default selected expense types
  //         localStorage.setItem('cachedChartData', JSON.stringify(data));
  //       } catch (error) {
  //         console.error('Error fetching data:', error);
  //       }
  //     }
  //     setLoading(false); // Data is fetched, set loading to false
  //   };
  //   fetchData();
  // }, []);

  // Handle DateRangeSlider changes
  const handleBalanceDateRangeChange = (range) => setBalanceDateRange(range);
  const handlePaymentsDateRangeChange = (range) => setPaymentsDateRange(range);

  // Update date range depending on the schema (view)
  const updateDateRange = (schema, range) => {
    if (schema === 'solde_compte') {
      setBalanceDateRange(range);  // Update balance date range
    } else if (schema === 'detail_depense') {
      setPaymentsDateRange(range);  // Update payments date range
    }
  };

  // Filter payments data based on selected date range
  const filteredPaymentsData = useMemo(() => {
    if (!paymentsDateRange || !paymentsData) return paymentsData;

    const [startDate, endDate] = paymentsDateRange;

    return Object.values(paymentsData).filter((payment) => {
      const paymentDate = dayjs(payment.date, 'YYYY-MM-DD');
      if (!paymentDate.isValid()) return false;
      return paymentDate.isSameOrAfter(dayjs(startDate)) && paymentDate.isSameOrBefore(dayjs(endDate));
    });
  }, [paymentsDateRange, paymentsData]);

  const changeView = (newView) => {
    if (newView === 'solde_compte' || newView === 'balances') {
      setView('balances');
    } else if (newView === 'detail_depense' || newView === 'payments') {
      setView('payments');
    } else if (newView === 'categories_depense' || newView === 'expenses') {
      setView('expenses');
    }
  };

  if (loading) {
    // Display loading indicator while data is being fetched
    return <div>Loading data...</div>;
  }

  return (
    <main className="w-full h-screen">
      <div className="w-full grid grid-cols-12 gap-4 h-full">
        {/* Section 1 */}
        <section className="col-span-2 p-4 bg-gray-200 h-full">
          <h3 className="text-xl mb-2">Filtres</h3>

          {/* Date Range and MultiSelect for Balances */}
          {view === 'balances' && (
            <>
              <DateRangeSlider 
                minDate={balanceDates[0]} 
                maxDate={balanceDates[balanceDates.length - 1]} 
                onChange={handleBalanceDateRangeChange} 
                selectedRange={balanceDateRange} 
              />
              <MultiSelect 
                options={balanceProjectOptions} 
                selectedOptions={balanceSelectedKeys} 
                onChange={setBalanceSelectedKeys} 
              />
            </>
          )}

          {/* Date Range for Payments */}
          {view === 'payments' && (
            <>
              <DateRangeSlider 
                minDate={paymentsDates[0]} 
                maxDate={paymentsDates[paymentsDates.length - 1]} 
                onChange={handlePaymentsDateRangeChange} 
                selectedRange={paymentsDateRange} 
              />
            </>
          )}

          {/* MultiSelect for Expenses */}
          {view === 'expenses' && (
            <MultiSelect 
              options={expenseTypeOptions} 
              selectedOptions={expenseSelectedTypes} 
              onChange={setExpenseSelectedTypes} 
            />
          )}
          
        </section>
        
        {/* Section 2 */}
        <section className="col-span-7 p-4 bg-gray-300 h-full">
          <h3 className="text-xl mb-2">Vue</h3>

          <div className="flex justify-center mb-4">
            <button 
              className={`mx-2 px-4 py-2 ${view === 'balances' ? 'bg-civision-green text-white' : 'bg-gray-300'}`}
              onClick={() => changeView('balances')}
            >
              Balances
            </button>

            <button 
              className={`mx-2 px-4 py-2 ${view === 'payments' ? 'bg-civision-green text-white' : 'bg-gray-300'}`}
              onClick={() => changeView('payments')}
            >
              Payments
            </button>

            <button 
              className={`mx-2 px-4 py-2 ${view === 'expenses' ? 'bg-civision-green text-white' : 'bg-gray-300'}`}
              onClick={() => changeView('expenses')}
            >
              Expenses
            </button>
          </div>

          {/* Conditionally render line chart or table */}
          {view === 'balances' ? (
            <ChatLinechart data={chartData} filter={balanceSelectedKeys} dateRange={balanceDateRange} />
          ) : view === 'payments' ? (
            <ChatPaymentsTable payments={filteredPaymentsData} />
          ) : view === 'expenses' ? (
            <ChatBarchart data={chartData} selectedExpenseTypes={expenseSelectedTypes} />
          ) : null}

        </section>

        {/* Section 3 */}
        <section className="col-span-3 p-4 bg-gray-400 h-full flex flex-col">
          <h3 className="text-xl mb-2">Chat Display</h3>
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto">
              <ChatDisplay changeView={changeView} updateDateRange={updateDateRange} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
