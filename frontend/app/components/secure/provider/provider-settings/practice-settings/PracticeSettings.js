import React, { useState, useEffect } from 'react'
import Accordion from '../../../../templates/components/Accordion'
import DoctorDashboard from '../../doctor/DoctorDashboard'
import EquipmentSettings from './equipment-settings/EquipmentSettings'
// import ServiceProductSettings from './service-product-settings/ServiceProductSettings'
import ServiceSettings from './service-settings/ServiceSettings'


import LocationSettings from './practice-location-settings/PracticeLocationSettings'
import UserSettings from '../user-settings/UserSettings'
import ProviderSettings from '../../settings-dashboard/provider-settings/ProviderSettings'


const PracticeSettings = (props) =>{
    return(
        <div>
            <Accordion id="practiceSettings" accordionId="practiceSettings">
            <div title="Equipment">
                    <EquipmentSettings/>
                </div>
                <div title="Providers">
                    <ProviderSettings/>
                </div>
                <div title="Services">
                    <ServiceSettings/>
                </div>
                {/* <div title="Service Codes">
                    <ServiceProductSettings />
                </div> */}
                <div title="Products">
                    <ServiceSettings />
                </div>
                <div title="Users">
                    < UserSettings/>
                </div>
                <div title="Branding"></div>
            </Accordion>
        </div>
    )
}

export default PracticeSettings
