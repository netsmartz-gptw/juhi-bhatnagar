import moment from "moment";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Dropdown } from "semantic-ui-react";
import TransactionStatusEnum from "../../../../../../../../common/enum/transaction-status.enum";
// import { Dropdown, DropdownHeader } from "semantic-ui-react";
// import Card from "react-bootstrap/Card";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import ModalBox from '../../../../../../templates/components/ModalBox'

import RecurringPaymentsService from "../../../../../../../../services/api/recurring-payments.service";
import ScheduledTransactionService from "../../../../../../../../services/api/scheduled-transaction.service";
import Utilities from "../../../../../../../../services/commonservice/utilities";
// import EditPatient from "../../../edit-patient/EditPatient"
import List from "../../../../../../../templates/components/List";
import ModalBox from "../../../../../../../templates/components/ModalBox";
import PaymentAdjust from "../../payment-adjust/PaymentAdjust";


const PaymentsList = (props) => {
  const [paymentsList, setPaymentsList] = useState();
  const [showAdjust, setShowAdjust] = useState(false)
  const [showMove, setShowMove] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState()
  const [paymentPlan,setPaymentPlan] = useState(props.recurringPayment || {})

  useEffect(() => {
    if (props.autoPull) {
      getRecurringPayment()
      if(!props.paymentPlan){
        pullPaymentsList();
      }
    } else if (props.pull) {
      getRecurringPayment()
      if(!props.paymentPlan){
        pullPaymentsList();
      }
    }
  }, [props.autoPull, props.pull, props.keyword]);

  const transactionStatusList = [
    { 'statusName': 'Created', 'id': 0 },
    { 'statusName': 'Pending', 'id': 1 },
    { 'statusName': 'Authorized', 'id': 2 },
    { 'statusName': 'Posted', 'id': 3 },
    { 'statusName': 'Failed', 'id': 5 },
    { 'statusName': 'Void', 'id': 8 },
    { 'statusName': 'Approved', 'id': 10 },
    { 'statusName': 'Void attempted', 'id': 11 },
    { 'statusName': 'Hold', 'id': 13 },
    { 'statusName': 'Denied', 'id': 14 },
    { 'statusName': 'Success', 'id': 16 },
    { 'statusName': 'Closed', 'id': 30 },
  ];

  const pullPaymentsList = () => {
    return RecurringPaymentsService.getPaymentSchedule({ recurringId: props.paymentPlanId })
      .then((res) => {
        console.log(res);
        setPaymentsList(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRecurringInfo = () =>{
    let reqObj = {InvoiceIds: props.invoiceId}
    RecurringPaymentsService.getPaymentSchedule(reqObj)
    .then(res=>{
      console.log(res)
    })
  }

  const getRecurringPayment = () =>{
    RecurringPaymentsService.getRecurringPaymentsById({recurringId:props.paymentPlanId})
    .then(res=>
      {console.log(res);
      setPaymentPlan(res)})
  }
  const changeShowDetails = (id) => {
    if (id === showDetails) {
      setShowAddress()
    }
    else (
      setShowAddress(id)
    )
  }

  const moveToEnd = () =>{
      let reqObj = {
          operationType: 1,
      }
      ScheduledTransactionService.updateScheduleTransaction(reqObj, selectedPayment.recurringPaymentId, selectedPayment.id)
      .then(res=>{
          toast.success("Recurring TC Updated")
          setShowMove(false)
      })
      .catch(err=>{
        toast.error('Could not reschedule to the end')
        setShowMove(false)
      })
  }
  const payFrequency = {
    0: 'Daily',
    1: 'Weekly',
    2: 'BiWeekly',
    3: 'Monthly',
    4: 'Quarterly',
    5: 'HalfYearly',
    6: 'Annually'
  }
  return (
    <div>
      {paymentsList ? (
        <List >
        <div className="card mb-3 p-3">
            <h5>{paymentPlan.noOfPayments} {payFrequency[paymentPlan.frequency]} Payments of {Utilities.toDollar(paymentPlan.paymentAmount || 0)}</h5>
            <div className="row d-flex">
              <span className="col"><i className="icon calendar alternate" /><strong>First Transaction: </strong>{moment(paymentPlan.firstTransactionDate).format("MM-DD-YYYY")}</span>
              <span className="col"><strong>No. Of Payments: </strong>{paymentPlan.noOfPayments}</span>
              <span className="col"><strong>Total Payments: </strong>{paymentPlan.totalPaymentsMade}</span>
              <span className="col"><strong>Payment Cycle: </strong>{payFrequency[paymentPlan.frequency]} </span>
            </div>
          </div>
          {paymentsList && paymentsList.map((payment, i) => {
            return (
              <div className="card mb-3">
                <div className="card-header row-fluid align-items-center d-flex">
                  <div className='col-12 row d-flex'>
                    <span className="col"><strong>Scheduled on: </strong>  {payment.executionDate != null ? moment(payment.executionDate).format("MM-DD-YYYY") : '--'}</span>
                    <span className="col"><strong>Amount: </strong>{payment.amountDue != null ? Utilities.toDollar(payment.amountDue || 0) : '--'}</span>
                    {payment.transactionStatus != null ? <span className="col"><strong>Status: </strong> {transactionStatusList &&transactionStatusList.find(obj => obj.id === payment.transactionStatus)?.statusName}</span> : null}
                    {payment.transactionDate != null ? <span className="col"><strong>Paid on: </strong> {moment(payment.transactionDate).format("MM-DD-YYYY")}</span> : null}

                  </div>
                  {payment.transactionDate === null && <Dropdown direction="left" icon="ellipsis horizontal" className="m-0 text-center float-right" >
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={e=>{e.preventDefault(); setSelectedPayment(payment); return setShowMove(true)}}>Move to End</Dropdown.Item>
                  <Dropdown.Item onClick={e=>{e.preventDefault(); setSelectedPayment(payment); return setShowAdjust(true)}}>Adjust</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>}


                  {/* <div className='col-auto'>
                               <button 
                               className='btn btn-transparent' 
                               onClick={e => { 
                                 e.preventDefault(); 
                                 setEditNote(payment); 
                                 return setShowEdit(true) 
                                 }} 
                                 title="Edit Note">
                                   <i className='icon pencil' />
                               </button>
                           </div> */}
                  {/* <div className='col-auto'>
                               <button 
                               className='btn btn-transparent' 
                               onClick={e => { 
                                 e.preventDefault(); 
                                 changeShowDetails(i) 
                                 }} 
                                 title="Show Details">
                                   <i className='icon eye slash outline' />
                               </button>
                           </div> */}
                </div>
                <div className="row-fluid align-items-center d-flex p-3">
                  <div className='col-12 d-flex row'>
                    <span className="col"> <strong>Payment Mode: </strong> {payment.cardType ? 'CC' : 'ACH'}</span>
                    <span className="col"><strong>Name on Account: </strong> {payment.accountHolderName}</span>
                    <span className="col"><strong>Account Number: </strong> {payment.maskAccountNumber}</span>
                    <span className="col"><strong>Card Type: </strong> {payment.cardType}</span>
                  </div>

                  {/* <div className='col-auto'>
                               <button 
                               className='btn btn-transparent' 
                               onClick={e => { 
                                 e.preventDefault(); 
                                 setEditNote(payment); 
                                 return setShowEdit(true) 
                                 }} 
                                 title="Edit Note">
                                   <i className='icon pencil' />
                               </button>
                           </div> */}
                  {/* <div className='col-auto'>
                               <button 
                               className='btn btn-transparent' 
                               onClick={e => { 
                                 e.preventDefault(); 
                                 changeShowDetails(i) 
                                 }} 
                                 title="Show Details">
                                   <i className='icon eye slash outline' />
                               </button>
                           </div> */}
                </div>
                {/* {showDetails === i && <div className="card-body" style={{ cursor: 'default' }}>
                           <div className="item">
                               <div className="content">

                                   {
                                       payment.description != '' ?
                                           payment.description : '--'
                                   }
                               </div>
                           </div>
                       </div>} */}
              </div>

            )
          })}
        </List >

      ) : (
        <List
          resultsMessage={
            <span>
              There is currently no Payments for this user.
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAdd(true);
                }}
              >
                Add Invoice
              </a>
            </span>
          }
        ></List>)}
      <ModalBox open={showAdjust} onClose={() => { setShowAdjust(false) }}>
        <PaymentAdjust patientId={paymentPlan?.patientId || props.patientId} payment={selectedPayment} onClose={() => { setShowAdjust(false); return pullPaymentsList() }} />
      </ModalBox>
      <ModalBox open={showMove} onClose={()=>{setShowMove(false)}} onCloseSuccess={()=>{moveToEnd(); return pullPaymentsList()}}>
        Are you sure you want to move this payment to the end?
        </ModalBox>
    </div>
  );
};

export default PaymentsList;


