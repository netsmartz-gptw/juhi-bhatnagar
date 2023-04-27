import React, { useState, useEffect } from 'react'

const ProductTagForm = (props) => {

    const [inputData, setInputData] = useState(props.initialData || {})
    // formula for input change
    const inputChange = (e) => {
        let newStateObject = { ...inputData };
        newStateObject[e.target.name] = [e.target.value]
        setInputData(newStateObject);
        return console.log(inputData)
    };
    return (
        <div className='d-flex row'>
            <div className='col-12'>
                <div className='field required'>
                    <label>Tag Name</label>
                    <input type="text" value={inputData.name} name="name"
                        onChange={(e) => { e.preventDefault(); inputChange(e) }} />
                </div>
            </div>
            <div className='mt-3 d-flex justify-content-between'>
                <div className='col-auto'>
                    <button className='btn btn-secondary' onClick={e=>{e.preventDefault(); if(props.onClose){props.onClose()}}}>Close</button>
                    </div>
                <div className='col-auto'>   
                  <button className='btn btn-primary' onClick={e=>{e.preventDefault(); props.submitHandler(inputData)}}>Save</button>
                  </div>
            </div>
        </div>
    )
}
export default ProductTagForm