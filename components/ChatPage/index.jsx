import React from 'react';
import ChatDisplay from '../ChatDisplay';

export default function ChatPage({ initialMessages, initialChartData }) {
  return <ChatDisplay initialMessages={initialMessages} initialChartData={initialChartData} />;
}

export async function getServerSideProps() {
  // Fetch initial data from the API
  const response = await fetch(process.env.API_URL);
  const data = await response.json();

  return {
    props: {
      initialMessages: data.messages || [],
      initialChartData: data.chartData || {},
    },
  };
}
