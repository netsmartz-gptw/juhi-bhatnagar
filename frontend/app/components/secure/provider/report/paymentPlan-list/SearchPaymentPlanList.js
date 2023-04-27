import React, { useState, useEffect } from "react";
import label from "../../../../../../assets/i18n/en.json";
import Select from "react-select";
import ModalBox from "../../../../templates/components/ModalBox";
import AddInvoice from '../../invoices/add-invoice/AddInvoice'
import moment from "moment";
import Utilities from '../../../../../services/commonservice/utilities'

const SearchPaymentPlanList = (props) => {
  const [keyword, setKeyword] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [sortBy, setSortBy] = useState("Desc");
  console.log(props.paymentPlans)
  const changeKeyword = (kw) => {
    console.log(kw);
    setKeyword(kw);
    if (props.setKeyword) {
      if (kw) {
        props.setKeyword(kw);
      } else {
        props.setKeyword();
      }
    }
  };
  return (
    <div>
      {props.isLoader && (
        <div className="ui">
          <div className="ui active dimmer">
            <div className="ui indeterminate text loader">
              {label.common.processing}
            </div>
          </div>
        </div>
      )}
      {!props.isLoader && (
        <div className="row-fluid">
          <div className="required field">
            <label>Search Payment Plans</label>
            <div className="input-group col-6">
              <Select
                options={props.paymentPlans.sort((a, b) =>
                  a.firstName.localeCompare(b.firstName)
                )}
                name="patientId"
                className="react-select-container"
                classNamePrefix="react-select"
                value={props.paymentPlans.find(
                  (obj) => obj.id === keyword?.paymentPlanId
                )}
                onChange={(e) => {
                  changeKeyword(e);
                }}
                isClearable={true}
                getOptionLabel={(option) => {
                  return (
                    option.invoiceNumber+
                    " | " +
                    option.firstName +
                    " " +
                    option.lastName +
                    " | "+
                    option.noOfPayments + " payments of "
                    + Utilities.toDollar(option.paymentAmount)
                  );
                }}
                getOptionValue={(option) => option.id}
                noOptionsMessage={(e) => {
                  return (
                    <button
                      className="btn btn-primary form-control"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAdd(true);
                      }}
                    >
                      Add Payment Plan
                    </button>
                  );
                }}
              />
              <button
                className="btn btn-primary"
                title="Add Patient"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAdd(true);
                }}
              >
                <i className="icon plus" />
              </button>
            </div>
            
           
                
          </div>
          <ModalBox
            open={showAdd}
            onClose={() => {
              setShowAdd(false);
            }}
         title="Create an Invoice for your Payment Plan" >
            <AddInvoice/>
          </ModalBox>
        </div>
      )}
    </div>
  );
};

export default SearchPaymentPlanList;
