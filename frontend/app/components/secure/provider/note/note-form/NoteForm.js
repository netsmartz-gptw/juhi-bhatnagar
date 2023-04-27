import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import CommonService from '../../../../../services/api/common.service'
import PatientService from '../../../../../services/api/patient.service'
import label from "../../../../../../assets/i18n/en";
import moment from 'moment';
import Utilities from '../../../../../services/commonservice/utilities';
import toast from 'react-hot-toast';
import MessageSetting from '../../../../../common/constants/message-setting.constant'

const NoteForm = (props) => {
    const [patientList, setPatientList] = useState();

    const defaultState = {
        patientId: '',
        title: '',
        description: ''
    }

    const [inputData, setInputData] = useState(props.initialData || {});

    // useEffect(() => {
    //     setInputData({
    //         patientId: props.patientId,
    //         title: props.title,
    //         description: props.description
    //     });
    // }, [props]);

    const inputChange = (e) => {
        let newStateObject = { ...inputData };
        newStateObject[e.target.name] = e.target.value
        setInputData(newStateObject);
    };

    useEffect(() => {
        PatientService.getPatientById(props.initialData.patientId)
            .then((data) => {
                // console.log(data)
                setPatientList(data.data);
            }).catch(console.log);
    }, []);

    // console.log(props.initialData)

    return (
        <div className="">
            <div className="fields">
                <div className="field required sixteen wide column">
                    <label>{label.provider.note.patient}</label>
                    {/* {props.initialData?.patientId} */}
                    <Select
                        className="react-select-control"
                        classNamePrefix="react-select"
                        options={patientList}
                        name="patientId"
                        isDisabled
                        value={patientList}
                        onChange={e => {
                            inputChange({
                                target:
                                    { value: e.id, name: 'patientId' }
                            })
                        }}
                        getOptionLabel={option => option.firstName + ' ' + option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY") + ' | ' + (option?.mobile ? Utilities.toPhoneNumber(option.mobile) : option?.patientPhone ? Utilities.toPhoneNumber(option.patientPhone) : '----')}
                        getOptionValue={(option) => option.id}
                    />
                </div>
            </div>
            <div className="field sixteen wide column">
                <label>Description</label>
                <input type="text"
                    value={inputData.title}
                    onChange={e => {
                        e.preventDefault();
                        inputChange(e)
                    }}
                    name="title"
                    placeholder="Description" />
            </div>
            <div className="field sixteen wide column">
                <label>Details</label>
                <textarea placeholder="Details"
                    className="form-control"
                    value={inputData.description}
                    onChange={e => {
                        e.preventDefault();
                        inputChange(e)
                    }}
                    name="description"
                    rows={2}
                />
            </div>
            <div className="mt-3 d-flex justify-content-between">
                <div className="col-auto">
                    {props.onClose && <button className="btn btn-secondary" onClick={e => {
                        e.preventDefault();
                        if (props.onClose()) {
                            props.onClose()
                        }
                    }}>Close
                    </button>}
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={e => {
                        e.preventDefault();
                        if (props.isEdit) {
                            toast.success("Editing")
                            PatientService.editNote(inputData, patientList.id, props.initialData.id).then((data) => {
                                toast.success(MessageSetting.LoginServicenote.edit)
                                if (props.onClose()) {
                                    props.onClose()
                                }
                            }).catch(console.log);
                        } else {
                            PatientService.addNote(inputData, patientList.id).then((data) => {
                                toast.success(MessageSetting.LoginServicenote.add)
                                if (props.onClose()) {
                                    props.onClose()
                                }
                            }).catch(console.log);
                        }
                    }}>{props.submitLabel || 'Add'}</button>
                </div>
            </div>
        </div>
    )
}

export default NoteForm