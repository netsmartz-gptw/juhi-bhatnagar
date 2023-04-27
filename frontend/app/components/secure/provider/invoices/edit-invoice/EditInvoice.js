import React, { useEffect, useState } from 'react'
import InvoiceService from '../../../../../services/api/invoice.service'
import InvoiceForm from '../invoice-form/InvoiceForm'
import APIResponse from '../../../../templates/components/APIResponse';

const EditInvoice = (props) => {

    const [initialData, setInitialData] = useState()
    const [apiResponse, setApiResponse] = useState()
    
    const pullInvoice = () =>{
        InvoiceService.getInvoiceById(props.id)
        .then(res=>{
            let newData = res
            console.log(newData)
            setInitialData(newData)
        })
    }
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

    const editInvoice = (data, selectedPatient, items) => {
        let reqObj = data
        reqObj.items = items
        reqObj.doctorId = items[0].doctorId
        reqObj.invoiceId = data.id
        reqObj.operationType = data.operationType || 2
        reqObj.autoClaimStatus = data.autoClaimStatus || false
        reqObj.practiceLocationId = data.practiceLocationId
        InvoiceService.editInvoice(reqObj)
            .then((res) => { 
                setApiResponse(res);
            })
            .catch((err) => { 
                setApiResponse(err);
                console.log(err) 
            });

            // .then(res => {
            //     console.log(res)
            // })
            // .catch(err => {
            //     console.log(err)
            // })
            // if(props.onClose()){
            //     props.onClose()
            // }
    }

    useEffect(()=>{
        pullInvoice()
    },[props.id])

    return (
        <div>
            {initialData && <InvoiceForm initialData={initialData} isModal onClose={props.onClose} isEdit submitLabel="Add" submitHandler={editInvoice} />}
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
    )
}
export default EditInvoice