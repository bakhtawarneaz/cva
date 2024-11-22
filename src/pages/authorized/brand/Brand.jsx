import React, { useMemo, useRef, useState } from 'react'

/* icons...*/
import { IoChevronForwardOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import { TfiWorld } from "react-icons/tfi";
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
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { MuiColorInput, matchIsValidColor } from 'mui-color-input'
import { parseISO, format } from 'date-fns';

/* styles...*/
import '@styles/_breadCrumb.css';
import '@styles/_table.css';

/* hooks... */
import { useCreateBrand, useEditBrand, useDeleteBrand } from '@hooks/useMutation';
import { useFetchBrand, useFetchCountries, useFetchOrganizations } from '@hooks/useQuery';

const Brand = () => {

    const { register, handleSubmit, formState: { errors }, setValue, clearErrors, reset, control } = useForm(
      {
        defaultValues: {
          primary_color: "#202f5f",
          secondary_color: "#202f5f"
      }
    }
  );

    /* Redus State Here...*/
    const userId = useSelector((state) => state.auth.user.id);

     /* UseState Here...*/
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isUploading, setIsUploading] = useState(false); 
     const [uploadedImage, setUploadedImage] = useState(''); 
     const [progress, setProgress] = useState(0);
     const [currentPage, setCurrentPage] = useState(1);
     const [editingBrand, setEditingBrand] = useState(null);
     const [searchTerm, setSearchTerm] = useState("");
  
     /* Variables Here...*/
    const PARAMS = {
      page: currentPage,
      per_page: 10,
    };

    const PARAMS2 = {
      page: null,
      perPage: null,
    };

    const queryClient = useQueryClient();
    
    /* Hooks...*/
    const fileInputRef = useRef(null); 
  
    /* Queries */
    const { data: brandData, isLoading: isBrandsLoading } = useFetchBrand(PARAMS);
    const { data: countryData } = useFetchCountries();
    const { data: organizationData } = useFetchOrganizations(PARAMS2, 'selectBox');
  
    /* Mutations */
    const createMutation = useCreateBrand(reset, closeModal, handleResetUpload);
    const editMutation = useEditBrand(closeModal);
    const deleteMutation = useDeleteBrand();
  
    const brand = brandData?.data?.brand?.data || [];
    const meta = brandData?.data?.brand?.meta || {};
  
     /* Functions Here...*/
    const onSubmit = (data) => {
      const PAY_LOAD = {
        ...data,
        created_by: parseInt(userId),
      };
      if (editingBrand) {
        const UPDATED_PAY_LOAD = {
          ...PAY_LOAD,
          updated_by: parseInt(userId)
        };
        editMutation.mutate(UPDATED_PAY_LOAD);
      } else {
        createMutation.mutate(PAY_LOAD);
      }
    };

    const handleEdit = (id) => {
      const selected = brand.find((org) => org.id === id);
      if (selected) {
        setEditingBrand(selected);
        if (selected.on_boarding_date) {
          const formattedDate = format(parseISO(selected.on_boarding_date), 'yyyy-MM-dd');
          setValue('on_boarding_date', formattedDate);
        }
        Object.keys(selected).forEach((key) => {
          if (key !== 'on_boarding_date') {
            setValue(key, selected[key]);
          }
        });
        setUploadedImage(selected.app_back_image);
        setIsModalOpen(true);
      } else {
        toast.error('Failed to find brand data.');
      }
    };
  
     function closeModal() {
      setIsModalOpen(false);
      setEditingBrand(null);
      handleResetUpload();
      clearErrors();
      reset();
    };
  
    const handleToggle = (id, status) => {
      const PAY_LOAD = { 
        id, 
        is_active: status 
      };
      deleteMutation.mutate(PAY_LOAD);
    };
  
    function handleResetUpload() {
      setUploadedImage('');  
      setProgress(0);        
      setIsUploading(false); 
      if (fileInputRef.current) fileInputRef.current.value = '';
      setValue('app_back_image', '');
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
        setValue('app_back_image', response.data.link);
        toast.success('File uploaded successfully!');
        clearErrors('app_back_image');
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
      queryClient.invalidateQueries({ queryKey: ['brand']});
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
        key: "app_back_image",
        label: "Logo",
        render: (row) => <img 
          src={row.app_back_image || UserProfilePic } 
          alt={row.name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = UserProfilePic;
          }} 
        />,
      },
      { key: "name", label: "Name" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { 
        key: "website", 
        label: "Website", 
        render: (row) => <Link to={row.website}><TfiWorld /></Link>, 
      },
      { key: "address", label: "Address" },
      { 
        key: "on_boarding_date", 
        label: "Onboarding",
        render: (row) => format(parseISO(row.on_boarding_date), 'yyyy-MM-dd'), 
      },
      { 
        key: "is_active", 
        label: "Status", 
        render: (row) => (
          <Switch
            className={row.is_active ? 'active' : ''}
            isChecked={row.is_active}
            onToggle={() => handleToggle(row.id, !row.is_active)}
          />
        ), 
      },
    ];
  
    /* Filter...*/
    const filteredData = useMemo(() => {
      if (!searchTerm) return brand;
      return brand.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, brand]);

  return (
    <>
      <div className='brand_wrap'>

          {/* BreadCrumb */}
          <div className='top_bar_heading'>
              <h2>brand <span>{meta.total}</span></h2>
              <div className='breadCrumb'>
                <span>home</span>
                <span className='icon'><IoChevronForwardOutline /></span>
                <span>brand</span>
              </div>
          </div>

          {/* Table */}
              <div className='card'>
                <div className='card_header'>
                  <div className='left'> 
                      <span>search:</span>
                      <input
                        type="text"
                        placeholder="search brand name..."
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
                      <button>add brand</button>
                    </div>
                  </div>
                </div>
                <div className='card_body'>
                    <TableComponent
                      columns={columns}
                      data={filteredData}
                      isLoading={isBrandsLoading}
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
                    {brand.length > 0 && <PaginationComponent meta={meta} onPageChange={handlePageChange} />}
                  </div>
                </div>
              </div>

      </div>

      {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3>{editingBrand ? 'update brand' : 'brand'}</h3>
            <div className='form_group form_group_upload'>
              <div className='custom_upload' onClick={openFileDialog}>
                  {!isUploading && !uploadedImage && (
                    <div className='upload_cover'>
                      <input type="file" {...register('app_back_image', { required: true })} onChange={handleFileChange} ref={fileInputRef} />
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
              {errors.app_back_image && <p className='error'>image is required</p>}
            </div>
            <div className='inner_form'>
              <div className='form_group'>
                <label>Name</label>
                <input type="text" {...register('name', { required: true })} className='form_control' />
                {errors.name && <p className='error'>name is required</p>}
              </div>

              <div className='form_group'>
                <label>Phone</label>
                <input type="text" {...register('phone', { required: true })} className='form_control' />
                {errors.phone && <p className='error'>number is required</p>}
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

            <div className='form_group form_group_address'>
              <label>Address</label>
              <textarea {...register('address', { required: true })} />
              {errors.address && <p className='error'>address is required</p>}
            </div>

            <div className='form_group form_group_country'>
              <label>Country</label>
              <select {...register('country_id', { required: true })}>
                <option value="">select country</option>
                {
                  countryData?.data?.countries?.map(country => (
                    <option key={country.id} value={country.id}>{country.name}</option>
                  ))
                }
              </select>
              {errors.country_id && <p className='error'>country is required</p>}
            </div>

            <div className='form_group form_group_country'>
              <label>Organization</label>
              <select {...register('organization_id', { required: true })}>
                <option value="">select organization</option>
                {
                  organizationData?.data?.clients?.data.map(organization => (
                    <option key={organization.id} value={organization.id}>{organization.company}</option>
                  ))
                }
              </select>
              {errors.organization_id && <p className='error'>organization is required</p>}
            </div>

            <div className='brand_color_wrap'>    
              <div className='form_group'>
                <label>On-Boarding Date</label>
                <input type="date" {...register('on_boarding_date', { required: true })} className='form_control' />
                {errors.on_boarding_date && <p className='error'>date is required</p>} 
              </div>
              <div className='form_group'>
                <label>Primary Color</label>
                  <Controller
                    name="primary_color"
                    control={control}
                    rules={{ validate: matchIsValidColor }}
                    render={({ field }) => (
                      <MuiColorInput
                        {...field}
                        format="hex"
                      />
                    )}
                  />
                {errors.primary_color && <p className='error'>primary color is required</p>} 
              </div>
              <div className='form_group'>
                <label>Secondary Color</label>
                  <Controller
                    name="secondary_color"
                    control={control}
                    rules={{ validate: matchIsValidColor }}
                    render={({ field }) => (
                      <MuiColorInput
                        {...field}
                        format="hex"
                      />
                    )}
                  />
                {errors.secondary_color && <p className='error'>secondary color is required</p>} 
              </div>
            </div>

            <div className='modal_btn_cover'>
              <button type="submit" className='cancel' onClick={closeModal}>cancel</button>
              <button type="submit" className='btn' disabled={createMutation.isPending || editMutation.isPending}>
                {(createMutation.isPending || editMutation.isPending) ? (
                  <ButtonLoader />
                ) : (
                  editingBrand ? 'Update' : 'Create'
                )}
              </button>
            </div>
          </form>
        </Modal>
    </>
  )
}

export default Brand
