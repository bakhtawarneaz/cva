import React from 'react'
import ReactApexChart from 'react-apexcharts';
import Loading from '@components/Loading';

const Buyers = ({ buyerData, isLoading }) => {

    const dealNames = buyerData.map(item => item.deal_name);
    const buyerCounts = buyerData.map(item => item.buyer_count);
    
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
          colors: ['#4800c9'],
        },
        tooltip: {
          y: {
            formatter: (val) => `${val}`
          }
        }
      };
    
      const series = [
        {
          name: 'Buyer Count',
          data: buyerCounts
        }
      ];

  return (
    <>
        {isLoading ? <Loading /> : <ReactApexChart options={options} series={series} type="bar" height={350} />}
    </>
  )
}

export default Buyers