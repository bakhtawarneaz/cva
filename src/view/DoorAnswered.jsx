import React from 'react';
import ReactApexChart from 'react-apexcharts';
import Loading from '@components/Loading';

const DoorAnswered = ({ doorsAnswered = 0, doorsNotAnswered = 0, isLoading }) => {

    const series = [doorsAnswered, doorsNotAnswered];

    const options = {
        chart: {
            type: 'donut',
            height: 350,
        },
        labels: ['Answered', 'Not Answered'],
        colors: ['#0162e8', '#0162e880'],
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val.toFixed(1)}%`,
        },
        tooltip: {
            y: {
                formatter: (val) => `${val}`
            }
        },
        legend: {
            position: 'bottom',
        }
    };

    return (
        <>
        {isLoading ? (
            <Loading />
        ) : (
            series && series.length > 0 ? (
                <ReactApexChart options={options} series={series} type="donut" height={350} />
            ) : (
                ''
            )
        )}
    </>
    );
};

export default DoorAnswered;
