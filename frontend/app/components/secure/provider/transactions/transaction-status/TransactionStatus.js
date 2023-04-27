import moment from 'moment'
import React, { useState, useEffect } from 'react'
import TransactionStatusEnum from '../../../../../common/enum/transaction-status.enum'
import Exception from '../../../../../common/exceptions/exception'
import TransactionService from '../../../../../services/api/transaction.service'
import Utilities from '../../../../../services/commonservice/utilities'

const TransactionStatus = (props) => {
    const [tc, setTc] = useState()
    const [isLoader, setIsLoader] = useState(false)

    const TransactionOperationMapEnum = {
        0: 'Sale',
        1: 'Auth Only',
        2: 'Force Sale',
        3: 'Adjust',
        4: 'Activate',
        5: 'Deactivate',
        6: 'Reload',
        7: 'Refund',
        8: 'Inquire'
    }


    const channelType = [
        { title: 'All', value: 0 },
        { title: 'ACH', value: 2 },
        { title: 'Credit', value: 3 },
        { title: 'Debit', value: 4 },
        { title: 'Cash', value: 9 },
        { title: 'Check', value: 10 },
    ]

    const pullTransactionStatus = () => {
        setIsLoader(true)
        TransactionService.getTransactionStatus(props.payment.id)
            .then(res => {
                console.log(res.data)
                setTc(res.data)
                setIsLoader(false)
            })
    }

    useEffect(() => {
        if (props.payment?.transactionStatus == 5) {
            pullTransactionStatus()
        }
    }, [])
    return (
        <table className='table table-borderless' style={{ border: '1px solid lightgrey' }}>
            {props.payment?.transactionStatus == 5 || props.payment?.transactionStatus == 14 ?
                <thead>
                    <tr>
                        <th><strong>Transaction</strong> {TransactionStatusEnum[props.payment?.transactionStatus]}</th>
                        <th><strong>Failure Code</strong> {tc && tc?.reasonCode}</th>
                        <th colSpan={2}><strong>Transaction Date</strong> {props.payment?.transactionDate && moment(props.payment?.transactionDate).format("MM-DD-YYYY H:mm A")}</th>
                    </tr>
                </thead>
                : <thead>
                    <tr>
                        <th colSpan={3}><strong>Transaction Date</strong> {props.payment?.transactionDate && moment(props.payment?.transactionDate).format("MM-DD-YYYY H:mm A")}</th>
                        <th> <strong>Transaction</strong> {TransactionStatusEnum[props.payment?.transactionStatus]}</th>

                    </tr>
                </thead>
            }
            {props.payment && <tbody>
                <tr>
                    <td colSpan={2}><strong>Transaction Id</strong> {props.payment?.id}</td>
                    <td colSpan={2}><strong>Transaction Amount</strong> {Utilities.toDollar(props.payment?.tenderInfo?.totalAmount)}</td>
                </tr>
            </tbody>}
            {channelType.find(obj => obj.value === props.payment?.tenderInfo?.channelType) !== 9 && <tbody>
                <tr>   <td className="col-md-6 col-12"><strong>Card Type</strong> {props.payment?.tenderInfo?.cardType}</td>
                    <td className="col-md-6 col-12"><strong>Name on Card</strong> {props.payment?.tenderInfo?.nameOnCheckOrCard}</td>
                    <td className="col-md-6 col-12"><strong>Card Number</strong> {props.payment?.tenderInfo?.maskCardNumber}</td>
                    <td className="col-md-6 col-12"><strong>Payment Method</strong> {channelType.find(obj => obj.value === props.payment?.tenderInfo?.channelType).title}</td></tr>
            </tbody>}
            {channelType.find(obj => obj.value === props.payment?.tenderInfo?.channelType) == 10 && <tbody>
                <tr>
                    <td><strong>Payment Method</strong> {channelType.find(obj => obj.value === payment.tenderInfo?.channelType).title}</td>
                    <td colSpan={2}><strong>Bank</strong> {props.payment?.tenderInfo?.bankName}</td>
                    <td><strong>Check Number</strong> {props.payment?.tenderInfo?.checkNumber}</td>
                </tr>
            </tbody>}
            {props.payment?.transactionStatus == 5 &&
                <thead>
                    <tr>
                        <th colSpan={4}><strong>Failure Information</strong> {Exception.getExceptionMessage(tc?.reasonMessage)}</th>
                    </tr>
                </thead>}
        </table>
    )
}

export default TransactionStatus