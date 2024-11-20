import React from 'react'

/* components...*/
import Loading from '@components/Loading';

/* packages...*/
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BuyersChart = ({ buyerData, isLoading }) => {

    const dealNames = buyerData.map((item) => item.deal_name); 
    const buyerCounts = buyerData.map((item) => item.buyer_count); 
  
    const chartData = {
      labels: dealNames, 
      datasets: [
        {
          label: 'Buyer Count',
          data: buyerCounts,
          backgroundColor: '#4800c9', 
          borderColor: '#4800c9',
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      responsive: true,
      indexAxis: 'y', 
      plugins: {
        legend: {
          display: true,
          position: 'top', 
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.raw}`, 
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Buyer Count', 
          },
          beginAtZero: true,
        },
        y: {
          title: {
            display: true,
            text: 'Deal Names',
          },
        },
      },
    };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </>
  )
}

export default BuyersChart
