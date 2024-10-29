import React from 'react'
import ReactApexChart from 'react-apexcharts';
import Loading from '@components/Loading';


const TargetAchieve = ({ dealsSold, totalDeals, percentage, title, isLoading }) => {
    const tOptions = {
        chart: {
          type: 'radialBar',
          height: 350,
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: '#f0f0f0',
              strokeWidth: '100%',
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                offsetY: -10,
                fontSize: '22px',
                fontWeight: 600,
                color: '#000',
                formatter: function (val) {
                  return `${val}%`;
                }
              }
            }
          }
        },
        colors: ['#007bff'],
        stroke: {
          dashArray: 4
        },
    };
  return (
    <>
        {isLoading ? (
            <Loading height={350} /> 
        ) : (
        <>
            <ReactApexChart options={tOptions} series={[percentage]} type="radialBar" height={350} />
            <div className='content'>
            <p>{title}</p>
            <span className='s1'><b>{dealsSold}</b> deals sold</span>
            <span className='s2'><b>{totalDeals}</b> total entries</span>
            </div>
        </>
        )}
    </>
  )
}

export default TargetAchieve