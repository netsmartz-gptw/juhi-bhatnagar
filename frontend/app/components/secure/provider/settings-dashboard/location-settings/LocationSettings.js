import React, { useState, useEffect } from 'react'
import EquipmentSettings from '../practice-settings/equipment-settings/EquipmentSettings'
import TabsTemplate from '../../../../templates/components/TabsTemplate'
import ProductSettings from './product-settings/ProductSettings'
import PracticeLocationServiceTable from './practice-location-services-table/PracticeLocationServicesTable'
import RoomSettingsTable from './room-settings-table/RoomSettingsTable'

import LocationSettingsTable from './location-settings-table/LocationSettingsTable'
import PracticeLocationAvailability from './practice-location-availablity/PracticeLocationAvailablity'
import PracticeLocationProvider from './practice-location-provider/PracticeLocationProvider'

const LocationSettings = (props) => {
    return (
        <div>
            <TabsTemplate id="locationSettings" accordionId="locationSettings">
                <div title="Manage Locations">
                    <LocationSettingsTable/>
                </div>
                <div title="Rooms">
                    <RoomSettingsTable/>
                    {/* <PracticeLocationRoomDashboard/> */}
                </div>
                <div title="Equipment">
                    <EquipmentSettings />
                </div>
                {/* <div title="Services">
                    <ServicesDashboard/>
                </div> */}
                <div title="Products">
                    <ProductSettings />
                </div>
                <div title="Practice Location Services">
                    <PracticeLocationServiceTable/>
                </div>
                <div title="Practice Location Provider">
                    {/*<PracticeLocationServiceTable/>*/}
                    <PracticeLocationProvider/>
                </div>
                 <div title="Availability">
                    <PracticeLocationAvailability/>
                </div>
            </TabsTemplate>
        </div>
    )
}

export default LocationSettings