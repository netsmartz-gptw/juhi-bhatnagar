import React, { useState, useEffect } from 'react'
import { Dropdown } from "semantic-ui-react";
// import label from '../../../../../../assets/i18n/en.json'
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"
import InvoiceService from "../../../../../../../../services/api/invoice.service";
import InvoiceCard from '../../../../../invoices/invoice-card/InvoiceCard'
import List from "../../../../../../../templates/components/List";
import moment from 'moment'
import Utilities from '../../../../../../../../services/commonservice/utilities';
import ModalBox from '../../../../../../../templates/components/ModalBox';
import OpenBalanceCard from './OpenBalanceCard';
import AddInvoice from '../../../../../invoices/add-invoice/AddInvoice';
import toast from 'react-hot-toast';
// import moment from 'moment'
// import ModalBox from '../../../../templates/components/ModalBox'
// import OpenBalancesEdit from '../note-edit/OpenBalancesEdit'
// import OpenBalancesAdd from '../note-add/OpenBalancesAdd'

const OpenBalancesList = (props) => {
  const [invoiceBalances, setInvoiceBalances] = useState()
  const [showAdd, setShowAdd] = useState(false)
  const [openBalance, setOpenBalance] = useState(0)
  // useEffect(() => {
  //   if (props.autoPull) {
  //     pullInvoiceBalances()
  //   }
  //   else if (props.pull) {
  //     pullInvoiceBalances()
  //   }
  // }, [props.autoPull, props.pull])

  // useEffect(() => {
  //   pullInvoiceBalances()
  // }, [props.keyword])

  const pullInvoiceBalances = () => {
    let reqObj = {
      sortField: 'dueDate',
      Asc: 'false',
      PatientIds: [props.patientId],
      StartRow: 0,
      // InvoiceStatuses: '1,2,5,6,7,8,10',
      InvoiceStatuses: '1,2,5,6,8,10',
    }
    InvoiceService.findInvoice(reqObj)
      .then((res) => {
        let balance = 0;
        if (res.length) {
          if (Array.isArray(res) === true) {
            setInvoiceBalances(res.sort((a, b) => b.dueDate.localeCompare(a.dueDate)))
          }
          else {
            setInvoiceBalances([res]);
          }
        }
        else {
          setInvoiceBalances();
        }
      })
      .catch((err) => {
        console.log(err);
      });

  }

  // const changeShowDetails = (id) => {
  //     if (id === showDetails) {
  //         setShowDetails()
  //     }
  //     else (
  //         setShowDetails(id)
  //     )
  // }
  // console.log(props.patientId)

  useEffect(() => {
    if (invoiceBalances) {
      let total = 0
      invoiceBalances.forEach(obj => { console.log(obj); total += obj.finalAmount })
      return setOpenBalance(total)
    }
  }, [invoiceBalances])
  useEffect(() => {
    setInvoiceBalances(props.balances)
  }, [props.balances])
  return (
    <div className="row d-flex g-4">
      <div className='col-12'>
        <div className='btn btn-primary w-100 p-3'><h5 className='text-white'><strong>Open Balance Sum: {openBalance && Utilities.toDollar(openBalance)}</strong></h5></div>
      </div>
      {invoiceBalances ? invoiceBalances.map((invoice, idx) => (
        <div className='col-md-4 col-12'>
          <OpenBalanceCard invoice={invoice} />
        </div>
        // <div className='row-fluid col-12'> 
        //         <InvoiceCard transaction={invoice}/>
        // </div>
      ))
        :
        <div>
          <div className="ui warning message mt-3 segment p-3 shadow-sm">
            <span>There are currently no balances for this user. <a href="#" onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add Balance</a></span>
          </div>
        </div>
      }
      <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }}>
        <AddInvoice initialData={{ patientId: props.patientId }} onClose={() => { setShowAdd(false) }} />
      </ModalBox>
    </div>
  );
}

export default OpenBalancesList