import React, { useMemo, useRef, useState } from 'react'

/* icons...*/
import { IoChevronForwardOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { LuRefreshCw } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { TfiWorld } from "react-icons/tfi";

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
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

/* styles...*/
import '@styles/_breadCrumb.css';
import '@styles/_table.css';

/* hooks... */
import { useCreateOrganization, useEditOrganization, useDeleteOrganization } from '@hooks/useMutation';
import { useFetchOrganizations, useFetchCountries } from '@hooks/useQuery';

const Organization = () => {

  const { register, handleSubmit, formState: { errors }, setValue, clearErrors, reset } = useForm();

  /* Redus State Here...*/
  const userId = useSelector((state) => state.auth.user.id);

   /* UseState Here...*/
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false); 
  const [uploadedImage, setUploadedImage] = useState(''); 
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrganization, setEditingOrganization] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  /* Variables Here...*/
  const PARAMS = {
    page: currentPage,
    per_page: 10,
  };
  const queryClient = useQueryClient();
  
  /* Hooks...*/
  const fileInputRef = useRef(null); 

  /* Queries */
  const { data: organizationData, isLoading: isOrganizationsLoading } = useFetchOrganizations(PARAMS);
  const { data: countryData } = useFetchCountries();

  /* Mutations */
  const createMutation = useCreateOrganization(reset, closeModal, handleResetUpload);
  const editMutation = useEditOrganization(closeModal);
  const deleteMutation = useDeleteOrganization();

  const organization = organizationData?.data?.clients?.data || [];
  const meta = organizationData?.data?.clients?.meta || {};


  /* Functions Here...*/
  const onSubmit = (data) => {
    const countryID = countryData?.data?.countries?.find((country) => country.name === data.country);
    const PAY_LOAD = {
      ...data,
      country_id: parseInt(countryID.id),
      created_by: parseInt(userId)
    };
    if (editingOrganization) {
      const UPDATED_PAY_LOAD = {
        ...PAY_LOAD,
        id: editingOrganization.id,
        host: "localhost",
        enabled:editingOrganization.enabled
      };
      editMutation.mutate(UPDATED_PAY_LOAD);
    } else {
      createMutation.mutate(PAY_LOAD);
    }
  };

  const handleEdit = (id) => {
    const selected = organization.find((org) => org.id === id);
    if (selected) {
      setEditingOrganization(selected);
      setValue('name', selected.company);
      Object.keys(selected).forEach((key) => setValue(key, selected[key]));
      setUploadedImage(selected.logo);
      setIsModalOpen(true);
    } else {
      toast.error('Failed to find organization data.');
    }
  };
  
  function closeModal() {
    setIsModalOpen(false);
    setEditingOrganization(null);
    handleResetUpload();
    clearErrors();
    reset();
  };

  const handleToggle = (id, status) => {
    const PAY_LOAD = { 
      id, 
      enabled: status 
    };
    deleteMutation.mutate(PAY_LOAD);
  };

  function handleResetUpload() {
    setUploadedImage('');  
    setProgress(0);        
    setIsUploading(false); 
    if (fileInputRef.current) fileInputRef.current.value = '';
    setValue('logo', '');
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

  const handleReload = () => {
    queryClient.invalidateQueries({ queryKey: ['organization']});
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
    { 
      key: "website", 
      label: "Website", 
      render: (row) => <Link to={row.website}><TfiWorld /></Link>, 
    },
    { key: "address", label: "Address" },
    { key: "country", label: "Country" },
    { key: "onboarding_date", label: "Onboarding" },
    { 
      key: "enabled", 
      label: "Status", 
      render: (row) => (
        <Switch
          className={row.enabled ? 'active' : ''}
          isChecked={row.enabled}
          onToggle={() => handleToggle(row.id, !row.enabled)}
        />
      ), 
    },
  ];

   /* Filter...*/
  const filteredData = useMemo(() => {
    if (!searchTerm) return organization;
    return organization.filter((item) =>
      item.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, organization]);


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
              <span>search:</span>
              <input
                type="text"
                placeholder="search organization here..."
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
              <button>add organization</button>
            </div>
          </div>
        </div>
        <div className='card_body'>
            <TableComponent
              columns={columns}
              data={filteredData}
              isLoading={isOrganizationsLoading}
              skeletonRowCount={10}
              renderActions={(row) => (
                <span>
                  <FiEdit onClick={() => handleEdit(row.id)} />
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
        <h3>{editingOrganization ? 'update organization' : 'organization'}</h3>
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
          <button type="submit" className='btn' disabled={createMutation.isPending || editMutation.isPending}>
            {(createMutation.isPending || editMutation.isPending) ? (
              <ButtonLoader />
            ) : (
              editingOrganization ? 'Update' : 'Create'
            )}
          </button>
        </div>
      </form>
    </Modal>

    </>
  )
}

export default Organization
