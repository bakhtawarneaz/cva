import React from 'react';
import { IoClose } from "react-icons/io5";
import '@styles/_modal.css';

const Modal = ({ isOpen, onClose, children }) => {

   /* Functions Here...*/
  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };


  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className="modal_body">
        <button className="modal_close" onClick={onClose}>
            <IoClose />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
