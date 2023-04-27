import React, { useState, useEffect } from 'react'
import PatientService from '../../../../../services/api/patient.service'
import List from '../../../../templates/components/List'
import label from '../../../../../../assets/i18n/en.json'
import moment from 'moment'
import ModalBox from '../../../../templates/components/ModalBox'
import NoteEdit from '../note-edit/NoteEdit'
import NoteAdd from '../note-add/NoteAdd'

const NoteList = (props) => {
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
    }, [props.autoPull, props.pull, props.keyword, showAdd, showEdit])

    const pullNotes = () => {
        let reqObj = {
            PageSize: 10,
            StartRow: 0,
            SortField: 'CreatedOn',
            Asc: false,
        }
        if (props.patientId) {
            reqObj = { ...reqObj, PatientId: props.patientId }
        }
        return PatientService.findNotes(reqObj)
            .then(res => {
                console.log(res)
                    let newData = res.data.filter(obj => obj.patientId === props.patientId)
                    if (newData.length !==0){
                        console.log(newData + "new note data")
                        setNotes(newData)
                    }
                    else {
                        setNotes()
                    }
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
    console.log(props.patientId)
    return (
        <div>
            <List resultsMessage={<span>There are Currently no Notes for this user. <a href="#" onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add a Note</a></span>}>
                {notes && notes.map((note, i) => {
                    console.log(note)
                    return (


                        <div className="card mb-3">
                            <div className="card-header row-fluid align-items-center d-flex">
                                <div className='col'>
                                    {moment(note.createdOn).format("MM/DD/YYYY")}
                                    <span> | {note.title != null ? note.title : '--'}</span>
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
                            {showDetails === i && <div className="card-body" style={{ cursor: 'default' }}>
                                <div className="item">
                                    <div className="content">

                                        {
                                            note.description != '' ?
                                                note.description : '--'
                                        }
                                    </div>
                                </div>
                            </div>}
                        </div>

                    )
                })}
            </List >
            <ModalBox open={showEdit} onClose={() => { setShowEdit(false) }}>
                <NoteEdit initialData={editNote} onClose={()=>setShowEdit(false)}/>
            </ModalBox>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }} >
                {props.showAdd && <NoteAdd initialData={{patientId: props.patientId}} closeModal={()=>setShowAdd(false)} />}
            </ModalBox>
        </div>
    )
}

export default NoteList