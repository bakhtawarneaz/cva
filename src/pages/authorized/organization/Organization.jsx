import React, { useState } from 'react'
import { IoChevronForwardOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import '@styles/_organization.css';
import '@styles/_table.css';
import Modal from '@components/Modal';

const Organization = () => {

   /* UseState Here...*/
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <div className='organization_wrap'>
      
      {/* BreadCrumb */}
      <div className='top_bar_heading'>
          <h2>
            <span>home</span>
            <span className='icon'><IoChevronForwardOutline /></span>
            <span>organizations</span>
          </h2>
      </div>

      {/* Table */}
      <div className='card'>
        <div className='card_header'>
          <div className='left'> 

          </div>
          <div className='right'> 
            <div className='btn_cover' onClick={() => setIsModalOpen(true)}>
              <FiPlus />
              <button>add organization</button>
            </div>
          </div>
        </div>
        <div className='card_body'>

        </div>
        <div className='card_footer'>

        </div>
      </div>

    </div>

    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <h2>Modal Title</h2>
      <p>This is the modal content.</p>
    </Modal>

    </>
  )
}

export default Organization
