import React, { useState, useEffect } from 'react'
import FormForm from "./FormForm";

const FormEdit = (props) => {

    return (
        <div>
            <FormForm formTitle={props.formTitle} patient={props.patient} formId={props.formId} readOnly={false} onClose={props.onClose} form={props.form} patientId={props.patientId} /> 
        </div>
    )
}

export default FormEdit
