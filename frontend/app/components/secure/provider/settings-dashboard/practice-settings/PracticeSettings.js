import React, { useState, useEffect } from 'react'
import TabsTemplate from '../../../../templates/components/TabsTemplate'
import UnavailableBlockSettings from '../unavailable-blocks/UnavailableBlocks'
import PracticeServiceType from '../../provider-settings/practice-settings/practice-service-type/practiceServiceType'
import FormsManagement from './forms-management/FormsManagement'
import BrandSettingsBeta from './brand-settings/BrandSettingsBeta'
import PracticePatientTypeTable from './practice-patient-type/PracticePatientTypeTable'

const PracticeSettings = (props) => {
    return (
        <div>
            <TabsTemplate id="practiceSettings" accordionId="practiceSettings">
                <div title="Branding">
                    {/* <BrandSettings/> */}
                    <BrandSettingsBeta/>
                </div>
                <div title="Forms">
                    <FormsManagement/>
                </div>
                <div title="Unavailable Blocks">
                    <UnavailableBlockSettings />
                </div>
                <div title="Practice Service Type">
                    <PracticeServiceType/>
                </div>
                <div title="Practice Patient Type">
                    <PracticePatientTypeTable/>
                </div>
            </TabsTemplate>
        </div>
    )
}

export default PracticeSettings