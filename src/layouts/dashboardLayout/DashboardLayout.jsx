import React, { useRef, useState } from 'react'
import {  Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TfiLayoutGrid2 } from "react-icons/tfi";
import { MdOutlineLightMode } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoIosLogOut } from 'react-icons/io';
import { MenuItems } from '@view/MenuItems';
import MenuList from '@components/MenuList';
import AuthFormLogo from  '@assets/cva-logo.png';
import hand from '@assets/hand.gif';
import { RxDashboard } from "react-icons/rx";
import '@styles/_dashboard.css';
import BackToTopButton from '@components/BackToTopButton';
import { logout } from '@slice/authSlice';

const DashboardLayout = () => {

  /* Redux Here...*/
  const token  = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  /* UseState Here...*/
  const [isVisible, setIsVisible] = useState(false);

  /* Variables Here...*/
  const currentYear = new Date().getFullYear();
  const profileRef = useRef(null);

  /* Functions Here...*/
  const toggleVisibility = (event) => {
    event.stopPropagation();
     setIsVisible((prev) => !prev);
   };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);


  if (token === null) {
    return <Navigate to={'/auth/login'} replace />;
  }

  const handleLogout = () => dispatch(logout());

  return (
    <div className='site-wraper'>
      <aside className="sidebar">
        <div className='sider'>
          <div className='sidebar_logo'>
              <div className="site_logo">
                <img src={AuthFormLogo} alt='' />
                <h1>cva</h1>
              </div>
              <div className="toggle_sidebar">
                <div className="toggle_icon">
                  <RxDashboard />
                </div>
              </div>
          </div>
          <ul className='sidebar_menu'>
            {MenuItems.map((item, index) => (
                <MenuList item={item} key={index} />
            ))}
          </ul>
        </div>
      </aside>
      <main className="site_main">
          <header className="main_header">
            <div className='header_left'>
                <h4>welcome - <span>super admin</span> <img src={hand} alt="hand-gif" /></h4>
                <p>Here’s what’s happening today...!</p>
            </div>
            <div className="header-right">
                  <div className='profile_cover'>
                    <div className="icon">
                        <button><MdOutlineLightMode /></button>
                    </div>
                    <div className="icon">
                        <button><TfiLayoutGrid2 /></button>
                    </div>
                    <div className="icon img_icon">
                        <button onMouseDown={toggleVisibility}><FaRegUser /></button>
                        <div ref={profileRef} className={`profile ${isVisible ? 'visible' : ''}`}>
                          <ul>
                            <li onClick={handleLogout}><IoIosLogOut /><span>Log Out</span></li>
                          </ul>
                        </div>
                    </div>
                  </div>
              </div>
          </header>
          <div className='main_body'>
              <Outlet />
          </div>
          <footer>
            <p>© {currentYear} CVA. All Rights Reserved.</p>
          </footer>
      </main>
      <BackToTopButton />
    </div>
  )
}

export default DashboardLayout