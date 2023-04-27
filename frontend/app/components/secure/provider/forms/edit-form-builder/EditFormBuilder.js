import { FormEdit } from '@formio/react/lib/components'
import React, { useState, useEffect } from 'react'
import { getConfig } from '../form-form-builder/formio-builder-options'

const EditFormBuilder = (props) => {
    const [form, setForm] = useState(props.form)
    const [isLoader, setIsLoader] = useState(false)
    const [inputData, setInputData] = useState(props.form)
    // formula for input change
    const inputChange = (e) => {
     e.preventDefault()
     let newStateObject = { ...inputData };
     newStateObject[e.target.name] = e.target.value;
     setInputData(newStateObject);
 };
    const saveForm = (data) => {
        console.log(data)
    }
    return (
        <div className='d-flex row'>
            <div className='col-12 mb-3'>
                <div className='field required'>
                    <label>Title</label>
                    <input type="text" placeholder="Form Title" value={inputData.formTitle} name="formTitle" onChange={e => { e.preventDefault(); inputChange(e) }} />
                </div>
                <div className='field'>
                    <label>Description</label>
                    <input type="text" placeholder="Description" value={inputData.description} name="description" onChange={e => { e.preventDefault(); inputChange(e) }} />
                </div>
            </div>
            <FormEdit form={{ display: 'form', components: props.form?.fields?.components }} saveText="Save" options={getConfig()} saveForm={saveForm} />
        </div>
    )
}

export default EditFormBuilder