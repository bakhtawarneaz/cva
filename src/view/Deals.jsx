import React from 'react'
import ReactApexChart from 'react-apexcharts';
import Loading from '@components/Loading';

const Deals = ({ dealData, isLoading }) => {

    const dealNames = dealData.map(item => item.deal_name);
    const dealSold = dealData.map(item => item.total_sold);
    
    const options = {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            columnWidth: '45%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: dealNames,
        },
        fill: {
          colors: ['#f93a5a'],
        },
        tooltip: {
          y: {
            formatter: (val) => `${val}`
          }
        }
      };
    
      const series = [
        {
          name: 'Deal Sold',
          data: dealSold
        }
      ];

  return (
    <>
        {isLoading ? <Loading /> : <ReactApexChart options={options} series={series} type="bar" height={350} />}
    </>
  )
}

export default Deals