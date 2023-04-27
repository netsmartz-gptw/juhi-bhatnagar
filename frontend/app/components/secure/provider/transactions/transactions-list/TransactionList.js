import React, { useState, useEffect } from 'react'
import PatientService from '../../../../../services/api/patient.service'
import List from '../../../../templates/components/List'
import label from '../../../../../../assets/i18n/en.json'
import moment from 'moment'
import ModalBox from '../../../../templates/components/ModalBox'
import NoteEdit from "../../note/note-edit/NoteEdit"
import NoteAdd from '../../note/note-add/NoteAdd'

const TransactionList = (props) => {
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
            PageSize: 10,
            StartRow: 0,
            SortField: 'CreatedOn',
            Asc: false,
        }
        if (props.patientId) {
            reqObj = { ...reqObj, patientId: props.patientId }
        }
        return PatientService.findNotes(reqObj)
            .then(res => {
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

    return (
        <div>
            <List resultsMessage={<span>There are currently no Transactions for this user. <a href="#" onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add a Transaction</a></span>}>
                {notes && notes.map((note, i) => {
                    console.log(note)
                    return (


                        <div className="card mb-3">
                            <div className="card-header row-fluid align-items-center d-flex">
                                <div className='col'>
                                    {note.patientDetails.firstName} {note.patientDetails.lastName}
                                    <span> | {note.title != null ? note.title : '--'}</span>
                                </div>
                                <div className='col-auto'>
                                    <strong> {label.note.find.createdOn} </strong>{moment(note.createdOn).format("MM/DD/YYYY")}
                                </div>
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
                <NoteEdit initialData={editNote} closeModal={setShowEdit} />
            </ModalBox>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }} >
                <NoteAdd initialData={{ patiendId: props.patientId }} closeModal={setShowAdd} />
            </ModalBox>
        </div>
    )
}

export default TransactionList