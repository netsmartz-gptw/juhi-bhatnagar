import moment from 'moment'
import React, { useState, useEffect, useContext } from 'react'
import Utilities from '../../../../../../services/commonservice/utilities'
import { store } from '../../../../../../context/StateProvider'
import SettingsService from '../../../../../../services/api/settings.service'
import StorageService from '../../../../../../services/session/storage.service'
import DimLoader from '../../../../../templates/components/DimLoader'
import toast from 'react-hot-toast'

const ProfileSettings = (props) => {

    const stateAndDispatch = useContext(store)
    const state = stateAndDispatch.state
    const dispatch = stateAndDispatch.dispatch

    const [profile, setProfile] = useState()
        const [isLoader, setIsLoader] = useState(false)
    useEffect(() => {
        if(JSON.parse(StorageService.get("session", "userDetails")) &&  JSON.parse(StorageService.get("session", "settingsData"))){
            setProfile({...JSON.parse(StorageService.get("session", "userDetails")),... JSON.parse(StorageService.get("session", "settingsData"))})
        }
        else{
        setIsLoader(true)
        SettingsService.getSettings()
            .then(res => {
                let userData = JSON.parse(StorageService.get('session', 'userDetails'))
                let results = { ...res.data, ...userData }
                console.log(results)
                setProfile(results)
                setIsLoader(false)
            })
            .catch(err=>{setIsLoader(false)})
        }
    }, [])
    return (
        <div className='card' style={{minHeight:'200px'}}>
            {isLoader && <DimLoader/>}
            {profile && <div className='row d-flex'>
                <div className='col-12'>
                    <h5 className="primary-header pt-3">{profile?.contact?.name?.firstName} {profile?.contact?.name?.lastName} | &nbsp;
                        <i className='icon user outline' /> {profile?.userName}
                    </h5>
                    <table className='table table-borderless col-auto m-3'>
                        <colgroup>
                            {/* <col span="1" style={{ width: '30px'}}/> */}
                            <col span="1" style={{ width: '150px' }} />
                            <col span="1" style={{ width: '' }} />
                        </colgroup>
                        <tbody>
                            <tr>
                                {/* <td><i className='ms-2 icon pencil small' title="Edit"/></td> */}
                                <td><strong>Email</strong></td>
                                <td>{profile?.contact?.email}</td>
                            </tr>
                            <tr>
                                {/* <td><i className='ms-2 icon pencil small' title="Edit"/></td> */}
                                <td><strong>Phone</strong></td>
                                <td>{profile.contact?.phone && Utilities.toPhoneNumber(profile.contact?.phone)}</td>
                            </tr>
                            <tr>
                                {/* <td><i className='ms-2 icon pencil small' title="Edit"/></td> */}
                                <td><strong>Address</strong></td>
                                <td>{profile.contact?.address.addressLine1}<br />
                                    {profile.contact?.address.addressLine2 && <span>{profile.contact?.address.addressLine2}<br /> </span>}
                                    {profile.contact?.address.city && <span>{profile.contact?.address.city}, &nbsp;</span>}
                                    {profile.contact?.address.state && <span>{profile.contact?.address.state}, &nbsp;</span>}
                                    {profile.contact?.address.postalCode && profile.contact?.address.postalCode}
                                </td>
                            </tr>
                            <tr>
                                {/* <td></td> */}
                                <td><strong>URL</strong></td>
                                <td>{state.providerSelected && <a href={`https://hellopatients.com/login/${profile.providerName}`}>https://hellopatients.com/login/{profile.providerName}</a>}</td>
                            </tr>
                            <tr>
                                {/* <td></td> */}
                                <td><strong>Creation Date</strong></td>
                                <td>{moment(profile.createdOn).format("MM-DD-YYYY")}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>}
        </div>
    )
}

export default ProfileSettings