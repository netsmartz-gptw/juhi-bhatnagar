import React, { useEffect, useState } from "react";
import moment from "moment";
import { Dropdown, Accordion, Icon, Modal } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import Preview from "../paymentPlan-card/preview-accordion/preview/Preview"
import PaymentsList from "../paymentPlan-card/payments-accordion/payments-list/PaymentsList";
import PaymentHistoryList from "../paymentPlan-card/payment-history-accordion/payment-history-list/PaymentHistoryList"
import Utilities from "../../../../../../services/commonservice/utilities";
import InvoicePreview from "../../../invoices/invoice-preview/InvoicePreview";
import ModalBox from "../../../../../templates/components/ModalBox";
import PaymentAdjust from "./payment-adjust/PaymentAdjust";
import SendInvoice from "../../../invoices/send-invoice/SendInvoice";
import CloseAndWriteOff from "../../../transactions/close-and-write-off/CloseAndWriteOff";
import InvoiceService from "../../../../../../services/api/invoice.service";
import EditInvoice from "../../../invoices/edit-invoice/EditInvoice";

const PaymentPlanCard = (props) => {
    const [showMore, setShowMore] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showAddPaymentAccount, setShowAddPaymentAccount] = useState(false);
    const [showProcessPayment, setShowProcessPayment] = useState(false);
    const [activeIndex, setActiveIndex] = useState();
    const [paymentPlan, setPaymentPlan] = useState(props.paymentPlan);
    const [showDeactivate, setShowDeactivate] = useState(false);
    const [sendInvoice, setSendInvoice] = useState(false)
    const [preview, setPreview] = useState(false)
    const [cancel, setCancel] = useState(false)
    const [cancelWO, setCancelWO] = useState(false)
    const [closeReason, setCloseReason] = useState()
    const [errors, setErrors] = useState()

    const navigate = useNavigate();
    const setIndex = (i) => {
        if (i === activeIndex) {
            setActiveIndex();
        } else {
            setActiveIndex(i);
        }
    };
    const InvoiceTypeEnum = {
        0: 'OneTime',
        1: 'Payment Plan',
        2: 'ScheduledOneTime',
        3: 'Membership'
    }

    const invoiceStatus = [
        { value: 1, title: 'Ready To Send' },
        { value: 2, title: 'Awaiting Payment' },
        { value: 3, title: 'Cancelled' },
        { value: 4, title: 'Payment Created' },
        { value: 5, title: 'Payment Plan' },
        { value: 6, title: 'Subscription Plan' },
        { value: 7, title: 'Unpaid' },
        { value: 8, title: 'In Progress' },
        { value: 9, title: 'Paid' },
        { value: 10, title: 'Unpaid' },
        { value: 11, title: 'Unsubscribed' },
        { value: 30, title: 'Closed' }
    ]

    const cancelHandler = () => {
        let reqObj = { closeReason: closeReason }
        if (closeReason.length >= 10) {
            InvoiceService.closeAndWriteOff(props.paymentPlan.invoiceId, reqObj)
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

    useEffect(() => {
        console.log(props.paymentPlan)
        setPaymentPlan(props.paymentPlan);
    }, [props.paymentPlan]);
    // console.log(props.paymentPlan)
    return (
        <div className='container-flex card mb-3 bg-light'>
            {paymentPlan &&
                <div className='row d-flex p-3'>
                    <div className='col-12 row-fluid d-flex justify-content-between'>
                        <div className='col-12 row d-flex align-items-start'>
                            <div className='col-md-8 col-12 btn text-start' onClick={e => { e.preventDefault(); setShowMore(!showMore) }}>
                                <h5 className='mt-2'>{paymentPlan.invoiceNumber ? `${paymentPlan.invoiceNumber} | ` : null}{paymentPlan.firstName} {paymentPlan.lastName}
                                </h5>
                                <div className='row'>
                                {props.type == 3 ?
                                    <div className="col-md-6 col-12"><span className="w-150px"><strong>Total</strong></span>{paymentPlan.noOfPayments} of payments {Utilities.toDollar(paymentPlan.paymentAmount)}</div>:                                    <span className='col-md-6 col-12'><span className="w-150px"><strong>Total</strong></span>{Utilities.toDollar(paymentPlan.totalAmount ? paymentPlan.totalAmount : 0)}</span>}
                                    {props.type == 3 ? <span className='col-md-6 col-12'><span className="w-150px"><strong>Remaining Balance</strong></span>{paymentPlan.totalPaymentLeft} payments of {Utilities.toDollar(paymentPlan.paymentAmount)}</span> : <span className='col-md-6 col-12'><span className="w-150px"><strong>Remaining Balance</strong></span>{Utilities.toDollar(paymentPlan.totalDueAmount ? paymentPlan.totalDueAmount : 0)}</span>}
                                    {/* <span className='col-md-6 col-12'><span className="w-150px"><strong><i className='icon clipboard' />Payment Type</strong></span> {InvoiceTypeEnum[paymentPlan.transactionType]}</span> */}
                                </div>
                                <div className='row'>
                                    {paymentPlan.createdOn && <span className='col-md-6 col-12'><span className="w-150px"><strong>Created On</strong></span> {moment(paymentPlan.createdOn).format("M/D/YYYY")}</span>}
                                    {paymentPlan.nextTransactionDate && <span className='col-md-6 col-12'><span className="w-150px"><strong>Next Transaction Date</strong></span> {moment.utc(paymentPlan.nextTransactionDate).format("M/D/YYYY")}</span>}
                                </div>
                            </div>

                            <div className='col-md-4 col-12 d-flex justify-content-end'>
                                {/* {props.transaction.status} */}
                                <div className='btn-group'>
                                    {paymentPlan?.status && <div
                                        className='btn btn-secondary'
                                        // style={{backgroundColor:filters.find(obj => obj.value == props.transaction.status)?.color}}
                                        title={invoiceStatus.find(obj => obj.value == paymentPlan?.status)?.title}
                                    // style={{border: 'none',backgroundColor:filters.find(obj => obj.value == props.transaction.status)?.color}}
                                    >
                                        {/* {InvoiceTypeEnum[paymentPlan.transactionType]} */}
                                        {invoiceStatus.find(obj => obj.value == paymentPlan?.status)?.title || paymentPlan?.status}</div>}
                                    {paymentPlan?.status === 10 ? <button className='btn btn-primary' title="Edit" onClick={e => { e.preventDefault(); setShowEdit(true) }}><i className={`icon pencil`} /></button> : null}
                                    <button className='btn btn-primary' title="Send to Patient" onClick={e => { e.preventDefault(); setSendInvoice(true) }}><i className="icon paper plane outline" /></button>
                                    {paymentPlan?.status === 1 || paymentPlan?.status === 2 || paymentPlan?.status === 10 && paymentPlan?.status !== 9 && paymentPlan?.status !== 7 ? <button className='btn btn-primary' title="Pay Invoice" onClick={e => { e.preventDefault(); setPay(true) }}><i className="icon dollar" /></button> : null}
                                    <button className='btn btn-primary' title="View Details" onClick={e => { e.preventDefault(); setPreview(true) }}><i className="icon eye" /></button>
                                    {paymentPlan?.status !== 30 && paymentPlan?.status !== 9 ? <Dropdown button direction="left" icon="ellipsis horizontal" className="btn-primary icon btn p-o">
                                        <Dropdown.Menu>
                                            {paymentPlan.status === 1 ? <Dropdown.Item onClick={e => { e.preventDefault(); setCancel(true) }}>Cancel</Dropdown.Item>
                                                : <Dropdown.Item onClick={e => { e.preventDefault(); setCancelWO(true) }}>Cancel & Write Off</Dropdown.Item>}
                                        </Dropdown.Menu>
                                    </Dropdown> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    {showMore && <div className='mt-3'>
                        <Accordion fluid styled>
                            <Accordion.Title
                                active={activeIndex === 0}
                                index={0}
                                onClick={e => { e.preventDefault(); setIndex(0) }}
                            > <Icon name='dropdown' />Preview</Accordion.Title>
                            <Accordion.Content active={activeIndex === 0}>
                                {activeIndex === 0 && <InvoicePreview invoiceId={paymentPlan.invoiceId} pull={activeIndex === 0} />}
                            </Accordion.Content>


                            <Accordion.Title
                                active={activeIndex === 1}
                                index={1}
                                onClick={e => { e.preventDefault(); setIndex(1) }}
                            > <Icon name='dropdown' />Upcoming Payments{activeIndex === 1 && <Icon name="plus" style={{ float: 'right' }} title="Add Patient Wallet Details" className='btn p-1' onClick={e => { e.preventDefault(); setWalletAdd(true) }} />}</Accordion.Title>
                            <Accordion.Content active={activeIndex === 1}>
                                {activeIndex === 1 && <PaymentsList paymentPlanId={paymentPlan.id} pull={activeIndex === 1} />}
                            </Accordion.Content>

                            <Accordion.Title
                                active={activeIndex === 2}
                                index={2}
                                onClick={e => { e.preventDefault(); setIndex(2) }}
                            > <Icon name='dropdown' />Payment History{activeIndex === 2 && <Icon name="plus" style={{ float: 'right' }} title="Add Membership Details" className='btn p-2' onClick={e => { e.preventDefault(); setMembershipAdd(true) }} />}</Accordion.Title>
                            <Accordion.Content active={activeIndex === 2}>
                                {activeIndex === 2 && <PaymentHistoryList paymentPlanId={paymentPlan.id} paymentPlan={paymentPlan} pull={activeIndex === 2} />}
                            </Accordion.Content>
                        </Accordion>
                    </div>}
                </div>
            }
            <ModalBox open={sendInvoice} onClose={() => { setSendInvoice(false) }}>
                <SendInvoice transaction={paymentPlan} invoiceId={props.invoiceId} onClose={() => { setSendInvoice(false) }} />
            </ModalBox>
            <ModalBox open={preview} onClose={() => setPreview(false)} size="large">
                <InvoicePreview invoiceId={paymentPlan.invoiceId} pull={preview} onClose={() => setPreview(false)} />
            </ModalBox>
            <ModalBox open={showEdit} onClose={() => setShowEdit(false)} size="fullscreen">
                <EditInvoice id={paymentPlan.invoiceId} pull={showEdit} onClose={() => { props.refresh(); return setShowEdit(false) }} />
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
                <CloseAndWriteOff refresh={() => { if (props.refresh) { props.refresh() } }} invoiceId={paymentPlan.invoiceId} onClose={() => { setCancelWO(false); if (props.refresh) { props.refresh() } }} />
            </ModalBox>
        </div>
    );
};

export default PaymentPlanCard;
