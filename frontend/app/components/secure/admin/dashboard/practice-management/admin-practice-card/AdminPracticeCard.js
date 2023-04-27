import moment from 'moment';
import React, { useState, useEffect } from 'react'
import { Dropdown, Icon, Accordion } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import ProviderService from '../../../../../../services/api/provider.service';
import Utilities from '../../../../../../services/commonservice/utilities';
import StorageService from '../../../../../../services/session/storage.service';
import UserRolesTable from '../../../../provider/settings-dashboard/user-settings/user-roles/user-roles-table/UserRolesTable';
import UserSettingsTable from '../../../../provider/settings-dashboard/user-settings/user/user-settings-table/UserSettingsTable'

const AdminPracticeCard = (props) => {
    const [activeIndex, setActiveIndex] = useState()
    const [show, setShow] = useState(false)
    const navigate = useNavigate()
    const emulate = () => {
        let reqObj = props.practice
        reqObj.userName = props.practice.providerAdminUser
        ProviderService.emulate(reqObj)
            .then(res => {
                let reqObj = res.data
                reqObj.userName = props.practice.providerAdminUser
                StorageService.save('session', 'guestUser', JSON.stringify(reqObj));
                return navigate('/login')
            })
    }
    return (
        <div className='card'>
            <div className='row d-flex p-3'>
                <div className='col-11 point row d-flex' onClick={e => { e.preventDefault(); setShow(!show) }}>
                    <div className='col-12 mb-3'>
                        <h5><strong>{props.practice.name}</strong> | {props.practice.contact.name.firstName} {props.practice.contact.name.lastName}</h5>
                    </div>

                    <div className='col-12 row d-flex align-items-center'>
                        <div className='col-4 d-flex align-items-center'>
                            <span className='w-150px truncate'><strong>Created On</strong></span> {props.practice.createdOn && moment.utc(props.practice.createdOn).format("M-D-YYYY")}
                        </div>
                        <div className='col-4 d-flex align-items-center'>
                            <span className='w-150px truncate'><strong>Phone</strong></span> {props.practice.contact.phone && Utilities.toPhoneNumber(props.practice.contact.phone)}
                        </div>
                        <div className='col-4 d-flex align-items-center'>
                            <span className='w-150px truncate'><strong>Email</strong></span> {props.practice.contact.email}
                        </div>
                    </div>
                </div>
                <div className='col-1 text-end'>
                    <Dropdown button direction="left" icon="ellipsis horizontal" className="btn-primary icon btn p-o">
                        <Dropdown.Menu>
                            <Dropdown.Item>Edit Practice Details</Dropdown.Item>
                            <Dropdown.Item>Deactivate</Dropdown.Item>
                            <Dropdown.Item>Reset Password</Dropdown.Item>
                            <Dropdown.Item onClick={e => { e.preventDefault(); emulate() }}>Emulate</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

            </div>
            {show && <div className='col-12 row d-flex p-3'>
                <div className="col-12">
                    <Accordion fluid styled>
                        <Accordion.Title
                            active={activeIndex === 0}
                            index={0}
                            onClick={e => { e.preventDefault(); if (activeIndex === 0) { setActiveIndex() } else { setActiveIndex(0) } }}
                        > <Icon name='dropdown' />Practice Information</Accordion.Title>
                        <Accordion.Content active={activeIndex === 0}>
                            <div className="d-flex row">
                                <div className='col-4 d-flex align-items-start'>
                                    <span className='w-150px truncate'><strong>Address</strong></span>
                                    {props.practice.contact.address.addressLine1}
                                    {props.practice.contact.address.addressLine2}
                                    , {props.practice.contact.address.city}
                                    &nbsp;{props.practice.contact.address.state}
                                    &nbsp;{props.practice.contact.address.postalCode}
                                </div>
                                <div className='col-4 d-flex align-items-center'>
                                    <span className='w-150px truncate'><strong>Facility Name</strong></span> {props.practice.facilityName}
                                </div>
                                <div className='col-4 d-flex align-items-center'>
                                    <span className='w-150px truncate'><strong>Facility Branch</strong></span> {props.practice.branchName}
                                </div>
                            </div>
                        </Accordion.Content>
                        <Accordion.Title
                            active={activeIndex === 1}
                            index={1}
                            onClick={e => { e.preventDefault(); if (activeIndex === 1) { setActiveIndex() } else { setActiveIndex(1) } }}
                        > <Icon name='dropdown' />Practice User Types</Accordion.Title>
                        <Accordion.Content active={activeIndex === 1}>
                            <UserRolesTable practiceId={props.practice.id} />
                        </Accordion.Content>
                        <Accordion.Title
                            active={activeIndex === 2}
                            index={2}
                            onClick={e => { e.preventDefault(); if (activeIndex === 2) { setActiveIndex() } else { setActiveIndex(2) } }}
                        > <Icon name='dropdown' />Practice Users</Accordion.Title>
                        <Accordion.Content active={activeIndex === 2}>
                            <UserSettingsTable practiceId={props.practice.id} />
                        </Accordion.Content>
                    </Accordion>
                </div>
            </div>}
        </div>
    )
}

export default AdminPracticeCard