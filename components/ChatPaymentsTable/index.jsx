import React from 'react';

export default function PaymentsTable({ payments }) {
  return (
    <div 
      className="overflow-y-auto resize-y min-h-[150px] max-h-[calc(100vh-200px)] border border-gray-300" 
      style={{ width: '100%' }} // Allow resizing horizontally if needed
    >
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Requester</th>
            <th className="px-4 py-2 border">Project Number</th>
            <th className="px-4 py-2 border">Expense Type</th>
            <th className="px-4 py-2 border">DP Number</th>
            <th className="px-4 py-2 border">Daily Balance</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(payments).map((payment, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border">{payment.date}</td>
              <td className="px-4 py-2 border">{payment.description}</td>
              <td className="px-4 py-2 border">{payment.amount}</td>
              <td className="px-4 py-2 border">{payment.resquester}</td>
              <td className="px-4 py-2 border">{payment.project_number}</td>
              <td className="px-4 py-2 border">{payment.expense_type}</td>
              <td className="px-4 py-2 border">{payment.dp_number}</td>
              <td className="px-4 py-2 border">{payment.daily_balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
