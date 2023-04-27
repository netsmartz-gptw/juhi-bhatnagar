import React, { useEffect, useState } from "react";
import List from "../../../../templates/components/List";
import PaymentPlanCard from "../paymentPlan-list/paymentPlan-card/PaymentPlanCard";
import AddInvoice from "../../invoices/add-invoice/AddInvoice";
import ModalBox from "../../../../templates/components/ModalBox";
import RecurringPaymentsService from "../../../../../services/api/recurring-payments.service";
import Module from "../../../../templates/components/Module";
import Table from "../../../../templates/components/Table";
import moment from "moment";
import Utilities from "../../../../../services/commonservice/utilities";
import CloseAndWriteOff from "../../transactions/close-and-write-off/CloseAndWriteOff";
import InvoiceService from "../../../../../services/api/invoice.service";
import { add } from "lodash";
import PaymentHistoryList from "../paymentPlan-list/paymentPlan-card/payment-history-accordion/payment-history-list/PaymentHistoryList";
import InvoicePreview from "../../invoices/invoice-preview/InvoicePreview";
import PaymentsList from "../paymentPlan-list/paymentPlan-card/payments-accordion/payments-list/PaymentsList";
// import CommonService from '../../../../../services/api/common.service'

const PaymentPlanTable = (props) => {
  const [paymentPlanList, setPaymentPlanList] = useState();
  // const [keyword, setKeyword] = useState("64Q2M1xn")
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState('Desc')
  const [addInvoice, setAddInvoice] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [cancel, setCancel] = useState(false)
  const [cancelWO, setCancelWO] = useState(false)
  const [closeReason, setCloseReason] = useState()
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState()
  const [startDate, setStartDate] = useState(new Date(moment().startOf("D")).toISOString())
  const [endDate, setEndDate] = useState(new Date(moment().endOf("D").toISOString()))
  const [timePeriod, setTimePeriod] = useState("day")
  const [showPayments, setShowPayments] = useState(false)
  const [showPaymentHistory, setShowPaymentHistory] = useState(false)
  const [viewInvoice, setViewInvoice]=useState(false)

  const changeStart = (date) => {
    if (timePeriod === "quarter") {
      setStartDate(moment(date).startOf("quarter"))
      setEndDate(moment(date).add(2, "M").endOf("M"))
    }
    else if (timePeriod !== "custom") {
      setStartDate(moment(date).startOf(timePeriod[0].toLocaleUpperCase()))
      setEndDate(moment(date).endOf(timePeriod[0].toLocaleUpperCase()))
    }
    paymentPlanLookup()
  }
  const changeRange = () => {
    if (timePeriod === "quarter") {
      setStartDate(moment(startDate).startOf("quarter"))
      setEndDate(moment(startDate).add(2, "M").endOf("M"))
    }
    else if (timePeriod !== "custom") {
      setStartDate(moment(startDate).startOf(timePeriod[0].toLocaleUpperCase()))
      setEndDate(moment(startDate).endOf(timePeriod[0].toLocaleUpperCase()))
    }
  }

  useEffect(() => {
    changeRange()
  }, [timePeriod])
  useEffect(() => {
    paymentPlanLookup()
  }, [])

  const cancelHandler = () => {
    let reqObj = { closeReason: closeReason }
    InvoiceService.closeAndWriteOff(selectedPaymentPlan?.invoiceId, reqObj)
      .then(res => {
        console.log(res)
      })
  }

  const paymentPlanLookup = () => {
    let reqObj = {
      SearchTerm: "",
      isActive: true,
      isRegistered: true,
      SortField: "createdOn",
      Asc: false,
      StartDate: new Date(moment.utc(startDate).startOf('d')).toISOString(),
      EndDate: new Date(moment.utc(endDate).startOf('d')).toISOString(),
    };
    setIsLoader(true);
    RecurringPaymentsService.findRecurringPayments(reqObj)
      .then((res) => {
        if (res) {
          console.log(res);
          setPaymentPlanList(res);
          setIsLoader(false);
        }
      })
      .catch((err) => console.log(err));
    setIsLoader(false);
  };

  const columns = [
    {
      key: "invoiceNumber",
      text: "Invoice Number",
      align: "left",
      sortable: true,
    },
    {
      key: "firstName",
      text: "First Name",
      align: "left",
      sortable: true,
    },
    {
      key: "lastName",
      text: "Last Name",
      align: "left",
      sortable: true,
    },
    {
      key: "createdOn",
      text: "Created On",
      align: "left",
      sortable: true,
      cell: (pp) => { return moment.utc(pp.createdOn).format("M/D/YYYY") }
    },
    {
      key: "nextTransactionDate",
      text: "Next Payment",
      align: "left",
      sortable: true,
      cell: (pp) => { return moment.utc(pp.nextTransactionDate).format("M/D/YYYY") }
    },
    {
      key: "paymentAmount",
      text: "Payment Amount",
      align: "left",
      sortable: true,
      cell: (pp) => { return Utilities.toDollar(pp.paymentAmount) }
    },
    {
      key: "totalPaymentsMade",
      text: "Payments Made",
      align: "left",
      sortable: true,
    },
    {
      key: "totalPaymentLeft",
      text: "Payments Left",
      align: "left",
      sortable: true,
    },
    {
      key: "totalDueAmount",
      text: "Balance",
      align: "left",
      sortable: true,
      cell: (pp) => { return Utilities.toDollar(pp.totalDueAmount) }
    },
    {
      key: "amount",
      text: "Total",
      align: "left",
      sortable: true,
      cell: (pp) => { return Utilities.toDollar(pp.amount) }
    },
    {
      key: "transactionType",
      text: "Status",
      align: "left",
      sortable: true,
      cell: (pp) => pp.status === 1 ? 'Created' : 'In Progress'
    },
    {
      key: "actions",
      text: "Actions",
      align: "center",
      sortable: false,
      cell: (pp) => {
        return <div className="w-100 d-flex justify-content-center"><div className="btn-group">{pp.status === 1 ? <button className="btn btn-primary" onClick={e => { e.preventDefault(); setSelectedPaymentPlan(pp); return setCancel(true) }} title="cancel"><i className="icon dont" /></button>
          : <button className="btn btn-primary" onClick={e => { e.preventDefault(); setSelectedPaymentPlan(pp); return setCancelWO(true) }} title="Cancel & Write Off"><i className="icon dont" /></button>}
          <button className="btn btn-primary" title="View Payment History" onClick={e => { e.preventDefault(); setSelectedPaymentPlan(pp); return setShowPaymentHistory(true) }}><i className="icon history" /></button>
          <button className="btn btn-primary" title="View Upcomming Payments" onClick={e => { e.preventDefault(); setSelectedPaymentPlan(pp); return setShowPayments(true) }}><i className="icon calendar alternate outline" /></button>
          <button className="btn btn-primary" title="View Invoice" onClick={e => { e.preventDefault(); setSelectedPaymentPlan(pp); return setViewInvoice(true) }}><i className="icon eye" /></button></div></div>
      }
    },
  ]

  const config = {
    page_size: 10,
    length_menu: [10, 20, 50],
    show_filter: true,
    show_pagination: true,
    pagination: 'advance',
    filename: "Payment Plan Report",
    button: {
      excel: true,
      print: true,
      csv: true,
      extra: true
    },
    language: {
      loading_text: "Please be patient while data loads..."
    }
  }
  // useEffect(() => {
  //   paymentPlanLookup();
  // }, []);

  return (
    <div className="row d-flex g-4">
      <div className="col-12">
        <Module title="Filters">
          <div className='row d-flex'>
            <div className='col-12 row d-flex justify-content-center mx-0 align-items-end'>
              <div className='col'>
                <div className='ui field'>
                  <label>Time Period</label>
                  <select className='form-select' value={timePeriod} onChange={e => { e.preventDefault(); setTimePeriod(e.target.value) }}>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="quarter">Quarter</option>
                    <option value="year">Year</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              {timePeriod === 'quarter' || timePeriod === 'year' || timePeriod === 'month' ? <div className='col'>
                <div className='ui field'>
                  <label>Year</label>
                  <input type="number" value={moment(startDate).year()} onChange={e => { e.preventDefault(); console.log(e.target.value + 1); setStartDate(new Date(moment(startDate).year(e.target.value)).toISOString()); setEndDate(new Date(moment(endDate).year(e.target.value)).toISOString()); }} />
                </div>
              </div> : null}
              {timePeriod === 'quarter' && <div className='col'>
                <div className='ui field'>
                  <label>Quarter</label>
                  <select className="form-select" value={moment(startDate).quarter()} onChange={e => { e.preventDefault(); setStartDate(moment(startDate).quarter(e.target.value)); setEndDate(moment(endDate).quarter(e.target.value).endOf('quarter')); }}>
                    <option value={1}>Q1</option>
                    <option value={2}>Q2</option>
                    <option value={3}>Q3</option>
                    <option value={4}>Q4</option>
                  </select>
                </div>
              </div>}
              {timePeriod === 'month' && <div className='col'>
                <div className='ui field'>
                  <label>Month</label>
                  <select className="form-select" value={moment(startDate).month() + 1} onChange={e => { e.preventDefault(); console.log(moment(startDate).startOf("M").month(e.target.value - 1).toISOString()); setStartDate(new Date(moment(startDate).startOf("M").month(e.target.value - 1))); setEndDate(new Date(moment(endDate).month(e.target.value - 1).endOf('M'))); return paymentPlanLookup() }}>
                    <option value={1}>January</option>
                    <option value={2}>February</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>
                  </select>
                </div>
              </div>}
              {timePeriod === 'week' || timePeriod === 'day' || timePeriod === 'custom' ? <div className='col'>
                <div className='ui field'>
                  <label>Start Date</label>
                  <input type="date" value={Utilities.toDate(startDate)} onChange={e => { e.preventDefault(); setStartDate(e.target.value) }} onBlur={e => { e.preventDefault(); changeStart(startDate) }} disabled={timePeriod !== 'day' && timePeriod !== 'week' && timePeriod !== 'custom'} />
                </div>
              </div> : null}
              {timePeriod === 'custom' && <div className='col'>
                <div className='ui field'>
                  <label>End Date</label>
                  <input type="date" value={Utilities.toDate(endDate)} onChange={e => { e.preventDefault(); setEndDate(e.target.value); return paymentPlanLookup() }} disabled={timePeriod !== "custom"} />
                </div>
              </div>}
              <div className="col-auto"><button className="btn btn-primary" onClick={e => { e.preventDefault(); paymentPlanLookup() }} title="Pull Report"><i className="icon arrow circle right" /></button></div>
            </div>
          </div>
        </Module>
      </div>
      <div className="col-12">
        <Module title="Payment Plan Report">
          <Table config={config} records={paymentPlanList} loading={isLoader} columns={columns} />
        </Module>
      </div>
      <ModalBox open={addInvoice} onClose={() => setAddInvoice(false)}>
        <AddInvoice />
      </ModalBox>
      <ModalBox open={cancel} onClose={() => { setCancel(false) }} onCloseSuccess={() => { cancelHandler(); if (props.refresh) { props.refresh() }; return setCancel(false) }} size="tiny">
        Why are you cancelling this Invoice? <input type="text" className="mt-3" minLength={10} value={closeReason} onChange={e => { e.preventDefault(); setCloseReason(e.target.value) }} />
      </ModalBox>
      <ModalBox open={cancelWO} onClose={() => { setCancelWO(false) }} size="tiny">
        <CloseAndWriteOff refresh={() => { if (props.refresh) { props.refresh() } }} invoiceId={selectedPaymentPlan?.invoiceId} onClose={() => { setCancelWO(false); if (props.refresh) { props.refresh() } }} />
      </ModalBox>
      <ModalBox open={showPaymentHistory} onClose={() => { setShowPaymentHistory(false) }} title="Payment History">
        {showPaymentHistory && <PaymentHistoryList paymentPlan={selectedPaymentPlan} pull={true} />}
      </ModalBox>
      <ModalBox open={viewInvoice} onClose={() => { setViewInvoice(false) }} title="View Invoice">
        {viewInvoice && <InvoicePreview invoiceId={selectedPaymentPlan?.invoiceId} />}
      </ModalBox>
      <ModalBox open={showPayments} onClose={() => { setShowPayments(false) }} title="Scheduled Payments">
        {showPayments && <PaymentsList paymentPlanId={selectedPaymentPlan?.id}  pull={true}/>}
      </ModalBox>
    </div>
  );
};

export default PaymentPlanTable;
