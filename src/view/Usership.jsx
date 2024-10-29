import React from 'react'
import ReactApexChart from 'react-apexcharts';
import Loading from '@components/Loading';

const Usership = ({ data, isLoading }) => {

    const options = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: { 
            categories: data?.map((item) => item.usership_name) || []
        },
        yaxis: { title: { text: 'Usership' } },
        fill: { colors: ['#029666']  },
        tooltip: { y: { formatter: (val) => `${val}` } },
    };
    
    const series = [
        { 
          name: 'Total Bought', 
          data: data?.map((item) => item.total_bought) || [] 
        }
    ];

  return (
    <>
    {isLoading ? <Loading /> : <ReactApexChart options={options} series={series} type="bar" height={350} />}
    </>
  )
}

export default Usership