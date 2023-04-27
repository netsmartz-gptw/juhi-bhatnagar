import React, { useState, useEffect } from 'react'
import TabsTemplate from '../../../../templates/components/TabsTemplate'
import DoctorList from '../../doctor/doctor-list/DoctorList'
import ProviderTableSettings from './provider-table-settings/ProviderTableSettings'

const ProviderSettings = (props) => {
    return (
        <TabsTemplate>
            <div title='Manage Providers'>
                {/* <DoctorList/> */}
                <ProviderTableSettings/>
            </div>
            <div title='Provider Scheduling' disabled></div>
        </TabsTemplate>
    )
}

export default ProviderSettings