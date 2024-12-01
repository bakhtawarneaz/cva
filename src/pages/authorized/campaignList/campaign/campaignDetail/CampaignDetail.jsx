import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

/* icons... */
import { IoChevronForward } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";

/* hooks... */
import { useFetchCampaign } from "@hooks/useQuery";
import { useEditCampaign } from "@hooks/useMutation";

/* packages... */
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const CampaignDetail = () => {

    /* Redus State Here...*/
    const userId = useSelector((state) => state.auth.user.id);

  /* Hooks */
  const { id } = useParams();

  /* Query to Fetch Campaign Data */
  const PARAMS = { campaign_id: id };
  const { data: campaignsData } = useFetchCampaign(PARAMS);

  /* Mutations */
  const editMutation = useEditCampaign();

  // Extract campaignColumns and format column names
  const campaignColumns = campaignsData?.data?.fetchCampaign?.campaignColumns || [];
  const formattedColumnNames = campaignColumns.map((col) =>
    col.column_name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );

  /* State Management */
  const [availableItems, setAvailableItems] = useState([]); // Left column items
  const [checkedLeft, setCheckedLeft] = useState([]); // Checked items in the left column
  const [checkedRight, setCheckedRight] = useState([]); // Checked items in the right column
  const [dealMaxQty, setDealMaxQty] = useState("");
  // Use a ref to track if the state has been initialized
  const isInitialized = React.useRef(false);

  // Dynamically initialize availableItems from API response
  useEffect(() => {
    if (campaignsData && !isInitialized.current) {
      const initialAvailableItems = formattedColumnNames.filter(
        (_, index) => campaignColumns[index]?.value === true
      );
      setAvailableItems(initialAvailableItems);

      const dealMaxQuantity = campaignsData?.data?.fetchCampaign.campaigns[0];

      if (dealMaxQuantity?.deal_max_quantity) {
        setDealMaxQty(dealMaxQuantity.deal_max_quantity);
      } 

      isInitialized.current = true; // Mark as initialized
    }
  }, [campaignsData, formattedColumnNames, campaignColumns]);

  // Dynamically derive `selectedItems` for the right column
  const selectedItems = formattedColumnNames.filter(
    (item) => !availableItems.includes(item)
  );

  /* Handlers */

  // Submit API
  const onSubmit = async () => {
    const updatedColumns = campaignColumns.map((col) => {
      const columnNameFormatted = col.column_name
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        ...col,
        value: availableItems.includes(columnNameFormatted), // True if in the left column
      };
    });

    const fetchCampaign = campaignsData?.data?.fetchCampaign.campaigns[0];

    const PAYLOAD = {
      created_by: parseInt(userId),
      ...fetchCampaign,
      deal_max_quantity:dealMaxQty,
      columnNames: updatedColumns,        // Add updated columnNames
    };

    editMutation.mutateAsync(PAYLOAD);
  };

  // Toggle Select All
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

  // Toggle Single Item Selection
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

  // Add Items from Left to Right
  const handleAdd = () => {
    setAvailableItems((prev) =>
      prev.filter((item) => !checkedLeft.includes(item))
    ); // Remove added items from the left column
    setCheckedLeft([]); // Clear checked items in the left column
  };

  // Remove Items from Right to Left
  const handleRemove = () => {
    setAvailableItems((prev) => [...prev, ...checkedRight]); // Add checked items to the left column
    setCheckedRight([]); // Clear checked items in the right column
  };


  return (
    <>
      <div className="campaign_wrap">
        <div className="top_bar_heading">
          <h2>Campaign ID # {id}</h2>
          <button onClick={onSubmit}>save</button>
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
                </li>
              ))}
            </ul>
          </div>

          {/* Center Buttons */}
          <div className="field_cover center">
            <button onClick={handleAdd} disabled={checkedLeft.length === 0}>
              <IoChevronForward />
            </button>
            <button onClick={handleRemove} disabled={checkedRight.length === 0}>
              <IoChevronBackOutline />
            </button>
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
    </>
  );
};

export default CampaignDetail;
