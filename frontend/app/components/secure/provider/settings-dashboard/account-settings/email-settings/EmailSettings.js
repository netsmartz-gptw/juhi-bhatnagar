import React, { useState, useEffect } from 'react'
import CommonService from '../../../../../../services/api/common.service'
import EmailSettingsService from '../../../../../../services/api/email-settings.service'
import ProviderService from '../../../../../../services/api/provider.service'
import SettingsService from '../../../../../../services/api/settings.service'
import Utilities from '../../../../../../services/commonservice/utilities'
import StorageService from '../../../../../../services/session/storage.service'
import Module from '../../../../../templates/components/Module'

const EmailSettings = (props) => {
    const [newEmail, setNewEmail] = useState()
    const [email, setEmail] = useState()

    const updateEmail = () => {
        EmailSettingsService.putEmailSettings({ fromEmail: newEmail })
            .then(res => {
                let userData = JSON.parse(StorageService.get('session', 'userDetails'))
                userData.contact.email === newEmail
                StorageService.save('session', "userDetails", JSON.stringify(userData));
                console.log(res)
                setNewEmail("")
                return getEmail()
            })
    }
    const getEmail = () => {
        ProviderService.getProviderDetails(CommonService.getLoggedInData().parentId)
        .then(res=>{
            setEmail(res.fromEmail)
        })
        // SettingsService.getSettings()
        //     .then(res => {
        //         console.log(res)
        //         if (res === undefined || res === null || !res || !res.data) {

        //         }
        //         else {
        //             setEmail(res.data.fromEmail)
        //         }
        //     })
    }
    useEffect(() => {
        getEmail()
    }, [])
    return (

        <div className='col'>
            <Module title="Change Email">
                <div className='col-12 field'>
                    <label>Current Email</label>
                    <input type="email" name="currentemail" disabled value={email} />
                </div>
                <div className='col-12 field required'>
                    <label>New email</label>
                    <input type="email" name="newemail" value={newEmail} onChange={e => { e.preventDefault(); setNewEmail(e.target.value) }} />
                </div>
                <div className='col-12 d-flex justify-content-end mt-3 '>
                    <div className='col-auto'>
                        <button className='btn btn-primary' onClick={e => { e.preventDefault(); updateEmail() }}>Change Email</button>
                    </div>
                </div>
            </Module>
        </div>
    )
}

export default EmailSettings