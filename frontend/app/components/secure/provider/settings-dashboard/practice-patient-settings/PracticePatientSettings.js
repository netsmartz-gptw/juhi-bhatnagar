import React, { useEffect, useState, useContext } from 'react'
import ModalBox from '../../../../templates/components/ModalBox'
import AddPatientType from '../../patient-type/add-patienttype/AddPatientType'
import EditPatientType from '../../patient-type/edit-patienttype/EditPatientType'
import AccordionTemplate from '../../../../templates/components/AccordionTemplate'
import PatientUploadTable from './patient-upload/PatientUploadTable'
import PatientTable from './patient-table/PatientTable'

const PracticePatientSettings = (props) => {
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editPatientType, setEditPatientType] = useState();
    const [selectedPatientType, setSelectedPatientType] = useState()
    const [deleteModal, setDeleteModal] = useState()


    return (
        <div>
            <div title="PracticePatient" className='py-3'>
                <AccordionTemplate id="patients" accordionId="patients">
                    <div title="Patients">
                        <PatientTable />
                    </div>
                    <div title="Patient Uploads">
                        <PatientUploadTable />
                    </div>
                </AccordionTemplate>
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
                        <button className='btn btn-primary ms-3' onClick={e => { e.preventDefault(); deleteItem();setDeleteModal(false) }}>Yes</button>
                    </div>
                </div>}
            </ModalBox>
        </div>
    )
}

export default PracticePatientSettings