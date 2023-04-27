import React, { useState, useCallback } from 'react'
import PatientTypeService from "../../../../../services/api/patient-type.service";

const PatientTypeForm = (props) => {
    const [inputData, setInputData] = useState(props.initialData || { isDefault: false });
    const [selectedColor, setSelectedColor] = useState(props.initialData?.appointmentBorderColor || "");

    const inputChange = (e) => {
        let newStateObject = { ...inputData };
        newStateObject[e.target.name] = e.target.value
        setInputData(newStateObject);
    };

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (props.isEdit) {
            PatientTypeService.editPatientType({
                patientType: inputData.patientType,
                appointmentBorderColor: selectedColor,
                isDefault: inputData.isDefault,
                practicePatientTypeId: props.initialData.practicePatientTypeId
            }).then(() => {
                setInputData({
                    patientType: '',
                    appointmentBorderColor: '',
                    isDefault: false
                });
                props.onSuccess();
            }).catch(console.error);
        } else {
            PatientTypeService.addPatientType({
                patientType: inputData.patientType,
                appointmentBorderColor: selectedColor,
                isDefault: inputData.isDefault
            }).then(() => {
                setInputData({
                    patientType: '',
                    appointmentBorderColor: '',
                    isDefault: false
                });
                props.onSuccess()
            }).catch(console.error);
        }
        props.closeModal(false);
    }, [inputData, selectedColor]);

    return (
        <div className="row d-flex align-items-end">
            <div className="field col">
                <label>Patient Type</label>
                <input type="text"
                    value={inputData.patientType}
                    onChange={e => {
                        e.preventDefault();
                        inputChange(e)
                    }}
                    name="patientType"
                    placeholder="Patient Type" />
            </div>
            <div className="field required col-auto">
                <label>Color</label>
                {/* <CompactPicker
                        color={selectedColor}
                        onChangeComplete={setSelectedColor}
                    /> */}
                <input type="color" className="form-control form-control-color" id="selectedColor" value={selectedColor} onChange={e => { e.preventDefault(); setSelectedColor(e.target.value) }} title="Select Color" />
            </div>
            <div className="field ui form-check checkbox col-2">
                <input type="checkbox"
                    name="isDefault"
                    className="form-check-input"
                    checked={inputData.isDefault}
                    onInputCapture={e => {
                        inputChange({
                            target:
                                { value: !e.target.checked, name: 'isDefault' }
                        })
                    }}
                />
                <label className="form-check-label">
                    Default
                </label>
            </div>

            <div className="mt-3 d-flex justify-content-between">
                <div className='col-auto'>
                    <button className="btn btn-secondary"
                        onClick={e => {
                            e.preventDefault();
                            setInputData({
                                patientType: '',
                                appointmentBorderColor: '',
                                isDefault: false
                            });
                            props.closeModal(false);
                        }}>Cancel
                    </button>
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={handleSubmit}>{props.submitLabel || 'Save'}</button>
                </div>
            </div>
        </div>
    )
}

export default PatientTypeForm;