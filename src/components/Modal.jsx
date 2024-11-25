import React from 'react';
import { IoClose } from "react-icons/io5";
import '@styles/_modal.css';

const Modal = ({ isOpen, onClose, className, children }) => {

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${className}`}>
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
