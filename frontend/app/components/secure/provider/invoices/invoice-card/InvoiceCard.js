import React, { useState, useEffect } from 'react'
import moment from 'moment';
import Utilities from '../../../../../services/commonservice/utilities';
import { Accordion, Dropdown, Icon } from 'semantic-ui-react';
import ModalBox from '../../../../templates/components/ModalBox';
import EditInvoice from '../edit-invoice/EditInvoice';
import InvoicePreview from '../invoice-preview/InvoicePreview';
import InvoiceService from '../../../../../services/api/invoice.service';
import PaymentHistoryList from '../../report/paymentPlan-list/paymentPlan-card/payment-history-accordion/payment-history-list/PaymentHistoryList';
import VirtualTerminalForm from '../../transactions/terminals/virtual-terminal/virtual-terminal-form/VirtualTerminalForm';
import InstallmentForm from '../../transactions/terminals/installment-terminal/installment-form/InstallmentForm';
import SendInvoice from '../send-invoice/SendInvoice';
import PaymentsList from '../../report/paymentPlan-list/paymentPlan-card/payments-accordion/payments-list/PaymentsList';
import CloseAndWriteOff from '../../transactions/close-and-write-off/CloseAndWriteOff';
import toast from 'react-hot-toast';

const InvoiceCard = (props) => {

    const [show, setShow] = useState(false)
    const [preview, setPreview] = useState(false)
    const [edit, setEdit] = useState(false)
    const [pay, setPay] = useState(false)
    const [payPlan, setPayPlan] = useState(false)
    const [activeIndex, setActiveIndex] = useState()
    const [sendInvoice, setSendInvoice] = useState()
    const [cancel, setCancel] = useState(false)
    const [cancelWO, setCancelWO] = useState(false)
    const [closeReason, setCloseReason] = useState()
    const [payPlanType, setPayPlanType] = useState(2)
    const [errors, setErrors] = useState()
    const cancelHandler = () => {
        let reqObj = { closeReason: closeReason }
        if (closeReason.length >= 10) {
            InvoiceService.closeAndWriteOff(props.invoiceId, reqObj)
                .then(res => {
                    console.log(res)
                })
        }
        else {
            toast.error("Your reason for closing must be at least 10 characters long")
        }
    }

    useEffect(() => {
        if (closeReason?.length <= 10) {
            setErrors("Your reason for closing must be at least 10 characters long")
        }
        else if (!closeReason || closeReason == "") {
            setErrors("A reason for closing is required")
        }
        else {
            setErrors()
        }
    }, [closeReason])
    // const invoiceStatus = [
    //     { title: 'All', value: null },
    //     { title: 'Ready To Send', value: 1 },
    //     { title: 'Awaiting Payment', value: 2 },
    //     { title: 'Cancelled', value: 3 },
    //     { title: 'Full Payment', value: 4 },
    //     { title: 'Membership', value: 5 },
    //     { title: 'One Time Scheduled Payment', value: 6 },
    //     { title: 'Subscription Plan', value: 7 },
    //     { title: 'In Progress', value: 8 },
    //     { title: 'Paid', value: 9 },
    //     { title: 'Unpaid', value: 10 },
    //     { title: 'Unsubscribed', value: 11 },
    //     { title: 'Closed', value: 30 }
    // ]
    const invoiceStatus = [
        { title: 'All', value: null },
        { title: 'Ready To Send', value: 1 },
        { title: 'Open', value: 2 },
        { title: 'Cancelled', value: 3 },
        { title: 'Paid', value: 4 },
        { title: 'Membership', value: 5 },
        { title: 'One Time Scheduled Payment', value: 6 },
        { title: 'Payment Plan', value: 7 },
        { title: 'In Progress', value: 8 },
        { title: 'Paid', value: 9 },
        { title: 'Open', value: 10 },
        { title: 'Unsubscribed', value: 11 },
        { title: 'Partial Payment', value: 13 },
        { title: 'Closed', value: 30 }
    ]

    useEffect(() => {
        if (props.keyword) {
            setActiveIndex()
        }
    }, [props.keyword])

    const filters = [
        { title: "All", value: "", identifier: "all" },
        { title: "Ready To Send", value: 1, identifier: "readyToSend", color: 'lightgreen' },
        { title: "Awaiting Payment", value: 2, identifier: "awaitingPayment", color: 'red' },
        { title: "Payment Created", value: 4, identifier: "fullPayment", color: 'green' },
        { title: "Payment Plan", value: 5, identifier: "paymentPlan", color: 'blue' },
        { title: "Subscription Plan", value: 7, identifier: "subscriptionPlan", color: 'blue' },
        { title: "In Progress", value: 8, identifier: "subscriptionPlan", color: 'blue' },
        { title: "Unpaid", value: 10, identifier: "unPaid", color: 'lightgray' },
        { title: "Partial Payment", value: 13, identifier: "unPaid", color: 'lightgray' },
        { title: "Cancelled", value: 9, identifier: "cancelled", color: 'red' },
        { title: "Closed", value: 30, identifier: "closed" }
    ]
    console.log(props.transaction)
    return (
        <div className='card mb-3 p-3'>
            <div className='row d-flex'>
                <div className='btn col row d-flex align-items-center' onClick={e => { e.preventDefault(); setShow(!show) }}>
                    <div className='row-fluid d-flex text-start mb-3 align-items-center'>
                        <h5 className='col'>
                            {props.transaction.invoiceNumber && props.transaction.invoiceNumber + ' | '}
                            <strong>{props.transaction.patientName}</strong> | {0<props.transaction.amountPaid < props.transaction.finalAmount && props.transaction.amountPaid !== props.transaction.finalAmount && props.transaction.amountPaid ? Utilities.toDollar(props.transaction.finalAmount - props.transaction.amountPaid) + ' /':null} {Utilities.toDollar(props.transaction.finalAmount)}
                        </h5>
                        <div className='col-auto'>
                            {/* {props.transaction.invoiceStatus} */}
                            <div className='btn-group'>
                                {props.transaction.invoiceStatus && <div
                                    className='btn btn-secondary'
                                    // style={{backgroundColor:filters.find(obj => obj.value == props.transaction.invoiceStatus)?.color}}
                                    title={invoiceStatus.find(obj => obj.value == props.transaction.invoiceStatus)?.title}
                                // style={{border: 'none',backgroundColor:filters.find(obj => obj.value == props.transaction.invoiceStatus)?.color}}
                                >{invoiceStatus.find(obj => obj.value == props.transaction.invoiceStatus)?.title || props.transaction.invoiceStatus}</div>}
                                {props.transaction?.invoiceStatus === 1 ? <button className='btn btn-primary' title="Edit" onClick={e => { e.preventDefault(); setEdit(true) }}><i className={`icon pencil`} /></button> : null}
                                <button className='btn btn-primary' title="Send to Patient" onClick={e => { e.preventDefault(); setSendInvoice(true) }}><i className="icon paper plane outline" /></button>
                                {props.transaction?.invoiceStatus === 1 || props.transaction?.invoiceStatus === 2 || props.transaction?.invoiceStatus === 10 || props.transaction?.invoiceStatus === 7 || props.transaction?.invoiceStatus === 13 ? <button className='btn btn-primary' title="Collect Payment" onClick={e => { e.preventDefault(); setPay(true) }}><i className="icon dollar" /></button> : null}
                                <button className='btn btn-primary' title="View Details" onClick={e => { e.preventDefault(); setPreview(true) }}><i className="icon eye" /></button>
                                {props.transaction?.invoiceStatus !== 9 && props?.transaction.invoiceStatus !== 30 && props?.transaction.invoiceStatus !== 4 ? <Dropdown button direction="left" icon="ellipsis horizontal" className="btn-primary icon btn p-o">
                                    <Dropdown.Menu>
                                        {/* <Dropdown.Item>Edit Payment Info</Dropdown.Item> */}
                                        {props.transaction?.invoiceStatus === 1 || props.transaction?.invoiceStatus === 2 || props.transaction?.invoiceStatus === 10 && props.transaction?.invoiceStatus !== 9 && props.transaction?.invoiceStatus !== 7 ? <Dropdown.Item onClick={e => { e.preventDefault(); setPayPlan(true) }}>Create Payment Plan</Dropdown.Item> : null}
                                        {props.transaction?.invoiceStatus !== 8 && <Dropdown.Item onClick={e => { e.preventDefault(); setCancel(true) }}>Cancel</Dropdown.Item>}
                                        {props.transaction?.invoiceStatus === 8 && <Dropdown.Item onClick={e => { e.preventDefault(); setCancelWO(true) }}>Cancel & Write Off</Dropdown.Item>}
                                    </Dropdown.Menu>
                                </Dropdown> : null}
                            </div>
                        </div>
                    </div>
                    <div className='col-12 text-start row d-flex justify-content-between'>
                        <span className='col'><strong>Provider: </strong>{props.transaction.doctorName}</span>
                        {props.transaction.createdOn && <span className='col text-center'><strong className='ms-5'>Created On: </strong>{moment(props.transaction.createdOn).format("M-D-YYYY")}</span>}
                        {props.transaction.serviceDate && <span className='col text-center'><strong className='ms-5'>Service Date: </strong>{moment(props.transaction.serviceDate).format("M-D-YYYY")}</span>}
                        {props.transaction.dueDate && <span className='col text-end'><strong className={`ms-5 ${new Date(props.transaction.dueDate) <= new Date() && 'text-danger'}`}>Due Date: </strong>{moment(props.transaction.dueDate).format("M-D-YYYY")}</span>}
                    </div>
                </div>
                {show &&
                    <div className='col-12 mt-3'>
                        <Accordion fluid styled>
                            <Accordion.Title
                                active={activeIndex === 0}
                                index={0}
                                onClick={e => { e.preventDefault(); if (activeIndex === 0) { setActiveIndex() } else { setActiveIndex(0) } }}
                            > <Icon name='dropdown' />Preview</Accordion.Title>
                            <Accordion.Content active={activeIndex === 0}>
                                <InvoicePreview transaction={props.transaction} pull={activeIndex === 0} />
                            </Accordion.Content>
                            {props.transaction.invoiceStatus === 5 || props.transaction.invoiceStatus === 6 || props.transaction.invoiceStatus === 7 || props.transaction.invoiceStatus === 8 ? <Accordion.Title
                                active={activeIndex === 1}
                                index={1}
                                onClick={e => { e.preventDefault(); if (activeIndex === 1) { setActiveIndex() } else { setActiveIndex(1) } }}
                            > <Icon name='dropdown' />Upcoming Payments</Accordion.Title> : null}
                            <Accordion.Content active={activeIndex === 1}>
                                <PaymentsList paymentPlanId={props.transaction.paymentId} patientId={props.transaction.patientId} autoPull={activeIndex === 1} />
                            </Accordion.Content>
                            <Accordion.Title
                                active={activeIndex === 2}
                                index={2}
                                onClick={e => { e.preventDefault(); if (activeIndex === 2) { setActiveIndex() } else { setActiveIndex(2) } }}
                            > <Icon name='dropdown' />Payment History</Accordion.Title>
                            <Accordion.Content active={activeIndex === 2}>
                                <PaymentHistoryList paymentPlan={props.transaction} autoPull={activeIndex === 2} />
                            </Accordion.Content>
                        </Accordion>

                    </div>
                }
            </div>
            <ModalBox open={preview} onClose={() => { setPreview(false) }}>
                <InvoicePreview transaction={props.transaction} invoiceId={props.transaction.id} isModal onClose={() => { setPreview(false) }} />
            </ModalBox>
            <ModalBox open={edit} onClose={() => { setEdit(false) }} size="fullscreen">
                <EditInvoice id={props.transaction.id} onClose={() => { setEdit(false); if (props.refresh()) { props.refresh() } }} isModal />
            </ModalBox>
            <ModalBox open={pay} onClose={() => { setPay(false);if (props.refresh()) { props.refresh() } }}>
                <VirtualTerminalForm initialData={props.transaction} invoiceId={props.transaction.id} onClose={() => { setPay(false); if (props.refresh()) { props.refresh() } }} isModal />
            </ModalBox>
            <ModalBox open={payPlan} onClose={() => { setPayPlan(false) }}>
                <InstallmentForm type={payPlanType} initialData={props.transaction} onClose={() => { setPayPlan(false); if (props.refresh()) { props.refresh() } }} isModal />
            </ModalBox>
            <ModalBox open={sendInvoice} onClose={() => { setSendInvoice(false) }} size="large">
                <SendInvoice patientId={props.transaction.patientId} transaction={props.transaction} invoiceId={props.transaction.id} onClose={() => { setSendInvoice(false) }} />
            </ModalBox>
            <ModalBox open={cancel} onClose={() => { setCancel(false) }} size="tiny">
                <div className='col-12'>
                    Why are you cancelling this Invoice?
                </div>
                <div className='col-12'>
                    <input type="text" className="mt-3" minLength={10} value={closeReason} onChange={e => { e.preventDefault(); setCloseReason(e.target.value) }} />
                    <span className="error-message">{errors && errors}</span>
                </div>
                <div className='col-12 d-flex justify-content-between mt-3'>
                    <div className="col-auto">
                        <button className='btn btn-secondary' onClick={e => { e.preventDefault(); setCancel(false) }}>Close</button>
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-primary' onClick={(e) => { e.preventDefault(); cancelHandler(); if (props.refresh()) { props.refresh() }; return setCancel(false) }}>Confirm</button>
                    </div>
                </div>
            </ModalBox>
            <ModalBox open={cancelWO} onClose={() => { setCancelWO(false) }} size="tiny">
                <CloseAndWriteOff refresh={() => { props.refresh() }} invoice={props.transaction} onClose={() => { setCancelWO(false); if (props.refresh()) { props.refresh() } }} />
            </ModalBox>
        </div>
    )
}
export default InvoiceCard