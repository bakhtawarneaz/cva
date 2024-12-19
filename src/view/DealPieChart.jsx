import React from 'react'

/* components...*/
import Loading from '@components/Loading';

/* packages...*/
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, Filler);

const DealPieChart = ({ dealData, isLoading }) => {

  const dealNames = dealData.map((item) => item.deal_name); 
  const dealSold = dealData.map((item) => item.total_sold); 

  const chartData = {
    labels: dealNames, 
    datasets: [
      {
        label: 'Deals Sold',
        data: dealSold, 
        backgroundColor: dealNames.map((_, index) => `hsl(${(index * 50) % 360}, 70%, 50%)`), 
        borderWidth: 1,
      },
    ],
  };

  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom', 
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`, 
        },
      },
    },
  };
    
  return (
    <>
        {isLoading ? (
            <Loading />
        ) : (
            <Pie data={chartData} options={options} />
        )}
    </>
  )
}

export default DealPieChart
