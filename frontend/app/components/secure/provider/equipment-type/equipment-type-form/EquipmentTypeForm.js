import React, { useState, useEffect } from 'react'

// Constants
import label from '../../../../../../assets/i18n/en.json'
import Select from 'react-select';
// Services
import EquipmentService from '../../../../../services/api/equipment.service';

const EquipmentTypeForm = (props) => {
    // Pull properties form parent
    const { initialData, messages, submitHandler, exitHandler } = props;

    // Set states for form
    const [isLoader, setIsLoader] = useState(false)
    const [formData, setFormData] = useState(initialData)
    const [formErrors, setFormErrors] = useState(messages.errors)
    const [masterEquipmentTypeList, setMasterEquipmentTypeList] = useState()

    const pullMasterEquipmentType = () => {
        EquipmentService.masterEquipmentTypeLookupForProvider()
            .then(res => {
                console.log(res)
                setMasterEquipmentTypeList(res)
            })
    }
    // formula for input change
    const inputChange = (e) => {
        let newStateObject = { ...formData };
        newStateObject[e.target.name] = e.target.value;
        setFormData(newStateObject);
        console.log("new data", newStateObject);
    };

    useEffect(() => {
        pullMasterEquipmentType()
    }, [])
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
                            <label> {label.equipmentType.add.equipmentTypeName}</label>
                            <input placeholder="Equipment Type" type="text" name="equipmentType" value={formData.equipmentType} onChange={(e) => { e.preventDefault(); inputChange(e) }} />
                        </div>
                        <div className="required field">
                            <label>Master Equipment Type</label>
                            <Select
                                options={masterEquipmentTypeList}
                                classNamePrefix="react-select"
                                className="react-select-container"
                                name="masterEquipmentTypeId"
                                value={masterEquipmentTypeList && masterEquipmentTypeList.find(obj => obj.masterEquipmentTypeId === formData.masterEquipmentTypeId)}
                                onChange={e => {
                                    inputChange({
                                        target:
                                            { value: e.masterEquipmentTypeId, name: 'masterEquipmentTypeId' }
                                    })
                                }}
                                getOptionLabel={(option) => option.equipmentType}
                                getOptionValue={(option) => option.masterEquipmentTypeId}
                            />
                        </div>
                    </div>
                </div >
            </form >
            <div className='mt-3 d-flex justify-content-between'>
                <div className='col-auto'>
                    <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); props.onClose(false) }}> Cancel </button>
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); submitHandler(formData) }}>{props.submitLabel}</button>
                </div>
            </div>
        </div >
    )
}

export default EquipmentTypeForm