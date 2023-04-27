import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import List from "../../../../templates/components/List";
import Select from 'react-select'
import PaymentPlanCard from "../paymentPlan-list/paymentPlan-card/PaymentPlanCard";
import AsyncSelect from 'react-select/async'
import AddInvoice from "../../invoices/add-invoice/AddInvoice";
import ModalBox from "../../../../templates/components/ModalBox";
import RecurringPaymentsService from "../../../../../services/api/recurring-payments.service";
import Utilities from "../../../../../services/commonservice/utilities";
import CommonService from "../../../../../services/api/common.service";
import moment from "moment";
import AddPatient from '../../patient/add-patient/AddPatient'

const PaymentPlanList = (props) => {
  const [paymentPlanList, setPaymentPlanList] = useState();
  // const [keyword, setKeyword] = useState("64Q2M1xn")
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState(false)
  const [addInvoice, setAddInvoice] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [patientId, setPatientId] = useState()
  const [showAdd, setShowAdd] = useState(false)

  const patientLoad = (inputText, callBack) => {
    if (inputText?.length < 3) return;
    let reqObj = { SearchTerm: inputText, isActive: true, isRegistered: true, SortField: 'firstName', isAsc: true }
    CommonService.patientLookup(reqObj)
      .then(res => {
        if (res) {
          callBack(res.data)
        }
      }
      )
      .catch(err => console.log(err))
  }
  const rePatientLoad = useCallback(debounce(patientLoad, 500), [])

  const paymentPlanLookup = (patientId) => {
    setPaymentPlanList()
    setIsLoader(true);
    let reqObj = {
      SearchTerm: "",
      SortField: "CreatedOn",
      Asc: sortBy,
      StartRow: 0,
      PageSize: 25,
    };
    if (props.type) {
      reqObj.RecurringTransactionType = props.type
    }
    if (props.patientId || patientId) {
      reqObj.PatientIds = props.patientId || patientId
    }
    RecurringPaymentsService.findRecurringPayments(reqObj)
      .then((res) => {
        if (res) {
          console.log(res);
          if (res) {
            if (props.type) {
              setPaymentPlanList(res);
            }
            else {
              setPaymentPlanList(res)
            }
          }
          else {
            setPaymentPlanList()
          }
        }
        return setIsLoader(false);
      })
      .catch((err) => console.log(err));
    return setIsLoader(false);
  };
  const rePaymentPlanLookup = useCallback(debounce(paymentPlanLookup, 500), [])

  useEffect(() => {
    setIsLoader(true)
    rePaymentPlanLookup(patientId);
  }, [sortBy, patientId]);

  return (
    <div>
      <div className="row">
        <div className="col-md-6 col-12 mb-3">
          <div className="required field">
            <label>Search by Patient</label>
            <div className="input-group col-6">
              {/* <AsyncSelect
                name="patientId"
                className="react-select-container"
                classNamePrefix="react-select"
                loadOptions={rePaymentPlanLoad}
                onChange={(e) => {
                  console.log(e)
                  if (e?.invoiceNumber) {
                      setKeyword(e.invoiceNumber)
                  }
                  else {
                      setKeyword()
                  }
                }}
                isClearable={true}
                getOptionLabel={(option) => {
                  return (
                    option.invoiceNumber +
                    " | " +
                    option.firstName +
                    " " +
                    option.lastName +
                    " | " +
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
              </button> */}
              <AsyncSelect
                classNamePrefix="react-select"
                className="react-select-container"
                name="patientId"
                loadOptions={rePatientLoad}
                placeholder="Search Patient"
                onChange={e => {
                  console.log(e)
                  if (e?.id) {
                    setPatientId(e.id)
                  }
                  else {
                    setPatientId()
                  }
                }}
                isClearable={true}
                getOptionLabel={(option) => {
                  return (
                    option.firstName + ' ' + option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY") + ' | ' + Utilities.toPhoneNumber(option.mobile) || Utilities.toPhoneNumber(option.patientPhone)
                  )
                }
                }
                getOptionValue={(option) => option.id}
                noOptionsMessage={(e) => { return <button className='btn btn-primary form-control' onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add Patient</button> }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="field">
            <label className="me-3">Sort by: </label>
            <select
              className="form-select"
              onChange={(e) => {
                setSortBy(e.target.value);
              }}
            >
              <option value={false} selected>
                Date: Desc
              </option>
              <option value={true} selected>
                Date: Asc
              </option>
            </select>
          </div>
        </div>
      </div>
      <List
        noPaginate
        className="scroll-list"
        isLoading={isLoader}
        style={paymentPlanList && { maxHeight: "60vh" }}
        noResultsMessage={
          <span className="row-fluid">
            <span>There are no payments plans currently setup.</span>{" "}
            <a
              href="#"
              className="p-0 pb-2 text-primary"
              onClick={(e) => {
                e.preventDefault();
                setAddInvoice(true);
              }}
            >
              Click Here to Start an Invoice
            </a>
          </span>
        }
      >
        {Array.isArray(paymentPlanList)
          ? paymentPlanList
            // .sort((a, b) => sortBy === 'Desc' ? b.createdOn.localeCompare(a.createdOn) : a.createdOn.localeCompare(b.createdOn))
            .filter((transaction) => {
              if (keyword === "" || keyword === null || !keyword) {
                return transaction
              } else if (transaction.id == keyword.id) {
                return transaction
              }
            }).map((paymentPlan, i) => {
              return (
                <PaymentPlanCard
                  createdOn={paymentPlan.createdOn}
                  id={paymentPlan.id}
                  paymentPlan={paymentPlan}
                  invoiceId={paymentPlan.invoiceId}
                  key={i}
                  index={i}
                  type={props.type}
                  refresh={paymentPlanLookup}
                />
              );
            })
          : null}
      </List>
      <ModalBox open={addInvoice} onClose={() => setAddInvoice(false)} title="Create an Invoice for your Payment Plan">
        <AddInvoice onClose={() => { setAddInvoice(false) }} />
      </ModalBox>
      <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }}>
        <AddPatient onClose={() => { setShowAdd(false) }} />
      </ModalBox>
    </div >
  );
};

export default PaymentPlanList;
