import React, { useState } from 'react'
import Dashboard from '../../../templates/layouts/Dashboard'
import PracticeServiceTypesLocationList from './PracticeLocationServiceTypesList'
import PracticeLocationServiceTypesSearch from './practiceLocationServiceypesSearch'
// import Modal from '../../../templates/components/Modal'



const PracticeLocationServiceTypesDashboard = (props) => {
   
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
            <PracticeLocationServiceTypesSearch setKeyword={setKeyword} keyword={keyword} side="left"/>
            {!refresh &&
                <PracticeServiceTypesLocationList keyword={keyword} side='right'/>
            }
        </Dashboard >
    )
}

export default PracticeLocationServiceTypesDashboard