import React, { useState, useEffect } from 'react'
import label from '../../../../../../assets/i18n/en.json'
import AppointmentService from '../../../../../services/api/appointment.service'
import Select from "react-select"

const PracticeLocationRoomForm = (props) => {
    const { initialFormData, submitHandler } = props
    const [locationData, setLocationData] = useState(initialFormData)
    const [list, setList] = useState([])
    const [isLoader, setIsLoader] = useState(false)
    const [location, setLocation] = useState('')

    const inputChange = (e) => {
        let newStateObject = { ...locationData };
        newStateObject[e.target.name] = e.target.value
        setLocationData(newStateObject);
        return console.log(locationData)
    }

    const practiceLocation = () => {
        AppointmentService.practiceLocation()
            .then(
                (response) => {
                    setList(response);
                    setIsLoader(false);
                })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
            })
    }

    const practiceLocationById = (locationId) => {
        AppointmentService.getLocationById(locationId)
            .then(res => {
                setLocation(res?.practiceLocation)
                setLocationData({ practiceLocationId: locationId })
            })
    }

    useEffect(() => {
        if (initialFormData?.practiceLocationId) {
            practiceLocationById(initialFormData?.practiceLocationId)
        }
        practiceLocation()

    }, [initialFormData?.practiceLocationId])

    return (
        <div className="ui container">
            <div className="row d-flex ">
                <div className="field col-12">
                    <label>Practice Location</label>
                    <Select
                        className="react-select-container"
                        classNamePrefix="react-select"
                        value={locationData ? list.find((obj) => obj.practiceLocationId === locationData.practiceLocationId) : list.find((obj) => obj.practiceLocation === location)}
                        options={list}
                        onChange={e => { inputChange({ target: { value: e.practiceLocationId, name: "practiceLocationId" } }) }}
                        isClearable={true}
                        isDisabled={props.initialFormData?.practiceLocationId}
                        getOptionLabel={(option) => option.practiceLocation}
                        getOptionValue={(option) => option.practiceLocationId}
                    />
                </div>
            </div>
            <div className="row d-flex ">
                <div className="field col-12">
                    <label>Practice Location Room</label>
                    <input
                        placeholder='Practice Location Room'
                        type='text'
                        name="room"
                        value={!locationData?.room ? initialFormData?.room : locationData?.room}
                        onChange={(e) => inputChange(e)}
                    />
                </div>
            </div>
            <div className='mt-3 d-flex justify-content-between'>
                <div className='col-auto'>
                    <button className='btn btn-secondary' onClick={e => { e.preventDefault(); if (props.onClose()) { props.onClose() } }}>Close</button>
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); submitHandler(locationData) }}>{label.user.add.save}</button>
                </div>
            </div>
        </div>
    )
}

export default PracticeLocationRoomForm