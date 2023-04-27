import React, { useState } from 'react'
import label from '../../../../../assets/i18n/en.json'
import Dashboard from '../../../templates/layouts/Dashboard'
import AddEquipment from '../equipment/add-equipment/AddEquipment'
import EquipmentSearch from '../equipment/equipment-search/EquipmentSearch'
import EquipmentList from '../equipment/equipment-list/EquipmentList'

const EquipmentDashboard = (props) => {
    const [isEdit, setIsEdit] = useState(false)
    const [editId, setEditId] = useState("")
    const [refresh, setRefresh] = useState(false)
    const [keyword, setKeyword] = useState("")

    const editEquipment = (data) => {
        console.log("Edit equipment", data)
        setEditId(data.equipmentTypeId)
        console.log("edit id", editId)
        setIsEdit(true)
    }

    const refreshList = () => {
        setRefresh(true)
        setRefresh(false)
    }
    return (
        <Dashboard
            title={label.equipment.dashboard}
            Modules
            // isEdit={isEdit} 
            // stacked
        >
            <EquipmentSearch setKeyword={setKeyword} keyword={keyword} title={label.equipment.find.heading} side="left" />
            <AddEquipment refresh={refreshList} title={label.equipment.add.heading} side="left"/>
            {!refresh &&
                <EquipmentList keyword={keyword} title={label.equipment.list.heading} editEquipment={editEquipment} side='right' />
            }
        </Dashboard >
    )
}

export default EquipmentDashboard