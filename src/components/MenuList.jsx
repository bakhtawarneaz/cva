import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const MenuList = ({ item, isSidebarCollapsed }) => {

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

        {/* Render submenus only if item has children */}
        {item.children && (
            <>
              {/* Click-based submenu */}
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
              {/* Hover-based submenu for collapsed sidebar */}
              {isSidebarCollapsed && isHovering && (
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
          </>
        )}
      </li>
    </>
  );
};

export default MenuList;
