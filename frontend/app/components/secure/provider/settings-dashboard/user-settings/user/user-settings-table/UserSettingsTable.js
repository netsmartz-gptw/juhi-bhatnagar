import React, { useEffect, useState } from 'react'
import Select from "react-select"
import label from '../../../../../../../../assets/i18n/en.json'
import moment from 'moment'
import List from '../../../../../../templates/components/List'
// Common service
import CommonService from '../../../../../../../services/api/common.service'
import UserService from '../../../../../../../services/api/user.service'
import Countries from '../../../../../../../common/constants/countries.constant'
import { Transition, Dropdown, Modal, Button } from 'semantic-ui-react';
import ModalBox from '../../../../../../templates/components/ModalBox'
import UserEdit from '../user-edit/UserEdit'
import MessageSetting from '../../../../../../../common/constants/message-setting.constant'
import ResetPasswordService from '../../../../../../../services/api/reset-password.service'
import toast from 'react-hot-toast'
import Table from '../../../../../../templates/components/Table'
import Utilities from '../../../../../../../services/commonservice/utilities'
import UserAdd from '../user-add/UserAdd'

const UserSettingsTable = (props) => {
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [statusModal, setStatusModal] = useState(false)
    const [resetModal, setResetModal] = useState(false)
    const [userStatus, setUserStatus] = useState('')
    const [userList, setUserList] = useState(props.list)
    const [id, setId] = useState('')
    const [providerId, setProviderId] = useState('')
    const [usersType, setUserType] = useState()
    const [isAdmin, setIsAdmin] = useState(true)
    const [selectedUser, setSelectedUser] = useState()

    const columns = [
        {
            key: "userName",
            text: "Username",
            // className: "name",
            align: "left",
            sortable: true
        },
        {
            key: (user) => user.contact.name.firstName,
            text: "Name",
            // className: "name",
            align: "left",
            sortable: false,
            cell: (practicePatient, i) => `${practicePatient.contact.name.firstName} ${practicePatient.contact.name.lastName}`
        },
        {
            key: "contact",
            text: "Phone",
            // className: "name",
            align: "left",
            sortable: false,
            cell: (practicePatient, i) => practicePatient.contact.mobile ? Utilities.toPhoneNumber(practicePatient.contact.mobile) : null
        },
        {
            key: "email",
            text: "Email",
            // className: "name",
            align: "true",
            sortable: false,
            cell: (practicePatient, i) => practicePatient.contact.email
        },
        {
            key: "userType",
            text: "User Type",
            // className: "name",
            align: "left",
            sortable: true,
            cell: (practicePatient) => practicePatient.userType === 1? 'Practice':'Patient'
        },
        {
            key: "isAdmin",
            text: "Admin",
            // className: "name",
            align: "left",
            sortable: true,
            cell: practicePatient =>  <div className='w-100 text-center'><input className='form-input-check' type='checkbox' value={practicePatient.isAdmin} disabled/></div>
        },
        {
            key: "createdOn",
            text: "Created On",
            // className: "name",
            align: "left",
            sortable: true,
            cell: (practicePatient, i) => moment(practicePatient.createdOn).format("MM-DD-YYYY")
        },
        {
            key: "doctorId",
            text: "Provider",
            // className: "name",
            align: "left",
            sortable: true,
            cell: (practicePatient, i) => practicePatient.doctorId ? 'Yes' : 'No'
        },
        {
            key: "status",
            text: "Status",
            // className: "name",
            align: "center",
            sortable: true,
            cell: (practicePatient, i) => practicePatient.isActive ? <span className='btn btn-success text-white w-100'>Active</span> : <span className='btn btn-danger text-white w-100'>Inactive</span>
        },
        {
            key: "actionPracticePatient",
            text: "Action",
            // className: "name",
            align: "center",
            sortable: false,
            cell: (user, i) => {
                return (

                    <div className='d-flex justify-content-center'>
                        <button className="p-0 ps-1 btn btn-primary" title="Edit User" onClick={e => { e.preventDefault(); setSelectedUser(user); return setOpenModal(true) }}><i className="icon pencil" /></button>
                        <button className="p-0 ps-1 btn btn-primary ms-1" title={user.isActive ? 'Deactivate User' : 'Activate User'} onClick={e => { e.preventDefault(); setSelectedUser(user); return setStatusModal(true) }}>{user.isActive ? <i className="icon dont" /> : <i className="icon check" />}</button>
                        {user.isActive && <button className="p-0 ps-1 btn btn-primary ms-1" title="Reset Password" onClick={e => { e.preventDefault(); setSelectedUser(user); return setResetModal(true) }}><i className="icon lock" /></button>}
                    </div>
                )
            }
        }
    ]

    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: "Users",
        button: {
            excel: true,
            print: true,
            csv: true,
            extra: true
        },
        language: {
            loading_text: "Please be patient while data loads..."
        }
    }

    const resetHandler = () => {
       let reqObj = { 'isReset': true, 'userType': selectedUser.userType };
        ResetPasswordService.resetPassword(reqObj,  selectedUser.userName,  selectedUser.userType, isAdmin).then(
            toast.success(MessageSetting.LoginServiceuser.resetPassword),
            console.log('reset'),
            setResetModal(false)
        ).catch(err => console.log(err))
    }

    const statusHandler = () => {
        if (!selectedUser.isActive) {
            UserService.activateUser(selectedUser.id).then(response => {
                toast.success(MessageSetting.LoginServiceuser.activate)
                console.log('activate')
                setStatusModal(false)
                findUser()
            })
        } else {
            UserService.deactivateUser(selectedUser.id).then(response => {
                toast.success(MessageSetting.LoginServiceuser.deactivate)
                console.log('deactivate')
                setStatusModal(false)
                findUser()
            })
        }

    }


    const mapCountryName = (countryId) => {
        for (let i = 0; i < countryList.length; i++) {
            const element = countryList[i];
            if (countryList[i].countryId === countryId) {
                return countryList[i].name;
            }
        }
    }

    const getUserDetail = (user) => {
        console.log(user)
        // setVisible((prevState) => (!prevState))
        if (user.showDetails) {
            user.showDetails = !user.showDetails;
            return;
        }
        user.isLoader_UserDetails = true; // need to remove
        user.isLoader_UserOperation = true;
        let url = '';
        if (user.contact.url !== '' && user.contact.url !== null) {
            if (!/^http[s]?:\/\//.test(user.contact.url)) {
                url += 'http://';
            }
            url += user.contact.url;
        }
        user.contact.url = url;
        const addressObj = user.contact.address;
        let fullAddress = `${addressObj.addressLine1}${addressObj.addressLine2}${addressObj.city}${addressObj.state}${addressObj.country}${addressObj.postalCode}`;
        if (fullAddress !== '') {
            addressObj.country = (addressObj.country !== '' && addressObj.country != null) ? mapCountryName(addressObj.country) : '';
            fullAddress = '';
            fullAddress = (addressObj.addressLine1 !== '' && addressObj.addressLine1 != null) ? `${addressObj.addressLine1}, ` : '';
            fullAddress = (addressObj.addressLine2 !== '' && addressObj.addressLine2 != null) ? `${fullAddress}${addressObj.addressLine2}, ` : `${fullAddress}`;
            fullAddress = (addressObj.city !== '' && addressObj.city != null) ? `${fullAddress}${addressObj.city}, ` : `${fullAddress}`;
            fullAddress = (addressObj.state !== '' && addressObj.state != null) ? `${fullAddress}${addressObj.state}, ` : `${fullAddress}`;
            fullAddress = (addressObj.country !== '' && addressObj.country != null) ? `${fullAddress}${addressObj.country}, ` : `${fullAddress}`;
            fullAddress = (addressObj.postalCode !== '' && addressObj.postalCode != null) ? `${fullAddress}${addressObj.postalCode}` : `${fullAddress}`;
        }
        user.fullAddress = fullAddress;
        user.userDetails = user;
        user.showDetails = true;

        user.isLoader_UserDetails = false;
        user.isLoader_UserOperation = false;

    }


    const findUser = () => {
        let reqObj = {}
        setIsLoader(true);
        if(props.practiceId){
            reqObj.practiceId=props.practiceId
        }
        UserService.findUser(reqObj)
            .then((response) => {
                console.log(response)
                setUserList(response.data);
                setIsLoader(false)
            })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
            })
    }

    useEffect(() => {

        findUser()
    }, [])


    return (
        <div className='table-responsive'>
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader"></div>
                </div>
            </div>}
            {userList ?
                <Table records={userList} columns={columns} config={config} loading={isLoader} extraButtons={[{
                    className: 'btn btn-primary',
                    title: "Add Practice Patient",
                    children:
                        <span><i className='icon plus' /></span>
                    ,
                    onClick: (e) => {
                        e.preventDefault();
                        setShowAdd(true);
                    }
                }]} />
                : null}
            <ModalBox open={openModal} onClose={() => setOpenModal(false)}>
                <UserEdit userId={selectedUser?.id} onClose={() => { findUser(); return setOpenModal(false); return findUser() }} />
            </ModalBox>

            <ModalBox open={statusModal} onClose={() => setStatusModal(false)}>
                <div className='row d-flex justify-content-between align-items-center'>
                    <div className='col'>
                        {selectedUser?.isActive ? <p>{MessageSetting.LoginServiceuser.deactivateConfirmation}</p> : <p>{MessageSetting.LoginServiceuser.activateConfirmation} </p>}
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-primary' onClick={(e) => { e.preventDefault(); statusHandler() }} >OK</button>
                        <button  className="btn btn-secondary ms-3" onClick={(e) => { e.preventDefault(); setStatusModal(false) }}>{label.common.cancel}</button>
                    </div>
                </div>
            </ModalBox>

            <ModalBox open={resetModal} onClose={() => setResetModal(false)}>
                <div className='row d-flex justify-content-between align-items-center'>
                    <div className='col'>
                        <p>{MessageSetting.LoginServicecommon.resetPasswordConfirmation}</p>
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-primary' onClick={resetHandler}>OK</button>
                        <button className="btn btn-secondary ms-3" onClick={() => setResetModal(false)}>{label.common.cancel}</button>
                    </div>
                </div>
            </ModalBox>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }}>
                <UserAdd onClose={() => { findUser(); return setShowAdd(false) }} />
            </ModalBox>

        </div>
    )
}


export default UserSettingsTable
