import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const MenuList = ({ item, isSidebarCollapsed }) => {

   /* Hooks Here...*/
  const location = useLocation();
  const submenuRef = useRef(null);

  /* UseState Here...*/
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  /* Functions Here...*/
  const toggleSubmenu = () => {
    if (!isSidebarCollapsed) {
      setIsOpen(!isOpen);
      if (submenuRef.current) {
        submenuRef.current.style.maxHeight = isOpen ? '0' : `${submenuRef.current.scrollHeight}px`;
      }
    }
  };

  /* Variables Here...*/
  const isActive = location.pathname === item.path;

  return (
    <>
      <li
        onMouseEnter={() => isSidebarCollapsed && setIsHovering(true)}
        onMouseLeave={() => isSidebarCollapsed && setIsHovering(false)}
      >
        <Link 
          to={item.path || '#'} 
          onClick={!isSidebarCollapsed && item.children ? toggleSubmenu : null}
          className={isActive ? 'active' : ''}
          >
          {item.icon} <span>{item.title}</span>
          {item.children && (
            <span className='sub_menu_icon'>
              {isOpen ? <FaAngleUp /> : <FaAngleDown />}
            </span>
          )}
        </Link>

         {/* Render the tooltip when sidebar is collapsed and item is being hovered */}
          {isSidebarCollapsed && isHovering && (
            <div className="tooltip visible">{item.title}</div>
          )}

        {/* Render submenu only if sidebar is not collapsed */}
        {!isSidebarCollapsed && item.children && (
          <ul
            ref={submenuRef}
            className={`sub_menu ${isOpen ? 'active' : ''}`}
          >
            {item.children.map((subItem, index) => (
              <li key={index}>
                <Link to={subItem.path} className={location.pathname === subItem.path ? 'active' : ''}>
                  {subItem.title}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* When sidebar is collapsed, render hover-based submenu */}
        {isSidebarCollapsed && isHovering && item.children && (
          <ul className='hover_sub_menu'>
            {item.children.map((subItem, index) => (
              <li key={index}>
                <Link to={subItem.path} className={location.pathname === subItem.path ? 'active' : ''}>
                  {subItem.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    </>
  );
};

export default MenuList;
