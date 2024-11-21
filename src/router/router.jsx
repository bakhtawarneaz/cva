import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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


/************* Role Helper *************/
const ProtectedRoute = ({ element, allowedRoles }) => {

    const user = useSelector((state) => state.auth.user);

    if (allowedRoles.includes(Number(user?.role_id))) {
        return element;
    }
};

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
            { path: 'home', element: <ProtectedRoute element={<Home />} allowedRoles={[65, 66, 80, 61, 82]} /> }, 
            { path: 'organization', element: <ProtectedRoute element={<Organization />} allowedRoles={[65]} /> }, 
            { path: 'brand', element: <ProtectedRoute element={<Brand />} allowedRoles={[65]} /> }, 
            { path: 'user', element: <ProtectedRoute element={<User />} allowedRoles={[65]} /> }, 
            { 
                path: 'campaign', 
                element: <ProtectedRoute element={<Campaign />} allowedRoles={[65, 66, 80, 61, 82]} />, 
                children: [
                    { path: '', element: <Navigate to="deal" /> },
                    { path: 'deal', element: <ProtectedRoute element={<Deal />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                    { path: 'gift', element: <ProtectedRoute element={<Gift />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                    { path: 'sample', element: <ProtectedRoute element={<Sample />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                    { path: 'usership', element: <ProtectedRoute element={<Usership />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                    { path: 'customer', element: <ProtectedRoute element={<Customer />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                    { path: 'backCheckerReport', element: <ProtectedRoute element={<BackCheckerReport />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                    { path: 'baPerformance', element: <ProtectedRoute element={<BAPerformance />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                    { path: 'syncHistory', element: <ProtectedRoute element={<SyncHistory />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                    { path: 'baAttendance', element: <ProtectedRoute element={<BAAttendance />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                    { path: 'baCampaign', element: <ProtectedRoute element={<BACampaign />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                    { path: 'town', element: <ProtectedRoute element={<Town />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                    { path: 'area', element: <ProtectedRoute element={<Area />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                    { path: 'team', element: <ProtectedRoute element={<Team />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                    { path: 'videos', element: <ProtectedRoute element={<Videos />} allowedRoles={[65, 66, 80, 61, 82]} /> },
                ]
            },
            { path: 'ba', element: <ProtectedRoute element={<BA />} allowedRoles={[65, 66, 80]} /> },
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