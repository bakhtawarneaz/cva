import React, { useRef, useState } from 'react'
import { IoChevronForwardOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import '@styles/_organization.css';
import '@styles/_table.css';
import Modal from '@components/Modal';
import { useForm } from 'react-hook-form';
import { fetchCountry } from '@api/countryApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createOrganization } from '@api/organizationApi';
import { uploadFile } from '@api/uploadApi';
import toast from 'react-hot-toast';
import { FaRegTrashAlt } from "react-icons/fa";
import { useSelector } from 'react-redux';
import ButtonLoader from '@components/ButtonLoader';
import { LuRefreshCw } from "react-icons/lu";
import { CiExport } from "react-icons/ci";
import { getOrganization } from '@api/organizationApi';
import TableComponent from '@components/TableComponent';
import PaginationComponent from '@components/PaginationComponent';
import { FiEdit } from "react-icons/fi";
import { TfiWorld } from "react-icons/tfi";
import { Link } from 'react-router-dom';

const Organization = () => {

  const { register, handleSubmit, formState: { errors }, setValue, clearErrors, reset } = useForm();

  /* Redus State Here...*/
  const userId = useSelector((state) => state.auth.user.id);

   /* UseState Here...*/
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false); 
  const [uploadedImage, setUploadedImage] = useState(''); 
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null); 
  const [currentPage, setCurrentPage] = useState(1);

  /* Variables Here...*/
  const page = 1;
  const perPage = 10;

  const PARAMS = {
    page: currentPage,
    per_page: perPage,
  };

  
  /* Hooks...*/
  const { data: organizationData, isLoading } = useQuery({
    queryKey: ['organization', currentPage],
    queryFn: () => getOrganization(PARAMS),
  });

  const { data: countryData } = useQuery({
      queryKey: ['country'],
      queryFn: () => fetchCountry(),
      staleTime: 10000,
  });

  const mutation = useMutation({
    mutationFn: (payload) => createOrganization(payload),
    onSuccess: () => {
      toast.success('Organization Create Successfully...!');
    },
  });

  const organization = organizationData?.data?.clients?.data || [];
  const meta = organizationData?.data?.clients?.meta || {};


  /* Functions Here...*/
  const onSubmit = (data) => {
    const countryID = countryData?.data?.countries?.find(country => country.name === data.country);
    const PAY_LOAD = {
      ...data,
      country_id: parseInt(countryID.id),
      created_by: parseInt(userId),
    };
    mutation.mutate(PAY_LOAD);
    reset();
    handleResetUpload();
    //closeModal();
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
      setValue('logo', response.data.link);
      toast.success('File uploaded successfully!');
      clearErrors('logo');
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

  const handleResetUpload = () => {
    setUploadedImage('');  
    setProgress(0);        
    setIsUploading(false); 
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
    setValue('logo', '');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clearErrors();
    handleResetUpload();
    reset();
  };

  /* Table code Here...*/

  const handlePageChange = (page) => {
    if (page > 0 && page <= (meta?.totalPages)) {
      setCurrentPage(page);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "logo",
      label: "Logo",
      render: (row) => <img src={row.logo} alt={row.company} />,
    },
    { key: "company", label: "Name" },
    { key: "number", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "website", label: "Website", render: (row) => <Link to={row.website}><TfiWorld /></Link>, },
    { key: "address", label: "Address" },
    { key: "country", label: "Country" },
    { key: "onboarding_date", label: "Onboarding" },
    { key: "enabled", label: "Status" },
  ];



  return (
    <>
    <div className='organization_wrap'>
      
      {/* BreadCrumb */}
      <div className='top_bar_heading'>
          <h2>organization <span>{meta.total}</span></h2>
          <div className='breadCrumb'>
            <span>home</span>
            <span className='icon'><IoChevronForwardOutline /></span>
            <span>organizations</span>
          </div>
      </div>

      {/* Table */}
      <div className='card'>
        <div className='card_header'>
          <div className='left'> 

          </div>
          <div className='right'> 
            <div className='btn_reload'>
               <LuRefreshCw />
               <button>reload</button>
            </div>
            <div className='btn_export'>
                <CiExport />
                <button>export</button>
            </div>
            <div className='btn_cover' onClick={() => setIsModalOpen(true)}>
              <FiPlus />
              <button>add organization</button>
            </div>
          </div>
        </div>
        <div className='card_body'>
            <TableComponent
            columns={columns}
            data={organization}
            isLoading={isLoading}
            renderActions={(row) => (
              <span>
                <FiEdit />
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
            {organization.length > 0 && <PaginationComponent meta={meta} onPageChange={handlePageChange} />}
          </div>
        </div>
      </div>

    </div>

    {/* Modal */}
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>organization</h3>
        <div className='form_group form_group_upload'>
          <div className='custom_upload' onClick={openFileDialog}>
              {!isUploading && !uploadedImage && (
                <div className='upload_cover'>
                  <input type="file" {...register('logo', { required: true })} onChange={handleFileChange} ref={fileInputRef} />
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
          {errors.logo && <p className='error'>image is required</p>}
        </div>
        <div className='inner_form'>
          <div className='form_group'>
            <label>Name</label>
            <input type="text" {...register('name', { required: true })} className='form_control' />
            {errors.name && <p className='error'>name is required</p>}
          </div>

          <div className='form_group'>
            <label>Phone</label>
            <input type="text" {...register('number', { required: true })} className='form_control' />
            {errors.number && <p className='error'>number is required</p>}
          </div>

          <div className='form_group'>
            <label>Email</label>
            <input type="email" {...register('email', { required: true })} className='form_control' />
            {errors.email && <p className='error'>email is required</p>}
          </div>

          <div className='form_group'>
            <label>Website</label>
            <input type="url" {...register('website', { required: true })} className='form_control' />
            {errors.website && <p className='error'>website is required</p>}
          </div>
        </div>

        <div className='form_group form_group_country'>
          <label>Country</label>
          <select {...register('country', { required: true })}>
            <option value="">select country</option>
            {
              countryData?.data?.countries?.map(country => (
                <option key={country.id} value={country.name}>{country.name}</option>
              ))
            }
          </select>
          {errors.country && <p className='error'>country is required</p>}
        </div>

        <div className='form_group form_group_address'>
          <label>Address</label>
          <textarea {...register('address', { required: true })} />
          {errors.address && <p className='error'>address is required</p>}
        </div>

        <div className='form_group form_group_color'>
          <label>Color</label>
          <input type="color" {...register('primary_color', { required: true })} />
          {errors.primary_color && <p className='error'>color is required</p>}
        </div>
        <div className='modal_btn_cover'>
          <button type="submit" className='cancel' onClick={closeModal}>cancel</button>
          <button type="submit" className='btn' disabled={mutation.isPending}>
            {mutation.isPending ? (
                  <ButtonLoader />
                ) : (
                  "create"
            )}
          </button>
        </div>
      </form>
    </Modal>

    </>
  )
}

export default Organization
