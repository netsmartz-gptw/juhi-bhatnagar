import React, { useState, useEffect } from 'react'
import InvoiceService from '../../../../../services/api/invoice.service'
import PatientService from '../../../../../services/api/patient.service'
import Utilities from '../../../../../services/commonservice/utilities'
import DimLoader from '../../../../templates/components/DimLoader'
import InvoicePreview from '../invoice-preview/InvoicePreview'
import InputMask from "react-input-mask";
import toast from 'react-hot-toast'
const SendInvoice = (props) => {
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [isLoader_PatientInfo, setIsLoader_PatientInfo] = useState(false)
    // const [patient, setPatient] = useState()
    const findPatient = () => {
        if (props.patientId || props.transaction.patientId) {
            let reqItem = props.patientId || props.transaction.patientId
            PatientService.getPatientById(reqItem)
                .then(res => {
                    console.log(res.data)
                    // setPatient(res.data)
                    if(res.data.email){
                        setEmail(res.data.email)
                    }
                    if(res.data.mobile){
                        setPhone(res.data.mobile)
                    }
                    if(res.data.phone){
                        setPhone(res.data.phone)
                    }
                })
        }
    }
    const sendInvoiceHandler = () => {
        setIsLoader_PatientInfo(true)
        let reqObj = {
            emailId: email,
            phone: phone || null,
            providerId: props.transaction.providerId
        }
        InvoiceService.resendInvoice(props.invoiceId, reqObj)
            .then(res => {
                setIsLoader_PatientInfo(false)
                console.log(res);
                if (props.onClose()) {
                    props.onClose()
                }
            })
            .catch(err => {
                setIsLoader_PatientInfo(false)
                if (props.onClose()) {
                    props.onClose()
                }
            })
    }
    useEffect(() => {
        if (props.transaction.patientId) {
            findPatient()
        }
    }, [props.transaction])
    return (
        <div className='row d-flex'>
            <div className='col-3 d-flex flex-column justify-content-between'>
                <div className='col-12'>
                    <div className='card mb-3 p-3'>
                        <div className='field required'>
                            <label>Email</label>
                            <input type="text" placeholder={isLoader_PatientInfo?'Loading...':'Email'} value={email} onChange={e => { e.preventDefault(); setEmail(e.target.value) }} />
                        </div>
                    </div>
                    <div className='card p-3'>
                        <div className='field'>
                            <label>Phone</label>
                            <InputMask mask='(999) 999-9999' type="text" placeholder={isLoader_PatientInfo?'Loading...':'Phone'}  value={phone} onChange={e => { e.preventDefault(); setPhone(e.target.value) }} />
                        </div>
                    </div>
                </div>
                <div className='col-12 d-flex justify-content-between'>
                    <button className='btn btn-secondary' onClick={e => { e.preventDefault(); props.onClose() }}>Cancel</button>
                    <button className='btn btn-primary ms-3' onClick={e => { e.preventDefault(); sendInvoiceHandler(); }}>Send</button>
                </div>
                {/* {props.transaction && JSON.parse(props.transaction)} */}
            </div>
            <div className='col-9'>
                {props.transaction ? <InvoicePreview invoiceId={props.transaction.invoiceId} transaction={props.transaction} /> : <DimLoader />}
            </div>
        </div>
    )
}
export default SendInvoice