import React from 'react'

/* components...*/
import Loading from '@components/Loading';

/* packages...*/
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

const PitchesChart = ({ totalPitches, totalBought, isLoading }) => {

    const chartData = {
        labels: ['Total Pitches', 'Total Bought'], 
        datasets: [
          {
            label: 'Pitches Data',
            data: [totalPitches, totalBought], 
            backgroundColor: ['#f76a2d', '#efa65f'], 
            borderColor: ['#f76a2d', '#efa65f'],
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
              text: 'Categories', 
            },
          },
          y: {
            title: {
              display: true,
              text: 'Pitches', 
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

export default PitchesChart
