import React, { useState } from 'react'
import Dashboard from '../../../templates/layouts/Dashboard'
import PracticeLocationAvailablityList from './PracticeLocationAvailablityList'

const PracticeLocationAvailabilityDashboard = (props) => {
   
    const [refresh, setRefresh] = useState(false)
  
    const refreshList = () => {
        setRefresh(true)
        setRefresh(false)
    }

    return (
        <Dashboard
            // title={label.findUser.dashboard}
            // isEdit={isEdit}
            Modules
            stacked
        >
            {!refresh &&
                <PracticeLocationAvailablityList side='right'/>
            }
        </Dashboard >
    )
}

export default PracticeLocationAvailabilityDashboard