import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import label from '../../../../../../assets/i18n/en.json'
import EquipmentService from '../../../../../services/api/equipment.service';
import PracticeServiceTypeService from '../../../../../services/api/practice-service-type.service';

const PracticeServiceTypeForm = (props) => {
    // Pull properties form parent
    const { initialData, messages, isEdit, submitHandler, loaded } = props;

    // Set states for form
    const [isLoader, setIsLoader] = useState(false)
    const [formData, setFormData] = useState(initialData)
    const [formErrors, setFormErrors] = useState(messages.errors)
    const [masterServiceTypes, setMasterServiceTypes] = useState()
    const [serviceCodes, setServiceCodes] = useState()
    const [equipmentTypes, setEquipmentTypes] = useState()
    const [addNewType, setAddNewType] = useState(false)

    useEffect(() => {
        masterServiceTypeLookup();
        serviceCodesLookup();
        equipmentTypeLookup();

    }, [])

    const masterServiceTypeLookup = () => {
        PracticeServiceTypeService.masterServiceTypeLookup()
            .then((response) => {
                // console.log(response)
                setMasterServiceTypes(response.data);
            })
            .catch(error => {
                console.log(error)
                // setCheckException(error);
            })
    }

    const serviceCodesLookup = () => {
        PracticeServiceTypeService.getServiceCodes()
            .then((response) => {
                setServiceCodes(response);
            })
            .catch(error => {
                console.log(error)
                // setCheckException(error);
            })
    }

    const equipmentTypeLookup = () => {
        EquipmentService.equipmentTypeLookup()
            .then((response) => {
                console.log(response)
                setEquipmentTypes(response);
            })
            .catch(error => {
                console.log(error)
                // setCheckException(error);
            })
    }

    // formula for input change
    const inputChange = (e) => {
        let newStateObject = { ...formData };
        newStateObject[e.target.name] = e.target.value
        if (e.target.id) {
            newStateObject['serviceId'] = e.target.id
        }
        setFormData(newStateObject);
        // return console.log(formData)

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
                            <label> {label.practiceServiceType.add.serviceType}</label>
                            <input placeholder="Practice Service Type" type="text" name="practiceServiceType" value={formData.practiceServiceType} onChange={(e) => { e.preventDefault(); inputChange(e) }} />
                        </div>

                        <div className="required field">
                            <label> {label.practiceServiceType.add.description}</label>
                            <input placeholder="description" type="text" name="description" value={formData.description} onChange={(e) => { e.preventDefault(); inputChange(e) }} />
                        </div>
                        <div className="required field">
                            <label>{label.practiceServiceType.add.masterServiceType}</label>
                            <Select
                                options={masterServiceTypes}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                name="masterServiceTypeId"
                                value={masterServiceTypes && masterServiceTypes.find(obj => obj.masterServiceTypeId === formData.masterServiceTypeId)}
                                onChange={e => {
                                    inputChange({
                                        target:
                                            { value: e.masterServiceTypeId, name: 'masterServiceTypeId' }
                                    })
                                }}
                                getOptionLabel={(option) => option.serviceType}
                                getOptionValue={(option) => option.masterServiceTypeId}
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-6 required field">
                                <label> {label.practiceServiceType.add.defaultDuration}</label>
                                <input placeholder="Default Duration" type="text" name="defaultDuration" value={formData.defaultDuration} onChange={(e) => { e.preventDefault(); inputChange(e) }} />
                            </div>
                            <div className="col-md-4 required field">
                                <label> {label.practiceServiceType.add.unitPrice}</label>
                                <input placeholder="0.00" type="text" name="unitPrice" value={formData.unitPrice} onChange={(e) => { e.preventDefault(); inputChange(e) }} />
                            </div>
                            <div className='col-md-auto d-flex justify-content-end'>
                                <div className="required field col">
                                    <label>Color</label>
                                    <input type="color"
                                        className="form-control form-control-color"
                                        value={formData.appointmentFillColor}
                                        name="appointmentFillColor"
                                        onChange={e => {
                                            inputChange(e)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="required field">
                            <label>{label.practiceServiceType.add.serviceCode}</label>
                            <Select
                                options={serviceCodes}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                name="serviceCode"
                                value={serviceCodes && serviceCodes.find(obj => obj.code === formData.serviceCode)}
                                onChange={e => {
                                    inputChange({
                                        target:
                                            { value: e.code, name: 'serviceCode', id: e.id }
                                    })
                                }}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.code}
                            />
                        </div>
                        <div className="required field">
                            <label>{label.practiceServiceType.add.equipmentType}</label>
                            <Select
                                options={equipmentTypes}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                name="equipmentTypeId"
                                value={equipmentTypes && equipmentTypes.find(obj => obj.equipmentTypeId === formData.equipmentTypeId)}
                                onChange={e => {
                                    inputChange({
                                        target:
                                            { value: e.equipmentTypeId, name: 'equipmentTypeId', id: e.equipmentTypeId }
                                    })
                                }}
                                getOptionLabel={(option) => option.equipmentType}
                                getOptionValue={(option) => option.equipmentTypeId}
                            />
                        </div>
                    </div>
                </div >
            </form >
            <br />
            <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); submitHandler(formData) }}>{props.submitLabel}</button>
            <button className="btn btn-secondary ms-2" onClick={(e) => { e.preventDefault(); props.exitHandler() }}> Cancel </button>
        </div >
    )
}

export default PracticeServiceTypeForm