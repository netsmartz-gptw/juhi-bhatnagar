import React, { useState, useEffect } from 'react'
import PatientService from '../../../../../../../services/api/patient.service'
import List from '../../../../../../templates/components/List'
import label from '../../../../../../../../assets/i18n/en.json'
import moment from 'moment'
import ModalBox from '../../../../../../templates/components/ModalBox'

import NoteEdit from '../../../../note/note-edit/NoteEdit'

import NoteAdd from '../../../../note/note-add/NoteAdd'


const PatientInsuranceInfo = (props) => {
    const [contactDetails, setContactDetails] = useState()
    const [showEdit, setShowEdit] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [editContactDetails, setEditContactDetails] = useState()
    const [showContactDetails, setShowContactDetails] = useState(false)

    useEffect(() => {
        if (props.autoPull) {
            pullInsurance()
        }
        else if (props.pull) {
            pullInsurance()
        }
    }, [props.autoPull, props.pull, props.keyword])

    const pullInsurance = () => {
        PatientService.getPatientById(props.patientId)
            .then(res => {
                console.log(res.data)
                if (Array.isArray(res.data)) {
                    setContactDetails(res.data)
                }
                else {
                    setContactDetails([res.data])
                }
                // setContactDetails(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }


    const changeShowDetails = (id) => {
        if (id === showContactDetails) {
            setShowContactDetails()
        }
        else (
            setShowContactDetails(id)
        )
    }

    return (
        <div>
            <List noResultsMessage={<span>There are currently no Insurance Details for this patient. <a href="#" onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add Insurance Details</a></span>}>
                {contactDetails && contactDetails.map((contactDetail, i) => {
                    console.log(contactDetail + "contact detail from inside list")
                    return (


                        <div className="card mb-3">
                            <div className="card-header row-fluid align-items-center d-flex">
                                <div className='col'>
                                    {contactDetail.firstName} {contactDetail.lastName}
                                    <span> | {contactDetail.title != null ? contactDetail.title : '--'}</span>
                                </div>
                                <div className='col-auto'>
                                    <strong> Created On </strong>{moment(contactDetail.createdOn).format("MM/DD/YYYY")}
                                </div>
                                <div className='col-auto'>
                                    <button className='btn btn-transparent' onClick={e => { e.preventDefault(); setEditContactDetails(contactDetail); return setShowEdit(true) }} title="Edit Contact Details">
                                        <i className='icon pencil' />
                                    </button>
                                </div>
                                <div className='col-auto'>
                                    <button className='btn btn-transparent' onClick={e => { e.preventDefault(); changeShowDetails(i) }} title="Show Details">
                                        <i className={showContactDetails === i ? 'icon eye slash outline' : 'icon eye'} />
                                    </button>
                                </div>
                            </div>
                            {showContactDetails === i && <div className="card-body" style={{ cursor: 'default' }}>
                                <div className="item">
                                    <div className="content">

                                        {
                                            contactDetail.phone
                                        }
                                    </div>
                                </div>
                            </div>}
                        </div>

                    )
                })}
            </List >
            <ModalBox open={showEdit} onClose={() => { setShowEdit(false) }}>
                <NoteEdit initialData={editContactDetails} closeModal={setShowEdit} />
            </ModalBox>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }} >
                <NoteAdd initialData={{ patiendId: props.patientId }} closeModal={setShowAdd} />
            </ModalBox>
        </div>
    )
}

export default PatientInsuranceInfo