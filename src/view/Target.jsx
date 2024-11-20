import React from 'react'

/* components...*/
import Loading from '@components/Loading';

/* packages...*/
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const Target = ({ dealsSold, totalDeals, percentage, title, isLoading }) => {
    
 const remainingPercentage = 100 - percentage;

 const chartData = {
    labels: ['Deals Sold', 'Total Entries'],
    datasets: [
      {
        data: [percentage, remainingPercentage],
        backgroundColor: ['#ffd700', '#248dfd'], 
        borderWidth: 1,
        borderColor: ['#000'],  
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: false,
    cutout: '50%', 
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label;
            const value = label === 'Deals Sold' ? dealsSold : totalDeals;
            return `${label}: ${value}`;
          },
        },
      },
      legend: {
        display: true,
        position: 'right'
      },
    },
  };


  const plugins = [{
    beforeDraw: function (chart) {
      const { ctx, chartArea, width, height } = chart;
      const { top, bottom, left, right } = chartArea;
      ctx.restore();
      let fontSize = (height / 200).toFixed(2);
      ctx.font = fontSize + "em sans-serif";
      ctx.textBaseline = "middle";
      ctx.textAlign = 'center';
      let text = `${percentage}%`;
      let maxCircleRadius = Math.min(width, height) * 0.2;
      let circleRadius = maxCircleRadius;
      let circleX = (left + right) / 2; 
      let circleY = (top + bottom) / 2; 
      let textX = circleX;
      let textY = circleY;
      ctx.fillStyle = '#2f3035'; 
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'white'; 
      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  }
]

  return (
    <>
        {isLoading ? (
        <Loading height={350} />
        ) : (
        <>
         <p>{title}</p>
         <Doughnut data={chartData} options={options} plugins={plugins} key={percentage} />
        </>
        )}
    </>
  )
}

export default Target
