import React, { useState } from 'react'
import Dashboard from '../../../templates/layouts/Dashboard'
import PracticeLocationRoomList from './location-room-list/PracticeLocationRoomList'
import PracticeLocationRoomSearch from './location-room-search/PracticeLocationRoomSearch'

// import Modal from '../../../templates/components/Modal'



const PracticeLocationRoomDashboard = (props) => {
   
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
            <PracticeLocationRoomSearch setKeyword={setKeyword} keyword={keyword} side="left"/>
            {!refresh &&
                <PracticeLocationRoomList keyword={keyword} side='right'/>
            }
        </Dashboard >
    )
}

export default PracticeLocationRoomDashboard