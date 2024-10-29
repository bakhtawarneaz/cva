import React from 'react'
import ReactApexChart from 'react-apexcharts';
import Loading from '@components/Loading';

const Pitches = ({ totalPitches, totalBought, isLoading }) => {

    const options = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: { 
            categories: ['Total Pitches', 'Total Bought'],
        },
        yaxis: { title: { text: 'Pitches' } },
        fill: { colors: ['#f76a2d','#efa65f'] },
        tooltip: { y: { formatter: (val) => `${val}` } },
    };

    const series = [
        {
            name: 'Pitches Data',
            data: [totalPitches, totalBought]
        }
    ];

  return (
    <>
        {isLoading ? <Loading /> : <ReactApexChart options={options} series={series} type="bar" height={350} />}
    </>
  )
}

export default Pitches