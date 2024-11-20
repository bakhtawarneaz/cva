import React, { useRef, useState } from 'react'

/* icons...*/
import { FaHandsClapping } from "react-icons/fa6";
import { PiDoorOpenDuotone } from "react-icons/pi";
import { IoCallSharp } from "react-icons/io5";
import { SlGraph } from "react-icons/sl";
import { BsCurrencyDollar } from "react-icons/bs";
import { RiRepeatFill } from "react-icons/ri";
import { MdOutlineFilterAlt } from "react-icons/md";

/* packages...*/
import DatePicker from "react-multi-date-picker";
import { useMutation, useQuery } from '@tanstack/react-query';

/* styles...*/
import '@styles/_home.css';

/* assets...*/
import im1 from '@assets/1.png'
import im2 from '@assets/2.png'
import im3 from '@assets/3.png'
import im4 from '@assets/4.png'
import im5 from '@assets/5.png'
import im6 from '@assets/6.png'

/* view...*/
import Knocks from '@view/Knocks';
import Target from '@view/Target';
import UsershipChart from '@view/UsershipChart';
import PitchesChart from '@view/PitchesChart';
import BuyersChart from '@view/BuyersChart';
import DoorAnsweredChart from '@view/DoorAnsweredChart';
import DealPieChart from '@view/DealPieChart';

/* api...*/
import { getDashboardData } from '@api/dashboardApi';
import { fetchCities } from '@api/cityApi';
import { fetchCampaigns } from '@api/campaignApi';

