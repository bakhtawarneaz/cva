import React from 'react'

/* components...*/
import Loading from '@components/Loading';

/* packages...*/
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Knocks = ({ data, isLoading }) => {

    const chartData = {
        labels: data?.map((item) => {
          const date = new Date(item.day);
          return date.toISOString().split('T')[0]; 
        }) || [],
        datasets: [
          {
            label: 'Knocks',
            data: data?.map((item) => item.total_knocks) || [],
            borderColor: '#0162e8',
            backgroundColor: 'rgba(1, 98, 232, 0.5)',
            borderWidth: 2,
            fill: true,
            tension: 0.4, 
          },
        ],
      };

      const options = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.raw} knocks`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Knocks',
            },
            beginAtZero: true,
          },
        },
      };
      
  return (
    <>
      {isLoading ? <Loading /> :  <Line data={chartData} options={options} />}
    </>
  )
}

export default Knocks
