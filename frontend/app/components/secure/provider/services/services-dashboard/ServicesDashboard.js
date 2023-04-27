import React, { useState } from 'react'
import label from '../../../../../../assets/i18n/en.json'
import Dashboard from '../../../../templates/layouts/Dashboard'
import ServicesAdd from '../services-add/ServicesAdd'
import ServicesEdit from '../services-edit/ServicesEdit'
import ServicesList from '../services-list/ServicesList'
import ServicesSearch from '../services-search/ServicesSearch'


const ServicesDashboard = (props) => {
    const [isEdit, setIsEdit] = useState(false)
    const [editId, setEditId] = useState("")
    const [refresh, setRefresh] = useState(false)
    const [keyword, setKeyword] = useState("")

    const editServices = (data) => {
        setEditId(data.id)
        setIsEdit(true)
    }

    const cancleEdit = () => {
        setIsEdit(false)
    }

    const refreshList = () => {
        setRefresh(true)
        setRefresh(false)
    }
    return (
        <Dashboard
            title={label.services.dashboard}
            Modules
            isEdit={isEdit}
            // stacked
        >
            <ServicesSearch setKeyword={setKeyword} keyword={keyword} title={label.services.find.heading} side="left" />
            <ServicesAdd refresh={refreshList} title={label.services.add.heading} side="left"/>
            
            {isEdit &&
                <ServicesEdit id={editId} refresh={refreshList} exitEdit={cancleEdit} title={label.services.edit.heading} />
            }
            {!refresh &&
                <ServicesList keyword={keyword} title={label.services.list.heading}  editService={editServices} refresh={refreshList} side='right'  />
            }
        </Dashboard >
    )
}

export default ServicesDashboard