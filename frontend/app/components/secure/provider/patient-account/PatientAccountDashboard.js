import React, {useEffect, useState} from 'react'
import Dashboard from '../../../templates/layouts/Dashboard'
import PatientAccountAdd from './patient-account-add/PatientAccountAdd'
import PatientAccountForm from './patient-account-form/PatientAccountForm'

const PatientAccountDashboard = (props) =>{

    return(
        <Dashboard title="Patient Account Dashboard" Modules stacked>
            <PatientAccountAdd title="Patient Form"/>
        </Dashboard>
    )
}

export default PatientAccountDashboard