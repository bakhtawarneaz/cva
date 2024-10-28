import React, { useState } from 'react'
import { FaHandsClapping } from "react-icons/fa6";
import { PiDoorOpenDuotone } from "react-icons/pi";
import { IoCallSharp } from "react-icons/io5";
import { SlGraph } from "react-icons/sl";
import { BsCurrencyDollar } from "react-icons/bs";
import { RiRepeatFill } from "react-icons/ri";
import { MdOutlineFilterAlt } from "react-icons/md";
import DatePicker from "react-multi-date-picker";
import transition from "react-element-popper/animations/transition"
import '@styles/_home.css';
import im1 from '@assets/1.png'
import im2 from '@assets/2.png'
import im3 from '@assets/3.png'
import im4 from '@assets/4.png'
import im5 from '@assets/5.png'
import im6 from '@assets/6.png'
import ReactApexChart from 'react-apexcharts';
import KnocksChart from '@view/KnocksChart';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@api/dashboardApi';
import DashboardTopLoader from '@components/DashboardTopLoader';

const Home = () => {

  /* Variables Here...*/

  const initialData = {
    topBarData: {
      total_knocks: 0,
      doors_answered: 0,
      productivity: "0",
      total_revenue: "0",
      productive_calls: 0,
      conversion_rate: "0",
      deals_sold_yesterday: [{ deals_sold_yesterday: 0, number_of_deals: 0, percentage_yesterday: 0 }],
      deals_sold_this_month: [{ deals_sold_this_month: 0, number_of_deals: 0, percentage_this_month: 0 }],
    },
    userShipData: [],
    buyerData: [],
    dealData: [],
    knockData: [],
    pitchData: { total_pitches: 0, total_bought: 0 },
  };
  
  /* UseState Here...*/
  const [value, setValue] = useState([]);
  const [data, setData] = useState(initialData);

  /* Functions Here...*/
  const mutation = useMutation({
    mutationFn: (payload) => getDashboardData(payload),
    onSuccess: (fetchedData) => {
      setData(fetchedData.data);
    },
  });


  const handleSearch = (e) => {
    e.preventDefault();
    setData(initialData);
    const PAY_LOAD = {
      "campaign_id": 64,
      "ba_id": null,
      "city_id": null,
      "startDate": null,
      "endDate": null
    }
    mutation.mutate(PAY_LOAD);
  };
  
  /*** Knocks Charts ******/
  
  const options = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    yaxis: {
      title: {
        text: 'Values'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} units`
      }
    }
  };

  const series = [
    {
      name: 'Series 1',
      data: [44, 55, 41, 67, 22, 43, 21]
    },
    {
      name: 'Series 2',
      data: [13, 23, 20, 8, 13, 27, 33]
    }
  ];


    /*** Target Achieve ******/
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
  
    const TSeries = [83]; 

  return (
    
    <div className='dashboard_wrap'>
      
      <div className='dashboard_filter'>
         <div className='left'>
            <span><MdOutlineFilterAlt /> filters</span>
         </div> 
         <div className='right'>
            <form>
              <div className='form_group'>
                <select>
                  <option>select city</option>
                </select>
              </div>
              <div className='form_group'>
                <select>
                  <option>select campaign</option>
                  <option value="64">LML DDS & Tricycle ISB & AJK Zone</option>
                </select>
              </div>
              <div className='form_group custom_date_picker'>
                <DatePicker 
                  value={value} 
                  onChange={setValue} 
                  range 
                  dateSeparator=" - "
                  numberOfMonths={2}
                  animations={[
                    transition({ duration: 800, from: 35 })
                  ]} 
                  placeholder="Start Date - End Date"
                  showOtherDays
                  monthYearSeparator="-"
                />
              </div>
              <div className='btn_group'>
                <button onClick={handleSearch}>search</button>
                <button>clear</button>
              </div>
            </form>
         </div>
      </div>
      <div className='top_bar'>
          <div className='box blue'>
              <div className='icon' style={{background: '#487FFF'}}>
                <FaHandsClapping />
              </div>
              <div className='disc'>
                <span>Total Knocks</span>
                <h3>{mutation.isPending ? <DashboardTopLoader color="#487fff" /> : data.topBarData?.total_knocks || 0}</h3>
              </div>
              <img src={im1} />
          </div>
          <div className='box red'>
              <div className='icon' style={{background: '#45B369'}}>
                <PiDoorOpenDuotone />
              </div>
              <div className='disc'>
                <span>Doors Answered</span>
                <h3>{mutation.isPending ? <DashboardTopLoader color="#45b369" /> : data.topBarData?.doors_answered || 0}</h3>
              </div>
              <img src={im2} />
          </div>
          <div className='box green'>
              <div className='icon' style={{background: '#F4941E'}}>
                <IoCallSharp />
              </div>
              <div className='disc'>
                <span>Productive Calls</span>
                <h3>{mutation.isPending ? <DashboardTopLoader color="#f4941e" /> : data.topBarData?.productive_calls || 0}</h3>
              </div>
              <img src={im3} />
          </div>
          <div className='box orange'>
              <div className='icon' style={{background: '#8252E9'}}>
                <SlGraph />
              </div>
              <div className='disc'>
                <span>Productivity</span>
                <h3>{mutation.isPending ? <DashboardTopLoader color="#8252e9" /> : data.topBarData?.productivity || 0}</h3>
              </div>
              <img src={im4} />
          </div>
          <div className='box purple'>
              <div className='icon' style={{background: '#DE3ACE'}}>
                <BsCurrencyDollar />
              </div>
              <div className='disc'>
                <span>Revenue in PKR</span>
                <h3>{mutation.isPending ? <DashboardTopLoader color="#de3ace" /> : data.topBarData?.total_revenue || 0}</h3>
              </div>
              <img src={im5} />
          </div>
          <div className='box yellow'>
              <div className='icon' style={{background: '#00B8F2'}}>
                <RiRepeatFill />
              </div>
              <div className='disc'>
                <span>Conversion Rate</span>
                <h3>{mutation.isPending ? <DashboardTopLoader color="#00b8f2" /> : data.topBarData?.conversion_rate || 0}</h3>
              </div>
              <img src={im6} />
          </div>
      </div>
       <div className='chart_wrap'>
           <div className='chart_box knocks'> 
              <h2>knocks</h2>
              <p className='txt'>Daywise Statistical Overview</p>
              <KnocksChart data={data?.knockData} isLoading={mutation.isPending} />
           </div>   
           <div className='chart_box target_achieve'> 
              <h2>Target Achieve</h2>
              <p className='txt'>Number of Deals, sold till now</p>
              <div className='target_chart_wrap'>
                  <div className='left'>
                    <ReactApexChart options={tOptions} series={TSeries} type="radialBar" height={350} />
                    <div className='content'> 
                       <p>Yesterday Target Achieve</p>
                       <span className='s1'>deals sold</span> 
                       <span className='s2'>total entries</span> 
                    </div>
                  </div>
                  <div className='right'>
                    <ReactApexChart options={tOptions} series={TSeries} type="radialBar" height={350} />
                    <div className='content'> 
                       <p>Monthly Target Achieve</p>
                       <span className='s1'>deals sold</span> 
                       <span className='s2'>total entries</span> 
                    </div>
                  </div>
              </div>
           </div>  
           <div className='chart_box usership'> 
              <h2>usership</h2>
              <p className='txt'>Statistical overview of customers, who have bought and didn't bought the deals</p>
              <ReactApexChart options={options} series={series} type="bar" height={350} />
           </div>
           <div className='chart_box pitches'> 
              <h2>pitches</h2>
              <p className='txt'>Ratio of pitches listened and buy</p>
              <ReactApexChart options={options} series={series} type="bar" height={350} />
           </div>   
       </div>           
       <div className='chart_wrap buyers_chart'>
           <div className='chart_box'> 
              <h2>buyers chart</h2>
              <p className='txt'>Number of deals purchased by unique customers</p>
              <ReactApexChart options={options} series={series} type="bar" height={350} />
           </div>   
       </div> 
       <div className='chart_wrap'>
           <div className='chart_box door_answered'> 
              <h2>door answered</h2>
              <p className='txt'>Ratio of Non Associated and Associated Userships</p>
              <ReactApexChart options={options} series={series} type="bar" height={350} />
           </div>   
           <div className='chart_box deals'> 
              <h2>deals</h2>
              <p className='txt'>Number of Deals, sold till now</p>
              <ReactApexChart options={options} series={series} type="bar" height={350} />
           </div>   
       </div> 

    </div>
  )
}

export default Home