import React, { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

/* icons...*/
import { IoChevronForwardOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";

/* components...*/
import Modal from '@components/Modal';
import ButtonLoader from '@components/ButtonLoader';
import TableComponent from '@components/TableComponent';
import PaginationComponent from '@components/PaginationComponent';
import Switch from '@components/Switch';

/* packages...*/
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { parseISO, format } from 'date-fns';
import DatePicker from "react-multi-date-picker";

/* styles...*/
import '@styles/_breadCrumb.css';
import '@styles/_table.css';
import '@styles/_campaign.css';

/* hooks... */
import { useCreateCampaign, useEditCampaign, useDeleteCampaign } from '@hooks/useMutation';
import { useFetchCampaign, useFetchCity, useFetchBrandAll } from '@hooks/useQuery';

const Campaign = () => {
    const { register, handleSubmit, formState: { errors }, setValue, control, clearErrors, reset } = useForm();

    /* Redus State Here...*/
    const userId = useSelector((state) => state.auth.user.id);

    /* UseState Here...*/
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState([]);

    /* Variables Here...*/
    const PARAMS = {
      page: currentPage,
      per_page: 10,
    };

    const BRAND_PARAMS = {
      page: null,
      perPage: null,
    };

  /* Hooks...*/
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const datePickerRef = useRef(null);


  /* Queries */
  const { data: campaignsData, isLoading: isCampaignLoading } = useFetchCampaign(PARAMS);
  const { data: citiesData } = useFetchCity();
  const { data: brandData } = useFetchBrandAll(BRAND_PARAMS);

  /* Mutations */
  const createMutation = useCreateCampaign(reset, closeModal);
  const editMutation = useEditCampaign(closeModal);
  const deleteMutation = useDeleteCampaign();

  const campaign = campaignsData?.data?.fetchCampaign?.campaigns || [];
  const meta = campaignsData?.data?.fetchCampaign?.meta || {};
  const campaignColumns = campaignsData?.data?.fetchCampaign?.campaignColumns || [];

  

  /* Functions Here...*/
  const onSubmit = (data) => {
    const cityIdsArray = Array.isArray(data.city_ids) ? data.city_ids : [data.city_ids];
    const { dateRange, ...rest } = data;
    const PAY_LOAD = {
      ...rest,
      start_date: format(dateRange[0], 'yyyy-MM-dd'),
      end_date: format(dateRange[1], 'yyyy-MM-dd'),
      created_by: parseInt(userId),
      is_active: true,
      city_ids: cityIdsArray,
      //columnNames:[]
    };
    if (editingCampaign) {
      const UPDATED_PAY_LOAD = {
        ...PAY_LOAD,
        columnNames:campaignColumns
      };
      editMutation.mutate(UPDATED_PAY_LOAD);
    } else {
      createMutation.mutate(PAY_LOAD);
    }
  };

  const handleEdit = (id) => {
    const selected = campaign.find((org) => org.id === id);
    if (selected) {
      setEditingCampaign(selected);
      const startDate = selected.start_date ? parseISO(selected.start_date) : null;
      const endDate = selected.end_date ? parseISO(selected.end_date) : null;
      if (startDate && endDate) {
        setDateRange([startDate, endDate]);
        setValue("dateRange", [startDate, endDate]);
      } else {
        setDateRange([]);
        setValue("dateRange", []);
        toast.error("Invalid date format in campaign data.");
      }
      Object.keys(selected).forEach((key) => setValue(key, selected[key]));
      setIsModalOpen(true);
    } else {
      toast.error('Failed to find campaign data.');
    }
  };

  function closeModal() {
    setIsModalOpen(false);
    setEditingCampaign(null);
    clearErrors();
    reset();
  };

  const handleToggle = (id, status) => {
    const PAY_LOAD = { 
      id, 
      status: status 
    };
    deleteMutation.mutate(PAY_LOAD);
  };

  const handleReload = () => {
    queryClient.invalidateQueries({ queryKey: ['campaign']});
  };

  /* Table code Here...*/
  const handlePageChange = (page) => {
    if (page > 0 && page <= (meta?.totalPages)) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (row) => {
    navigate(`/dashboard/campaign-list/campaign-detail/${row.id}`);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "campaign_type_name", label: "Campaign Type" },
    { key: "start_date", label: "Start Date", render: (row) => format(parseISO(row.start_date), 'yyyy-MM-dd'),  },
    { key: "end_date", label: "End Date", render: (row) => format(parseISO(row.end_date), 'yyyy-MM-dd'), },
    { key: "created_on", label: "Created Date", render: (row) => format(parseISO(row.created_on), 'yyyy-MM-dd'), },
    { 
      key: "is_active", 
      label: "Status", 
      render: (row) => (
        <Switch
          className={row.is_active ? 'active' : ''}
          isChecked={row.is_active}
          onToggle={(e) => {
            e.stopPropagation();
            handleToggle(row.id, !row.is_active)
          }}
        />
      ), 
    },
  ];

  /* Filter...*/
  const filteredData = useMemo(() => {
    if (!searchTerm) return campaign;
    return campaign.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, campaign]);

  return (
   <>
      <div className='campaign_wrap'>

          {/* BreadCrumb */}
          <div className='top_bar_heading'>
              <h2>campaign <span>{meta.total}</span></h2>
              <div className='breadCrumb'>
                <span>home</span>
                <span className='icon'><IoChevronForwardOutline /></span>
                <span>campaign</span>
              </div>
          </div>

          {/* Table */}
              <div className='card'>
                <div className='card_header'>
                  <div className='left'> 
                      <span>search:</span>
                      <input
                        type="text"
                        placeholder="search campaign name..."
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
                      <button>add campaign</button>
                    </div>
                  </div>
                </div>
                <div className='card_body'>
                    <TableComponent
                      columns={columns}
                      data={filteredData}
                      isLoading={isCampaignLoading}
                      skeletonRowCount={10}
                      onRowClick={handleRowClick}
                      renderActions={(row) => (
                        <span>
                            <FiEdit  
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(row.id);
                              }} 
                            />
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
                    {campaign.length > 0 && <PaginationComponent meta={meta} onPageChange={handlePageChange} />}
                  </div>
                </div>
              </div>

      </div>

      {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} className={'campaign_modal'}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3>{editingCampaign ? 'update campaign' : 'campaign'}</h3>
              <div className='inner_form'>
                <div className='form_group'>
                  <label>Campaign Name</label>
                  <input type="text" {...register('name', { required: true })} className='form_control' />
                  {errors.name && <p className='error'>campaign name is required</p>}
                </div>

                <div className='form_group'>
                  <label>Campaign Target Reach</label>
                  <input type="number" {...register('target_reached', { required: true })} className='form_control' />
                  {errors.target_reached && <p className='error'>campaign target is required</p>}
                </div>

                <div className='form_group'>
                  <label>Campaign Productivity</label>
                  <input type="number" {...register('daily_productivity_target', { required: true })} className='form_control' />
                  {errors.daily_productivity_target && <p className='error'>campaign productivity is required</p>}
                </div>

                <div className='form_group'>
                  <label>Daily Target Reach</label>
                  <input type="number" {...register('daily_target', { required: true })} className='form_control' />
                  {errors.daily_target && <p className='error'>daily target is required</p>}
                </div>

                <div className='form_group'>
                  <label>City</label>
                  <select {...register('city_ids', { required: true })}>
                    <option value="">select city</option>
                    {
                      citiesData?.data?.fetchCity?.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))
                    }
                  </select>
                  {errors.city_ids && <p className='error'>city is required</p>}
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
                  <label>Campaign Type</label>
                  <select {...register('campaign_type', { required: true })}>
                    <option value="">select campaign type</option>
                    <option value="1">DTS</option>
                    <option value="2">OnGround</option>
                    <option value="3">InStore</option>
                  </select>
                  {errors.campaign_type && <p className='error'>campaign type is required</p>}
                </div>

                <div className='form_group custom_date_picker'>
                  <label>Start Date & End Date</label>
                    <Controller
                      control={control}
                      name="dateRange"
                      rules={{
                        validate: (value) =>
                          value?.length === 2 || "date is required",
                      }}
                      render={({ field: { onChange } }) => (
                        <DatePicker
                          value={dateRange}
                          onChange={(dates) => {
                            const parsedDates = dates.map((date) => (date instanceof Date ? date : new Date(date)));
                            onChange(parsedDates);
                            setDateRange(parsedDates);
                            if (dates?.length === 2) {
                              datePickerRef.current?.closeCalendar();
                            }
                          }}
                          ref={datePickerRef}
                          range
                          numberOfMonths={2}
                          placeholder="Select Date Range"
                          dateSeparator=" - "
                        />
                      )}
                    />
                    {errors.dateRange && <p className="error">{errors.dateRange.message}</p>}
                </div>
              </div>
            <div className='modal_btn_cover'>
              <button type="button" className='cancel' onClick={closeModal}>cancel</button>
              <button type="submit" className='btn' disabled={createMutation.isPending || editMutation.isPending}>
                {(createMutation.isPending || editMutation.isPending) ? (
                  <ButtonLoader />
                ) : (
                  editingCampaign ? 'Update' : 'Create'
                )}
              </button>
            </div>
          </form>
        </Modal>
    </>
  )
}

export default Campaign
