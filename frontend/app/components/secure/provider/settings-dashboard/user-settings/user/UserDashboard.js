import React, { useState } from 'react'
import label from '../../../../../../../assets/i18n/en.json'
// import Modal from '../../../templates/components/Modal'
import Dashboard from '../../../../../templates/layouts/Dashboard'
import UserSearch from './user-search/UserSearch'
import UserList from './user-list/UserList'


const UserDashboard = (props) => {
    const [isEdit, setIsEdit] = useState(false)
    const [editId, setEditId] = useState("")
    const [refresh, setRefresh] = useState(false)
    const [keyword, setKeyword] = useState()
    const [list, setList] = useState()

    // const editEquipment = (data) => {
    //     console.log("Edit equipment", data)
    //     setEditId(data.equipmentTypeId)
    //     console.log("edit id", editId)
    //     setIsEdit(true)
    // }

    const refreshList = () => {
        setRefresh(true)
        setRefresh(false)
    }

    return (
        <Dashboard
            // title={label.findUser.dashboard}
            isEdit={isEdit}
            Modules
            stacked
        >
            <UserSearch
                setKeyword={setKeyword}
                keyword={keyword}
                // title={label.findUser.find.heading} 
                side="left"
                list={list}
                setList={setList}

            />
            {!refresh &&
                <UserList keyword={keyword}
                    title={label.findUser.list.heading}
                    side='right'
                    list={list}
                    setList={setList} />
            }
        </Dashboard >
    )
}

export default UserDashboard