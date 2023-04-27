import React, {useState} from 'react'
import NoteForm from '../note-form/NoteForm'

const NoteAdd = (props) => {
    return(
        <div>
            {/* {props.initialData.patientId} */}
        <NoteForm initialData={props.initialData} patient={props.patient} onClose={()=>props.onClose()} isModal={props.isModal}/>
        </div>
    )
}

export default NoteAdd