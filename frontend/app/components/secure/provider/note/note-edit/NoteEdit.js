import React, {useState} from 'react'
import NoteForm from '../note-form/NoteForm'

const NoteEdit = (props) => {
    return(
        <NoteForm
            isEdit={true}
            submitLabel='Save changes'
            onClose={()=>props.onClose()}
            initialData={props.initialData}
        />
    )
}

export default NoteEdit