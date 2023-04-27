import React, { useState, useEffect } from 'react'
import PatientAccountService from '../../../../../services/api/patient-account.service'
import PatientAccountForm from '../patient-account-form/PatientAccountForm'
import APIResponse from '../../../../templates/components/APIResponse'

const PatientAccountEdit = (props) => {

    const [apiResponse,setApiResponse] = useState()

    const onSuccess = (message) => {
        if (props.refresh) {
            props.refresh()
        }
        if (props.onClose) {
            props.onClose()
        }
        if (props.exitHandler) {
            props.exitHandler()
        }
    }
    const submitHandler = (type, data) => {
            PatientAccountService.editPatientAccount(
                {
                    "address": {
                        "addressLine1": data.address.addressLine1,
                        "addressLine2": data.address?.addressLine2 || "",
                        "city": data.address.city,
                        "state": data.address.state,
                        "country": 1,
                        "postalCode": data.address.zipCode || data.address.postalCode
                    },
                    "samePatientAddress": data.samePatientAddress || false,
                    "accountHolderName": data.accountHolderName,
                    "cardNumber": data.cardNumber,
                    "cardExpiry": data.cardExpiry.includes("/")?data.cardExpiry.replace("/",""):data.cardExpiry,
                    "cardType": data.cardType,
                    "accountType": data.accountType,
                    "isActive": true
                }
                ,props.patientId, props.account.id)
            .then(res=>{
                setApiResponse(res)
                console.log(res)
                if(props.onClose()){
                    props.onClose()
                }
            })
            .catch(err=>{
                setApiResponse(err)
                if(props.onClose()){
                    props.onClose()
                }
            })

    }
    return (
        <>
            <PatientAccountForm isEdit initialData={{...props.account,patientId:props.patientId}} onClose={()=> props.onClose()} buttonLabel="Update" submitHandler={submitHandler} />
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </>
       
    )
}

export default PatientAccountEdit