import React, { useState, useEffect } from "react";
import moment from 'moment'
// import { Dropdown, DropdownHeader } from "semantic-ui-react";
// import Card from "react-bootstrap/Card";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import ModalBox from '../../../../../../templates/components/ModalBox'

import RecurringPaymentsService from "../../../../../../../../services/api/recurring-payments.service";
// import EditPatient from "../../../edit-patient/EditPatient"
import List from "../../../../../../../templates/components/List";
import InvoiceService from "../../../../../../../../services/api/invoice.service";
import TransactionService from "../../../../../../../../services/api/transaction.service";
import Utilities from "../../../../../../../../services/commonservice/utilities";
import TransactionStatusEnum from "../../../../../../../../common/enum/transaction-status.enum";
import ModalBox from "../../../../../../../templates/components/ModalBox";
import TransactionStatus from "../../../../../transactions/transaction-status/TransactionStatus";


const PaymentHistoryList = (props) => {
  const [paymentHistoryList, setPaymentHistoryList] = useState();
  const [editAddress, setEditAddress] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [viewDetails, setViewDetails] = useState(false)


  useEffect(() => {
    if (props.autoPull) {
      pullPaymentHistoryList();
    } else if (props.pull) {
      pullPaymentHistoryList();
    }
  }, [props.autoPull, props.pull, props.keyword]);

  console.log(props.paymentPlan)

  const pullPaymentHistoryList = () => {
    if (props.paymentPlan.invoiceNumber) {
      let reqObj = {
        InvoiceNo: props.paymentPlan.invoiceNumber,
        SortField: 'transactionDate',
        Asc: false
      }
      // return RecurringPaymentsService.findRecurringPayments(props.paymentPlanId)
      return TransactionService.findTransaction(reqObj)
        .then((res) => {
          console.log(res.data.data);
          if (Array.isArray(res.data.data)) {
            setPaymentHistoryList(res.data.data);
          }
          else {
            setPaymentHistoryList([res.data.data])
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };



  return (
    <div>
      <List noPaginate noResultsMessage="No Payment History Available">
        {paymentHistoryList && paymentHistoryList.map((payment, i) => {
          return (
          <TransactionStatus payment={payment}/>
          )
        })}
      </List >

    </div>
  );
};

export default PaymentHistoryList;


