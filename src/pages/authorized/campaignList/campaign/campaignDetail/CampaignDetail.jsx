import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

/* icons... */
import { IoChevronForward } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";

/* hooks... */
import { useFetchCampaign } from "@hooks/useQuery";
import { useEditCampaign } from "@hooks/useMutation";

/* packages... */
import { useSelector } from "react-redux";

/* components...*/
import ButtonLoader from '@components/ButtonLoader';
import Drawer from '@components/Drawer';

const CampaignDetail = () => {

  /* Redus State Here...*/
  const userId = useSelector((state) => state.auth.user.id);

  /* Hooks */
  const { id } = useParams();
  const isInitialized = React.useRef(false);

  /* Query to Fetch Campaign Data */
  const PARAMS = { campaign_id: id };
  const { data: campaignsData } = useFetchCampaign(PARAMS);

  /* Mutations */
  const editMutation = useEditCampaign();

  const campaignColumns = campaignsData?.data?.fetchCampaign?.campaignColumns || [];
  const campaigs = campaignsData?.data?.fetchCampaign?.campaigns || [];

  
  const permissionFields = campaigs.length
  ? Object.keys(campaigs[0])
      .filter((key) => key.startsWith("is_"))
      .map((key) => ({ key, value: campaigs[0][key] }))
  : [];

  const formattedColumnNames = campaignColumns.map((col) =>
    col.column_name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );

  /* UseState Here...*/
  const [availableItems, setAvailableItems] = useState([]); 
  const [checkedLeft, setCheckedLeft] = useState([]); 
  const [checkedRight, setCheckedRight] = useState([]); 
  const [dealMaxQty, setDealMaxQty] = useState("");
  const [sampleMaxQty, setSampleMaxQty] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  //const [permissionFields, setPermissionFields] = useState([]);

 /* useEffect Here...*/
  useEffect(() => {
    if (campaignsData && !isInitialized.current) {
      const initialAvailableItems = formattedColumnNames.filter(
        (_, index) => campaignColumns[index]?.value === true
      );
      setAvailableItems(initialAvailableItems);

      const dealMaxQuantity = campaignsData?.data?.fetchCampaign.campaigns[0];
      const sampleMaxQuantity = campaignsData?.data?.fetchCampaign.campaigns[0];

      if (dealMaxQuantity?.deal_max_quantity) {
        setDealMaxQty(dealMaxQuantity.deal_max_quantity);
      } 
      if (sampleMaxQuantity?.sample_max_quantity) {
        setSampleMaxQty(sampleMaxQuantity.sample_max_quantity);
      } 

      isInitialized.current = true;
    }
  }, [campaignsData, formattedColumnNames, campaignColumns]);


  const selectedItems = formattedColumnNames.filter(
    (item) => !availableItems.includes(item)
  );

  const handlePermissionChange = (key, value) => {
    const updatedFields = permissionFields.map((field) =>
      field.key === key ? { ...field, value: value } : field
    );

  };

  /* Functions Here...*/
  const onSubmit = async () => {
    const updatedColumns = campaignColumns.map((col) => {
      const columnNameFormatted = col.column_name
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        ...col,
        value: availableItems.includes(columnNameFormatted),
      };
    });
    const fetchCampaign = campaignsData?.data?.fetchCampaign.campaigns[0];
    const PAYLOAD = {
      created_by: parseInt(userId),
      ...fetchCampaign,
      deal_max_quantity:dealMaxQty,
      sample_max_quantity:sampleMaxQty,
      columnNames: updatedColumns,   
    };

    editMutation.mutateAsync(PAYLOAD);
  };


  const handleSelectAll = (isLeft) => {
    if (isLeft) {
      setCheckedLeft(
        checkedLeft.length === availableItems.length ? [] : [...availableItems]
      );
    } else {
      setCheckedRight(
        checkedRight.length === selectedItems.length ? [] : [...selectedItems]
      );
    }
  };

  const handleSingleSelect = (item, isLeft) => {
    if (isLeft) {
      setCheckedLeft((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    } else {
      setCheckedRight((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    }
  };

  const handleAdd = () => {
    setAvailableItems((prev) =>
      prev.filter((item) => !checkedLeft.includes(item))
    ); 
    setCheckedLeft([]);
  };

  
  const handleRemove = () => {
    setAvailableItems((prev) => [...prev, ...checkedRight]); 
    setCheckedRight([]);
  };


  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);


  return (
    <>
      <div className="campaign_wrap">
        <div className="top_bar_heading">
          <h2>Campaign ID # {id}</h2>
          <div className="camD_btn">
              <div className="camD_btn_wrap">
                <button onClick={handleAdd} disabled={checkedLeft.length === 0}>
                  <IoChevronForward />
                </button>
                <button onClick={handleRemove} disabled={checkedRight.length === 0}>
                  <IoChevronBackOutline />
                </button>
              </div>
              <button className='btn2' disabled={editMutation.isPending} onClick={onSubmit}>
                {(editMutation.isPending) ? (
                  <ButtonLoader />
                ) : (
                  'save'
                )}
              </button>
              <button className="btn1" onClick={openDrawer}>permission</button>
          </div>
        </div>

        <div className="field_wrap">
          {/* Left Column */}
          <div className="field_cover left">
            <div className="field_card_header">
              <div className="check_cover">
                <input
                  type="checkbox"
                  onChange={() => handleSelectAll(true)}
                  disabled={availableItems.length === 0}
                  checked={
                    checkedLeft.length === availableItems.length &&
                    availableItems.length > 0
                  }
                />
              </div>
              <div className="disc">
                <h3>Available Fields</h3>
                <span>
                  ({checkedLeft.length}/{availableItems.length}) selected
                </span>
              </div>
            </div>
            <ul>
              {availableItems.map((item) => (
                <li key={item}>
                  <input
                    type="checkbox"
                    checked={checkedLeft.includes(item)}
                    onChange={() => handleSingleSelect(item, true)}
                  />
                  <span>{item}</span>
                  {item === "Deal Max Quantity" && ( 
                    <input
                      type="text"
                      value={dealMaxQty}
                      onChange={(e) => {setDealMaxQty(e.target.value)}}
                      placeholder="Deal Max Quantity"
                    />
                  )}
                  {item === "Sample Max Quantity" && ( 
                    <input
                      type="text"
                      value={sampleMaxQty}
                      onChange={(e) => {setSampleMaxQty(e.target.value)}}
                      placeholder="Sample Max Quantity"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div className="field_cover right">
            <div className="field_card_header">
              <div className="check_cover">
                <input
                  type="checkbox"
                  onChange={() => handleSelectAll(false)}
                  disabled={selectedItems.length === 0}
                  checked={
                    checkedRight.length === selectedItems.length &&
                    selectedItems.length > 0
                  }
                />
              </div>
              <div className="disc">
                <h3>Selected Fields</h3>
                <span>
                  ({checkedRight.length}/{selectedItems.length}) selected
                </span>
              </div>
            </div>
            <ul>
              {selectedItems.map((item) => (
                <li key={item}>
                  <input
                    type="checkbox"
                    checked={checkedRight.includes(item)}
                    onChange={() => handleSingleSelect(item, false)}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Drawer */}
        <Drawer 
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          title="Manage Permissions"
        >
          {permissionFields.map(({ key, value }) => (
            <div key={key} className="permission-item">
              <label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePermissionChange(key, e.target.checked)}
                />
                {key.replace("is_", "").replace(/_/g, " ").toUpperCase()}
              </label>
            </div>
          ))}
        </Drawer>
    </>
  );
};

export default CampaignDetail;
