import { FaHome } from 'react-icons/fa';
import { FaBuilding } from "react-icons/fa";
import { TbBrandCodepen } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { MdCampaign } from "react-icons/md";
import { AiOutlinePartition } from "react-icons/ai";
import { getDynamicPath } from '@helper/PathHelper';

export const MenuItems = [
    {
        title: 'Dashboard',
        path: getDynamicPath('/home'),
        icon: <FaHome />,
    },
    {
        title: 'Organization',
        path: getDynamicPath('/organization'),
        icon: <FaBuilding />,
    },
    {
        title: 'Brand',
        path: getDynamicPath('/brand'),
        icon: <TbBrandCodepen />,
    },
    {
        title: 'User',
        path: getDynamicPath('/user'),
        icon: <FaUsers />,
    },
    {
        title: 'Campaign',
        icon: <MdCampaign />,
        children: [
            { title: 'Campaign', path: getDynamicPath('/campaign') },
            { title: 'Deals', path: getDynamicPath('/campaign', 'deal') },
            { title: 'Gift', path: getDynamicPath('/campaign', 'gift') },
            { title: 'Sample', path: getDynamicPath('/campaign', 'sample') },
            { title: 'Usership', path: getDynamicPath('/campaign', 'usership') },
            { title: 'Customer', path: getDynamicPath('/campaign', 'customer') },
            { title: 'BackCheckerReport', path: getDynamicPath('/campaign', 'backCheckerReport') },
            { title: 'BAPerformance', path: getDynamicPath('/campaign', 'baPerformance') },
            { title: 'SyncHistory', path: getDynamicPath('/campaign', 'syncHistory') },
            { title: 'BAAttendance', path: getDynamicPath('/campaign', 'baAttendance') },
            { title: 'BACampaign', path: getDynamicPath('/campaign', 'baCampaign') },
            { title: 'Town', path: getDynamicPath('/campaign', 'town') },
            { title: 'Area', path: getDynamicPath('/campaign', 'area') },
            { title: 'Team', path: getDynamicPath('/campaign', 'team') },
            { title: 'Videos', path: getDynamicPath('/campaign', 'videos') },
        ],
    },
    {
        title: 'BA',
        path: getDynamicPath('/ba'),
        icon: <AiOutlinePartition />,
    },
  ];