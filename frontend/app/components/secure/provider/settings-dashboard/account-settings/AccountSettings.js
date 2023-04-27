import React, {useEffect, useState} from 'react'
import TabsTemplate from '../../../../templates/components/TabsTemplate'
import EmailSettings from './email-settings/EmailSettings'
import NotificationSettings from './notification-settings/NotificationSettings'
import PasswordSettings from './password-settings/PasswordSettings'
import ProfileSettings from './profile-settings/ProfileSettings'
import StorageService from "../../../../../services/session/storage.service";
import {StorageType} from "../../../../../common/enum/storage.enum";
import UnavailableBlockSettings from "../unavailable-blocks/UnavailableBlocks";

const AccountSettings = (props) => {
    const [doctorId, setDoctorId] = useState();
    useEffect(() => {
        const loggedInData = JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
        setDoctorId(loggedInData.doctorId);
    }, []);
    return (
        <TabsTemplate>
            <div title="Profile">
                <ProfileSettings/>
            </div>
            <div title="Account Security">
                <div className='row d-flex'>
                <EmailSettings/>
                <PasswordSettings/>
                </div>
            </div>
            <div title="Notification Settings">
                <NotificationSettings />
            </div>
            {doctorId ? <div title="Unavailable Blocks">
                <UnavailableBlockSettings doctorId={doctorId} isAccount={true}/>
            </div> : <div></div>}
        </TabsTemplate>
    )
}

export default AccountSettings