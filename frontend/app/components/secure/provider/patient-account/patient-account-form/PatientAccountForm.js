import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import States from '../../../../../common/constants/states.constant'
import CommonService from '../../../../../services/api/common.service'
import Utilities from '../../../../../services/commonservice/utilities'
import AccordionTemplate from '../../../../templates/components/AccordionTemplate'
import InputMask from "react-input-mask";
import moment from 'moment'
import PatientService from '../../../../../services/api/patient.service'

const PatientAccountForm = (props) => {
    const [cardType, setCardType] = useState()
    const [paymentMethod, setPaymentMethod] = useState("credit-debit")
    const [inputData, setInputData] = useState(props.initialData)
    const [sameAddress, setSameAddress] = useState(false)
    const [patientList, setPatientList] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(props.patient || null)
    const icons = {
        blank: 'credit-card',
        AMEX: 'cc amex',
        DINERS: 'cc diners club',
        DISCOVER: 'cc discover',
        JCB: 'cc jcb',
        MASTERCARD: 'cc mastercard',
        VISA: 'cc visa'
    }

    // formula for input change
    const inputChange = (e) => {
        let newStateObject = { ...inputData };
        newStateObject[e.target.name] = e.target.value
        setInputData(newStateObject);
        return console.log(inputData)
    };
    const addressInputChange = (e) => {
        let newStateObject = { ...inputData };
        newStateObject.address[e.target.name] = e.target.value
        setInputData(newStateObject);
        return console.log(inputData)
    };

    useEffect(() => {
        if (props.patientId) {
           PatientService.getPatientById(props.patientId)
           .then(res=>{
               setPatientList([res.data])
               setSelectedPatient(res.data)
           })
        }
        else{
            let reqObj = { SearchTerm: '', isActive: true, isRegistered: true }
        PatientService.findPatient(reqObj)
            .then(res => {
                if (res) {
                    console.log(res)
                    setPatientList(res)
                }
                setSelectedPatient(res.find(obj => obj.id === inputData.patientId))
            }
            )
            .catch(err => console.log(err))
        }
    }, [])

    useEffect(() => {
        console.log(selectedPatient)
        if (selectedPatient) {
            if (inputData.sameAsPatientAddress === true) {
                setInputData({ ...inputData, address: { ...selectedPatient.address } })
            }
        }
    }, [inputData.sameAsPatientAddress])
    useEffect(() => {
        let cardValue = inputData.cardNumber
        if (cardValue != null && cardValue?.length > 3) {
            let cardType = Utilities.getCardType(cardValue.replace(" ", "").replace(" ", "").replace(" ", ""))
            inputChange({
                target: {
                    value: cardType, name: "cardType"
                }
            })
            return setCardType(cardType)
        } else {
            setCardType()
        }
    }, [inputData.cardNumber])

    useEffect(() => {
        if (inputData.patientId) {
            setSelectedPatient(patientList.find(obj => obj.id === inputData.patientId))
        }
        if (props.initialData.patientId) {
            setSelectedPatient(patientList.find(obj => obj.id === props.initialData.patientId))
        }
    }, [])
    useEffect(() => {
        if (selectedPatient) {
            inputChange({ target: { value: selectedPatient?.firstName + ' ' + selectedPatient?.lastName, name: 'accountHolderName' } })
        }
    }, [selectedPatient])

    return (
        <div className="ui container">
            <AccordionTemplate id="patientAccountForm" accordionId="patientAccountForm">
                <div title="Account Details">
                    <div className="row d-flex my-3">
                        <div className={props.isEdit ? 'field col' : 'field required col'}>
                            <label>{props.isEdit ? 'Patient' : 'Search Patient'}</label>
                            <Select
                                isDisabled={true}
                                options={patientList}
                                classNamePrefix="react-select"
                                className="react-select-container"
                                name="patientId"
                                value={patientList && patientList.find(obj => obj.id === inputData.patientId || obj.id === props.initialData.patientId)}
                                onChange={e => {
                                    inputChange({
                                        target:
                                            { value: e.id, name: 'patientId' }
                                    })
                                    setSelectedPatient(e)
                                }}
                                getOptionLabel={(option) => option.firstName + ' ' + option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY") + ' | ' + Utilities.toPhoneNumber(option.mobile) || Utilities.toPhoneNumber(option.patientPhone)}
                                getOptionValue={(option) => option.id}
                            />
                            {/* {props.initialData.patientId} */}
                        </div>
                        {!props.isEdit && <div className="col-12">
                            <label className="me-3 mb-3">Payment Type</label>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input mt-2" type="radio" name="paymentType" id="inlineRadio1" defaultChecked={paymentMethod === "credit-debit" ? true : false} onInputCapture={e => { e.preventDefault(); inputChange(e); return setPaymentMethod("credit-debit") }} value="credit-debit" />
                                <label className="form-check-label mt-1" for="inlineRadio1">Card</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input mt-2" type="radio" name="paymentType" id="inlineRadio2" defaultChecked={paymentMethod === "ach" ? true : false} onInputCapture={e => { e.preventDefault(); inputChange(e); return setPaymentMethod("ach") }} value="ach" />
                                <label className="form-check-label mt-1" for="inlineRadio2">ACH</label>
                            </div>
                        </div>}
                        {paymentMethod === "credit-debit" && !props.isEdit ?
                            <div className="row d-flex">
                                <div className="col-12 field required">
                                    <label>Name on Card</label>
                                    <input
                                        type="text"
                                        name="accountHolderName"
                                        value={inputData.accountHolderName}
                                        onChange={e => { e.preventDefault(); inputChange(e) }}
                                    />
                                </div>
                                <div className="col field required">
                                    <label>Credit Card Number</label>
                                    <div className="row d-flex">
                                        <div className="mb-3 col">
                                            <InputMask
                                                type="text"
                                                mask={cardType === 'AMEX' ? '9999 9999 9999 999' : '9999 9999 9999 9999'}
                                                unmask={true}
                                                // className="form-control"
                                                placeholder="Credit Card"
                                                aria-describedby="basic-addon1"
                                                name="cardNumber"
                                                value={inputData.cardNumber}
                                                onChange={e => { e.preventDefault(); inputChange(e) }}
                                            />
                                        </div>
                                        <div className="col-auto">                                          <span className="input-group-text bg-transparent" id="basic-addon1">
                                            <i className={`mx-auto icon bg-transparent text-primary large ${cardType ? icons[cardType] : 'credit card'}`} ></i>
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div> : null}
                        {paymentMethod === 'credit-debit' && <div className="col-auto mb-3 field required">
                            <label>Expiration</label>
                            <InputMask
                                type="text"
                                name="cardExpiry"
                                mask="99/99"
                                unmask={true}
                                value={inputData.cardExpiry}
                                onChange={e => { e.preventDefault(); inputChange(e) }}
                            />
                        </div>}
                        {paymentMethod === "ach" &&
                            <div className="row d-flex">
                                <div className="col-6 field required">
                                    <label>Account Name</label>
                                    <input type="text"
                                        name="accountHolderName"
                                        value={inputData.accountHolderName}
                                        onChange={e => { e.preventDefault(); inputChange(e) }} />
                                </div>
                                <div className="col-6 field required">
                                    <label>Account Type</label>
                                    <select className="form-control"
                                        name="isCheckingAccount"
                                        value={inputData.isCheckingAccount}
                                        onChange={e => { e.preventDefault(); inputChange(e) }}
                                    >
                                        <option value={true}>Checking</option>
                                        <option value={false}>Savings</option>
                                    </select>
                                </div>
                                <div className="col-6 field required">
                                    <label>Routing Number</label>
                                    <input type="number"
                                        // mask="999 999 999"
                                        // unmask={true}
                                        name="routingNumber"
                                        value={inputData.routingNumber}
                                        onChange={e => { e.preventDefault(); inputChange(e) }}
                                    />
                                </div>
                                <div className="col-6 field required">
                                    <label>Account Number</label>
                                    <input type="number"
                                        name="accountNumber"
                                        // mask="9999 9999 9999"
                                        // unmask={true}
                                        value={inputData.accountNumber}
                                        onChange={e => { e.preventDefault(); inputChange(e) }} />
                                </div>
                                <div className="col-6 field required">
                                    <label>Bank Name</label>
                                    <input type="text"
                                        name="bankName"
                                        value={inputData.bankName}
                                        onChange={e => { e.preventDefault(); inputChange(e) }}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div title="Billing Address Details">
                    <div className="row d-flex my-3">
                        <div className="col-12 field form-check form-switch ms-3 ps-0">
                            <input className="form-check-input ms-0 me-3 mt-2" type="checkbox" role="switch" id="flexSwitchCheckDefault"
                                name="sameAsPatientAddress"
                                checked={inputData.sameAsPatientAddress}
                                onChange={e => {
                                    inputChange({ target: { value: e.target.checked, name: "sameAsPatientAddress" } })
                                }} />
                            <label className="form-check-label mt-1" for="flexSwitchCheckDefault">Same as Patient Address</label>
                        </div>
                        <div className="col-12 required field">
                            <label>Address Line 1</label>
                            <input type="text"
                                name="addressLine1"
                                value={inputData.address.addressLine1}
                                onChange={e => { addressInputChange(e) }} />
                        </div>
                        <div className="col-12 field">
                            <label>Address Line 2</label>
                            <input type="text"
                                name="addressLine2"
                                value={inputData.address.addressLine2}
                                onChange={e => { addressInputChange(e) }} />
                        </div>
                        <div className="col-6 required field">
                            <label>City</label>
                            <input type="text"
                                name="city"
                                value={inputData.address.city}
                                onChange={e => { addressInputChange(e) }} />
                        </div>
                        <div className="col-3 required field">
                            <label>State</label>
                            <Select
                                classNamePrefix="react-select"
                                className="react-select-container"
                                options={States[1]}
                                name="state"
                                value={States[1].find((obj) => obj.abbreviation === inputData.address.state)}
                                onChange={(e) => {
                                    addressInputChange({
                                        target: {
                                            value: e.abbreviation,
                                            name: "state",
                                        },
                                    });
                                }}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.abbreviation}
                                disabled={
                                    inputData.sameAsPatientAddress === "true" ? true : null
                                }
                            />
                        </div>
                        <div className="col-3 required field">
                            <label>ZipCode</label>
                            <InputMask
                                // className="form-control"
                                type="text"
                                mask="99999"
                                unmask={true}
                                name="zipCode"
                                value={inputData.address.zipCode || inputData.address.postalCode}
                                onChange={e => { e.preventDefault(); addressInputChange(e) }} />
                        </div>
                    </div>
                </div>
            </AccordionTemplate>
            <div className='d-flex mt-3 justify-content-between'>
                <div className='col-auto'>
                    <button className="btn btn-secondary" onClick={e => { e.preventDefault(e); if (props.onClose()) { props.onClose() } }}>Close</button>
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={e => { e.preventDefault(e); props.submitHandler(paymentMethod, inputData) }}>{props.buttonLabel || 'Save'}</button>
                    {props.additionalButton && props.additionalButton}
                </div>
            </div>
        </div>
    )
}

export default PatientAccountForm