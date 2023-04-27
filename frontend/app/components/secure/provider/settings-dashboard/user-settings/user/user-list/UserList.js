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

const UserList = (props) => {
    const { keyword, list, setList, userName, name, email, status, inputChange } = props
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [sortBy, setSortBy] = useState('')
    const [visible, setVisible] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [statusModal, setStatusModal] = useState(false)
    const [resetModal, setResetModal] = useState(false)
    const [userStatus, setUserStatus] = useState('')
    const [userList, setUserList] = useState(props.list)
    const [id, setId] = useState('')
    const [providerId, setProviderId] = useState('')
    const [usersType, setUserType] = useState()
    const [isAdmin, setIsAdmin] = useState()
    const [userTypeList, setUserTypeList] = useState([])


    const sortingItems = {
        date: [
            { 'label': 'Date: Sesc', 'columnName': 'createdOn', value: 'Desc' },
            { 'label': 'Date: Asc', 'columnName': 'createdOn', value: 'Asc' },
        ],
        order:
            [{ 'label': 'Name: A-Z', 'columnName': 'userName', value: 'Desc' },
            { 'label': 'Name: Z-A', 'columnName': 'userName', value: 'Asc' },]
    }

    // const [noResultsMessage, setNoResultsMessage] = useState("Please select Equipment Type to begin search")
    const countryList = Countries

    const onSort = (e) => {
        setSortBy(e.target.value)
    }

    let reqObj = {}
    const loggedInUserData = {}

    const modalHandler = (value) => {
        setOpenModal(true)
    }

    const openStatusModal = (value) => {
        setStatusModal(true)
        if (value === 'Deactivate') {
            setUserStatus('Deactivate')
        } else {
            setUserStatus('Activate')
        }
    }

    const openResetModal = (user) => {
        setResetModal(true)
        setId(user.id)
        setProviderId(user.parentId)
        setUserType(user.userType)
        setIsAdmin(user.isAdmin)
    }

    const resetHandler = () => {
        reqObj = { 'isReset': true, 'userType': usersType };
        ResetPasswordService.resetPassword(reqObj, id, usersType, providerId, isAdmin).then(
            toast.success(MessageSetting.LoginServiceuser.resetPassword),
            console.log('reset'),
            setResetModal(false)
        ).catch(err => console.log(err))
    }

    const statusHandler = () => {
        console.log(id, providerId)
        if (userStatus === 'Activate') {
            UserService.activateUser(id, providerId).then(response => {
                toast.success(MessageSetting.LoginServiceuser.activate)
                console.log('activate')
                setStatusModal(false)
                findUser()
            })
        } else if (userStatus === 'Deactivate') {
            UserService.deactivateUser(id, providerId).then(response => {
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
        setVisible((prevState) => (!prevState))
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

    useEffect(() => {

        let arr;
        if (props.setList) {
            if (sortBy === 'Asc') {
                // arr = equipmentTypeList.sort((a, b) => a.equipmentType.localeCompare(b.equipmentType))
                props.setList(userList.sort((a, b) => a.contact.name.firstName.localeCompare(b.contact.name.firstName)))
            }
            else if (sortBy === 'Desc') {
                // arr = equipmentTypeList.sort((a, b) => b.equipmentType.localeCompare(a.equipmentType))
                props.setList(userList.sort((a, b) => b.contact.name.firstName.localeCompare(a.contact.name.firstName)))
            }
            else {
                // arr = equipmentTypeList
                props.setList(userList)
            }
        }

    }, [sortBy])

    const findUser = () => {
        UserService.findUser(reqObj)
        .then((response) => {
            console.log(response)
            setList(response.data)
            setUserList(response.data);
            setIsLoader(false)
        })
        .catch(error => {
            setIsLoader(false);
            console.log(error)
        })
    }

    useEffect(() => {
        setIsLoader(true);
        findUser()
    }, [])


    return (
        <div>
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader"></div>
                </div>
            </div>}
            {!isLoader && list ? <List
                listItemStyle='mb-2'
                sortFunc={onSort}
                sortList={sortingItems.order}
                // pageSize={3}
                isLoading={isLoader}
            >
                {props.list.length && props.list.filter((item) => {
                    if (props.keyword === "" || props.keyword === null || props.keyword === undefined) {
                        return item
                    } else if (item.userName?.toString().toLowerCase().includes(props.keyword?.toString().toLowerCase())) {
                        return item
                    }
                }).map(userType => {

                    const localDate = moment.utc(userType.createdOn).local();
                    userType.createdOn = CommonService.getFormattedDate(localDate['_d']);
                    return (
                        <div className="card p-3 mb-3" >
                            <div className="row d-flex point" onClick={() => getUserDetail(userType)}>

                                <div className="item col">
                                    <div className="row">
                                        <div className='col-12'>
                                            <h5>
                                                <i className="user outline icon" />{userType.contact.name.firstName} {userType.contact.name.lastName}
                                            </h5>
                                        </div>

                                        <div className="col-12 row mt-3">
                                            <span className="col"><strong> {label.equipmentType.find.creationDate}: </strong>{userType.createdOn}</span>
                                            {/* <span className="separator">|</span> */}
                                            <span className="col"><strong> {label.user.find.phone}: </strong>{userType.contact.phone}</span>
                                            {/* <span className="separator">|</span> */}
                                            <span className="col"><strong> {label.user.find.email}: </strong>{userType.contact.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-auto'>
                                    <div className="input-group">
                                        {
                                            userType.isActive ? <div className="ui mini right floated button status green" >{label.common.active}</div> :
                                                <div className="ui mini right floated button status red">{label.common.inactive}</div>
                                        }
                                        <div className="ui right pointing dropdown"  >
                                            <Dropdown button direction="left" icon="ellipsis horizontal">
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => { modalHandler(userType.id); setId(userType.id); setProviderId(userType.parentId) }}>Edit</Dropdown.Item>
                                                    {userType.isActive ?
                                                        <>
                                                            <Dropdown.Item onClick={() => { openStatusModal('Deactivate'); setId(userType.id); setProviderId(userType.parentId)}}>Deactivate</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => { openResetModal(userType) }}>Reset Password</Dropdown.Item>
                                                        </>
                                                        : <Dropdown.Item onClick={() => { openStatusModal('Activate'); setId(userType.id); setProviderId(userType.parentId)}}>Activate</Dropdown.Item>}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {userType.showDetails &&
                                <Transition.Group as={List} visible={visible} animation='scale' duration={500}>
                                    <div className="col-12 mt-3" style={{ cursor: 'default' }}>
                                        <i className="map marker icon"></i>
                                        <strong>{label.user.find.address}:
                                        </strong>{userType.fullAddress != '' ? ` ${userType.fullAddress}` : '--'}
                                    </div>
                                </Transition.Group>
                            }
                        </div>
                    )
                }
                )}

            </List> : null}
            <ModalBox open={openModal} onClose={() => setOpenModal(false)}>
                <UserEdit userId={id} providerId={providerId} onClose={()=>{setOpenModal(false); return findUser()}} />
            </ModalBox>

            <ModalBox open={statusModal} onClose={() => setStatusModal(false)}>
                <Modal.Description>
                    {userStatus === 'Deactivate' ? <p>{MessageSetting.LoginServiceuser.deactivateConfirmation}</p> : <p>{MessageSetting.LoginServiceuser.activateConfirmation} </p>}
                </Modal.Description>
                <Modal.Actions>
                    <Button className='btn btn-primary' onClick={statusHandler} >OK</Button>
                    <Button onClick={() => setStatusModal(false)}>{label.common.cancel}</Button>
                </Modal.Actions>
            </ModalBox>

            <ModalBox open={resetModal} onClose={() => setResetModal(false)}>
                <Modal.Description>
                    <p>{MessageSetting.LoginServicecommon.resetPasswordConfirmation}</p>
                </Modal.Description>
                <Modal.Actions>
                    <Button className='btn btn-primary' onClick={resetHandler}>OK</Button>
                    <Button onClick={() => setResetModal(false)}>{label.common.cancel}</Button>
                </Modal.Actions>
            </ModalBox>

        </div>
    )
}


export default UserList
