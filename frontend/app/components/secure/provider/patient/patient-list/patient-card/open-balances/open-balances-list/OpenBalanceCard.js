import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { Card } from 'react-bootstrap'
import moment from 'moment'
import Utilities from '../../../../../../../../services/commonservice/utilities'
import ModalBox from '../../../../../../../templates/components/ModalBox'
import InvoicePreview from '../../../../../invoices/invoice-preview/InvoicePreview'
import SendInvoice from '../../../../../invoices/send-invoice/SendInvoice'
import InstallmentForm from '../../../../../transactions/terminals/installment-terminal/installment-form/InstallmentForm'
import VirtualTerminalForm from '../../../../../transactions/terminals/virtual-terminal/virtual-terminal-form/VirtualTerminalForm'
import PaymentsList from '../../../../../report/paymentPlan-list/paymentPlan-card/payments-accordion/payments-list/PaymentsList'

const OpenBalanceCard = (props) => {
  const [showPay, setShowPay] = useState(false)
  const [showPayPlan, setShowPayPlan] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)
  const [sendInvoice, setSendInvoice] = useState(false)
  const [showPayments, setShowPayments] = useState(false)
  const filters = [
    { title: "All", value: "", identifier: "all" },
    { title: "Ready To Send", value: 1, identifier: "readyToSend", color: 'lightgreen' },
    { title: "Unpaid", value: 2, identifier: "awaitingPayment", color: 'yellow' },
    { title: "Full Payment", value: 4, identifier: "fullPayment", color: 'blue' },
    { title: "Payment Plan", value: 5, identifier: "paymentPlan", color: 'blue' },
    { title: "Subscription Plan", value: 7, identifier: "subscriptionPlan", color: 'blue' },
    { title: "Payment Plan In Progress", value: 8, identifier: "subscriptionPlan", color: 'blue' },
    { title: "Unpaid", value: 10, identifier: "unPaid", color: 'lightgray' },
    { title: "Cancelled", value: 9, identifier: "cancelled", color: 'red' },
    { title: "Closed", value: 30, identifier: "closed" }
  ]

  return (
    <div className='card p-3'>
      <div className="row d-flex justify-content-between">
        {props.invoice.finalAmount && props.invoice.invoiceNumber ? (
          <div className="col right"><h5><div className='col-md-6 col-12'><strong>{Utilities.toDollar(props.invoice?.finalAmount)}</strong></div> <div className='col-md-6 col-12'>{props.invoice.invoiceNumber}</div></h5></div>
        ) : (
          <div className="col right">Final Amount: -- | Invoice Number: --</div>
        )}
        <div className='col-auto'>
          <Dropdown
            button
            direction="left"
            icon="ellipsis horizontal"
            className="btn-primary icon btn p-o text-center"
          >
            <Dropdown.Menu>
              <Dropdown.Item onClick={e => { e.preventDefault(); setShowPay(true) }}>Collect Payment</Dropdown.Item>
              <Dropdown.Item onClick={e => { e.preventDefault(); setShowPayPlan(true) }}>Setup Payment Plan</Dropdown.Item>
              <Dropdown.Item onClick={e => { e.preventDefault(); setShowInvoice(true) }}>View Invoice</Dropdown.Item>
              <Dropdown.Item onClick={e => { e.preventDefault(); setShowPayments(true) }}>Manage Payments</Dropdown.Item>
              <Dropdown.Item onClick={e => { e.preventDefault(); setSendInvoice(true) }}>Resend</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      {props.invoice && <div className="row d-flex">
        {props.invoice.invoiceStatus &&
          <span title={filters.find(obj => obj.value == props.invoice.invoiceStatus)?.title}>
            <strong className='w-150px'>Status</strong>
            {filters.find(obj => obj.value == props.invoice.invoiceStatus)?.title}
          </span>
        }

        <div className='col-12'>
          <strong className='w-150px'>Created On:</strong>
          {props.invoice.createdOn ? moment(props.invoice.createdOn).format("MM/DD/YYYY") : '--'}
        </div>
        <div className='col-12'>
          <strong className='w-150px'>Service Date:</strong>
          {props.invoice.serviceDate ? moment(props.invoice.serviceDate).format("MM/DD/YYYY") : '--'}
        </div>
        <div className='col-12'>
          <strong className='w-150px'>Due Date:</strong>
          {props.invoice.dueDate ? moment(props.invoice.dueDate).format("MM/DD/YYYY") : '--'}
        </div>
        <div className='col-12'>
        <strong className='w-150px'>Provider Name:</strong>
          {props.invoice.doctorName ? props.invoice.doctorName : '--'}
        </div>
      </div>}
      <ModalBox open={showInvoice} onClose={() => setShowInvoice(false)}>
        <InvoicePreview invoiceId={props.invoice.id} onClose={() => setShowInvoice(false)} />
      </ModalBox>
      <ModalBox open={showPay} onClose={() => setShowPay(false)}>
        <VirtualTerminalForm initialData={props.invoice} onClose={() => setShowPay(false)} />
      </ModalBox>
      <ModalBox open={showPayPlan} onClose={() => setShowPayPlan(false)}>
        <InstallmentForm initialData={props.invoice} onClose={() => setShowPayPlan(false)} />
      </ModalBox>
      <ModalBox open={sendInvoice} onClose={() => { setSendInvoice(false) }}>
        <SendInvoice patientId={props.invoice.patientId} invoiceId={props.invoice.id} transaction={props.invoice} onClose={() => { setSendInvoice(false) }} />
      </ModalBox>
      <ModalBox open={showPayments} onClose={()=>{setShowPayments(false)}}>
        <PaymentsList invoiceId={props.invoice.id} pull={showPayments}/>
      </ModalBox>
    </div>
  )
}

export default OpenBalanceCard