import moment from 'moment'
import React, { useState, useEffect } from 'react'
import PatientService from '../../../../../../services/api/patient.service'
import Utilities from '../../../../../../services/commonservice/utilities'
import ModalBox from '../../../../../templates/components/ModalBox'
import Table from '../../../../../templates/components/Table'
import AddPatient from '../../../patient/add-patient/AddPatient'
import EditPatient from '../../../patient/edit-patient/EditPatient'
const PatientTable = (props) => {
    const [patients, setPatients] = useState()
    const [isLoader, setIsLoader] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState()
    const [showEdit, setShowEdit] = useState(false)
    const [showAdd, setShowAdd] = useState(false)

    const pullPatients = () => {
        setIsLoader(true)
        let reqObj = { SearchTerm: '', isActive: true, isRegistered: true, SortField: 'firstName', StartRow: 0 }
        PatientService.findPatient(reqObj)
            .then(res => {
                setPatients(res)
                setIsLoader(false)
            }
            )
            .catch(err => {
                console.log(err)
                setIsLoader(false)
            })
    }
    const columns = [
        {
            key: "firstName",
            text: "First Name",
            align: "left",
            sortable: true,
        },
        {
            key: "lastName",
            text: "Last Name",
            align: "left",
            sortable: true,
        },
        {
            key: "mrn",
            text: "MRN",
            align: "left",
            sortable: true,
        },
        {
            key: "dob",
            text: "DOB",
            align: "left",
            sortable: true,
            cell: patient => moment.utc(patient.dob).format("MM/DD/YYYY")
        },
        {
            key: "mobile",
            text: "Phone",
            align: "left",
            sortable: true,
            cell: patient => Utilities.toPhoneNumber(patient.mobile)
        },
        {
            key: "email",
            text: "Email",
            align: "left",
            sortable: true,
        },
        {
            key: "isOptIn",
            text: "Opt In",
            align: "left",
            sortable: true,
            cell: patient => patient.isOptIn === 1 ? 'Y' : 'N'
        },
        {
            key: "addressLine1",
            text: "Address Line 1",
            align: "left",
            sortable: true,
            cell: patient => patient.address.addressLine1
        },
        // {
        //     key: "addressLine2",
        //     text: "Address Line 2",
        //     align: "left",
        //     sortable: true,
        //     cell: patient => patient.address.addressLine2
        // },
        {
            key: "city",
            text: "City",
            align: "left",
            sortable: true,
            cell: patient => patient.address.city
        },
        {
            key: "state",
            text: "State",
            align: "left",
            sortable: true,
            cell: patient => patient.address.state
        },
        {
            key: "country",
            text: "Country",
            align: "left",
            sortable: true,
            cell: patient => patient.address.country == 0 ? 'USA' : ''
        },
        {
            key: "postalCode",
            text: "Postal Code",
            align: "left",
            sortable: true,
            cell: patient => patient.address.postalCode
        },
        {
            key: "actions",
            text: "Actions",
            align: "left",
            sortable: false,
            cell: patient => <span className='w-100 d-flex justify-content-center'><div className="btn-group">
                <button className='btn btn-primary' onClick={e => { e.preventDefault(); setSelectedPatient(patient); return setShowEdit(true) }} title="Edit Patient"><i className="icon pencil" /></button>
            </div></span>
        },
    ];

    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: "advance",
        filename: "Patient Report",
        button: {
            // print: true,
            csv: true,
            extra: true,
        },
        language: {
            loading_text: "Please be patient while data loads...",
        },
    };
    useEffect(() => {
        pullPatients()
    }, [])
    return (
        <div>
            <Table config={config} loading={isLoader} records={patients} columns={columns}
                extraButtons={[
                    {
                        className: 'btn btn-primary',
                        children: <i className="icon plus" />,
                        title: 'Add Patient',
                        onClick: e => { e.preventDefault(); setShowAdd(true) }
                    }
                ]} />
                <ModalBox open={showAdd} onClose={()=>setShowAdd(false)}>
                <AddPatient onClose={()=>{pullPatients(); return setShowAdd(false)}}/>
                </ModalBox>
                <ModalBox open={showEdit} onClose={()=>{setShowEdit(false)}}>
                    <EditPatient id={selectedPatient?.id} onClose={()=>{pullPatients(); return setShowEdit(false)}}/>
                </ModalBox>
        </div>
    )
}

export default PatientTable