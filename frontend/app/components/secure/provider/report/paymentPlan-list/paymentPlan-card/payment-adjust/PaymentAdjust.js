import React, { useState, useEffect } from 'react'
import PatientService from '../../../../../../../services/api/patient.service'
import Select from 'react-select'
import ModalBox from '../../../../../../templates/components/ModalBox'
import PatientAccountAdd from '../../../../patient-account/patient-account-add/PatientAccountAdd'
import Utilities from '../../../../../../../services/commonservice/utilities'
import RecurringPaymentsService from '../../../../../../../services/api/recurring-payments.service'
import toast from 'react-hot-toast'
import ScheduledTransactionService from '../../../../../../../services/api/scheduled-transaction.service'

const PaymentAdjust = (props) => {
    const [accounts, setAccounts] = useState()
    const [selectedAccount, setSelectedAccount] = useState()
    const [transactionDate, setTransactionDate] = useState()
    const [showAdd, setShowAdd] = useState(false)
    const accountTypes = {
        // 0:'all',
        1: 'Credit',
        2: 'ACH',
        3: 'credit',
        4: 'debit',
        // 5:'cash',
        // 6:'check',
    }

    const adjustPayment = () => {
        let reqObj = {
            newExecutionDate: new Date(transactionDate),
            operationType: 2,
            paymentAccountId: selectedAccount.id,
        }
        ScheduledTransactionService.updateScheduleTransaction(reqObj, props.payment.recurringPaymentId, props.payment.id)
        .then(res=>{
            toast.success("Recurring TC Updated")
            if(props.onClose()){
                props.onClose()
            }
        })
        .catch(err=>{
            toast.error("Recurring TC Update Failed")
            if(props.onClose()){
                props.onClose()
            }
        })
    }
    const findAccounts = () => {
        console.log(props.patientId)
        PatientService.fetchPatientAccount(props.patientId)
            .then(res => {
                setAccounts(res)
                if (props.payment?.paymentAccountId) {
                    setSelectedAccount(res.find(obj => obj.id === props.payment.paymentAccountId))
                }
            })
    }

    useEffect(() => {
        findAccounts()
        console.log(props.payment)
        if (props.payment.executionDate) {
            setTransactionDate(Utilities.toDate(props.payment.executionDate))
        }
    }, [props.patientId])
    return (
        <div className='p-3 row d-flex'>
            <div className='field mb-3 col-8'>
                <label>Select Account</label>
                <div className='input-group'>
                    <Select
                        classNamePrefix="react-select"
                        className="react-select-container"
                        options={accounts}
                        name="patientId"
                        value={selectedAccount}
                        onChange={e => {
                            setSelectedAccount(e)
                        }}
                        placeholder="Select Account"
                        getOptionLabel={(option) => {
                            let label = ""
                            if (option.accountType === 1) {
                                label = accountTypes[option.accountType] + ' | ' + option.cardType + ' ' + option.maskedCardNumber + ' | ' + option.accountHolderName
                            }
                            else if (option.accountType === 2) {
                                label = accountTypes[option.accountType] + ' | ' + option.bankName + ' ' + option.maskedAccountNo + ' | ' + option.accountHolderName
                            }
                            return label
                        }
                        }
                        getOptionValue={(option) => option.id}
                        noOptionsMessage={() => { return <button className='btn btn-primary form-control' onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add Account</button> }}
                    />
                    <button className='btn btn-primary col-auto' title="Add Account" onClick={e => { e.preventDefault(); setShowAdd(true) }}><i className='icon plus' /></button>
                </div>
            </div>
            <div className='field required col-4'>
                <label>Transaction Date</label>
                <input type="date" value={transactionDate} onChange={e => { e.preventDefault(); setTransactionDate(e.target.value) }} />
            </div>
            <div className='col-12'>
                <button className='btn btn-primary' onClick={(e)=>{e.preventDefault(); adjustPayment()}}>Update</button>
                <button className='btn btn-secondary ms-3' onClick={e => { e.preventDefault(); props.onClose() }}>Close</button>
            </div>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }}>
                <PatientAccountAdd patientId={props.patientId} onClose={() => { setShowAdd(false) }} />
            </ModalBox>
        </div>
    )
}

export default PaymentAdjust