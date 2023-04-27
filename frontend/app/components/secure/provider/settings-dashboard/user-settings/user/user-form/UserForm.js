import React, { useState, useEffect } from 'react'
import label from '../../../../../../../../assets/i18n/en.json'
import Select from 'react-select'
import States from '../../../../../../../common/constants/states.constant'
import Countries from '../../../../../../../common/constants/countries.constant'
import RoleService from '../../../../../../../services/api/role.service'
import AccordionTemplate from '../../../../../../templates/components/AccordionTemplate'
import DoctorService from '../../../../../../../services/api/doctor.service'
import Utilities from '../../../../../../../services/commonservice/utilities'
import InputMask from 'react-input-mask'
import FormValidatorService from '../../../../../../../services/validator/form-validator.service'
import UserFormConfig from "./user-form-config"
import toast from 'react-hot-toast'

const UserForm = (props) => {
    const { initialFormData, submitHandler } = props
    const [userData, setUserData] = useState(initialFormData)
    const [roleLookUpList, setRoleLookUpList] = useState([])
    const [doctorList, setDoctorList] = useState([])
    const [isLoader, setIsLoader] = useState(false)
    const [errors, setErrors] = useState({})

    const required = ['roleId']
    const userTypes = [
        { value: 0, title: 'Patient' },
        { value: 1, title: 'Practice' }
    ]
    const reqObj = {}
    // console.log(userData)

    const inputChange = (e, key, nestedKey) => {
        setErrors(FormValidatorService.setErrors(e, errors, UserFormConfig.config))
        setUserData((prevState) => {
            let data = {}
            if (nestedKey && key) {
                data = {
                    ...prevState,
                    [key]: {
                        ...prevState?.[key],
                        [nestedKey]: {
                            ...prevState?.[key]?.[nestedKey],
                            [e.target.name]: e.target.value,
                        }
                    }
                }
            } else if (key) {
                data = {
                    ...prevState,
                    [key]: {
                        ...prevState?.[key],
                        [e.target.name]: e.target.value
                    }
                }
            } else {
                data = {
                    ...prevState,
                    [e.target.name]: e.target.value
                }
            }
            console.log(data)
            setErrors(FormValidatorService.setErrors(e, errors, UserFormConfig.config))
            return { ...prevState, ...data }
        })

    }

    const roleLookup = () => {
        RoleService.roleLookup(reqObj)
            .then((response) => {
                console.log(response)
                setRoleLookUpList(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const doctorLookUp = () => {
        // console.log("doctor lookup")
        setIsLoader(true)
        const reqObj = { isRegistered: true, isActive: true };
        DoctorService.doctorLookup(reqObj)
            .then(
                (response) => {
                    // console.log(response)
                    setDoctorList(response)
                    setIsLoader(false)
                })
            .catch((error) => {
                setIsLoader(false)
                console.log(error);
            })
    }

    useEffect(() => {
        roleLookup()
        doctorLookUp()
    }, [])

    return (

        <div className="ui container">
            <AccordionTemplate id="userAddForm" accordionId="userAddForm">
                <div title={label.user.add.primaryDetails}>
                    <div className="">
                        <div className="row d-flex ">
                            <div className="required field col-6">
                                <label>{label.user.add.firstName}</label>
                                <input
                                    placeholder='First Name'
                                    type='text'
                                    name="firstName"
                                    value={userData?.contact?.name?.firstName}
                                    onChange={(e) => inputChange(e, 'contact', 'name')}
                                />
                                <span className='error-message'>{errors.firstName}</span>
                                {/* {userData?.contact?.name?.firstName} */}
                            </div>
                            <div className="required field col-6">
                                <label>{label.user.add.lastName}</label>
                                <input
                                    placeholder='Last Name'
                                    type='text'
                                    name="lastName"
                                    value={userData?.contact?.name?.lastName}
                                    onChange={(e) => inputChange(e, 'contact', 'name')}
                                />
                                <span className='error-message'>{errors.lastName}</span>
                                {/* {userData?.contact?.name?.lastName} */}
                            </div>
                        </div>
                        <div className="row d-flex">
                            <div className="col-6 field required">
                                <label>{label.user.add.phone}</label>
                                <InputMask
                                    placeholder='Phone'
                                    type='text'
                                    name="phone"
                                    unmask={true}
                                    mask="(999) 999-9999"
                                    value={userData?.contact?.phone}
                                    onChange={(e) => inputChange(e, 'contact')}
                                    editable
                                />
                                <span className='error-message'>{errors.phone}</span>
                                {/* {userData?.contact?.phone} */}
                            </div>
                            <div className="col-6">
                                <label>{label.user.add.url}</label>
                                <input
                                    placeholder='URL'
                                    type='text'
                                    name='url'
                                    value={userData?.contact?.url}
                                    onChange={(e) => { e.preventDefault(); inputChange(e, 'contact') }}
                                />
                                <span className='error-message'>{errors.url}</span>
                                {/* {userData?.contact?.url} */}
                            </div>
                        </div>
                        <div className="row d-flex">
                            <div className="col-6 field required">
                                <label>{label.user.add.userAdminUserName}</label>
                                <input
                                    placeholder='UserName'
                                    type='text'
                                    name="userName"
                                    value={userData?.userName}
                                    onChange={(e) => { e.preventDefault(); inputChange(e) }}
                                />
                                <span className='error-message'>{errors.userName}</span>
                            </div>
                            <div className="col-6 field required">
                                <label>{label.user.add.email}</label>
                                <input
                                    placeholder='Email'
                                    type='text'
                                    name="email"
                                    value={userData?.contact?.email}
                                    onChange={(e) => inputChange(e, 'contact')}
                                />
                                <span className='error-message'>{errors.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div title={label.user.add.addressDetails}>
                    <div className="row d-flex">
                        <div className="">
                            <div className=" col-12">
                                <label>Address Line 1</label>
                                <input
                                    placeholder='Address Line 1'
                                    type="text"
                                    name="addressLine1"
                                    value={userData?.contact?.address?.addressLine1}
                                    onChange={(e) => inputChange(e, 'contact', 'address')}
                                />
                                <span className="error-message">{errors.addressLine1}</span>
                            </div>
                            <div className="col-12">
                                <label>{label.user.add.addressLine2}</label>
                                <input
                                    placeholder='Address Line 2'
                                    type='text'
                                    name='addressLine2'
                                    value={userData?.contact?.address?.addressLine2}
                                    onChange={(e) => inputChange(e, 'contact', 'address')}
                                />
                                <span className="error-message">{errors.addressLine2}</span>
                            </div>
                            <div className="row d-flex">
                                <div className="col-6">
                                    <label>{label.user.add.city}</label>
                                    <input
                                        placeholder='City'
                                        type='text'
                                        name='city'
                                        value={userData?.contact?.address?.city}
                                        onChange={(e) => inputChange(e, 'contact', 'address')}
                                    />
                                    {/* <span className='error-message'>{errors.city}</span> */}
                                </div>
                                <div className="col-6">
                                    <label>{label.user.add.country}</label>
                                    <Select
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        options={Countries}
                                        name="country"
                                        value={Countries.find((obj) => obj.countryId === userData?.contact?.address?.country)}
                                        onChange={(e) => {
                                            inputChange({
                                                target: { value: e.countryId, name: "country", }
                                            }, 'contact', 'address');
                                        }}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.countryId}
                                    />
                                </div>
                            </div>
                            <div className="row d-flex">
                                <div className="col-6">
                                    <label>{label.user.add.state}</label>
                                    <Select
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        options={States[1]}
                                        name="state"
                                        value={States[1].find((obj) => obj.abbreviation === userData?.contact?.address?.state)}
                                        onChange={(e) => {
                                            inputChange({
                                                target: { value: e.abbreviation, name: "state", },
                                            }, 'contact', 'address');
                                        }}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.abbreviation}
                                    />
                                    <span className="error-message">{errors.state}</span>
                                </div>
                                <div className="col-6">
                                    <label>{label.user.add.postalCode}</label>
                                    <input
                                        placeholder='Poastal (Zip) Code'
                                        type='text'
                                        name='postalCode'
                                        value={userData?.contact?.address?.postalCode}
                                        onChange={(e) => inputChange(e, 'contact', 'address')}
                                    />
                                    <span className="error-message">{errors.postalCode}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div title={label.user.add.roleDetails}>
                    <div className="row d-flex align-items-start">
                        {/* <div className="col field required">
                            <label>Account Type</label>
                            <select className='form-select' value={userData.userType} name="userType" onChange={e => { e.preventDefault(); inputChange({target:{name:'userType', value:parseInt(e.target.value)}})}}>
                                {userTypes.map(type => {
                                    return (
                                        <option value={type.value}>{type.title}</option>
                                    )
                                })}

                            </select>
                        </div> */}
                       <div className="col field required">
                            <label>{label.user.add.role}</label>
                            <Select
                                className="react-select-container"
                                classNamePrefix="react-select"
                                options={roleLookUpList}
                                name="roleId"
                                value={roleLookUpList.find((obj) => obj.id === userData?.roleId)}
                                onChange={(e) => { inputChange({ target: { value: e.id, name: "roleId" } }) }}
                                getOptionLabel={(option) => option.roleName}
                                getOptionValue={(option) => option.id}
                            />
                            <span className='error-message'>{errors.role}</span>
                        </div>
                        <div className="col field">
                            <label>Attach Provider</label>
                            <Select
                                className="react-select-container"
                                classNamePrefix="react-select"
                                options={doctorList}
                                isClearable
                                name="doctorId"
                                value={doctorList && doctorList.find(obj => obj.id === userData.doctorId)}
                                onChange={e => { e ? inputChange({ target: { value: e.id, name: 'doctorId' } }) : inputChange({ target: { value: '', name: 'doctorId' } }) }}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                            
                        </div>
                        <div className="col-auto field text-center">
                            <label>Admin</label>
                            <input type="checkbox" className="form-check-input mt-3" checked={userData.isAdmin} name="isAdmin" onChange={e => { inputChange({ target: { name: 'isAdmin', value: e.target.checked } }) }} />
                        </div>
                    </div>
                </div>
            </AccordionTemplate>
            <div className='mt-3 d-flex justify-content-between'>
                <div className='col-auto'>
                    <button className='btn btn-secondary float-right' onClick={e => { e.preventDefault(); if (props.onClose()) { props.onClose() } }}>Close</button>
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={(e) => { 
                        e.preventDefault(); 
                        if (!FormValidatorService.checkForm(errors, userData, required)) {
                            toast.error("Please make sure the form is complete")
                          }
                          else {
                        submitHandler(userData) 
                          }
                        }}>
                        {label.user.add.save}
                        </button>
                </div>
            </div>
            {/* <button className="ui tiny button" >{label.user.add.cancel}</button> */}
        </div>

    )
}

export default UserForm