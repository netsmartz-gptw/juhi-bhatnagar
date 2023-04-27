import React, { useEffect, useState } from "react";
import TransactionService from "../../../../../services/api/transaction.service";
import moment from 'moment'
import InputMask from "react-input-mask";
import Utilities from "../../../../../services/commonservice/utilities";
import DimLoader from "../../../../templates/components/DimLoader";
import toast from "react-hot-toast";
const RefundTransactionCard = (props) => {

  const [inputData, setInputData] = useState(props.initialData || {})
  const [paymentAmount, setPaymentAmount] = useState("partial")
  const [isLoader, setIsLoader] = useState(false)

  // formula for input change
  const inputChange = (e) => {
    if (e.target.name === 'amount' && e.target.value > parseFloat(props.transaction.tenderInfo.amount)) {
      toast.error("You cannot refund more than the invoice amount")
      let newStateObject = { ...inputData };
      newStateObject.amount = props.transaction.tenderInfo.amount
      setInputData(newStateObject);
      return console.log(inputData)
    }
    else if(e.target.name === 'amount'){
        let newStateObject = { ...inputData };
        newStateObject[e.target.name] = parseFloat(e.target.value)
        setInputData(newStateObject);
        return console.log(inputData)
    }
    else {
        let newStateObject = { ...inputData };
        newStateObject[e.target.name] = e.target.value
        setInputData(newStateObject);
        return console.log(inputData)
    }
  };
  const refundTc = () => {
    setIsLoader(true)
    let reqObj = {
      amount: parseInt(inputData.amount),
      remarks: inputData.remarks
    }
    TransactionService.refundTransaction(
      props.transaction.id, reqObj
    )
      .then((res) => {
        setIsLoader(true)
        console.log(res);
        if (props.onClose) {
          props.onClose()
        }
      })
      .catch(err => {
        setIsLoader(false)
      })
  };
  useEffect(() => {
    console.log(props.transaction);
  }, [props.id]);
  useEffect(() => {
    if (paymentAmount === 'full') {
      inputChange({
        target: {
          name: 'amount', value: props.transaction.tenderInfo.amount
        }
      })
    }
  }, [paymentAmount])
  return (
    <div className="row d-flex">
      {isLoader &&
        <DimLoader loadMessage="Processing" />
      }
      <div className="col-12">
        Are you sure you want to refund this transaction for &nbsp;
        {Utilities.toDollar(props.transaction.tenderInfo.amount)} on {moment(props.transaction.createdOn).format('YYYY-MM-DD')} for patient &nbsp;
        {props.transaction.firstName} {props.transaction.lastName}?
      </div>
      <div className="col-12 d-flex my-3 align-items-end">
        <div className="col-auto">
          <div className="form-check">
            <input type="radio" className="form-check-input" checked={paymentAmount === 'partial'} onChange={e => { setPaymentAmount('partial') }} /> <span className="form-check-label">Partial Refund</span>
          </div>
        </div>
        <div className="col-auto ms-4">
          <div className="form-check">
            <input type="radio" className="form-check-input" checked={paymentAmount === 'full'} onChange={e => { setPaymentAmount('full') }} />
            <span className="form-check-label">Full Refund</span>
          </div>
        </div>
      </div>
      {paymentAmount === 'partial' && <div className="col-auto field required">
        <label>Refund Amount</label>
        <input type="number" value={Utilities.toDollar(inputData.amount)} name="amount" onChange={e => { e.preventDefault(); inputChange(e) }} step=".01" />
      </div>}
      <div className="field required col">
        <label>Reason</label>
        <input type="text" value={inputData.remarks} name="remarks" onChange={e => { e.preventDefault(); inputChange(e) }} />
      </div>
      <div className="col-12 mt-3 d-flex justify-content-between">
        <div className="col-auto">
          <button className="btn btn-secondary" onClick={e => { e.preventDefault(); if (props.onClose) { props.onClose() } }}>Close</button>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={e => { e.preventDefault(); refundTc() }}
          >Refund</button>
        </div>
      </div>
    </div>
  );
};

export default RefundTransactionCard;
