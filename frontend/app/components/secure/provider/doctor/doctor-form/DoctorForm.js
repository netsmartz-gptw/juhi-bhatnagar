import React, { useEffect, useState } from 'react'
import label from '../../../../../../assets/i18n/en.json'
import Select from 'react-select'
import Countries from '../../../../../common/constants/countries.constant'
import States from '../../../../../common/constants/states.constant'
import AccordionTemplate from '../../../../templates/components/AccordionTemplate'
import Utilities from '../../../../../services/commonservice/utilities'
import InputMask from 'react-input-mask'
import FormValidatorService from "../../../../../services/validator/form-validator.service";
import DoctorFormConfig from "./doctor-form-config";
import toast from "react-hot-toast";

const DoctorForm = (props) => {
    const { initialData, messages, isEdit, submitHandler, loaded, exitEdit } = props;
    const [formData, setFormData] = useState(initialData)
    const [isLoader, setIsLoader] = useState(false)
    const required = ['firstName', 'lastName', 'dob', 'email', 'practicePatientType','npi']
    const [errors, setErrors] = useState({})

    const clearForm = () => {
        setFormData({})
    }

    // formula for input change
    const inputChange = (e) => {
        let newStateObject = { ...formData };
        newStateObject[e.target.name] = e.target.value;
        setErrors(FormValidatorService.setErrors(e, errors, DoctorFormConfig.config))
        return setFormData(newStateObject);
    };

    const addressChange = (e) => {
        let newStateObject = { ...formData };
        newStateObject.address[e.target.name] = e.target.value;
        setErrors(FormValidatorService.setErrors(e, errors, DoctorFormConfig.config))
        return setFormData(newStateObject);
    };

    return (
        <div className="ui">
            {isLoader &&
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader">{label.common.loading}</div>
                </div>}
            {!isLoader && <AccordionTemplate id="doctorForm" accordionId="doctorForm">

                <div className="" title="Basic Information">
                    <div className="two fields">
                        <div className="required field">
                            <label> {label.doctor.add.firstName}</label>
                            <input placeholder="First Name" type="text" name="firstName" value={formData.firstName} onChange={(e) => { e.preventDefault(); inputChange(e) }} />
                            <span className="error-message">{errors.firstName}</span>
                        </div>
                        <div className="required field">
                            <label> {label.doctor.add.lastName}</label>
                            <input placeholder="Last Name" type="text" name="lastName" value={formData.lastName} onChange={(e) => { e.preventDefault(); inputChange(e) }} />
                            <span className="error-message">{errors.lastName}</span>
                        </div>
                    </div >
                    <div className="two fields">
                        <div className="required field">
                            <label> {label.doctor.add.email}</label>
                            <input placeholder="Email" type="text" name="email" value={formData.email} onChange={(e) => { e.preventDefault(); inputChange(e) }} />
                            <span className="error-message">{errors.email}</span>
                        </div>
                    </div >

                    <div className="two fields">
                        <div className="required field">
                            <label> {label.doctor.add.npiNumber}</label>
                            <input placeholder="NPI Number" type="text" name="npi" value={formData.npi} onChange={(e) => { e.preventDefault(); inputChange(e) }} />
                            <span className="error-message">{errors.npi}</span>
                        </div>
                        <div className="required field">
                            <div className="field">
                                <label> {label.doctor.add.type}</label>
                                <input placeholder="Provider Type" type="text" name="doctorTypeCode" value={formData.doctorTypeCode} onChange={(e) => { e.preventDefault(); inputChange(e) }} />
                                <span className="error-message">{errors.doctorTypeCode}</span>
                            </div>
                        </div>
                        <div className="required field">
                            <div className="field">
                                <label> {label.doctor.add.phone}</label>
                                <InputMask placeholder="Phone" type="text" name="phone" unmask={true} mask="(999) 999-9999" value={formData.phone} onChange={(e) => { e.preventDefault(); inputChange(e) }} editable={true}/>
                                <span className="error-message">{errors.phone}</span>
                            </div>
                        </div>
                    </div>
                </div >
                <div className="" title="Address Information">
                    <div className="field">
                        <label> {label.doctor.add.addressLine1}</label>
                        <input placeholder="Address Line 1" type="text" name="addressLine1" value={formData.address.addressLine1} onChange={(e) => { e.preventDefault(); addressChange(e) }} />
                        <span className="error-message">{errors.addressLine1}</span>
                    </div>
                    <div className="field">
                        <label> {label.doctor.add.addressLine2}</label>
                        <input placeholder="Address Line 2" type="text" name="addressLine2" value={formData.address.addressLine2} onChange={(e) => { e.preventDefault(); addressChange(e) }} />
                        <span className="error-message">{errors.addressLine2}</span>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label> {label.doctor.add.city}</label>
                            <input placeholder="City" type="text" name="city" value={formData.address.city} onChange={(e) => { e.preventDefault(); addressChange(e) }} />
                            <span className="error-message">{errors.city}</span>
                        </div>
                        <div className="field">
                            <label> {label.doctor.add.country}</label>

                            <Select
                                className="react-select-container"
                                classNamePrefix="react-select"
                                options={Countries}
                                name="country"
                                value={Countries.find(
                                    (obj) => obj.name === formData.address.country
                                )}
                                onChange={(e) => {
                                    addressChange({
                                        target: {
                                            value: e.name,
                                            name: "country",
                                        },
                                    });
                                }}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.countryId}
                            ></Select>
                            <span className="error-message">{errors.country}</span>
                        </div>
                    </div >
                    <div className="two fields">
                        <div className="field">
                            <label>{label.doctor.add.state}</label>
                            <Select
                                className="react-select-container"
                                classNamePrefix="react-select"
                                options={
                                    formData.address.country === "CANADA"
                                        ? States[2]
                                        : States[1]
                                }
                                name="state"
                                value={
                                    formData.address.country === "CANADA"
                                        ? States[2].find(
                                            (obj) => obj.abbreviation === formData.address.state
                                        )
                                        : States[1].find(
                                            (obj) => obj.abbreviation === formData.address.state
                                        )
                                }
                                onChange={(e) => {
                                    addressChange({
                                        target: {
                                            value: e.abbreviation,
                                            name: "state",
                                        },
                                    });
                                }}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.abbreviation}
                            />
                            <span className="error-message">{errors.state}</span>
                        </div >
                        <div className="field">
                            <label> {label.doctor.add.postalCode}</label>
                            <input placeholder="Postal (Zip) Code" type="text" mask="00000-0000" unmask={true} name="postalCode" value={formData.address.postalCode} onChange={(e) => { e.preventDefault(); addressChange(e) }} />
                            <span className="error-message">{errors.postalCode}</span>
                        </div>
                    </div >
                </div >
            </AccordionTemplate>}
            <div className='mt-3 d-flex justify-content-between'>
                <div className='col-auto'>
                    <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); if (props.onClose()) { props.onClose() } }}> Cancel </button>
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={(e) => {
                        e.preventDefault();
                        if (!FormValidatorService.checkForm(errors, formData, required)) {
                            toast.error("Please make sure the form is complete")
                        }
                        else {
                            props.submitHandler(formData)
                        }
                    }}> {isEdit ? label.doctor.edit.save : label.doctor.add.save}</button>
                </div>
            </div>
        </div >
    )
}
export default DoctorForm