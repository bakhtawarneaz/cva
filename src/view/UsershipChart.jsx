import React from 'react'

/* components...*/
import Loading from '@components/Loading';

/* packages...*/
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

const UsershipChart = ({ data, isLoading }) => {

    const chartData = {
        labels: data?.map((item) => item.usership_name) || [], 
        datasets: [
            {
            label: 'Total Bought',
            data: data?.map((item) => item.total_bought) || [],
            backgroundColor: '#029666', 
            borderColor: '#029666',
            borderWidth: 1,
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
              label: (context) => `${context.raw}`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Usership Name', 
            },
          },
          y: {
            title: {
              display: true,
              text: 'Usership', 
            },
            beginAtZero: true,
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

export default UsershipChart
