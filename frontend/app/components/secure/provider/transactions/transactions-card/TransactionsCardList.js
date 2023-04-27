import React, { useState, useEffect } from 'react'
import moment from 'moment';
import Utilities from '../../../../../services/commonservice/utilities';
import { Dropdown, Modal } from 'semantic-ui-react';
import ModalBox from '../../../../templates/components/ModalBox';
import TransactionStatusEnum from '../../../../../common/enum/transaction-status.enum';
import TransactionReceipt from '../transaction-receipt/TransactionReceipt';
import Module from '../../../../templates/components/Module';
import VirtualTerminalForm from '../terminals/virtual-terminal/virtual-terminal-form/VirtualTerminalForm';
import RefundTransactionCard from '../refund-transaction/RefundTransactionCard';
import TransactionService from '../../../../../services/api/transaction.service';
import toast from 'react-hot-toast';
import InvoicePreview from '../../invoices/invoice-preview/InvoicePreview';

const TransactionsCardList = (props) => {

    const [show, setShow] = useState(false)
    const [preview, setPreview] = useState(false)
    const [edit, setEdit] = useState(false)
    const [pay, setPay] = useState(false)
    const [cancel, setCancel] = useState(false)
    const [refund, setRefund]= useState(false)
const cancelTc=()=>{
    TransactionService.voidTransaction(props.transaction.id)
    .then(res=>{
        console.log(res)
        toast.success("Transaction cancelled")
        if(props.refresh){
            props.refresh()
        }
        return setCancel(false)
    })
}
    const transactionStatus = [
        { 1: 'Not Defined' },
        { 2: 'ACH' },
        { 3: 'Credit' },
        { 4: 'Debit' },
        { 10: 'Check' },
        { 9: 'Cash' },
    ]
    const filters = [
        { title: "All", value: "", identifier: "all" },
        { title: "Credit", value: 3, identifier: "credit" },
        { title: "Debit", value: 4, identifier: "debit" },
        { title: "ACH", value: 2, identifier: "ach" },
        { title: "Check", value: 10, identifier: "check" },
        { title: "Cash", value: 9, identifier: "cash" },
        // { title: "One Time", value: 6, identifier: "oneTime" }
    ]

    const icons = {
        blank: 'credit-card',
        AMEX: 'cc amex',
        DINERS: 'cc diners club',
        DISCOVER: 'cc discover',
        JCB: 'cc jcb',
        MASTERCARD: 'cc mastercard',
        VISA: 'cc visa'
    }
    return (
        <div className='card mb-3 p-3'>
            <div className='row align-items-center' >
                <div className='col-12 text-start mb-3 row-fluid d-flex align-items-center point' onClick={e => { e.preventDefault(); setShow(!show) }} title="Click for Preview">
                    <h5 className='col'>
                        <strong onClick={(e) => {e.preventDefault(); console.log(props.transaction) }}>{props.transaction.firstName} {props.transaction.lastName}</strong> | {Utilities.toDollar(props.transaction.tenderInfo.totalAmount)}
                    </h5>
                    <div className='btn-group col-auto'>
                        <div className='btn bg-secondary d-flex align-items-center'>
                            <div className='col text-white'>
                                {props.transaction.tenderInfo.maskCardNumber ? <i className={`icon big ${icons[props.transaction.tenderInfo.cardType]}`} title={props.transaction.tenderInfo.cardType} /> : <span className='bank-marker my-2' title={props.transaction.tenderInfo.bankName || filters.find(obj => obj.value === props.transaction.tenderInfo.channelType).title}>{props.transaction.tenderInfo.bankName || filters.find(obj => obj.value === props.transaction.tenderInfo.channelType).title}</span>}
                             {props.transaction.tenderInfo.maskCardNumber && props.transaction.tenderInfo.maskCardNumber}
                                {props.transaction.tenderInfo.maskAccount && props.transaction.tenderInfo.maskAccount}
                            </div>
                        </div>
                        <button onClick={e=>{e.preventDefault(); setPreview(true)}} className="btn btn-primary"><i className="icon eye"/></button>
                        {TransactionStatusEnum[props.transaction.transactionStatus]==="Refund" || TransactionStatusEnum[props.transaction.transactionStatus]==="Refunded" || TransactionStatusEnum[props.transaction.transactionStatus] ==='Refund Attempt' || TransactionStatusEnum[props.transaction.transactionStatus] ==='Failed' || TransactionStatusEnum[props.transaction.transactionStatus] ==='Cancelled' ? null: TransactionStatusEnum[props.transaction.transactionStatus]==="Authorized" ? <button  onClick={(e)=>{e.preventDefault(); setCancel(true)}} className="btn btn-primary" title="Cancel"><i className="icon dont"/></button>: props.transaction.tenderInfo.channelType !==9 && props.transaction.tenderInfo.channelType != 10 ? <button  onClick={(e)=>{e.preventDefault(); setRefund(true)}} className="btn btn-primary" title="Refund"><i className="icon dont"/></button>: null}

                        {/* <Dropdown button direction="left" icon="ellipsis horizontal" className="btn-primary icon btn p-o">
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={()=>{setCancel(true)}}>Cancel</Dropdown.Item>
                                {props.transaction.transactionStatus !== 0 &&  <Dropdown.Item onClick={()=>{setRefund(true)}}>Refund</Dropdown.Item>}
                                </Dropdown.Menu>
                        </Dropdown> */}
                    </div>
                </div>
                <div className='col-12 text-start row d-flex justify-content-between'>
                    <span className='col-md-4 col-12'><strong>Transaction Id: </strong>{props.transaction?.id}</span>
                    <span className='col-md-4 col-12'><strong>Transaction Date: </strong>{moment(props.transaction.transactionDate).format("M-D-YYYY")}</span>
                    <span className='col-md-4 col-12'><strong>Status: </strong>{TransactionStatusEnum[props.transaction.transactionStatus]}</span>
                    <span className='col-md-4 col-12'><strong>Type: </strong>{filters.find(obj => obj.value === props.transaction.tenderInfo.channelType).title}</span>
                    <span className='col-md-4 col-12'><strong>Vendor: </strong>{props.transaction?.tenderInfo?.cardType || props.transaction?.tenderInfo?.bankName}</span>
                    {props.transaction.tenderInfo.nameOnCheckOrCard ? <span className='col-md-4 col-12'><strong className=''>Name on Card: </strong>{props.transaction.tenderInfo.nameOnCheckOrCard}</span> : <div className='col-md-4 col-12'></div>}
                </div>
            </div >
            {show && <Module className='col-12'>
                <InvoicePreview invoice={props.transaction} invoiceId={props.transaction.invoiceId}/>
                </Module>}
            <ModalBox open={preview} onClose={()=>{setPreview(false)}}>
                <InvoicePreview invoiceId={props.transaction.invoiceId} invoice={props.transaction}/>
                </ModalBox>
            <ModalBox open={pay} onClose={() => { setPay(false) }}>
                <VirtualTerminalForm initialData={props.transaction || {}} onClose={() => {if(props.refresh){props.refresh()} return setPay(false) }} />
            </ModalBox>
            <ModalBox open={refund} onClose={()=>{setRefund(false)}} title="Refund">
                <RefundTransactionCard transaction={props.transaction} onClose={()=>{if(props.refresh){props.refresh()} return setRefund(false)}}/>
            </ModalBox>
            <ModalBox open={cancel} onClose={()=>{setCancel(false)}} title="Cancel">
              <div className='d-flex row justify-content-between'>
                  <div className='col-12'>
                  Are you sure you want to cancel?
                  </div>
                  <div className='col-auto mt-3'><button className='btn btn-secondary' onClick={e=>{e.preventDefault(); setCancel(false)}}>Close</button></div>
                  <div className='col-auto mt-3'><button className='btn btn-primary' onClick={e=>{e.preventDefault(); cancelTc()}}>Confirm</button></div>
              </div>
            </ModalBox>
        </div >
    )
}
export default TransactionsCardList