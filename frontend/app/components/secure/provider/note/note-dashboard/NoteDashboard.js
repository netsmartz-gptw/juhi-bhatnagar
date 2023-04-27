import React, {useState} from 'react'
import Dashboard from '../../../../templates/layouts/Dashboard'
import NoteForm from '../note-form/NoteForm'
import NoteList from '../note-list/NoteList'
import NoteSearch from '../note-search/NoteSearch'

const NoteDashboard = (props) => {
    return(
        <Dashboard title="Notes Dashboard" Modules>
            {/* <NoteSearch title="Note Search" side="left"/> */}
            <NoteForm title="Note Form" side="left"/>
            <NoteList title="Note List" side="right"/>
        </Dashboard>
    )
}

export default NoteDashboard