import React from "react";
import '@styles/_drawer.css';
import { IoCloseCircleOutline } from "react-icons/io5";

const Drawer = ({ isOpen, onClose, title, children, handleSave, disabled, btnTitle }) => {

  return (
    <>
      <div className={`drawer_overlay ${isOpen ? "visible" : ""}`}>
        <div className={`drawer ${isOpen ? "open" : ""}`}>
            <div className="drawer_header">
            <h3>{title}</h3>
            <button className="close-btn" onClick={onClose}>
                <IoCloseCircleOutline size={24} />
            </button>
            </div>
            <div className='drawer_body'>
                {children}
            </div>
            <div className='drawer_footer'>
                <button className="btn-1" onClick={onClose}>cancel</button>
                <button 
                  className="btn-2" 
                  onClick={handleSave}
                  disabled={disabled}
                >{btnTitle}</button>
            </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
