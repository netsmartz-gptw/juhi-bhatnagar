import React, { useEffect, useState, useContext } from 'react'
import PracticePatientService from '../../../../../../services/api/patient-type.service'
import Table from '../../../../../templates/components/Table'
import { store } from '../../../../../../context/StateProvider'
import ModalBox from '../../../../../templates/components/ModalBox'
import AddPatientType from '../../../patient-type/add-patienttype/AddPatientType'
import EditPatientType from '../../../patient-type/edit-patienttype/EditPatientType'
import toast from 'react-hot-toast'

const PracticePatientTypeTable = (props) => {
    const globalStateAndDispatch = useContext(store)
    const contextState = globalStateAndDispatch.state
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editPatientType, setEditPatientType] = useState();
    const [isLoader_Practicepatient, setIsLoader_Practicepatient] = useState(false)
    const [practicePatientList, setpracticePatientList] = useState()
    const [selectedPatientType, setSelectedPatientType] = useState()
    const [deleteModal, setDeleteModal] = useState()

    const practicePatientLookup = () => {
        setIsLoader_Practicepatient(true);
        PracticePatientService.practicePatientLookup(contextState.practiceLocationId)
            .then((response) => {
                console.log(response)
                setpracticePatientList(response.data.selectResponse);
                setIsLoader_Practicepatient(false);
            })
            .catch(error => {
                setIsLoader_Practicepatient(false);
                console.log(error)
                // setCheckException(error);
            })
    }




    const deleteItem = () => {
        return PracticePatientService.deletePatientType(selectedPatientType.practicePatientTypeId)
            .then(res => {
                toast.success("Practice Patient Type Deleted")
                practicePatientLookup()
            })
            .catch(err => {
                toast.error("Error deleting Patient Type")
            })
    }


    useEffect(() => {
        practicePatientLookup()
    }, [])

    const practicePatientColumns = [
        {
            key: "patientType",
            text: "Patient Type",
            // className: "name",
            align: "left",
            sortable: true
        },
        {
            key: "appointmentBorderColor",
            text: "Appointment Border Color",
            // className: "name",
            align: "center",
            sortable: true,
            cell: (practicePatient, i) => {
                return (
                    <div className="d-flex justify-content-center appointment-style">
                        <span className="me-3" style={{ height: '15px', width: '15px', display: 'block', backgroundColor: practicePatient.appointmentBorderColor }} title={practicePatient.appointmentBorderColor}></span> <p>{practicePatient.appointmentBorderColor}</p>
                    </div>
                )
            }
        },
        {
            key: "actionPracticePatient",
            text: "Action",
            // className: "name",
            align: "center",
            sortable: false,
            cell: (practicePatient, i) => {
                return (
                    <div className='d-flex justify-content-center'>
                        <button className="p-0 ps-1 btn btn-primary" title="edit" onClick={e => { e.preventDefault(); setEditPatientType(practicePatient); return setShowEdit(true) }}><i className="icon pencil" /></button>
                        <button className="p-0 ps-1 btn btn-primary ms-1" title="delete" onClick={e => { e.preventDefault(); console.log(practicePatient); setSelectedPatientType(practicePatient); return setDeleteModal(true) }}><i className="icon trash" /></button>
                    </div>
                )
            }
        }
    ]

    const practicePatientConfig = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: "PracticePatientType",
        button: {
            excel: true,
            print: true,
            csv: true,
            extra: true
        },
        language: {
            loading_text: "Please be patient while data loads..."
        }
    }


    return (
        <div>

            <div title='Practice Patient Type'>
                <Table records={practicePatientList} columns={practicePatientColumns} config={practicePatientConfig} loading={isLoader_Practicepatient} extraButtons={[{
                    className: 'btn btn-primary',
                    title: "Add Practice Patient",
                    children:
                        <span><i className='icon plus' /></span>
                    ,
                    onClick: (e) => {
                        e.preventDefault();
                        setShowAdd(true);
                    }
                }]} />

            </div>
            <ModalBox open={showEdit} onClose={() => { setShowEdit(false) }}>
                <EditPatientType initialData={editPatientType} closeModal={setShowEdit} onSuccess={() => {
                    practicePatientLookup();
                }} />
            </ModalBox>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }} >
                <AddPatientType
                    closeModal={setShowAdd}
                    onSuccess={() => {
                        practicePatientLookup();
                    }}
                />
            </ModalBox>
            <ModalBox open={deleteModal} onClose={() => { setDeleteModal(false) }}>
                {selectedPatientType?.practicePatientTypeId && <div className='row d-flex align-items-center justify-content-between'>
                    <div className='col'>
                        Are you sure you want to delete {selectedPatientType.patientType}?
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-secondary' onClick={e => { e.preventDefault(); setSelectedPatientType(); return setDeleteModal(false) }}>No</button>
                        <button className='btn btn-primary ms-3' onClick={e => { e.preventDefault(); deleteItem(); setDeleteModal(false) }}>Yes</button>
                    </div>
                </div>}
            </ModalBox>
        </div>
    )
}

export default PracticePatientTypeTable