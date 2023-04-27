import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import InvoiceService from '../../../../../services/api/invoice.service'

const CloseAndWriteOff = (props) => {

    const [closeReason, setCloseReason] = useState()
    const [errors, setErrors] = useState()
    const cancelWOHandler = () => {
        let reqObj = { closeReason: closeReason }
        if (closeReason?.length >= 10) {
            InvoiceService.closeAndWriteOff(props.invoiceId, reqObj)
                .then(res => {
                    toast.success("Invoice Closed Succesfully")
                    console.log(res)
                    if (props.refresh()) {
                        props.refresh()
                    }
                    if (props.onClose()) { props.onClose() }
                })
        }
        else {
            toast.error("Your reason for closing must be more than 10 characters")
        }
    }
    useEffect(() => {
        if (closeReason?.length < 10) {
            setErrors("Your reason for closing must be more than 10 characters")
        }
        else if (!closeReason || closeReason == "") {
            setErrors("A reason for closing this invoice is required")
        }
        else {
            setErrors()
        }
    })
    return (
        <div className='w-100 row d-flex'>
            <div className='col-12'>
                <div className=" card p-3 bg-faded text-primary b-1">
                    Are you sure you would like to remove the patient balance and write it off? Please provide a reason why.
                </div>
            </div>
            <div className='field required col-12'>
                <label>Reason</label>
                <input type="text" className="mt-3" minLength={10} value={closeReason} onChange={e => { e.preventDefault(); setCloseReason(e.target.value); }} />
                <span className='error-message'>{errors && errors}</span>
            </div>
            <div className='col-12 mt-3 d-flex justify-content-between'>
                <div className='col-auto'>
                    <button className="btn btn-secondary float-right" onClick={e => { e.preventDefault(); if (props.onClose()) { props.onClose() } }}>No</button>
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={e => { e.preventDefault(); cancelWOHandler() }}>Yes</button>
                </div>
            </div>
        </div>
    )
}

export default CloseAndWriteOff