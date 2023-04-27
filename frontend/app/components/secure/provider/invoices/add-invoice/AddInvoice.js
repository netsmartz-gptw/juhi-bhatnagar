import { data } from 'jquery'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import InvoiceService from '../../../../../services/api/invoice.service'
import Utilities from '../../../../../services/commonservice/utilities'
import ModalBox from '../../../../templates/components/ModalBox'
import InstallmentForm from '../../transactions/terminals/installment-terminal/installment-form/InstallmentForm'
import VirtualTerminalForm from '../../transactions/terminals/virtual-terminal/virtual-terminal-form/VirtualTerminalForm'
import InvoiceForm from '../invoice-form/InvoiceForm'
import APIResponse from '../../../../templates/components/APIResponse';

const AddInvoice = (props) => {
    const [installment, setInstallment] = useState(false)
    const [showVirtTrans, setShowVirtTrans] = useState(false)
    const [invoice, setInvoice] = useState()
    const [isLoader, setIsLoader] = useState(false)
    const [invoiceStatus, setInvoiceStatus] = useState()
    const [apiResponse, setApiResponse] = useState()

    const onSuccess = (message) => {
        setInvoice(apiResponse.data)
        if (data) {
            if (data.invoiceStatus === 7) {
                setInstallment(true)
            }
            else if (data.invoiceStatus === 5) {
                setInstallment(true)
            }
            else {
                setShowVirtTrans(true)
            }
        }
    }

    const addInvoiceSubmit = (data, selectedPatient, items, payMethod, doctorId) => {
        setIsLoader(true)
        console.log(data)
        let reqObj = data
        reqObj.autoClaimStatus = false
        reqObj.doctorId = items[0]?.doctorId || doctorId
        reqObj.invoiceDate = data.invoiceDate ? new Date(data.invoiceDate) : new Date()
        reqObj.dueDate = data.dueDate ? new Date(data.dueDate) : new Date()
        reqObj.serviceDate = data.serviceDate ? new Date(data.serviceDate) : new Date()
        reqObj.items = items
        reqObj.operationType = 2
        reqObj.patientId = selectedPatient.id
        reqObj.patientName = data.patientName || selectedPatient.name || selectedPatient.firstName+' '+selectedPatient.lastName
        reqObj.invoiceStatus = data.invoiceStatus
        reqObj.taxAmount = data.itemTotalTax
        reqObj.practiceLocationId = data.practiceLocationId
        reqObj.visitDate = new Date(data.serviceDate)
        console.log(data.invoiceStatus)
        setInvoiceStatus(data.invoiceStatus)
        return InvoiceService.addInvoice(reqObj)
            .then((res) => {
                setIsLoader(false)
                setInvoice(res.data)
                setApiResponse(res);
                if (payMethod === 2 || payMethod === 3) {
                    return setInstallment(true)
                }
                else {
                    return setShowVirtTrans(true)
                }
            })
            .catch((err) => {
                console.log(err)
                setIsLoader(false)
                setApiResponse(err);
            });
    }

    useEffect(() => {
        if (isLoader === true) {
            setTimeout(() => {
                if (isLoader === true) {
                    setIsLoader(false)
                    // toast.error("Failure Creating Invoice")
                }
            }, 30000)
        }
    }, [isLoader])
    return (
        <div>
            <InvoiceForm isLoader={isLoader} selectPatientDisabled={props.selectPatientDisabled} hideCancel={props.hideCancel} initialData={props.initialData} isModal={props.isModal} onClose={() => { if (props.onClose) { props.onClose() } }} submitLabel="Add" submitHandler={addInvoiceSubmit} />
            <ModalBox open={installment && invoice} onClose={() => { setInstallment(false) }} size="large">
                {invoice && <InstallmentForm initialData={invoice}   type={invoiceStatus == 7 ? 2 : 3} onClose={() => {
                    setInstallment(false); if (props.onClose()) {
                        props.onClose
                    }
                }} isModal />}
            </ModalBox>
            <ModalBox open={showVirtTrans && invoice} onClose={() => {
                setShowVirtTrans(false); if (props.onClose) {
                    props.onClose()
                }
            }}>
                <VirtualTerminalForm initialData={{ ...invoice, taxAmount: invoice?.itemTotalTax, adjustedUnpaidAmount: invoice?.adjustedUnpaidAmount? invoice?.adjustedUnpaidAmount : invoice?.finalAmount }} onClose={() => {
                    setShowVirtTrans(false); if (props.onClose) {
                        props.onClose()
                    }
                }} size="large" isModal />
            </ModalBox>
            <APIResponse apiResponse={apiResponse} toastOnSuccess={true} />
        </div>
    )
}
export default AddInvoice