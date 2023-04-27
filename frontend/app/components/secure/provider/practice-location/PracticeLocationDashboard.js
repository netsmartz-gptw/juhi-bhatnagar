import React, { useState } from 'react'
import label from '../../../../../assets/i18n/en.json'
import Dashboard from '../../../templates/layouts/Dashboard'
import PracticeLocationList from './location-list/PracticeLocationList'
import PracticeLocationSearch from './location-search/PracticeLocationSearch'
// import Modal from '../../../templates/components/Modal'



const PracticeLocationDashboard = (props) => {
   
    const [refresh, setRefresh] = useState(false)
    const [keyword, setKeyword] = useState("")
  
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
            <PracticeLocationSearch setKeyword={setKeyword} keyword={keyword} side="left"/>
            {!refresh &&
                <PracticeLocationList keyword={keyword} side='right'/>
            }
        </Dashboard >
    )
}

export default PracticeLocationDashboard