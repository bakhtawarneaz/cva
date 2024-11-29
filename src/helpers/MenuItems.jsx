/* icons...*/
import { FaHome } from 'react-icons/fa';
import { FaBuilding } from "react-icons/fa";
import { TbBrandCodepen } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { MdCampaign } from "react-icons/md";
import { AiOutlinePartition } from "react-icons/ai";

/* helpers...*/
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
        title: 'Campaign List',
        icon: <MdCampaign />,
        children: [
            { title: 'Campaign', path: getDynamicPath('/campaign-list','campaign') },
            { title: 'Deals', path: getDynamicPath('/campaign-list', 'deal') },
            { title: 'Gift', path: getDynamicPath('/campaign-list', 'gift') },
            { title: 'Sample', path: getDynamicPath('/campaign-list', 'sample') },
            { title: 'Usership', path: getDynamicPath('/campaign-list', 'usership') },
            { title: 'Customer', path: getDynamicPath('/campaign-list', 'customer') },
            { title: 'BackCheckerReport', path: getDynamicPath('/campaign-list', 'backCheckerReport') },
            { title: 'BAPerformance', path: getDynamicPath('/campaign-list', 'baPerformance') },
            { title: 'SyncHistory', path: getDynamicPath('/campaign-list', 'syncHistory') },
            { title: 'BAAttendance', path: getDynamicPath('/campaign-list', 'baAttendance') },
            { title: 'Town', path: getDynamicPath('/campaign-list', 'town') },
            { title: 'Area', path: getDynamicPath('/campaign-list', 'area') },
            { title: 'Team', path: getDynamicPath('/campaign-list', 'team') },
            { title: 'Videos', path: getDynamicPath('/campaign-list', 'videos') },
        ],
    },
    {
        title: 'BA',
        path: getDynamicPath('/ba'),
        icon: <AiOutlinePartition />,
    },
  ];