import React, {useState, useEffect} from 'react'
import {FormBuilder} from '@formio/react';
import { getConfig } from './formio-builder-options';
const FormFormBuilder = (props) =>{
    console.log(props.form)
    const [form, setForm] = useState(props.form.fields.components)
    const [inputData, setInputData] = useState(props.form)
       // formula for input change
       const inputChange = (e) => {
        e.preventDefault()
        let newStateObject = { ...inputData };
        newStateObject[e.target.name] = e.target.value;
        setInputData(newStateObject);
    };
       const formChange = (e) => {
        e.preventDefault()
        let newStateObject = { ...form };
        newStateObject[e.target.name] = e.target.value;
        setForm(newStateObject);
    };

    return(
        <div className='d-flex row'>
            <div className='col-12 mb-3'>
                <div className='field required'>
                    <label>Title</label>
                    <input type="text" placeholder="Form Title" value={inputData.formTitle} name="formTitle" onChange={e=>{e.preventDefault(); inputChange(e)}}/>
                </div>
                <div className='field'>
                    <label>Description</label>
                    <input type="text" placeholder="Description" value={inputData.description} name="description"  onChange={e=>{e.preventDefault(); inputChange(e)}}/>
                </div>
            </div>
            <FormBuilder form={{display:'form',components:form}} options={getConfig()} onChange={(schema)=>{console.log(schema); setForm(schema.components)}}/>
        </div>
    )
}
export default FormFormBuilder