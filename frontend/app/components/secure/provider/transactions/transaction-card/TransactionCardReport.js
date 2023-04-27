import React, { useState, useEffect } from 'react'
import moment from 'moment';
import Utilities from '../../../../../services/commonservice/utilities';
import { Accordion, AccordionAccordion, Dropdown, Icon } from 'semantic-ui-react';
import TransactionPreview from '../transaction-preview/TransactionPreview';
import ModalBox from '../../../../templates/components/ModalBox';
// import EditTransaction from '../edit-transaction/EditTransactions';

const TransactionCardReport = (props) => {

    const [show, setShow] = useState(false)
    const [preview, setPreview] = useState(false)
    const [edit, setEdit] = useState(false)

    const invoiceStatus = {
        1: 'Ready To Send',
        2: 'Awaiting Payment',
        3: 'Cancelled',
        4: 'Full payment created',
        5: 'Payment plan created',
        6: 'OneTime scheduled created',
        7: 'Subscription plan created',
        8: 'In progress',
        9: 'Paid',
        10: 'Unpaid',
        11: 'Unsubscribed',
        30: 'Closed'
    }
    console.log(props.transaction)
    return (
        <div className='card mb-3 p-3'>
            <div className='row d-flex'>
                <div className='col row btn d-flex align-items-center' onClick={e => { e.preventDefault(); setShow(!show) }}>
                    <div className='col text-start mb-3'>
                        <h5 className=''>
                            {props.transaction.channelType}
                            <strong>{props.transaction.patientName}</strong> | {Utilities.toDollar(parseInt(props.transaction.totalSalesAmount))}
                            {props.transaction.paymentStatus && <div className='badge bg-secondary ms-5'>{invoiceStatus[props.transaction.paymentStatus]}</div>}
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TransactionCardReport