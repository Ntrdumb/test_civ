import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ChatBarchart({ data, selectedExpenseTypes }) {
  // Aggregate payments by expense type and filter by selectedExpenseTypes
  const expenseTypeData = Object.values(data.payments)
    .filter(payment => selectedExpenseTypes.includes(payment.expense_type)) // Apply filtering
    .reduce((acc, payment) => {
      const type = payment.expense_type;
      if (acc[type]) {
        acc[type].amount += payment.amount;  // Sum up amounts by type
      } else {
        acc[type] = { ...payment, amount: payment.amount };
      }
      return acc;
    }, {});

  // Convert the object to an array suitable for rendering in the BarChart
  const chartData = Object.keys(expenseTypeData).map(type => ({
    name: type,
    amount: expenseTypeData[type].amount
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#a46ca4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
