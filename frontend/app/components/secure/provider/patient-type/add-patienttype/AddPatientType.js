import React from "react";
import PatientTypeForm from '../patienttype-form/PatientTypeForm';


const AddPatientType = (props)=>{
    return <PatientTypeForm initialData={props.initialData} closeModal={props.closeModal} onSuccess={props.onSuccess} />
}

export default AddPatientType;