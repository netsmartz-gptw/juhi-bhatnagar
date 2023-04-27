import React, { useState, useEffect } from 'react'
import FormForm from "./FormForm";

const FormView = (props) => {

    return (
        <div>
            <FormForm formTitle={props.formTitle} patient={props.patient} formId={props.formId} readOnly={true} onClose={props.onClose} form={props.form} patientId={props.patientId} /> 
        </div>
    )
}

export default FormView