/* components...*/
import ButtonLoader from '@components/ButtonLoader';
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

   /* Hooks...*/
  const datePickerRef = useRef(null);
  
  /* UseState Here...*/
  const [data, setData] = useState(initialData);
  const [campaigns, setCampaigns] = useState([]); 
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [dateRange, setDateRange] = useState([]);


  /* Functions Here...*/
  const { data: citiesData } = useQuery({
      queryKey: ['cities'],
      queryFn: () => fetchCities(),
      staleTime: 10000,
  });

  const campaignMutation = useMutation({
    mutationFn: (cityId) => fetchCampaigns({ campaign_id: null, city_id: cityId, brand_id: null }),
    onSuccess: (response) => {
      const campaignsList = response.data.fetchCampaign.campaigns || [];
      setCampaigns(campaignsList);
    },
  });

  const mutation = useMutation({
    mutationFn: (payload) => getDashboardData(payload),
    onSuccess: (response) => {
      setData(response.data);
    },
  });

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    if (cityId) {
      campaignMutation.mutate(cityId);
    } else {
      setCampaigns([]);
      setSelectedCampaign(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setData(initialData);
    const [startDate, endDate] = dateRange;
    const PAY_LOAD = {
      campaign_id: selectedCampaign || null,
      city_id: selectedCity || null,
      startDate: startDate ? new Date(startDate).toISOString().split('T')[0] : null,
      endDate: endDate ? new Date(endDate).toISOString().split('T')[0] : null,
      ba_id: null
    };
    mutation.mutate(PAY_LOAD);
  };

  const handleClear = (e) => {
    e.preventDefault();
    setSelectedCity(null);
    setSelectedCampaign(null);
    setDateRange([]);
    setData(initialData);
    setCampaigns([]);
  };

  const handleDateChange = (value) => {
    setDateRange(value);
    if (value.length === 2) {
      datePickerRef.current.closeCalendar();
    }
  };
  
  
   /***** TargetAchieve ****/
  const yesterdayDeals = data.topBarData.deals_sold_yesterday[0]?.deals_sold_yesterday || 0;
  const yesterdayTotalDeals = data.topBarData.deals_sold_yesterday[0]?.number_of_deals || 0;
  const yesterdayPercentage = data.topBarData.deals_sold_yesterday[0]?.percentage_yesterday || 0;

  const monthDeals = data.topBarData.deals_sold_this_month[0]?.deals_sold_this_month || 0;
  const monthTotalDeals = data.topBarData.deals_sold_this_month[0]?.number_of_deals || 0;
  const monthPercentage = data.topBarData.deals_sold_this_month[0]?.percentage_this_month || 0;

  /***** Pitches ****/
  const totalPitches = data.pitchData?.total_pitches || 0;
  const totalBought = data.pitchData?.total_bought || 0;

  /***** Buyer ****/
  const buyerData = data.buyerData || [];

 /***** DoorAnswered ****/
  const doorsAnswered = data.topBarData?.doors_answered || 0;
  const totalKnocks = data.topBarData?.total_knocks || 0;
  const doorsNotAnswered = totalKnocks - doorsAnswered;

  /***** Deal ****/
  const dealData = data.dealData || [];

  const isSearchDisabled = !selectedCity || !selectedCampaign || dateRange.length < 2;

  return (
    
    <div className='dashboard_wrap'>
      
      <div className='dashboard_filter'>
         <div className='left'>
            <span><MdOutlineFilterAlt /> filters</span>
         </div> 
         <div className='right'>
            <form>
              <div className='form_group'>
                <select onChange={handleCityChange} value={selectedCity || ''}>
                  <option value="">select city</option>
                  {
                    citiesData?.data.fetchCity.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className='form_group'>
                <select onChange={(e) => setSelectedCampaign(e.target.value)} value={selectedCampaign || ''}>
                  <option value="">select campaign</option>
                  {
                    campaigns.map(campaign => (
                      <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className='form_group custom_date_picker'>
                  <DatePicker
                    value={dateRange}
                    onChange={handleDateChange}
                    ref={datePickerRef}
                    range
                    numberOfMonths={2}
                    dateSeparator=" - "
                    placeholder="Select Date Range"
                    showOtherDays
                    monthYearSeparator="-"
                  />
              </div>
              <div className='btn_group'>
                <button onClick={handleSearch} disabled={isSearchDisabled}>
                  {mutation.isPending ? (
                        <ButtonLoader />
                      ) : (
                        "search"
                  )}
                </button>
                <button onClick={handleClear} disabled={isSearchDisabled}>clear</button>
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
           
           <div className='box1'>
            <div className='chart_box knocks'> 
                <h2>knocks</h2>
                <p className='txt'>Daywise Statistical Overview</p>
                <Knocks data={data?.knockData} isLoading={mutation.isPending} />
            </div>   
            <div className='chart_box target_achieve'> 
                <h2>Target Achieve</h2>
                <p className='txt'>Number of Deals, sold till now</p>
                <div className='target_chart_wrap'>
                      <div className='target_cover'>
                        <Target 
                          dealsSold={yesterdayDeals} 
                          totalDeals={yesterdayTotalDeals} 
                          percentage={yesterdayPercentage} 
                          title="Yesterday Target Achieve" 
                          isLoading={mutation.isPending}
                        />
                      </div>
                      <div className='target_cover'>
                          <Target
                            dealsSold={monthDeals} 
                            totalDeals={monthTotalDeals} 
                            percentage={monthPercentage} 
                            title="Monthly Target Achieve" 
                            isLoading={mutation.isPending}
                          />
                      </div>
                </div>
            </div>  
           </div>

           <div className='box2'>
            <div className='chart_box usership'> 
                <h2>usership</h2>
                <p className='txt'>Statistical overview of customers, who have bought and didn't bought the deals</p>
                <UsershipChart data={data?.userShipData} isLoading={mutation.isPending} />
            </div>
            <div className='chart_box pitches'> 
                <h2>pitches</h2>
                <p className='txt'>Ratio of pitches listened and buy</p>
                <PitchesChart 
                  totalPitches={totalPitches} 
                  totalBought={totalBought} 
                  isLoading={mutation.isPending} 
                />
            </div> 
           </div>

           <div className='chart_box buyers_chart'> 
              <h2>buyers chart</h2>
              <p className='txt'>Number of deals purchased by unique customers</p>
              <BuyersChart buyerData={buyerData} isLoading={mutation.isPending} />
           </div> 

           <div className='box3'> 
            <div className='chart_box door_answered'> 
                <h2>door answered</h2>
                <p className='txt'>Ratio of Non Associated and Associated Userships</p>
                <DoorAnsweredChart 
                    doorsAnswered={doorsAnswered} 
                    doorsNotAnswered={doorsNotAnswered} 
                    isLoading={mutation.isPending} 
                />
            </div>   
            <div className='chart_box deals'> 
                <h2>deals</h2>
                <p className='txt'>Number of Deals, sold overall</p>
                <DealPieChart dealData={dealData} isLoading={mutation.isPending} />
            </div> 
           </div>

       </div>           
    </div>
  )
}

export default Home