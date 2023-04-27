import React from "react";
import PatientTypeForm from '../patienttype-form/PatientTypeForm';


const EditPatientType = (props)=>{
    return <PatientTypeForm isEdit={true}
                            submitLabel='Save changes'
                            closeModal={props.closeModal}
                            initialData={props.initialData}
                            onSuccess={props.onSuccess}
    />
}

export default EditPatientType;