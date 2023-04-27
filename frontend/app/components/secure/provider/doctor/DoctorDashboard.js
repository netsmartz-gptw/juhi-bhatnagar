import React, { useState } from 'react'
import label from '../../../../../assets/i18n/en.json'
import Dashboard from '../../../templates/layouts/Dashboard'
import AddDoctor from './add-doctor/AddDoctor'
import EditDoctor from './edit-doctor/EditDoctor'
import DoctorList from './doctor-list/DoctorList'
import FindDoctorSearch from './doctor-search/FindDoctorSearch'
const DoctorDashboard = (props) => {
    const [isEdit, setIsEdit] = useState(false)
    const [editId, setEditId] = useState("")
    const [refresh, setRefresh] = useState(false)
    const [keyword, setKeyword] = useState("")

    const editDoctor = (data) => {
        setEditId(data.id)
        setIsEdit(true)
    }

    const refreshList = () => {
        setRefresh(true)
        setRefresh(false)
    }
    return (
        <Dashboard
            title={label.doctor.dashboard}
            Modules
            isEdit={isEdit}
            // stacked
        >
            <FindDoctorSearch setKeyword={setKeyword} keyword={keyword} title={label.doctor.find.heading} side="left" />
            <AddDoctor refresh={refreshList} title={label.doctor.add.heading} side="left" />
            {isEdit &&
                <EditDoctor id={editId} refresh={refreshList} exitEdit={setIsEdit} title={label.doctor.edit.heading} />
            }
            {!refresh &&
                <DoctorList keyword={keyword} title={label.doctor.heading} editDoctor={editDoctor} side='right' />
            }
        </Dashboard >
    )
}

export default DoctorDashboard