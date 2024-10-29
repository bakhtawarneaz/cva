import { createBrowserRouter, Navigate } from 'react-router-dom';


/************* Un Authorized *************/

import Login from  '@unAuthPages/login/Login';
import DashboardLayout from  '@layouts/dashboardLayout/DashboardLayout';
import AuthLayout from  '@layouts/authLayout/AuthLayout';

/************* Authorized *************/

import Home from '@authPages/home/Home';
import Organization from '@authPages/organization/Organization';
import Brand from '@authPages/brand/Brand';
import User from '@authPages/user/User';
import Campaign from '@authPages/campaign/Campaign';
import BA from '@authPages/ba/BA';


/************* Sub Menu *************/
import Deal from '@authPages/deal/Deal';
import Gift from '@authPages/gift/Gift';
import Sample from '@authPages/sample/Sample';
import Usership from '@authPages/usership/Usership';
import Customer from '@authPages/customer/Customer';
import BackCheckerReport from '@authPages/backCheckerReport/BackCheckerReport';
import BAPerformance from '@authPages/baPerformance/BAPerformance';
import SyncHistory from '@authPages/syncHistory/SyncHistory';
import BAAttendance from '@authPages/baAttendance/BAAttendance';
import BACampaign from '@authPages/baCampaign/BACampaign';
import Town from '@authPages/town/Town';
import Area from '@authPages/area/Area';
import Team from '@authPages/team/Team';
import Videos from '@authPages/videos/Videos';

/************* Not Found Links *************/
import NotFound from '@components/NotFound';




const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/auth/login" />,
        errorElement: <NotFound />,
    },
    {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
            { path: '', element: <Navigate to="home" /> },
            { path: 'home', element: <Home /> },
            { path: 'organization', element: <Organization /> },
            { path: 'brand', element: <Brand /> },
            { path: 'user', element: <User /> },
            { 
                path: 'campaign', 
                element: <Campaign />,
                children: [
                    { path: '', element: <Navigate to="deal" /> },
                    { path: 'deal', element: <Deal /> },
                    { path: 'gift', element: <Gift /> },
                    { path: 'sample', element: <Sample /> },
                    { path: 'usership', element: <Usership /> },
                    { path: 'Customer', element: <Customer /> },
                    { path: 'backCheckerReport', element: <BackCheckerReport /> },
                    { path: 'baPerformance', element: <BAPerformance /> },
                    { path: 'syncHistory', element: <SyncHistory /> },
                    { path: 'baAttendance', element: <BAAttendance /> },
                    { path: 'baCampaign', element: <BACampaign /> },
                    { path: 'town', element: <Town /> },
                    { path: 'area', element: <Area /> },
                    { path: 'team', element: <Team /> },
                    { path: 'videos', element: <Videos /> },
                ]
            },
            { path: 'ba', element: <BA /> }
        ],
        errorElement: <NotFound />,
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            { path: '', element: <Navigate to="login" /> },
            { path: 'login',element: <Login /> }
        ],
        errorElement: <NotFound />,
    },
]);

export default router;