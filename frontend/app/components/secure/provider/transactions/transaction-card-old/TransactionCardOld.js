import React, { useState, useEffect } from 'react'
import moment from 'moment';
import Utilities from '../../../../../services/commonservice/utilities';
import { Accordion, AccordionAccordion, Dropdown, Icon } from 'semantic-ui-react';
import TransactionPreview from '../transaction-preview/TransactionPreview';
import ModalBox from '../../../../templates/components/ModalBox';
import EditTransaction from '../edit-transaction/EditTransactions';

const TransactionCard = (props) => {

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
    return (
        <div className='card mb-3 p-3'>
            <div className='row d-flex'>
                <div className='col row btn d-flex align-items-center' onClick={e => { e.preventDefault(); setShow(!show) }}>
                    <div className='col text-start mb-3'>
                        <h5 className=''>
                            {props.transaction.invoiceNumber && props.transaction.invoiceNumber + ' | '}
                            <strong>{props.transaction.patientName}</strong> | {Utilities.toDollar(props.transaction.finalAmount)}
                            {props.transaction.paymentStatus && <div className='badge bg-secondary ms-5'>{invoiceStatus[props.transaction.paymentStatus]}</div>}
                        </h5>
                    </div>
                    <div className='col-12 text-start row d-flex justify-content-between'>
                        <span className='col'><strong>Provider: </strong>{props.transaction.doctorName}</span>
                        <span className='col'><strong className='ms-5'>Checkout Date: </strong>{moment(props.transaction.transactionDate).format("M-D-YYYY")}</span>
                        <span className='col'><strong className='ms-5'>Service Date: </strong>{moment(props.transaction.serviceDate).format("M-D-YYYY")}</span>
                        <span className='col'><strong className={`ms-5 ${new Date(props.transaction.dueDate) <= new Date() && 'text-danger'}`}>Due Date: </strong>{moment(props.transaction.dueDate).format("M-D-YYYY")}</span>
                    </div>
                </div>
                <div className='col-auto'>
                    <div className='btn-group'>
                        <button className='btn btn-primary' title="Edit" onClick={e=>{e.preventDefault();setEdit(true)}}><i className={`icon pencil`} /></button>
                        <button className='btn btn-primary' title="Finalize/Send to Patient"><i className="icon paper plane outline" /></button>
                        <button className='btn btn-primary' title="View Details" onClick={e=>{e.preventDefault();setPreview(true)}}><i className="icon eye" /></button>
                        <Dropdown button direction="left" icon="ellipsis horizontal" className="btn-primary icon btn p-o">
                            <Dropdown.Menu>
                                <Dropdown.Item>Cancel</Dropdown.Item>
                                <Dropdown.Item>Edit Payment Info</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                {show &&
                    <div className=''>
                        <TransactionPreview transaction={props.transaction} />
                    </div>
                }
            </div>
            <ModalBox open={preview} onClose={() => { setPreview(false) }}>
                <TransactionPreview transaction={props.transaction} />
            </ModalBox>
            <ModalBox open={edit} onClose={() => { setEdit(false) }}>
                <EditTransaction id={props.transaction.id} onClose={()=>{setEdit(false)}}/>
            </ModalBox>
        </div>
    )
}
export default TransactionCard