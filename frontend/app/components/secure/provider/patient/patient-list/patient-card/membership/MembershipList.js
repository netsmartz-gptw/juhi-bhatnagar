import moment from "moment";
import React, { useEffect, useState } from "react";
import RecurringPaymentsService from "../../../../../../../services/api/recurring-payments.service";
import Utilities from "../../../../../../../services/commonservice/utilities";
import ModalBox from "../../../../../../templates/components/ModalBox";
import Table from '../../../../../../templates/components/Table'
import PaymentHistoryList from "../../../../report/paymentPlan-list/paymentPlan-card/payment-history-accordion/payment-history-list/PaymentHistoryList";
import PaymentsList from "../../../../report/paymentPlan-list/paymentPlan-card/payments-accordion/payments-list/PaymentsList";
import TransactionStatusEnum from "../../../../../../../common/enum/transaction-status.enum";
import InvoicePreview from "../../../../invoices/invoice-preview/InvoicePreview";
const PaymentPlanList = (props) => {
  const [paymentPlanList, setPaymentPlanList] = useState();
  const [isLoader, setIsLoader] = useState(false)
  const [showPayments, setShowPayments] = useState(false)
  const [showPaymentHistory, setShowPaymentHistory] = useState(false)
  const [selectedPP, setSelectedPP] = useState()
  const [viewInvoice, setViewInvoice] = useState(false)
  const paymentPlanLookup = () => {
    setIsLoader(true);
    let reqObj = {
      SearchTerm: "",
      isActive: true,
      isRegistered: true,
      SortField: "createdOn",
      Asc: false,
      PatientIds: props.patientId
    };
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

  useEffect(() => {
    if (props.pull) {
      paymentPlanLookup();
    }
  }, [props.pull]);

  const columns = [
    {
      key: "createdOn",
      text: "Created On",
      align: "left",
      sortable: true,
      cell: (pp) => moment(pp.createdOn).format("MM-DD-YYYY")
    },
    {
      key: "invoiceNumber",
      text: "Invoice Number",
      align: "left",
      sortable: true,
    },
    {
      key: "transactionType",
      text: "Type",
      align: "left",
      sortable: true,
      cell: (pp) => pp.transactionType === 1 ? "Payment Plan" : "Membership"
    },
    {
      key: "totalPaymentsMade",
      text: "Payments Made",
      align: "left",
      sortable: true,
      cell: (pp) => pp.totalPaymentsMade ? pp.totalPaymentsMade : 0
    },
    {
      key: "totalPaymentLeft",
      text: "Payments Left",
      align: "left",
      sortable: true,
    },
    {
      key: "paymentAmount",
      text: "Payment Amount",
      align: "left",
      sortable: true,
      cell: (pp) => Utilities.toDollar(pp.paymentAmount)
    },
    {
      key: "totalAmountPaid",
      text: "Paid",
      align: "left",
      sortable: true,
      cell: (pp) => Utilities.toDollar(pp.totalAmountPaid)
    },
    {
      key: "totalDueAmount",
      text: "Open Balance",
      align: "left",
      sortable: true,
      cell: (pp) => Utilities.toDollar(pp.totalDueAmount)
    },
    {
      key: "totalAmount",
      text: "Total",
      align: "left",
      sortable: true,
      cell: (pp) => Utilities.toDollar(pp.totalAmount)
    },
    {
      key: "status",
      text: "Status",
      align: "left",
      sortable: true,
      cell: (pp) => TransactionStatusEnum[pp.status]
    },
    {
      key: "action",
      text: "Actions",
      align: "left",
      sortable: false,
      cell: (pp) => {
        return <span className="w-100 d-flex justify-content-center">
          <div className="col-auto btn-group">
            <button className="btn btn-primary" title="View Payment History" onClick={e => { e.preventDefault(); setSelectedPP(pp); return setShowPaymentHistory(true) }}><i className="icon history" /></button>
            <button className="btn btn-primary" title="View Upcomming Payments" onClick={e => { e.preventDefault(); setSelectedPP(pp); return setShowPayments(true) }}><i className="icon calendar alternate outline" /></button>
            <button className="btn btn-primary" title="View Invoice" onClick={e => { e.preventDefault(); setSelectedPP(pp); return setViewInvoice(true) }}><i className="icon eye" /></button>
          </div>
        </span>
      }
    },

  ]

  const config = {
    page_size: 10,
    length_menu: [10, 20, 50],
    show_filter: true,
    show_pagination: true,
    pagination: 'advance',
    filename: "Membership List",
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

  return (
    <div className="d-flex row">
      <Table config={config} records={paymentPlanList} loading={isLoader} columns={columns} />
      <ModalBox open={showPaymentHistory} onClose={() => { setShowPaymentHistory(false) }} title="Payment History">
        {showPaymentHistory && <PaymentHistoryList paymentPlan={selectedPP} pull={true} />}
      </ModalBox>
      <ModalBox open={viewInvoice} onClose={() => { setViewInvoice(false) }} title="View Invoice">
        {viewInvoice && <InvoicePreview invoiceId={selectedPP?.invoiceId} />}
      </ModalBox>
      <ModalBox open={showPayments} onClose={() => { setShowPayments(false) }} title="Scheduled Payments">
        {showPayments && <PaymentsList paymentPlanId={selectedPP?.id}  pull={true}/>}
      </ModalBox>
    </div>
  );
};

export default PaymentPlanList;
