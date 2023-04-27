import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Module from '../../../templates/components/Module'
import SideTabs from '../../../templates/layouts/SideTabs'
import UserSettings from './user-settings/UserSettings'
import AccountSettings from './account-settings/AccountSettings'
import LocationSettings from './location-settings/LocationSettings'
import PracticeSettings from './practice-settings/PracticeSettings'
import ProviderSettings from './provider-settings/ProviderSettings'
import PracticePatientSettings from './practice-patient-settings/PracticePatientSettings'


const SettingsDashboard = (props) => {

    const [activeTab, setActiveTab] = useState()

    const navigate = useNavigate()
    useEffect(() => {
        changeTab(props.tab)
    }, [props.tab])

    const changeTab = (tab) => {
        if (tab === 'account') {
            navigate('/provider/settings')
            setActiveTab(tab)
        }
        else {
            navigate(`/provider/settings/${tab}`)
            setActiveTab(tab)
        }
    }
    return (
        // <Dashboard title="Settings" Modules split={[2, 10]}>
        <SideTabs title="Settings" menuTitle="Settings Menu" contentTitle='Settings' activeKey={activeTab} onSelect={k => changeTab(k)}>
            <Module title="My Account" eventKey="account">
                <AccountSettings/>
            </Module>
            <Module title="My Practice" eventKey="practice">
                <PracticeSettings />
            </Module>
            <Module title="My Locations" eventKey="location">
                <LocationSettings/>
            </Module>
            <Module title="My Providers" eventKey="provider">
                <ProviderSettings/>
            </Module>
            <Module title="My Patients" eventKey="patients">
                <PracticePatientSettings/>
            </Module>
            <Module title="My Users" eventKey="users">
                <UserSettings/>
            </Module>
        </SideTabs>
        // </Dashboard>
    )
}

export default SettingsDashboard