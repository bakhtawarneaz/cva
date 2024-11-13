import React, { useState } from 'react'
import { IoChevronForwardOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import '@styles/_organization.css';
import '@styles/_table.css';
import Modal from '@components/Modal';
import { useForm } from 'react-hook-form';

const Organization = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();


   /* UseState Here...*/
  const [isModalOpen, setIsModalOpen] = useState(false);


  /* Functions Here...*/
  const onSubmit = (data) => {
    console.log(data);
  };

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

    {/* Modal */}
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form_group'>
          <label>Image</label>
          <input type="file" {...register("image")} />
          {errors.image && <p>{errors.image.message}</p>}
        </div>
        <div className='inner_form'>
          <div className='form_group'>
            <label>Name</label>
            <input type="text" {...register("name")} className='form_control' />
            {errors.name && <p>{errors.name.message}</p>}
          </div>

          <div className='form_group'>
            <label>Phone</label>
            <input type="text" {...register("phone")} className='form_control' />
            {errors.phone && <p>{errors.phone.message}</p>}
          </div>

          <div className='form_group'>
            <label>Email</label>
            <input type="email" {...register("email")} className='form_control' />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <div className='form_group'>
            <label>Website</label>
            <input type="url" {...register("website")} className='form_control' />
            {errors.website && <p>{errors.website.message}</p>}
          </div>

          <div className='form_group'>
            <label>Address</label>
            <textarea {...register("address")} />
            {errors.address && <p>{errors.address.message}</p>}
          </div>

          <div className='form_group'>
            <label>Color</label>
            <input type="color" {...register("color")} />
            {errors.color && <p>{errors.color.message}</p>}
          </div>

        </div>
        <button type="submit">create</button>
      </form>
    </Modal>

    </>
  )
}

export default Organization
