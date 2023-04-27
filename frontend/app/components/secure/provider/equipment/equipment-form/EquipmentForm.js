import axios from 'axios';
import { intersection } from 'lodash';
import React, { useState, useEffect, Fragment, useContext } from 'react'
import context from 'react-bootstrap/esm/AccordionContext';
import Select from 'react-select';
import label from '../../../../../../assets/i18n/en.json'
import { store } from '../../../../../context/StateProvider';
import AppointmentService from '../../../../../services/api/appointment.service';
import EquipmentService from '../../../../../services/api/equipment.service';
import AccordionTemplate from '../../../../templates/components/AccordionTemplate';
import Module from '../../../../templates/components/Module';
import ModuleTitle from '../../../../templates/components/ModuleTitle';
import AddEquipmentType from '../../equipment-type/add-equipment-type/AddEquipmentType';


const EquipmentForm = (props) => {
    // Pull properties form parent
    const { initialData, messages, isEdit, submitHandler, loaded } = props;

    // Set states for form
    // console.log(initialData)
    const [isLoader, setIsLoader] = useState(false)
    const [formData, setFormData] = useState(initialData)
    const [locationList, setLocationList] = useState([])
    const [practiceLocationRooms, setPracticeLocationRooms] = useState([])
    const [equipmentTypes, setEquipmentTypes] = useState()
    const [addNewType, setAddNewType] = useState(false)
    const globalStateAndDispatch = useContext(store)
    const contextState = globalStateAndDispatch.state
    // console.log(contextState)
    const equipmentTypeLookup = () => {
        EquipmentService.equipmentTypeLookup()
            .then((response) => {
                // console.log(response)
                setEquipmentTypes(response);
            })
            .catch(error => {
                // console.log(error)
                // setCheckException(error);
            })
    }

    const practiceLocation = () => {
        AppointmentService.practiceLocation()
            .then(
                (response) => {
                    let array = response.map(item => {
                        return ({ label: item.practiceLocation, value: item.practiceLocationId })
                    })
                    setLocationList(array);
                    setIsLoader(false);
                })
            .catch(error => {
                setIsLoader(false);
            })
    }

    useEffect(() => {
        AppointmentService.practiceLocationRoomLookup(formData.practiceLocationId)
            .then(
                (response) => {
                    setPracticeLocationRooms(response);
                    setIsLoader(false);
                })
            .catch(error => {
                setIsLoader(false);
            })
    }, [formData.practiceLocationId])

    useEffect(() => {
        equipmentTypeLookup()
        practiceLocation()
    }, [])

    // formula for input change
    const inputChange = (e) => {
        let newStateObject = { ...formData };
        newStateObject[e.target.name] = e.target.value
        setFormData(newStateObject);
        // console.log(formData)
        return console.log(formData)
    };

    return (
        <div>
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader">{label.common.processing}</div>
                </div>
            </div>}
            <form className=''>
                <div className="ui content">
                    <div className="">

                        <div className="required field">
                            <label> {label.equipment.add.equipmentName}</label>
                            <input placeholder="Equipment" type="text" name="description" value={formData.description} onChange={(e) => { e.preventDefault(); inputChange(e) }} />
                            {/* <span>{formErrors.EquipmentTypeName}</span> */}
                        </div>
                        <div className="required field">
                            <label>{label.equipment.add.equipmentTypeName}</label>
                            <Select
                                className="react-select-container"
                                classNamePrefix="react-select"
                                options={equipmentTypes}
                                name="equipmentTypeId"
                                value={equipmentTypes && equipmentTypes.find(obj => obj.equipmentTypeId === formData.equipmentTypeId)}
                                onChange={e => {
                                    inputChange({
                                        target:
                                            { value: e.equipmentTypeId, name: 'equipmentTypeId' }
                                    })
                                }}
                                getOptionLabel={(option) => option.equipmentType}
                                getOptionValue={(option) => option.equipmentTypeId}
                            />
                        </div>
                        <div className="required field">
                            <label>Practice Location</label>
                            {props.submitLabel === "Add" ?
                                <input type="text" value={locationList && locationList.find(obj => obj.value === formData.practiceLocationId)?.label} disabled />
                                : <Select
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    value={locationList && locationList.find(obj => obj.value === formData.practiceLocationId)}
                                    options={locationList}
                                    onChange={e => { e ? inputChange({ target: { value: e.value, name: 'practiceLocationId' } }) : inputChange({ target: { value: '', name: 'practiceLocationId' } }) }}
                                    isClearable={true}
                                    getOptionLabel={(option) => { return (option.label) }}
                                />}

                        </div>
                        <div>
                            <label>Practice Location Room</label>
                            <Select
                                className="react-select-container"
                                classNamePrefix="react-select"
                                value={practiceLocationRooms && practiceLocationRooms.find(obj => obj.practiceLocationRoomId === formData.practiceLocationRoomId)}
                                options={practiceLocationRooms}
                                onChange={e => { inputChange({ target: { value: e.practiceLocationRoomId, name: 'practiceLocationRoomId' } }) }}
                                isClearable={true}
                                getOptionLabel={(option) => { return (option.room) }}
                            />
                        </div>
                    </div>
                </div >
            </form >
            <div className="mt-3 d-flex justify-content-between">
                <div className='col-auto'>
                    <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); props.onClose() }}> Cancel </button>
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); submitHandler(formData) }}>{props.submitLabel}</button>
                </div>
            </div >
        </div >
    )
}

export default EquipmentForm