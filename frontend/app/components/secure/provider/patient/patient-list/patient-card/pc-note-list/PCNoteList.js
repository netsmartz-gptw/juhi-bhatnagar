import React, { useState, useEffect } from 'react'
import PatientService from '../../../../../../../services/api/patient.service'
import List from '../../../../../../templates/components/List'
import label from '../../../../../../../../assets/i18n/en.json'
import moment from 'moment'
import ModalBox from '../../../../../../templates/components/ModalBox'
import NoteEdit from '../../../../note/note-edit/NoteEdit'
import NoteAdd from '../../../../note/note-add/NoteAdd'

const PCNoteList = (props) => {
    const [notes, setNotes] = useState()
    const [showEdit, setShowEdit] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [editNote, setEditNote] = useState()
    const [showDetails, setShowDetails] = useState(false)


    useEffect(() => {
        if (props.autoPull) {
            pullNotes()
        }
        else if (props.pull) {
            pullNotes()
        }
    }, [props.autoPull, props.pull, props.keyword])

    const pullNotes = () => {
        let reqObj = {
            StartRow: 0,
            SortField: 'CreatedOn',
            Asc: false,
        }
        if (props.patientId) {
            reqObj = { ...reqObj, PatientIds: props.patientId }
        }
        return PatientService.findNotes(reqObj)
            .then(res => {
                    setNotes(res.data)
            })
    }

    const changeShowDetails = (id) => {
        if (id === showDetails) {
            setShowDetails()
        }
        else (
            setShowDetails(id)
        )
    }
    useEffect(()=>{
        if(props.refresh && props.pull){
            pullNotes()
        }
    },[props.refresh])
    return (
        <div className='row d-flex justify-content-start g-3'>
            {notes ? notes.map((note, i) => {
                return (


                    <div className="col-lg-3 col-md-6 col-12">
                        <div className='p-3 corner-note-faded'>
                            <div className="row-fluid align-items-center d-flex point" onClick={e => { e.preventDefault(); if (showDetails === i) { setShowDetails(null) } else { setShowDetails(i) } }}>
                                <div className='col'>
                                    <strong className='me-4'>
                                    {moment(note.createdOn).format("MM/DD/YYYY")}
                                    </strong>
                                    <span> {note.title != null ? note.title : '--'}</span>
                                </div>
                                {/* <div className='col-auto'>
                                    <strong> {label.note.find.createdOn} </strong>{moment(note.createdOn).format("MM/DD/YYYY")}
                                </div> */}
                                <div className='col-auto'>
                                    <button className='btn btn-transparent' onClick={e => { e.preventDefault(); setEditNote(note); return setShowEdit(true) }} title="Edit Note">
                                        <i className='icon pencil' />
                                    </button>
                                </div>
                                <div className='col-auto'>
                                    <button className='btn btn-transparent' onClick={e => { e.preventDefault(); changeShowDetails(i) }} title="Show Details">
                                        <i className={showDetails === i ? 'icon eye slash outline' : 'icon eye'} />
                                    </button>
                                </div>
                            </div>
                            {showDetails === i && <div style={{ cursor: 'default' }}>
                                <hr/>
                                {
                                    note.description != '' ?
                                        note.description : '--'
                                }
                            </div>}
                        </div>
                    </div>
                )
            }) :
                <span>There are Currently no Notes for this user. <a href="#" onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add a Note</a></span>
            }
            <ModalBox open={showEdit} onClose={() => { setShowEdit(false) }}>
                <NoteEdit initialData={editNote} onClose={() => { pullNotes(); return setShowEdit(false) }} />
            </ModalBox>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }} >
                {props.showAdd && <NoteAdd initialData={{ patientId: props.patientId }} onClose={() => { pullNotes(); return setShowAdd(false) }} />}
            </ModalBox>
        </div>
    )
}

export default PCNoteList