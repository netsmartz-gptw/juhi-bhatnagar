import moment from 'moment'
import React, { useState, useEffect } from 'react'
import FormsService from '../../../../../../services/api/forms.service'
import ModalBox from '../../../../../templates/components/ModalBox'
import Module from '../../../../../templates/components/Module'
import Table from '../../../../../templates/components/Table'
import EditFormBuilder from '../../../forms/edit-form-builder/EditFormBuilder'
import FormView from '../../../patient/patient-list/patient-card/forms/forms-list/FormView'


const FormsManagement = (props) => {
    const [loader, setLoader] = useState(false)
    const [formsList, setFormsList] = useState()
    const [selectedForm, setSelectedForm] = useState()
    const [showForm, setShowForm] = useState(false)
    const [showEdit, setShowEdit] = useState(false)

    const pullForms = () => {
        setLoader(true)
        let reqObj = {}
        FormsService.getFormsList(reqObj)
            .then(res => {
                console.log(res)
                setFormsList(res?.data)
                setLoader(false)
            })
    }

    useEffect(() => {
        pullForms()
    }, [])


    const columns = [
        {
            key: "formTitle",
            text: "Title",
            align: "left",
            sortable: true,
        },
        {
            key: "createdDate",
            text: "Created On",
            align: "left",
            sortable: true,
            cell: (form) => moment(form.createdDate).format("MM/DD/YYYY")
        },
        {
            key: "modifiedDate",
            text: "Modified On",
            align: "left",
            sortable: true,
            cell: (form) => moment(form.modifiedDate).format("MM/DD/YYYY")
        },
        {
            key: "actions",
            text: "Actions",
            align: "center",
            sortable: false,
            cell: (form) => {
                return (<div className='d-flex justify-content-center'>
                    <div className='btn-group'>
                        {/* <button className='btn btn-primary' title="Edit Form" onClick={e => { e.preventDefault(); setSelectedForm(form); return setShowEdit(true) }}><i className='icon pencil' /></button> */}
                        <button className='btn btn-primary' title="View Form" onClick={e => { e.preventDefault(); setSelectedForm(form); return setShowForm(true) }}><i className='icon eye' /></button>
                    </div>
                </div>
                )
            }
        },
    ];
    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: "advance",
        filename: "Forms Management",
        dynamic: true,
        button: {
            print: true,
            csv: true,
            extra: true,
        },
        language: {
            loading_text: "Please be patient while data loads...",
        },
    };
    return (
        <div className='row d-flex'>
            <div className='col-12'>
                <Module title="Form Management">
                    <Table records={formsList} loading={loader} config={config} columns={columns}></Table>
                </Module>
            </div>
            <ModalBox open={showForm} onClose={()=>{setShowForm(false)}} size="fullscreen">
                <FormView formId={selectedForm?.id} onClose={()=>{setShowForm(false)}}/>
            </ModalBox>
            <ModalBox open={showEdit} onClose={()=>{setSelectedForm(); return setShowEdit(false)}} size="fullscreen">
                <EditFormBuilder form={selectedForm} onClose={()=>{setSelectedForm(); return setShowEdit(false)}}/>
            </ModalBox>
        </div>
    )
}
export default FormsManagement