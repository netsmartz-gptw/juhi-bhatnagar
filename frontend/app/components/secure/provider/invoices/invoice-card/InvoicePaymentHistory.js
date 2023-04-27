import { map } from 'jquery'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import InvoiceService from '../../../../../services/api/invoice.service'
import TransactionService from '../../../../../services/api/transaction.service'
const InvoicePaymentHistory = (props) => {

    const [history, setHistory] = useState()

    const pullHistory = () => {
        TransactionService.findTransaction({ InvoiceNo: props.invoiceNo })
            .then(res => {
                console.log(res.data.data)
                setHistory(res.data.data)
            })
    }

    useEffect(() => {
        pullHistory()
    }, [])
    return (
        <div className="">
            {history && history.map((tc, idx) => {
                return (
                    <div className='row'>
                        <div className='col'>
                            {moment(tc.authOrFailStatusDate).format("M/D/YYYY H:mm A")}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
export default InvoicePaymentHistory