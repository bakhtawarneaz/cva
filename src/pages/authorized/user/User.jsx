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
import { useForm, Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { MuiColorInput, matchIsValidColor } from 'mui-color-input'
import { parseISO, format } from 'date-fns';

/* styles...*/
import '@styles/_breadCrumb.css';
import '@styles/_table.css';

/* hooks... */
import { useCreateUser, useEditUser, useDeleteUser } from '@hooks/useMutation';
import { useFetchRole, useFetchOrganizationsAll, useFetchBrandAll, useFetchCity, useFetchCampaign, useFetchUser } from '@hooks/useQuery';

const User = () => {

  const { register, handleSubmit, formState: { errors }, setValue, clearErrors, reset, control, watch } = useForm(
     {
          defaultValues: {
            primary_color: "#202f5f",
            secondary_color: "#202f5f"
        }
      }
    );

    /* Redus State Here...*/

    /* UseState Here...*/
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false); 
    const [uploadedImage, setUploadedImage] = useState(''); 
    const [progress, setProgress] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [originalUser, setOriginalUser] = useState(null);

     /* Variables Here...*/
     const PARAMS = {
      page: currentPage,
      perPage: 10,
    };

    const ORGANIZATION_PARAMS = {
      page: null,
      perPage: null,
    };

    const BRAND_PARAMS = {
      page: null,
      perPage: null,
    };

    const ROLE_PARAM = {
      "limit": 10,
      "page": 0,
      "columns": "*",
      "sortby": "ASC",
      "orderby": "id",
      "where": "displayed = $1",
      "values": true
    }

    const CAMPAIGN_PARAMS = {
      campaign_id: null,
      brand_id: null,
      city_id: null,
      page: null,
      perPage: null,
    };

    const queryClient = useQueryClient();

    const selectedRoleId = watch("role_id");
    const isOrganizationEnabled = selectedRoleId === "66";
    const isBrandEnabled = selectedRoleId === "80" || selectedRoleId === "61" || selectedRoleId === "82";
    const isCampaignEnabled = selectedRoleId === "61" || selectedRoleId === "82";
    const isCityEnabled = selectedRoleId === "61" || selectedRoleId === "82";
    
    /* Hooks...*/
    const fileInputRef = useRef(null); 

    /* Queries */
    const { data: userData, isLoading: isUserLoading } = useFetchUser(PARAMS);
    const { data: roleData } = useFetchRole(ROLE_PARAM);
    const { data: organizationData } = useFetchOrganizationsAll(ORGANIZATION_PARAMS);
    const { data: brandData } = useFetchBrandAll(BRAND_PARAMS);
    const { data: citiesData } = useFetchCity();
    const { data: campaignsData } = useFetchCampaign(CAMPAIGN_PARAMS);

    /* Mutations */
    const createMutation = useCreateUser(reset, closeModal, handleResetUpload);
    const editMutation = useEditUser(closeModal);
    const deleteMutation = useDeleteUser();
  
    const user = userData?.data?.allUsers?.data || [];
    const meta = userData?.data?.allUsers?.meta || {};

     /* Functions Here...*/
     const onSubmit = (data) => {
      const PAY_LOAD = {
        ...data,
        clientId: (data.clientId === undefined || data.clientId === "") ? 0 : data.clientId,
        brand_id: data.brand_id === "" ? null : data.brand_id,
        campaign_id: data.campaign_id === "" ? null : data.campaign_id,
        city_id: data.city_id === "" ? null : data.city_id,
      };
      if (editingUser) {
        const UPDATED_PAY_LOAD = Object.keys(PAY_LOAD).reduce((updatedFields, key) => {
          if (PAY_LOAD[key] !== originalUser[key]) {
            updatedFields[key] = PAY_LOAD[key];
          }
          return updatedFields;
        }, {});
        editMutation.mutate({ id: editingUser.id, data: UPDATED_PAY_LOAD });
      } else {
        createMutation.mutate(PAY_LOAD);
      }
    };

    const handleEdit = (id) => {
      const selected = user.find((org) => org.id === id);
      if (selected) {
        setEditingUser(selected);
        setOriginalUser(selected);
        setValue('clientId', selected.organization_id === "0" ? "" : selected.organization_id);
        Object.keys(selected).forEach((key) => setValue(key, selected[key]));
        if (selected.role_id !== "66") setValue('clientId', '');
        if (!["80", "61", "82"].includes(selected.role_id)) setValue('brand_id', '');
        if (!["61", "82"].includes(selected.role_id)) setValue('campaign_id', '');
        if (!["61", "82"].includes(selected.role_id)) setValue('city_id', '');
        setUploadedImage(selected.profile_image);
        setIsModalOpen(true);
      } else {
        toast.error('Failed to find user data.');
      }
    };
  
     function closeModal() {
      setIsModalOpen(false);
      setEditingUser(null);
      handleResetUpload();
      clearErrors();
      reset();
    };
  
    const handleToggle = (id, status) => {
      const PAY_LOAD = { 
        enabled: status 
      };
      deleteMutation.mutate({ id, status: PAY_LOAD });
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
      queryClient.invalidateQueries({ queryKey: ['user']});
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
      { key: "username", label: "Name" },
      { 
        key: "number", 
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
        key: "role_name", 
        label: "Role",
        render: (row) => row.role_name || "-",
      },
      { 
        key: "organization_name", 
        label: "Organizations",
        render: (row) => row.organization_name || "-",
      },
      { 
        key: "city_name", 
        label: "City",
        render: (row) => row.city_name || "-",
      },
        
      { 
        key: "dt", 
        label: "Created Date",
        render: (row) => {
          if (!row.dt) {
            return '';
          }
          return format(parseISO(row.dt), 'yyyy-MM-dd');
        }
      },
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
      if (!searchTerm) return user;
      return user.filter((item) =>
        item.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, user]);


  return (
    <>
      <div className='user_wrap'>

          {/* BreadCrumb */}
          <div className='top_bar_heading'>
              <h2>user <span>{meta.total}</span></h2>
              <div className='breadCrumb'>
                <span>home</span>
                <span className='icon'><IoChevronForwardOutline /></span>
                <span>user</span>
              </div>
          </div>

          {/* Table */}
              <div className='card'>
                <div className='card_header'>
                  <div className='left'> 
                      <span>search:</span>
                      <input
                        type="text"
                        placeholder="search user name..."
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
                      <button>add user</button>
                    </div>
                  </div>
                </div>
                <div className='card_body'>
                    <TableComponent
                      columns={columns}
                      data={filteredData}
                      isLoading={isUserLoading}
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
                    {user.length > 0 && <PaginationComponent meta={meta} onPageChange={handlePageChange} />}
                  </div>
                </div>
              </div>

      </div>

      {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} className={'user_modal'}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3>{editingUser ? 'update user' : 'user'}</h3>
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
                <input type="text" {...register('number', { required: true })} className='form_control' />
                {errors.number && <p className='error'>phone is required</p>}
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
                <label>Username</label>
                <input type="text" {...register('username', { required: true })} className='form_control' />
                {errors.username && <p className='error'>username is required</p>} 
              </div>

              <div className='form_group'>
                <label>Password</label>
                <input type="password" {...register('password', { required: true })} className='form_control' />
                {errors.password && <p className='error'>password is required</p>} 
              </div>
              
              <div className='form_group'>
                <label>Role</label>
                <select 
                  {...register('role_id', { required: true })}
                  onChange={(e) => {
                    const selectedRole = e.target.value;
                    setValue('role_id', selectedRole);
                    if (selectedRole !== "66") setValue('clientId', '');
                    if (!["80", "61", "82"].includes(selectedRole)) setValue('brand_id', '');
                    if (!["61", "82"].includes(selectedRole)) setValue('campaign_id', '');
                    if (!["61", "82"].includes(selectedRole)) setValue('city_id', '');
                  }}
                >
                  <option value="">select role</option>
                  {
                    roleData?.data?.list?.data?.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))
                  }
                </select>
                {errors.role_id && <p className='error'>role is required</p>}
              </div>

              <div className='form_group'>
                <label>Organization</label>
                <select 
                  {...register("clientId", {
                    required: isOrganizationEnabled ? "Organization is required" : false,
                  })}
                  disabled={!isOrganizationEnabled}
                >
                  <option value="">select organization</option>
                  {
                    organizationData?.data?.clients?.data?.map(organization => (
                      <option key={organization.id} value={organization.id}>{organization.company}</option>
                    ))
                  }
                </select>
                {errors.clientId && <p className='error'>organization is required</p>}
              </div>

              <div className='form_group'>
                <label>Brand</label>
                <select 
                  {...register("brand_id", {
                    required: isBrandEnabled ? "Brand is required" : false,
                  })}
                  disabled={!isBrandEnabled}
                >
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
                <label>Campaign</label>
                <select 
                  {...register("campaign_id", {
                    required: isCampaignEnabled ? "Campaign is required" : false,
                  })}
                  disabled={!isCampaignEnabled}
                > 
                  <option value="">select campaign</option>
                  {
                    campaignsData?.data?.fetchCampaign?.campaigns?.map(campaign => (
                      <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                    ))
                  }
                </select>
                {errors.campaign_id && <p className='error'>campaign is required</p>}
              </div>

              <div className='form_group'>
                <label>City</label>
                <select 
                  {...register("city_id", {
                    required: isCityEnabled ? "City is required" : false,
                  })}
                  disabled={!isCityEnabled}
                >
                  <option value="">select city</option>
                  {
                    citiesData?.data?.fetchCity?.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))
                  }
                </select>
                {errors.city_id && <p className='error'>city is required</p>}
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
              <button type="button" className='cancel' onClick={closeModal}>cancel</button>
              <button type="submit" className='btn' disabled={createMutation.isPending || editMutation.isPending}>
                {(createMutation.isPending || editMutation.isPending) ? (
                  <ButtonLoader />
                ) : (
                  editingUser ? 'Update' : 'Create'
                )}
              </button>
            </div>
          </form>
        </Modal>
    </>
  )
}

export default User
