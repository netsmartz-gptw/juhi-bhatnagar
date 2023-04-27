import React, { useState, useEffect } from "react";
import label from "../../../../../../assets/i18n/en.json";
import moment from "moment";
import Select from "react-select";
import ProviderService from "../../../../../services/api/provider.service";
import AppointmentService from "../../../../../services/api/appointment.service";
import DoctorService from "../../../../../services/api/doctor.service";
import toast from "react-hot-toast";

const defaultState = {
    wholePractice: false,
    startWholeDay: false,
    endWholeDay: false,
    startDate: moment().format("YYYY-MM-DD"),
    startTime: '00:00',
    endDate: moment().format("YYYY-MM-DD"),
    endTime: '00:00'
}

const UnavailableBlockForm = (props) => {
    const [practiceLocations, setPracticeLocations] = useState();
    const [inputData, setInputData] = useState({...props?.initialData, wholePractice: 0 });
    const [validInput, setValidInput] = useState(false);
    const [doctor, setDoctor] = useState();
    const [doctors, setDoctors] = useState();

    useEffect(() => {

        let newStateObject = { ...inputData };

        if (!props?.initialData?.unavailableBlockId) 
        {
            newStateObject = defaultState
        }



        if (inputData.startWholeDay)
        {
            newStateObject["startTime"] = ''
        }
        else
        {
            newStateObject["startTime"] = (inputData.startTime ? moment.utc(inputData.startDate.replace('00:00:00',inputData.startTime)).local().format('HH:mm') : 0)

        }
        if (inputData.endWholeDay)
        {
            newStateObject["endTime"] = ''
        }
        else
        {
            newStateObject["endTime"] = (inputData.endTime ? moment.utc(inputData.endDate.replace('00:00:00',inputData.endTime)).local().format('HH:mm') : 0)

        }
        setInputData(newStateObject);

        AppointmentService.practiceLocationLookup()
            .then((res = []) => {
                const data = res.map(item => ({ label: item.practiceLocation, value: item.practiceLocationId }));
                setPracticeLocations(data);
            })
            .catch(err => {
                console.log(err)
            });

        if(props.isAccount){
            DoctorService.getById(props.doctorId)
                .then((res) => {
                    setDoctor(res);
                }).catch(console.log);
        } else {
            const reqObj = { isRegistered: true, isActive: true };
            DoctorService.doctorLookup(reqObj)
                .then((res) => {
                    const data = res.map(item => ({ label: item.name, value: item.id }));
                    setDoctors(data);
                }).catch(console.log);
        }
    }, []);

    const onSubmit = () => {
        const payload = { ...inputData };
        if (payload.wholePractice) {
            delete payload.practiceLocationId;
        }

        if (!payload.doctorId) {
            delete payload.doctorId;
        }

        let startDateTime = ''
        let endDateTime = ''

        if (payload.startWholeDay) {
            startDateTime = moment(payload.startDate)
            delete payload.startTime;
        }
        else
        {
            startDateTime = moment(payload.startDate.replace('00:00:00',payload.startTime+':00').replace('T',' ').replace('Z','').replace('.000',''), "YYYY-MM-DD hh:mm:ss", false)
        }

        if (payload.endWholeDay) {
            endDateTime = moment(payload.endDate)
            delete payload.endTime;
        }
        else
        {
            endDateTime = moment(payload.endDate.replace('00:00:00',payload.endTime+':00').replace('T',' ').replace('Z','').replace('.000',''), "YYYY-MM-DD hh:mm:ss", false)
        }

        if (startDateTime>endDateTime)
        {
            toast.error('Start date/time cannot be greater than End date/time');
            return;
        }

        payload.startDate = startDateTime.format("YYYY-MM-DD")
        payload.endDate = endDateTime.format("YYYY-MM-DD")
        payload.wholePractice = props.isAccount ? 0 : payload.wholePractice ? 1 : 0;
        payload.startWholeDay = payload.startWholeDay ? 1 : 0;
        payload.endWholeDay = payload.endWholeDay ? 1 : 0;

        if (props.initialData.unavailableBlockId) {
            ProviderService.editUnavailableBlock(props.initialData.unavailableBlockId, payload, props.isAccount)
                .then(data => {
                    toast.success('Unavailable block edited successfully');
                    if (props.onClose()) {
                        props.onClose()
                    }
                }).catch(() => {
                    toast.error('Oops! Something went wrong');
                });
        } else {
            ProviderService.addUnavailableBlock(payload, props.isAccount)
                .then(data => {
                    toast.success('Unavailable block added successfully');
                    if (props.onClose()) {
                        props.onClose()
                    }
                }).catch(() => {
                    toast.error('Oops! Something went wrong');
                });
        }
    }



    useEffect(() => {

        if (!inputData.description) {setValidInput(false); return;}
        if (!inputData.wholePractice && !inputData.practiceLocationId) {setValidInput(false); return;}
        if (!inputData.startDate) {setValidInput(false); return;}
        if (!inputData.endDate) {setValidInput(false); return;}

        if (!inputData.startTime && !inputData.startWholeDay) {setValidInput(false); return;}
        if (!inputData.endTime && !inputData.endWholeDay) {setValidInput(false); return;}

        setValidInput(true)

    }, [inputData]);



    const inputChange = (e) => {
        let newStateObject = { ...inputData };
        newStateObject[e.target.name] = e.target.value
        setInputData(newStateObject);
    };

    console.log({props})
    return <div className="row d-flex">
        {props.isAccount && <label>{doctor?.firstName} {doctor?.lastName}</label>}
        <div className="col-12 required field">
            <label> Description</label>
            <input
                placeholder="Description"
                type="text"
                name="description"
                value={inputData.description}
                onChange={inputChange}
                required
            />
        </div>
        <div className="col-10">
            <label> Location</label>
            <Select
                className='react-select-container col'
                isDisabled={inputData.wholePractice}
                classNamePrefix='react-select'
                options={practiceLocations}
                name="practiceLocationId"
                value={practiceLocations && practiceLocations.find(obj => obj.value === inputData.practiceLocationId)}
                onChange={e => {
                    inputChange({
                        target:
                            { value: e.value, name: 'practiceLocationId' }
                    })
                }}
            />
        </div>
        {
            !props.isAccount && <>
                <div className="col-12"><label> Provider</label>
                    <Select
                        className='react-select-container col'
                        classNamePrefix='react-select'
                        options={doctors}
                        name="doctorId"
                        value={doctors && doctors.find(obj => obj.value === inputData.doctorId)}
                        onChange={e => {
                            inputChange({
                                target:
                                    { value: e.value, name: 'doctorId' }
                            })
                        }}
                    />
                </div>
                <div className="col-2 d-flex align-items-end">
                    <div className="form-check d-flex align-items-center">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            name="wholePractice"
                            checked={inputData.wholePractice}
                            onChange={e => {
                                inputChange({
                                    target:
                                        { value: e.target.checked, name: 'wholePractice' }
                                })
                            }}
                        />
                        <label className="form-check-label ms-4">
                            Entire Practice
                        </label>
                    </div>
                </div>
            </>
        }

        <div className="row  d-flex align-items-end">
            <div className="field required col-6">
                <label>Start Date</label>
                <input type="date"
                    className="form-control"
                    value={moment.utc(inputData.startDate).format("YYYY-MM-DD")}
                    min={moment().format("YYYY-MM-DD")}
                    placeholder="MM/DD/YYYY"
                    onChange={e => {
                        e.preventDefault();
                        inputChange({
                            target:
                                { value: e.target.value, name: 'startDate' }
                        })
                    }}
                />
            </div>
            <div className="field required col-4">
                <label>Start Time</label>
                <input type="time"
                    className="form-control"
                    value={inputData.startTime}
                    min="1900-01-01"
                    onChange={e => {
                        e.preventDefault();
                        inputChange({
                            target:
                                { value: e.target.value, name: 'startTime' }
                        })
                    }}
                    disabled={inputData.startWholeDay}
                />
            </div>
            <div className="form-check col-2 d-flex align-items-center">
                <input
                    type="checkbox"
                    className="form-check-input"
                    name="startWholeDay"
                    checked={inputData.startWholeDay}
                    onChange={e => {
                        inputChange({
                            target:
                                { value: e.target.checked, name: 'startWholeDay' }
                        })
                    }}
                />
                <label className="form-check-label ms-4">
                    Entire Day
                </label>
            </div>
        </div>
        <div className="row d-flex align-items-end">
            <div className="field required col-6">
                <label>End Date</label>
                <input type="date"
                    className="form-control"
                    value={moment.utc(inputData.endDate).format("YYYY-MM-DD")}
                    min={moment().format("YYYY-MM-DD")}
                    placeholder="MM/DD/YYYY"
                    onChange={e => {
                        e.preventDefault();
                        inputChange({
                            target:
                                { value: e.target.value, name: 'endDate' }
                        })
                    }}
                />
            </div>
            <div className="field required col-4">
                <label>End Time</label>
                <input type="time"
                    className="form-control"
                    value={inputData.endTime}
                    min="1900-01-01"
                    max={moment().format("YYYY-MM-DD")}
                    placeholder="MM/DD/YYYY"
                    onChange={e => {
                        e.preventDefault();
                        inputChange({
                            target:
                                { value: e.target.value, name: 'endTime' }
                        })
                    }}
                    disabled={inputData.endWholeDay}
                />
            </div>
            <div className="form-check col-2 d-flex align-items-center">
                <input
                    type="checkbox"
                    className="form-check-input"
                    name="endWholeDay"
                    checked={inputData.endWholeDay}
                    onChange={e => {
                        inputChange({
                            target:
                                { value: e.target.checked, name: 'endWholeDay' }
                        });
                    }}
                />
                <label className="form-check-label ms-4">
                    Entire Day
                </label>
            </div>
        </div>

        <div className="mt-3 d-flex justify-content-between">
            <div className="col-auto">
                <button
                    className="btn btn-secondary float-right"
                    onClick={(e) => {
                        e.preventDefault();
                        if (props.onClose) {
                            props.onClose()
                        }
                    }}
                > Cancel
                </button>
            </div>
            <div className="col-auto">
                <button
                    disabled={!validInput}
                    className="btn btn-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}>
                    {props.initialData?.unavailableBlockId ? 'Update' : 'Save'}
                </button>
            </div>
        </div>
    </div>
}

export default UnavailableBlockForm;