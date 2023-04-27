import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import AccessRightsService from '../../../../../../services/api/access-rights.service';
import FeaturesAccessService from '../../../../../../services/api/features-access.service';

const NotificationSettings = (props) => {
    const [formData, setFormData] = useState()
    const [notificationSettings, setNotificationSettings] = useState()
    const [originalSettings, setOriginalSettings] = useState()
    const [isLoader, setIsLoader] = useState(false)

    // function for input change
    const inputChange = (e, i) => {

        let newStateObject = [...formData];
        newStateObject[i][e.target.name] = e.target.value
        console.log(newStateObject);
        return setFormData(newStateObject);
    };
    const getConfig = () => {
        setIsLoader(true)
        let reqObj = { SortField: 'featureName' }
        AccessRightsService.getfeatureConfig(reqObj)
            .then(res => {
                console.log(res);
                setNotificationSettings(res.filter(obj=>obj.hasSms==1||obj.hasEmail==1));
                setFormData(res.filter(obj=>obj.hasSms==1||obj.hasEmail==1))
                setOriginalSettings(res.filter(obj=>obj.hasSms==1||obj.hasEmail==1))
                setIsLoader(false)
            })
            .catch(err=>{
                console.log(err)
                setIsLoader(false)
            })
    }

    useEffect(() => {
        getConfig()
    }, [])

    const updateNotifs = () => {
        let includedData = formData.map(obj => {
            return (
                {
                    featureId: obj.featureId,
                    id: obj.id,
                    isEmailEnabled: obj.isEmailEnabled,
                    isSmsEnabled: obj.isSmsEnabled,
                    moduleId: obj.moduleId
                }
            )
        })
        console.log(includedData)
        FeaturesAccessService.postFeatureAccess({ featureConfig: includedData })
            .then(res => {
                console.log("update results", res)
                setNotificationSettings(res)
            })
    }

    const emailClickHandler = (e) => {
        console.log(e.target.checked)
        let newArray = notificationSettings?.map(notif => {
            return (
                { ...notif, isEmailEnabled: e.target.checked }
            )
        })
        setFormData(newArray)
        setNotificationSettings(newArray)
    }

    const smsClickHandler = (e) => {
        console.log(e.target.checked)
        let newArray = notificationSettings.map(notif => {
            return (
                { ...notif, isSmsEnabled: e.target.checked }
            )
        })
        setFormData(newArray)
        setNotificationSettings(newArray)
    }


    const resetNotifs = () => {
        setFormData(originalSettings)
        setNotificationSettings(originalSettings)
    }
    return (
        <div>
            <div className="d-flex mx-3 align-items-end justify-content-between">
                <h5 className='mb-0'>Notification Settings</h5>
                <div>
                    <button className='btn btn-secondary' onClick={e => { e.preventDefault(); resetNotifs() }}>Reset</button>
                    <button className='btn btn-primary ms-3' onClick={e => { e.preventDefault(); updateNotifs() }}>Update</button>
                </div>
            </div>
            <table className='table table-borderless m-3'>
                <colgroup>
                    <col span="1" />
                    <col span="1" style={{ width: '15%' }} />
                    <col span="1" style={{ width: '15%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th rowSpan={2} className="d-flex justify-content-start">Feature Name</th>
                        <th className='row d-flex justify-content-start field form-check form-switch'>
                            {/* <input className="form-check-input ms-2 me-2" type="checkbox" role="switch" id="flexSwitchCheckDefault" name="patientLink" /> */}

                            <div className="form-check form-switch" title="Select/Deselect All">
                                <input type="checkbox" className="form-check-input" id="customSwitch1" role="switch" onChange={e => { smsClickHandler(e) }} />
                                <label className="form-control-label text-primary" for="customSwitch1">SMS Notification</label>
                            </div>
                        </th>
                        <th className='row d-flex justify-content-start field form-check form-switch'>
                            {/* <input className="form-check-input ms-2 me-2" type="checkbox" role="switch" id="flexSwitchCheckDefault" name="patientLink" /> */}

                            <div className="form-check form-switch" title="Select/Deselect All">
                                <input type="checkbox" className="form-check-input" id="customSwitch1" role="switch" onChange={e => { emailClickHandler(e) }} />
                                <label className="form-control-label text-primary" for="customSwitch1">Email Notification</label>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoader && <tr><td colSpan={3}>Notifications are Loading...</td></tr>}
                    {notificationSettings && notificationSettings.sort((a, b) => a.featureName?.localeCompare(b.featureName)).map((type, i) => {
                        return (
                            <tr>
                                <td>{type.featureName}</td>
                                <td className="row d-flex field form-check form-switch">
                                    <input className="form-check-input ms-4"  onChange={e => { inputChange({target:{value:e.target.checked, name:'isSmsEnabled'}}, i) }} checked={formData&&formData[i]?.isSmsEnabled} name='isSmsEnabled' type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                </td>
                                <td className="row d-flex field form-check form-switch">
                                    <input className="form-check-input ms-4" checked={formData && formData[i]?.isEmailEnabled} onChange={e => { inputChange({target:{value:e.target.checked, name:'isEmailEnabled'}}, i) }} name='isEmailEnabled' type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                </td>
                            </tr>
                        )
                    })}

                </tbody>
            </table>
        </div>
    )
}

export default NotificationSettings