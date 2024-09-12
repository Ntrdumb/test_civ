import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

// Helper function to generate a list of all dates in the range
const generateDateRange = (start, end) => {
  const dates = [];
  let current = dayjs(start);
  const endDate = dayjs(end);

  while (current.isBefore(endDate) || current.isSame(endDate)) {
    dates.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }
  return dates;
};

export default function ChatLinechart({ data, filter, dateRange }) {
  // Get the available date range for the chart from the user-selected range or from all balance data
  const [startDate, endDate] = dateRange || [null, null];

  // console.log(data);

  // Get all unique dates from balance data if no date range is selected
  const balanceDates = Object.keys(data.balance).flatMap(project =>
    Object.keys(data.balance[project])
  );
  const allDates = balanceDates.length > 0 ? generateDateRange(startDate || balanceDates[0], endDate || balanceDates[balanceDates.length - 1]) : [];

  // Map the balance data to the full date range, filling in missing values with null
  const balanceData = allDates.map(date => {
    const dateEntry = { name: date };
    Object.keys(data.balance).forEach(project => {
      dateEntry[`${project}`] = data.balance[project][date] || null; // Fill missing dates with null
    });
    return dateEntry;
  });

  // Filter the data by selected project keys
  const filteredData = balanceData.map(item => {
    const filteredItem = { name: item.name };
    filter.forEach(key => {
      const projectKey = `${key}`;
      if (item[projectKey] !== undefined) {
        filteredItem[projectKey] = item[projectKey];
      }
    });
    return filteredItem;
  }).filter(item => Object.keys(item).length > 1);

  // Extract keys for the line chart (e.g., WF07_balance, WG00_balance)
  const keys = filteredData.length > 0 ? Object.keys(filteredData[0]).filter(key => key !== 'name') : [];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#c91c30'];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filteredData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Dynamically generate lines based on the data keys */}
          {keys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key} // The key now contains the project name (e.g., WF07_balance)
              stroke={colors[index % colors.length]} // Use different colors for each line, cycling through the array
              connectNulls={false} // Set to false to show gaps for missing values
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
