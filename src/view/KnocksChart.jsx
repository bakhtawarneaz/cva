import React from 'react'
import ReactApexChart from 'react-apexcharts';
import Loading from '@components/Loading';

const KnocksChart = ({ data, isLoading }) => {

    const options = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: { 
            categories: data?.map((item) => {
                const date = new Date(item.day);
                return date.toISOString().split('T')[0];
            }) || []
        },
        yaxis: { title: { text: 'Knocks' } },
        fill: { opacity: 1 },
        tooltip: { y: { formatter: (val) => `${val} knocks` } },
    };

    const series = [
      { 
        name: 'Knocks', 
        data: data?.map((item) => item.total_knocks) || [] 
      },
      { 
        name: 'Answered Knocks', 
        data: data?.map((item) => item.answered_knocks) || [] 
      },
      { 
        name: 'UnAnswered Knocks', 
        data: data?.map((item) => item.unanswered_knocks) || [] 
      }
    ];

  return (
    <>
    {isLoading ? <Loading /> : <ReactApexChart options={options} series={series} type="bar" height={350} />}
    </>
  )
}

export default KnocksChart