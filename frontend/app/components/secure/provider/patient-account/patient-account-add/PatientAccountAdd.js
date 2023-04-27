import React, { useState, useEffect } from 'react'
import PatientAccountService from '../../../../../services/api/patient-account.service'
import PatientAccountForm from '../patient-account-form/PatientAccountForm'
import APIResponse from '../../../../templates/components/APIResponse'

const PatientAccountAdd = (props) => {

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
        if (type === "credit-debit") {
            PatientAccountService.addPatientAccount(props.patientId, {
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
                "cardNumber": data.cardNumber.toString().replace(" ", "").replace(" ", "").replace(" ", ""),
                "cardExpiry": data?.cardExpiry.toString().replace("/", "") ,
                "cardType": data.cardType,
                "accountType": 1,
                "isActive": data.isActive || true
            })
                .then(res => {
                    setApiResponse(res)
                    console.log(res)
                    if (props.onClose()) {
                        props.onClose()
                    }
                })
                .catch(error => {
                    setApiResponse(error)
                })
        }
        else if (type === "ach") {
            PatientAccountService.addPatientAccount(props.patientId, {
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
                "accountNumber": data.accountNumber,
                "bankName": data.bankName,
                "isCheckingAccount": data.isCheckingAccount,
                "routingNumber": data.routingNumber,
                "accountType": 2,
                "isActive": data.isActive || true
            })
                .then(res => {
                    setApiResponse(res)
                    console.log(res)
                    if (props.onClose()) {
                        props.onClose()
                    }
                })
                .catch(error => {
                    setApiResponse(error)
                })
        }
    }
    return (
        <>
            <PatientAccountForm initialData={{ address: {}, patientId: props.patientId }} onClose={()=> props.onClose()} buttonLabel="Add" submitHandler={submitHandler} />
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </>
   
    )
}

export default PatientAccountAdd