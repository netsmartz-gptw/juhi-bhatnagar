import React, { useState, useEffect } from 'react'
import InputMask from 'react-input-mask';
import TabsTemplate from '../../../../../../templates/components/TabsTemplate';
import Select from 'react-select'
import PatientService from '../../../../../../../services/api/patient.service';
import moment from 'moment';
import CommonService from '../../../../../../../services/api/common.service';
import Utilities from '../../../../../../../services/commonservice/utilities';
import RecurringPaymentsService from '../../../../../../../services/api/recurring-payments.service';
import DimLoader from '../../../../../../templates/components/DimLoader';
import InvoiceService from '../../../../../../../services/api/invoice.service';
import ModalBox from '../../../../../../templates/components/ModalBox';
import PatientAccountAdd from '../../../../patient-account/patient-account-add/PatientAccountAdd';
import AddPatient from '../../../../patient/add-patient/AddPatient';
import toast from 'react-hot-toast';

const InstallmentForm = (props) => {
    const [inputData, setInputData] = useState({ ...props.initialData })
    const [cardType, setCardType] = useState()
    const [accounts, setAccounts] = useState()
    const [selectedAccount, setSelectedAccount] = useState()
    const [selectedPatient, setSelectedPatient] = useState()
    const [patientList, setPatientList] = useState()
    const [channelType, setChannelType] = useState(3)
    const [accountType, setAccountType] = useState('credit')
    const [subscriptionPlanActive, setSubscriptionPlanActive] = useState(false)
    const [installmentPlanActive, setInstallmentPlanActive] = useState(false)
    const [onCustomPlanSelectionFlag, setOnCustomPlanSelectionFlag] = useState(false)
    const [isLoader_ProcessRecurring, setIsLoader_ProcessRecurring] = useState(false)
    const [isLoader_ProcessTransaction, setIsLoader_ProcessTransaction] = useState(false)
    const [showAddAccount, setShowAddAccount] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [calcPayment, setCalcPayment] = useState()
    const [isLoader_Accounts, setIsLoader_Accounts] = useState(false)
    const [isLoader_Patients, setIsLoader_Patients] = useState(false)
    const icons = {
        blank: 'credit-card',
        AMEX: 'cc amex',
        DINERS: 'cc diners club',
        DISCOVER: 'cc discover',
        JCB: 'cc jcb',
        MASTERCARD: 'cc mastercard',
        VISA: 'cc visa'
    }
    const accountTypes = [
        // 0:'all',
        { value: 1, title: 'Credit' },
        { value: 2, title: 'ACH' },
        // 3: 'credit',
        // 4: 'debit',
        // 5:'cash',
        // 6:'check',
    ]

    const updateChannelType = (account) => {
        console.log("update to ", typeof account)
        switch (account) {
            case 'credit':
                // channelType = 3
                inputChange({
                    target: {
                        name: 'channelType', value: 3
                    }
                })
                setChannelType(3)
                break
            case 'ach':
                // channelType = 2
                inputChange({
                    target: {
                        name: 'channelType', value: 2
                    }
                })
                setChannelType(2)
                break
            case 'check':
                // channelType = 10
                inputChange({
                    target: {
                        name: 'channelType', value: 10
                    }
                })
                setChannelType(10)
                break
            case 'cash':
                // channelType = 9
                inputChange({
                    target: {
                        name: 'channelType', value: 9
                    }
                })
                setChannelType(9)
                break
            default:
                setChannelType(3)
                break;
        }

    }

    const addRecurringPayment = (patientId, patientAccId) => {
        let loggedInUserData = CommonService.getLoggedInData()
        setIsLoader_ProcessRecurring(true)
        let startDate = moment(inputData.firstTransactionDate)
            .add(moment().hour(), 'hour')
            .add(moment().minutes(), 'minute')
            .add(moment().seconds(), 'second')
            .toISOString();
        let reqObj = {
            'firstTransactionDate': startDate,
            'frequency': inputData.frequency || 3,
            'amount': inputData.amount || inputData.subTotal + inputData.taxAmount,
            'taxPercent': inputData.taxPercent,
            'noOfPayments': parseInt(inputData.noOfPayments),
            'discountType': inputData.discountType,
            'accountType': 1,
            'channelType': accountType === 'ach' ? 2 : 3,
            'email': inputData.email,
            'firstName': inputData.firstName,
            'lastName': inputData.lastName,
            'description': inputData.description,
            'downPayment': inputData.downPayment || 0,
            'transactionType': props.type === 2 ? 3 : 1,
            'discountAmount': 0,
        };

        if (subscriptionPlanActive === true) {
            inputData.discountList == 1 ?
                reqObj.discountAmount = +inputData.discountAmount || 0 :
                reqObj.discountRate = +inputData.discount || 0;
        } else if (installmentPlanActive === true) {
        inputData.discountList == 1 ?
            reqObj.discountAmount = +inputData.discountAmount || 0 :
            reqObj.discountRate = +inputData.discount || 0;
        }

        if (selectedPatient?.id) {
            reqObj.patientId = selectedPatient.id;
        } else {
            reqObj.patientId = patientId;
        }

        if (selectedAccount?.id) {
            reqObj.paymentAccountId = selectedAccount.id;
        } else {
            reqObj.paymentAccountId = patientAccId;
        }

        if (inputData.recurringPlanId != null && inputData.recurringPlanId !== undefined && inputData.recurringPlanId != '') {
            reqObj.recurringPlanId = inputData.recurringPlanId;
        } else {
            reqObj.recurringPlanId = null;
        }

        setInstallmentPlanActive(false)
        setSubscriptionPlanActive(false)

        if (onCustomPlanSelectionFlag !== true) {
            if (subscriptionPlanActive === true) {
                setInstallmentPlanActive(false)
                setSubscriptionPlanActive(true)
            } else {
                setInstallmentPlanActive(true)
                setSubscriptionPlanActive(false)
            }
        }

        // if (inputData !== undefined && inputData.invoicePayment !== undefined && inputData.invoicePayment === true) {

        const recReqObj = {
            paymentAccountId: reqObj.paymentAccountId,
            firstTransactionDate: startDate,
            frequency: reqObj.frequency,
            noOfPayments: parseInt(reqObj.noOfPayments),
            transactionType: props.type === 2 ? 3 : 1,
            channelType: accountType === 'ach' ? 2 : 3,
            downPayment: reqObj.downPayment || 0,
            email: inputData.email,
            description: inputData.description
        };

        if (loggedInUserData.userType === 1) {
            recReqObj.providerId = loggedInUserData.parentId;
        } else if (loggedInUserData.userType === 0) {
            recReqObj.patientId = loggedInUserData.parentId;
        }

        if (accountType == 'credit') {
            recReqObj.cvv = inputData.cvv;
        }


        return InvoiceService.addRecurringPayment(props.initialData.id, recReqObj)
            .then(
                (response) => {
                    // resetForms();
                    // getRecurringPaymentSchedule(patientId, response.paymentId);
                    setIsLoader_ProcessRecurring(false)
                    toast.success("Payment Plan Created")
                    if (props.onClose()) {
                        props.onClose()
                    }
                })
            .catch(error => {
                setIsLoader_ProcessRecurring(false)
                toast.error("Failed to create Payment Plan")
                console.log(error)
                if (props.onClose()) {
                    props.onClose()
                }
            })

        // } else {
        //     setTimeout(() => {
        //         RecurringPaymentsService.addRecurringPayment(reqObj)
        //             .then(
        //                 (response) => {
        //                     // resetForms();
        //                     getRecurringPaymentSchedule(patientId, response.id);
        //                     setIsLoader_ProcessRecurring(false)
        //                     if (props.onClose()) {
        //                         props.onClose()
        //                     }
        //                 })

        //             .catch(error => {
        //                 setIsLoader_ProcessRecurring(false)
        //                 if (props.onClose()) {
        //                     props.onClose()
        //                 }
        //                 // checkException2(error);
        //             });
        //     }, 5000);
        // }

    }
    const findAccounts = () => {
        setIsLoader_Accounts(true)
        PatientService.fetchPatientAccount(inputData.patientId)
            .then(res => {
                setAccounts(res)
                setIsLoader_Accounts(false)
            })
            .catch(err => {
                setIsLoader_Accounts(false)
            })
    }

    // formula for input change
    const inputChange = (e) => {
        let newStateObject = { ...inputData };
        newStateObject[e.target.name] = e.target.value
        setInputData(newStateObject);
        return console.log(inputData)
    };

    const patientLookup = () => {
        setIsLoader_Patients(true)
        if (props.patientId || props.initialData?.patientId) {
            let patientId = props.patientId || props.initialData?.patientId
            PatientService.getPatientById(patientId)
                .then(res => {
                    setPatientList([res.data])
                    setIsLoader_Patients(false)
                })
                .catch(err => {
                    setIsLoader_Patients(false)
                })
        }
        else {
            let reqObj = { SearchTerm: '', isActive: true, isRegistered: true, SortField: 'firstName' }
            CommonService.patientLookup(reqObj)
                .then(res => {
                    if (res) {
                        setPatientList(res.data)
                        if (inputData.patientId) {
                            setSelectedPatient(res.data.find(obj => obj.id === inputData.patientId))
                        }
                        setIsLoader_Patients(false)
                    }
                }
                )
                .catch(err => {
                    console.log(err)
                    setIsLoader_Patients(false)
                })
        }
    }

    useEffect(() => {
        patientLookup()
    }, [])
    useEffect(() => {
        if (props.initialData.patientId || inputData.patientId || props.patientId || selectedPatient) {
            findAccounts()
        }
        if (selectedPatient) {
            inputChange({ target: { name: 'email', value: selectedPatient.email } })
        }
    }, [selectedPatient])

    useEffect(() => {
        let account = { ...selectedAccount }
        delete account.createdOn
        if (selectedAccount) {
            setAccountType(accountTypes.find(obj => obj.value === account.accountType).title.toLowerCase())
            updateChannelType(accountTypes.find(obj => obj.value === account.accountType).title.toLowerCase())
        }
        setInputData({ ...inputData, ...account, ...selectedPatient })
    }, [selectedAccount])

    // console.log(props.initialData)
    // console.log(props.type)
    const FrequencyEnum = [
        'Daily',
        'Weekly',
        'BiWeekly',
        'Monthly',
        'Quarterly',
        'HalfYearly',
        'Annually'
    ]

    useEffect(() => {
        if (props.initialData) {
            console.log(props.initialData)
            setInputData(props.initialData)
        }
    }, [props.initialData])

    const calcPaymentFunc = () => {
        let amount = parseFloat(inputData.subTotal + inputData.taxAmount)
        if (inputData.noOfPayments > 0) {
            let noOfPayments = inputData.noOfPayments
            setCalcPayment(parseFloat(amount / noOfPayments).toFixed(2))
        }
        else setCalcPayment(amount)

    }

    useEffect(() => {
        calcPaymentFunc()
    }, [inputData.amount, inputData.noOfPayments])
    return (
        <div className='m-0 p-0'>
            {isLoader_ProcessRecurring || isLoader_ProcessTransaction ? <DimLoader loadMessage="Processing..." /> : null}
            <div className='card-body'>
                <div className='row'>
                    <div className='col-3 card m-0 p-0 bg-light'>
                        <div className='card-body p-3'>
                            {/* {channelType}
                            {accountType} */}
                            <h5 className='mb-3'>Payment Summary</h5>
                            <div>
                                <div className='field'>
                                    <label>Reference No</label>
                                    <input name="invoiceNumber" type="text" value={inputData.invoiceNumber || inputData.invoiceNumber} />
                                </div>
                                <div className='field required '>
                                    <label>{props.type == 2 ? 'Membership' : 'Payment Plan'} Amt</label>
                                    {/* <div className='input-group row align-items-center'> */}
                                    {/* <i className='icon small dollar' /> */}
                                    <input name="subTotal" type="text" disabled value={Utilities.toDollar(inputData.subTotal)} />
                                    {/* </div> */}
                                </div>
                                <div className='field'>
                                    <label>Tax Amount</label>
                                    {/* <div className='input-group row align-items-center'> */}
                                    {/* <i className='icon small dollar' /> */}
                                    <input name="taxAmount" type="text" value={Utilities.toDollar(inputData.taxAmount)} disabled />
                                    {/* </div> */}
                                </div>
                                {props.type !== 2 && <div className='field'>
                                    <label>Payment Amount</label>
                                    {/* <div className='input-group row align-items-center'> */}
                                    {/* <i className='icon small dollar' /> */}
                                    <input name="payAmount" type="text" value={Utilities.toDollar(calcPayment)} disabled />
                                    {/* </div> */}
                                </div>}
                                {props.type !== 3 &&
                                    <div className='field'>
                                        <label>Pay Today</label>
                                        {/* <div className='input-group row align-items-center'> */}
                                        {/* <i className='icon small dollar' /> */}
                                        <input name="downPayment" type="number" value={inputData.downPayment} onChange={e => { e.preventDefault(); inputChange(e) }} />
                                        {/* </div> */}
                                    </div>
                                }
                            </div>
                        </div>


                        <div className='card-footer m-0 align-items-end bg-dark mt-3 text-white p-3'>
                            {/* Total Amount: {Utilities.toDollar(inputData.subTotal + inputData.taxAmount) || '0.00'} */}
                            <div className='field'>
                                <label className="text-white text-end">Total Amount</label>
                                <input name="amount" type="text" className='text-white text-end' value={Utilities.toDollar(inputData.subTotal + inputData.taxAmount)} disabled />
                            </div>
                            {/* {props.type} */}
                        </div>
                    </div>
                    <div className='col-9 card m-0 p-3'>
                        <h5 className='card-title '>Search Patient</h5>
                        <div className='field mb-3'>
                            <div className='col-12 input-group'>
                                <Select
                                    options={patientList}
                                    name="patientId"
                                    value={patientList && patientList.find(obj => obj.id === inputData.patientId)}
                                    isSearchable
                                    classNamePrefix="react-select"
                                    className="react-select-container"
                                    isLoading={isLoader_Patients}
                                    isDisabled={props.patientId || props.initialData.patientId}
                                    onChange={e => {
                                        inputChange({
                                            target:
                                                { value: e.id, name: 'patientId' }
                                        })
                                        setSelectedPatient(e)
                                    }}
                                    loadingMessage="Patient Loading..."
                                    getOptionLabel={(option) => {
                                        option.firstName + ' ' + option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY") + ' | ' + Utilities.toPhoneNumber(option.mobile) || Utilities.toPhoneNumber(option.patientPhone)
                                        return (
                                            option.firstName + ' ' + option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY") + ' | ' + Utilities.toPhoneNumber(option.mobile) || Utilities.toPhoneNumber(option.patientPhone)
                                        )
                                    }
                                    }
                                    getOptionValue={(option) => option.id}
                                    noOptionsMessage={(e) => { return <button className='btn btn-primary form-control'>Add Patient</button> }}
                                />
                                {!props.patientId && !props.initialData.patientId ? <button className='btn btn-primary' title="Add Patient" onClick={e => { e.preventDefault(); setShowAdd(true) }}><i className='icon plus' /></button> : null}
                            </div>
                        </div>
                        <div className='field mb-3 input-group'>
                            <Select
                                options={accounts}
                                name="patientId"
                                isClearable
                                isLoading={isLoader_Accounts}
                                classNamePrefix="react-select"
                                className="react-select-container"
                                value={accounts && accounts.find(obj => obj.id === inputData.account?.id)}
                                onChange={e => {
                                    inputChange({
                                        target: {
                                            name: 'account', value: e
                                        }
                                    })
                                    setSelectedAccount(e)
                                    console.log(e)
                                }}
                                placeholder="Select Account"
                                isDisabled={props.isDisabled || !accounts}
                                getOptionLabel={(option) => {
                                    let label = ""
                                    if (option.accountType === 1) {
                                        label = accountTypes.find(obj => obj.value === option.accountType).title + ' | ' + option.cardType + ' ' + option.maskedCardNumber + ' | ' + option.accountHolderName
                                    }
                                    else if (option.accountType === 2) {
                                        label = accountTypes.find(obj => obj.value === option.accountType).title + ' | ' + option.bankName + ' ' + option.maskedAccountNo + ' | ' + option.accountHolderName
                                    }
                                    return label
                                }
                                }
                                getOptionValue={(option) => option.id}
                                noOptionsMessage={() => { return <button className='btn btn-primary form-control' onClick={e => { e.preventDefault(); setShowAddAccount(true) }}>Add Account</button> }}
                            />
                            {!props.isDisabled && <button className='btn btn-primary col-auto' title="Add Account" onClick={e => { e.preventDefault(); setShowAddAccount(true) }}><i className='icon plus' /></button>}
                        </div>
                        <TabsTemplate activeKey={accountType} onSelect={k => { console.log(k); setAccountType(k); return updateChannelType(k) }}>
                            <div disabled={selectedAccount && selectedAccount.accountType !== 1} eventKey='credit' title={<span><i className='icon credit card' />Card</span>}>
                                <div className='ui segment row d-flex align-items-end pb-4'>
                                    <div className='field required col-12'>
                                        <label>Name on Card</label>
                                        <input name="accountHolderName" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.accountHolderName} />
                                    </div>
                                    <div className='field required col-5'>
                                        <label>Last 4 of Card</label>
                                        <div className='input-group'>
                                            <input name="maskedCardNumber" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.maskedCardNumber} />

                                            <span className="input-group-text bg-transparent" id="basic-addon1">
                                                <i className={`mx-auto icon bg-transparent text-primary large ${cardType ? icons[inputData.cardType] : 'credit card'}`} ></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className='field required col-2'>
                                        <label>CVV</label>
                                        <input name="cvv" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.cvv} />
                                    </div>
                                    <div className='field required col-5'>
                                        <label>Exp.</label>
                                        <input name="cardExpiry" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.cardExpiry} />
                                    </div>
                                </div>
                            </div>
                            <div disabled={selectedAccount && selectedAccount.accountType !== 2} eventKey='ach' title={<span><i className='icon credit card' />ACH</span>}>
                                <div className='ui segment row d-flex align-items-end pb-4'>
                                    <div className="field required col-6">
                                        <label>Routing Number</label>
                                        <input name="routingNumber" placeholder='Routing/Transit Number' type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.routingNumber} />
                                    </div>
                                    <div className="field required col-6">
                                        <label>Account Number</label>
                                        <input name="maskedAccountNo" placeholder='Routing/Transit Number' type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.maskedAccountNo} />
                                    </div>
                                    <div className="field required col-6">
                                        <label>Account Name</label>
                                        <input name="accountHolderName" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.accountHolderName} />
                                    </div>
                                    <div className="field required col-6">
                                        <label>Account Type</label>
                                        <select name="nameOfInstitution" className='form-select' type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.nameOfInstitution}>
                                            <option value="checking">Checking</option>
                                            <option value="savings">Savings</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </TabsTemplate>
                        <div className='px-3 row'>
                            <div className="field required col-4">
                                <label>Payment Cycle</label>
                                <select className="form-select" name="frequency" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.frequency} defaultValue={3}>
                                    {FrequencyEnum.map((freq, i) => {
                                        return (
                                            <option value={i}>{freq}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="field required col-4">
                                <label>Number of Payments</label>
                                <input name="noOfPayments" type="number" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.noOfPayments} />
                            </div>
                            <div className="field required col-4">
                                <label>Schedule Transactions On</label>
                                <input name="firstTransactionDate" min={moment().add(1, "d").format('YYYY-MM-DD')} type="date" onChange={e => { e.preventDefault(); inputChange(e) }} defaultValue={Utilities.toDate(moment().date(15))} value={Utilities.toDate(inputData.firstTransactionDate)} />
                            </div>
                            <div className="field col-12">
                                <label>Email</label>
                                <input name="email" type="email" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.toEmail || inputData.email} />
                            </div>
                            <div className='field col-12'>
                                <label>Memo</label>
                                <textarea className='form-control' name="description" type="date" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.description} defaultValue="Thank you for your business" />
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            {/* {props.type} */}
            <div className='mt-3 d-flex justify-content-between'>
                <div className='col-auto'>
                    {props.isModal && <button className="btn btn-secondary" onClick={e => { e.preventDefault(); props.onClose() }}>Cancel</button>}
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={e => { e.preventDefault(); addRecurringPayment(inputData.patientId, selectedAccount.id); }}>{props.submitLabel || 'Add'}</button>
                </div>
            </div>
            <ModalBox open={showAddAccount} onClose={() => setShowAddAccount(false)}>
                <PatientAccountAdd patientId={inputData.patientId || props.initialData.patientId} onClose={() => { setShowAddAccount(false) }} />
            </ModalBox>
            <ModalBox open={showAdd} onClose={() => setShowAdd(false)}>
                <AddPatient onClose={() => { setShowAdd(false) }} />
            </ModalBox>
        </div >
    )
}

export default InstallmentForm