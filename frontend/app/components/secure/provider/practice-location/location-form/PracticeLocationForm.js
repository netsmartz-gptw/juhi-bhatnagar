import React, { useState, useEffect } from 'react'
import label from '../../../../../../assets/i18n/en.json'


const PracticeLocationForm = (props) => {
    const { initialFormData, submitHandler } = props
    const [locationData, setLocationData] = useState(props.initialFormData)

    // console.log(props.initialFormData)
    const inputChange = (e) => {
        let newStateObject = { ...locationData };
        newStateObject[e.target.name] = e.target.value
        setLocationData(newStateObject);
        // return console.log(locationData)
    }


    return (
        <div className="ui container">
            <div className="row d-flex ">
                <div className="field col-12">
                    <label>Location</label>
                    <input
                        placeholder='Practice Location'
                        type='text'
                        name="practiceLocation"
                        value={locationData && locationData.practiceLocation}
                        onChange={(e) => inputChange(e)}
                    />
                </div>
            </div>

            <div className='mt-3 d-flex justify-content-between'>
                <div className='col-auto'>
                    <button className="btn btn-secondary float-right" onClick={(e) => { e.preventDefault(); if (props.onClose) { props.onClose() } }}>Cancel</button>
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); submitHandler(locationData) }}>{label.user.add.save}</button>
                </div>
            </div>
        </div>
    )
}

export default PracticeLocationForm