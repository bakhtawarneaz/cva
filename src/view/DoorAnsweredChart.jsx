import React from 'react'

/* components...*/
import Loading from '@components/Loading';

/* packages...*/
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const DoorAnsweredChart = ({ doorsAnswered = 0, doorsNotAnswered = 0, isLoading }) => {

    const chartData = {
        labels: ['Answered', 'Not Answered'], 
        datasets: [
            {
            data: [doorsAnswered, doorsNotAnswered], 
            backgroundColor: ['#0162e8', '#0162e880'], 
            borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        cutout: '70%', 
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
        <Doughnut data={chartData} options={options} />
        )}
    </>
  )
}

export default DoorAnsweredChart
