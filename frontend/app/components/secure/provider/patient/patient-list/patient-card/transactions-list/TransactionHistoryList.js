import moment from "moment";
import React, { useState, useEffect } from "react";
import InvoiceService from "../../../../../../../services/api/invoice.service";
import TransactionService from "../../../../../../../services/api/transaction.service";
import Utilities from "../../../../../../../services/commonservice/utilities";
import List from "../../../../../../templates/components/List";
import Table from "../../../../../../templates/components/Table";
import { Dropdown } from "semantic-ui-react";
import RefundTransactionCard from "../../../../transactions/refund-transaction/RefundTransactionCard";
import ModalBox from "../../../../../../templates/components/ModalBox";
import TransactionPreview from "../../../../transactions/transaction-preview/TransactionPreview";
import toast from "react-hot-toast";
import TransactionReceipt from "../../../../transactions/transaction-receipt/TransactionReceipt";
import SendInvoice from "../../../../invoices/send-invoice/SendInvoice";

const TransactionHistoryList = (props) => {
  const [transactions, setTransactions] = useState();
  const [isLoader, setIsLoader] = useState(false);
  const [refundModal, setRefundModal] = useState(false);
  const [selectedTc, setSelectedTc] = useState()
  const [transactionView, setTransactionView] = useState(false)
  const [cancel, setCancel] = useState(false)
  const [showSend, setShowSend] = useState(false)

  const cancelTc = () => {
    TransactionService.voidTransaction(selectedTc.id)
      .then(res => {
        console.log(res)
        toast.success("Transaction cancelled")
        if (props.refresh) {
          props.refresh()
        }
        return setCancel(false)
      })
  }
  useEffect(() => {
    if (props.autoPull) {
      transactionLookup();
    } else if (props.pull) {
      transactionLookup();
    }
  }, [props.autoPull, props.pull, props.keyword]);

  const transactionLookup = () => {
    setIsLoader(true);
    let reqObj = {
      sortField: "transactionDate",
      Asc: "false",
      // PageSize: 10,
      PatientIds: props.patientId,
      StartRow: 0,
      InvoiceStatus: [2, 16]
    };
    TransactionService.findTransaction(reqObj).then((res) => {
      if (Array.isArray(res.data.data)) {
        let newArray = res.data.data.map((item) => {
          return { ...item, amount: item.tenderInfo.totalAmount };
        });
        console.log(newArray);
        setTransactions(newArray.sort((a, b) => b.transactionDate.localeCompare(a.transactionDate)));
      }
      return setIsLoader(false);
    });
  };

  const filters = [
    { statusName: "Created", id: 0 },
    { statusName: "Pending", id: 1 },
    { statusName: "Authorized", id: 2 },
    { statusName: "Posted", id: 3 },
    { statusName: "Failed", id: 5 },
    { statusName: "Void", id: 8 },
    { statusName: "Refunded", id: 9 },
    { statusName: "Approved", id: 10 },
    { statusName: "Void Attempted", id: 11 },
    { statusName: "Refund Attempted", id: 12 },
    { statusName: "Hold", id: 13 },
    { statusName: "Denied", id: 14 },
    { statusName: "Paid", id: 16 },
    { statusName: "Closed", id: 30 },
  ];


  const channelType = [
    { title: 'All', value: 0 },
    { title: 'ACH', value: 2 },
    { title: 'CC', value: 3 },
    { title: 'Debit', value: 4 },
    { title: 'Cash', value: 9 },
    { title: 'Check', value: 10 },
  ]

  const tableConfig = {
    page_size: 10,
    length_menu: [10, 20, 50],
    show_filter: true,
    show_pagination: !transactions || transactions.length < 10 ? false : true,
    pagination: "advance",
    filename: "Equipment",
    button: {
      excel: true,
      print: true,
      csv: true,
      extra: true,
    },
    language: {
      loading_text: "Please be patient while data loads...",
    },
  };

  const tableColumns = [
    {
      key: "createdOn",
      text: "Created On",
      align: "left",
      sortable: true,
      cell: (cell) => moment(cell.createdOn).format("MM/DD/YYYY h:mm a"),
    },
    {
      key: "invoiceNumber",
      text: "Invoice",
      align: "left",
      sortable: true,
    },
    {
      key: "amount",
      text: "Amount",
      align: "left",
      sortable: true,
      cell: (cell) => Utilities.toDollar(cell.amount),
    },
    {
      key: "transactionStatus",
      text: "Status",
      align: "left",
      sortable: true,
      cell: (cell) => { return filters.find((obj) => obj.id === cell.transactionStatus)?.statusName }
    },
    {
      key: "channelType",
      text: "Payment Type",
      align: "left",
      sortable: true,
      cell: (cell => { return channelType.find(obj => obj.value === cell.tenderInfo.channelType).title })
    },
    {
      key: "vendor",
      text: "Vendor",
      align: "left",
      sortable: false,
      cell: (cell => { return cell.tenderInfo.cardType? cell.tenderInfo.cardType : cell.tenderInfo.bankName? cell.tenderInfo.bankName : null })
    },
    {
      key: "accountId",
      text: "Account/Check #",
      align: "left",
      sortable: false,
      cell: (cell => { return cell.tenderInfo.maskCardNumber? cell.tenderInfo.maskCardNumber : cell.tenderInfo.maskAccount? cell.tenderInfo.maskAccount:cell.tenderInfo.checkNumber })
    },
    {
      key: "actionEquipmentType",
      text: "Action",
      align: "center",
      sortable: false,
      cell: (item, i) => {
        // console.log(equipmentType)
        return (
          <div className="row justify-content-center">
            <div className="col-auto">
              <div className="btn-group">
                {item.transactionStatus !== 9 && item.transactionStatus !== 16 ? <button className="p-0 ps-1 btn btn-primary">
                  <i className="icon pencil" title="Edit Transaction" />
                </button> : null}
                {item.transactionStatus !== 12 && item.transactionStatus !== 9 && item.transactionStatus !== 2  && item.tenderInfo.channelType !== 9 && item.tenderInfo.channelType !== 10? <button
                  className="p-0 ps-1 btn btn-primary"
                  onClick={(e, data) => {
                    e.preventDefault;
                    setSelectedTc(item)
                    setRefundModal(true);
                  }}
                >
                  <i className="icons icon dont " title="Refund Transaction">
                  </i>
                </button> : null}
                {item.transactionStatus === 2 &&
                  <button
                    className="p-0 ps-1 btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault;
                      setSelectedTc(item)
                      return setCancel(true)
                    }}
                  >
                    <i className="icons icon dont " title="Cancel Transaction">
                    </i>
                  </button>
                }
                {item.transactionStatus !== 16 && item.transactionStatus !== 9 ? <button className="p-0 ps-1 btn btn-primary">
                  <i className="icon redo" title="Retry" />
                  {/* Needs Work */}
                </button> : null}
                <button className="p-0 ps-1 btn btn-primary" onClick={e => { e.preventDefault(); setSelectedTc(item); setTransactionView(true) }}>
                  <i className="icon eye" title="View Receipt" />
                  {/* // Needs Work */}
                </button>
                <button className="p-0 ps-1 btn btn-primary" onClick={e => { e.preventDefault(); setSelectedTc(item); return setShowSend(true); }}>
                  <i className="icon send" title="Send Receipt" />
                </button>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div title="Transaction History" className="py-3">
      <Table
        records={transactions}
        columns={tableColumns}
        config={tableConfig}
        loading={isLoader}
      />
      <ModalBox
        open={refundModal}
        onClose={() => {
          setRefundModal(false);
        }}
      >
        <RefundTransactionCard
          isModal
          onClose={() => {
            setRefundModal(false);
          }}
          transaction={selectedTc}
        />
      </ModalBox>
      <ModalBox open={transactionView} onClose={() => { setTransactionView(false) }}>
        <TransactionReceipt transaction={{ ...selectedTc }} onClose={() => { setTransactionView(false) }} />
      </ModalBox>
      <ModalBox open={cancel} onClose={() => { setCancel(false) }} title="Cancel">
        <div className='d-flex row justify-content-between'>
          <div className='col-12'>
            Are you sure you want to cancel?
          </div>
          <div className='col-auto mt-3'><button className='btn btn-secondary' onClick={e => { e.preventDefault(); setCancel(false) }}>Close</button></div>
          <div className='col-auto mt-3'><button className='btn btn-primary' onClick={e => { e.preventDefault(); cancelTc() }}>Confirm</button></div>
        </div>
      </ModalBox>
      <ModalBox open={showSend} onClose={()=>{setShowSend(false)}}>
        <SendInvoice transaction={selectedTc} invoiceId={selectedTc?.invoiceId} onClose={()=>{setShowSend(false)}}/>
      </ModalBox>
    </div>
  );
};

export default TransactionHistoryList;
