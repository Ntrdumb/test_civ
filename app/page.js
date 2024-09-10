'use client'
import ChatDisplay from '../components/ChatDisplay';
import ChatBarchart from '../components/ChatBarchart';
import ChatLinechart from '@/components/ChatLinechart';
import Checkbox from '@/components/FilterCheckboxes';
import ChatPaymentsTable from '@/components/ChatPaymentsTable';
import DateRangeSlider from '@/components/DateRangeSlider';
import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';

export default function Home() {
  const [chartData, setChartData] = useState({ balance: {}, payments: {} });
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [view, setView] = useState('balances');
  const [dateRange, setDateRange] = useState(null); // Date range state

  // Extract all possible keys from chartData to generate checkboxes
  const allCheckboxKeys = useMemo(() => {
    // console.log("ALL DATA________________");
    // console.log(chartData);
    const balanceKeys = chartData.balance ? Object.keys(chartData.balance).flatMap(project => 
      Object.keys(chartData.balance[project]).map(date => `${project}_balance`)
    ) : [];
    // const paymentKeys = chartData.payments ? Object.keys(chartData.payments.project_number || {}).map(projectNum => `${projectNum}_payment`) : [];
    
    // console.log("PAYMENTS KEYS");
    // console.log(paymentKeys);

    // return Array.from(new Set([...balanceKeys, ...paymentKeys]));
    return Array.from(new Set([...balanceKeys]));
  }, [chartData]);

  // console.log("All keys")
  // console.log(allCheckboxKeys);

  // Initialize all keys as selected if they are present
  const initializedSelectedKeys = useMemo(() => allCheckboxKeys, [allCheckboxKeys]);

  if (selectedKeys.length === 0 && initializedSelectedKeys.length > 0) {
    setSelectedKeys(initializedSelectedKeys);
  }

  // Extract all dates from balance for min and max dates
  const balanceDates = useMemo(() => {
    const allDates = chartData.balance 
      ? Object.values(chartData.balance).flatMap(project => Object.keys(project))
      : [];
    return allDates.sort((a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1);
  }, [chartData.balance]);

  const minDate = balanceDates[0];
  const maxDate = balanceDates[balanceDates.length - 1];

  // Fetch data from API and cache it in localStorage
  useEffect(() => {
    const fetchData = async () => {
      const cachedData = localStorage.getItem('cachedChartData');
      if (cachedData) {
        setChartData(JSON.parse(cachedData));
      } else {
        try {
          const response = await fetch('/api/chat');
          const data = await response.json();
          setChartData(data);
          localStorage.setItem('cachedChartData', JSON.stringify(data));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, []);

  // Handle DateRangeSlider change
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  // Function to handle checkbox changes
  const handleCheckboxChange = (key) => {
    setSelectedKeys(prevSelectedKeys => {
      const isSelected = prevSelectedKeys.includes(key);
      return isSelected 
        ? prevSelectedKeys.filter(item => item !== key) 
        : [...prevSelectedKeys, key];
    });
  };

  // Function to update date range based on API response in ChatDisplay.js
  const updateDateRange = (newRange) => {
    setDateRange(newRange);
  };
  
  const changeView = (newView) => {
    if (newView === 'solde_compte') {
      setView('balances');
    } else if (newView === 'detail_depense') {
      setView('payments');
    } else if (newView === 'categories_depense') {
      setView('expenses');
    }
  };

  return (
    <main className="w-full h-screen">
      <div className="w-full grid grid-cols-12 gap-4 h-full">
        {/* Section 1 */}
        <section className="col-span-2 p-4 bg-gray-200 h-full">
          <h3 className="text-xl mb-2">Filtres</h3>

          {/* Date Range Slider */}
          {minDate && maxDate && (
            <DateRangeSlider 
              minDate={minDate} 
              maxDate={maxDate} 
              onChange={handleDateRangeChange} 
              selectedRange={dateRange} 
            />
          )}

          <div className="space-y-2">
            {allCheckboxKeys.map((key) => (
              <Checkbox
                key={key}
                label={key}
                checked={selectedKeys.includes(key)}
                onChange={() => handleCheckboxChange(key)}
              />
            ))}
          </div>
        </section>

        {/* Section 2 */}
        <section className="col-span-7 p-4 bg-gray-300 h-full">
          <h3 className="text-xl mb-2">Vue</h3>

          <div className="flex justify-center mb-4">
            <button 
              className={`mx-2 px-4 py-2 ${view === 'balances' ? 'bg-civision-green text-white' : 'bg-gray-300'}`}
              onClick={() => setView('balances')}
            >
              Balances
            </button>

            <button 
              className={`mx-2 px-4 py-2 ${view === 'payments' ? 'bg-civision-green text-white' : 'bg-gray-300'}`}
              onClick={() => setView('payments')}
            >
              Payments
            </button>

            <button 
              className={`mx-2 px-4 py-2 ${view === 'expenses' ? 'bg-civision-green text-white' : 'bg-gray-300'}`}
              onClick={() => setView('expenses')}
            >
              Expenses
            </button>
          </div>

          {/* Conditionally render line chart or table */}
          {view === 'balances' ? (
            <ChatLinechart data={chartData} filter={selectedKeys} dateRange={dateRange} />
          ) : view === 'payments' ? (
            <ChatPaymentsTable payments={chartData.payments} />
          ) : view === 'expenses' ? (
            <ChatBarchart data={chartData} filter={selectedKeys} />
          ) : null}

        </section>

        {/* Section 3 */}
        <section className="col-span-3 p-4 bg-gray-400 h-full flex flex-col">
          <h3 className="text-xl mb-2">Chat Display</h3>
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto">
              <ChatDisplay /*setChartData={setChartData}*/ changeView={changeView} updateDateRange={updateDateRange} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
