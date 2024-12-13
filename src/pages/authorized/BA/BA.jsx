import React, { useMemo, useRef, useState } from 'react'

/* icons...*/
import { IoChevronForwardOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

/* assets...*/
import UserProfilePic from  '@assets/11.png';

/* components...*/
import Modal from '@components/Modal';
import ButtonLoader from '@components/ButtonLoader';
import TableComponent from '@components/TableComponent';
import PaginationComponent from '@components/PaginationComponent';
import Switch from '@components/Switch';

/* api...*/
import { uploadFile } from '@api/uploadApi';

/* packages...*/
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { parseISO, format } from 'date-fns';

/* styles...*/
import '@styles/_breadCrumb.css';
import '@styles/_table.css';

/* hooks... */
import { useCreateBA, useEditBA, useDeleteBA } from '@hooks/useMutation';
import { useFetchBrandAll, useFetchCity, useFetchBA } from '@hooks/useQuery';

const BA = () => {

  const { register, handleSubmit, formState: { errors }, setValue, clearErrors, reset } = useForm();

    /* Redus State Here...*/
    const userId = useSelector((state) => state.auth.user.id);
    const brandId = useSelector((state) => state.auth.user.brand_id);

    /* UseState Here...*/
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false); 
    const [uploadedImage, setUploadedImage] = useState(''); 
    const [progress, setProgress] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingBA, setEditingBA] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

     /* Variables Here...*/
     const PARAMS = {
      brand_id: brandId || null ,
      page: currentPage,
      perPage: 10,
    };

    const BRAND_PARAMS = {
      page: null,
      perPage: null,
    };


    const queryClient = useQueryClient();
    
    /* Hooks...*/
    const fileInputRef = useRef(null); 

    /* Queries */
    const { data: baData, isLoading: isBaLoading } = useFetchBA(PARAMS);
    const { data: brandData } = useFetchBrandAll(BRAND_PARAMS);
    const { data: citiesData } = useFetchCity();

    /* Mutations */
    const createMutation = useCreateBA(reset, closeModal, handleResetUpload);
    const editMutation = useEditBA(closeModal);
    const deleteMutation = useDeleteBA();
  
    const ba = baData?.data?.ba?.data || [];
    const meta = baData?.data?.ba?.meta || {};

     /* Functions Here...*/
     const onSubmit = (data) => {
      const PAY_LOAD = {
        ...data,
        created_by: parseInt(userId),
        is_active: true
      };
      if (editingBA) {
        const UPDATED_PAY_LOAD = {
          ...PAY_LOAD,
          id: editingBA.ba_id,
          updated_by: parseInt(userId)
        };
        editMutation.mutate(UPDATED_PAY_LOAD);
      } else {
        createMutation.mutate(PAY_LOAD);
      }
    };

    const handleEdit = (ba_id) => {
      const selected = ba.find((org) => org.ba_id === ba_id);
      if (selected) {
        setEditingBA(selected);
        if (selected.dob) {
          const formattedDate = format(parseISO(selected.dob), 'yyyy-MM-dd');
          setValue('dob', formattedDate);
        }
        Object.keys(selected).forEach((key) => {
          if (key !== 'dob') {
            setValue(key, selected[key]);
          }
        });
        setUploadedImage(selected.profile_image);
        setIsModalOpen(true);
      } else {
        toast.error('Failed to find ba data.');
      }
    };
  
     function closeModal() {
      setIsModalOpen(false);
      handleResetUpload();
      clearErrors();
      reset();
    };
  
    const handleToggle = (ba_id, status) => {
      const PAY_LOAD = { 
        id: ba_id,
        is_active: status 
      };
      deleteMutation.mutate(PAY_LOAD);
    };
  
    function handleResetUpload() {
      setUploadedImage('');  
      setProgress(0);        
      setIsUploading(false); 
      if (fileInputRef.current) fileInputRef.current.value = '';
      setValue('profile_image', '');
    };
  
     const handleFileChange = async (e) => {
      setIsUploading(true);
      setProgress(0);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
      const simulateProgress = () => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10; 
        });
      };
      const progressInterval = setInterval(simulateProgress, 100);
      try {
        const response = await uploadFile(formData); 
        clearInterval(progressInterval);
        setProgress(100);
        setUploadedImage(response.data.link); 
        setValue('profile_image', response.data.link);
        toast.success('File uploaded successfully!');
        clearErrors('profile_image');
      } catch (error) {
        clearInterval(progressInterval);
        setProgress(0);
        toast.error('File upload failed.');
      } finally {
        setIsUploading(false);
      }
    };
  
    const openFileDialog = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
     const handleReload = () => {
      queryClient.invalidateQueries({ queryKey: ['ba']});
    };
  
    /* Table code Here...*/
    const handlePageChange = (page) => {
      if (page > 0 && page <= (meta?.totalPages)) {
        setCurrentPage(page);
      }
    };
  
    const columns = [
      { key: "ba_id", label: "ID" },
      {
        key: "profile_image",
        label: "Logo",
        render: (row) => <img 
          src={row.profile_image || UserProfilePic } 
          alt={row.name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = UserProfilePic;
          }} 
        />,
      },
      { key: "user_name", label: "Name" },
      { 
        key: "phone", 
        label: "Phone",
        render: (row) => row.number || "-", 
      },
      { 
        key: "email", 
        label: "Email",
        render: (row) => row.email || "-", 
      },
      { key: "gender", label: "Gender"},
      { 
        key: "created_on", 
        label: "Created Date",
        render: (row) => {
          if (!row.created_on) {
            return '';
          }
          return format(parseISO(row.created_on), 'yyyy-MM-dd');
        }
      },
      { 
        key: "is_active", 
        label: "Status", 
        render: (row) => (
          <Switch
            className={row.is_active ? 'active' : ''}
            isChecked={row.is_active}
            onToggle={() => handleToggle(row.ba_id, !row.is_active)}
          />
        ), 
      },
    ];
  
    /* Filter...*/
    const filteredData = useMemo(() => {
      if (!searchTerm) return ba;
      return ba.filter((item) =>
        item.user_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, ba]);

  
  return (
    <>
      <div className='ba_wrap'>

          {/* BreadCrumb */}
          <div className='top_bar_heading'>
              <h2>BA <span>{meta.total}</span></h2>
              <div className='breadCrumb'>
                <span>home</span>
                <span className='icon'><IoChevronForwardOutline /></span>
                <span>BA</span>
              </div>
          </div>

          {/* Table */}
              <div className='card'>
                <div className='card_header'>
                  <div className='left'> 
                      <span>search:</span>
                      <input
                        type="text"
                        placeholder="search Ba name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
                  <div className='right'> 
                    <div className='btn_reload' onClick={handleReload}>
                      <LuRefreshCw />
                      <button>reload</button>
                    </div>
                    <div className='btn_cover' onClick={() => setIsModalOpen(true)}>
                      <FiPlus />
                      <button>add ba</button>
                    </div>
                  </div>
                </div>
                <div className='card_body'>
                    <TableComponent
                      columns={columns}
                      data={filteredData}
                      isLoading={isBaLoading}
                      skeletonRowCount={10}
                      renderActions={(row) => (
                        <span>
                          <FiEdit onClick={() => handleEdit(row.ba_id)} />
                        </span>
                      )}
                      actionLabel="Action"
                    />
                </div>
                <div className='card_footer'>
                  <div className='left'>
                      <p>
                        Showing {meta.total === 0 ? 0 : (meta.currentPage - 1) * meta.perPage + 1} {' '}
                        to {Math.min(meta.currentPage * meta.perPage, meta.total)} {' '}
                        of {meta.total} entries
                      </p>
                  </div>
                  <div className='right'>
                    {ba.length > 0 && <PaginationComponent meta={meta} onPageChange={handlePageChange} />}
                  </div>
                </div>
              </div>

      </div>

      {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} className={'user_modal'}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3>{editingBA ? 'update BA' : 'BA'}</h3>
            <div className='form_group form_group_upload'>
              <div className='custom_upload' onClick={openFileDialog}>
                  {!isUploading && !uploadedImage && (
                    <div className='upload_cover'>
                      <input type="file" {...register('profile_image', { required: true })} onChange={handleFileChange} ref={fileInputRef} />
                      <button type="button" className='upload_btn'>
                        <span className='icon'>+</span>
                        <span className='txt'>upload</span>
                      </button>
                    </div>
                  )}
                  {isUploading && (
                    <div className='upload_loading'>
                      <span className='loading_title'>uploading...</span>
                      <span className='loading_bar'>
                        <span className='progress' style={{ width: `${progress}%` }}></span>
                      </span>
                    </div>
                  )}
                  {uploadedImage && (
                    <div className='upload_loading'>
                      <img src={uploadedImage} alt="Uploaded" />
                    </div>
                  )}
                  {uploadedImage && (
                    <div className='upload_reset'>
                      <button onClick={handleResetUpload}><FaRegTrashAlt /></button>
                    </div>
                  )}
              </div>
              {errors.profile_image && <p className='error'>image is required</p>}
            </div>
            <div className='inner_form'>
              <div className='form_group'>
                <label>First Name</label>
                <input type="text" {...register('first_name', { required: true })} className='form_control' />
                {errors.first_name && <p className='error'>first name is required</p>}
              </div>

              <div className='form_group'>
                <label>Last Name</label>
                <input type="text" {...register('last_name', { required: true })} className='form_control' />
                {errors.last_name && <p className='error'>last name is required</p>}
              </div>

              <div className='form_group'>
                <label>Phone</label>
                <input type="text" {...register('phone', { required: true })} className='form_control' />
                {errors.phone && <p className='error'>phone is required</p>}
              </div>

              <div className='form_group'>
                <label>Email</label>
                <input type="email" {...register('email', { required: true })} className='form_control' />
                {errors.email && <p className='error'>email is required</p>}
              </div>

              <div className='form_group'>
                <label>Date of Birth</label>
                <input type="date" {...register('dob', { required: true })} className='form_control' />
                {errors.dob && <p className='error'>dob is required</p>} 
              </div>

              <div className="form_group">
                <label>Gender</label>
                <div className="gender_wrap">
                  <div className="radio_label">
                    <input
                      type="radio"
                      value="male"
                      id="male"
                      {...register('gender', { required: true })}
                    />
                    <span htmlFor="male">Male</span>
                  </div>
                  <div className="radio_label">
                    <input
                      type="radio"
                      value="female"
                      id="female"
                      {...register('gender', { required: true })}
                    />
                    <span htmlFor="female">Female</span>
                  </div>
                </div>
                {errors.gender && <p className='error'>Gender is required</p>}
              </div>

              <div className='form_group'>
                <label>BA Code</label>
                <input type="text" {...register('ba_code', { required: true })} className='form_control' />
                {errors.ba_code && <p className='error'>BA Code is required</p>} 
              </div>

              <div className='form_group'>
                <label>Username</label>
                <input type="text" {...register('user_name', { required: true })} className='form_control' />
                {errors.user_name && <p className='error'>username is required</p>} 
              </div>

              <div className='form_group'>
                <label>Password</label>
                <input type="password" {...register('password', { required: true })} className='form_control' />
                {errors.password && <p className='error'>password is required</p>} 
              </div>

              <div className='form_group'>
                <label>Brand</label>
                <select {...register('brand_id', { required: true })}>
                  <option value="">select brand</option>
                  {
                    brandData?.data?.brand?.data?.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))
                  }
                </select>
                {errors.brand_id && <p className='error'>brand is required</p>}
              </div>

              <div className='form_group'>
                <label>City</label>
                <select {...register('city_id', { required: true })}>
                  <option value="">select city</option>
                  {
                    citiesData?.data?.fetchCity?.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))
                  }
                </select>
                {errors.city_id && <p className='error'>city is required</p>}
              </div>

            </div>

            <div className='modal_btn_cover'>
              <button type="submit" className='cancel' onClick={closeModal}>cancel</button>
              <button type="submit" className='btn' disabled={createMutation.isPending || editMutation.isPending}>
                {(createMutation.isPending || editMutation.isPending) ? (
                  <ButtonLoader />
                ) : (
                  editingBA ? 'Update' : 'Create'
                )}
              </button>
            </div>
          </form>
        </Modal>
    </>
  )
}

export default BA
