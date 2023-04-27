import React, { useEffect, useState, useContext, useCallback } from 'react'
import { store } from '../../../../../context/StateProvider'
import Select, { createFilter } from 'react-select'
import CommonService from '../../../../../services/api/common.service'
import DoctorService from '../../../../../services/api/doctor.service'
import AppointmentService from '../../../../../services/api/appointment.service'
import moment from 'moment';
import Utilities from '../../../../../services/commonservice/utilities'
import ModalBox from '../../../../templates/components/ModalBox'
import AddPatient from '../../patient/add-patient/AddPatient'
import InputMask from 'react-input-mask'
import PracticeLocationSelector from '../../../../templates/components/PracticeLocationSelector'
import AppointmentFormConfig from './appointment-form-config'
import toast from 'react-hot-toast'
import FormValidatorService from '../../../../../services/validator/form-validator.service'
import PatientService from '../../../../../services/api/patient.service'
import { debounce } from 'lodash'
import AsyncSelect from 'react-select/async';

const AppointmentForm = (props) => {
    // context state and dispatch 
    const globalStateAndDispatch = useContext(store)
    const state = globalStateAndDispatch.state
    const dispatch = globalStateAndDispatch.dispatch
    const [serviceType, setServiceType] = useState()

    const [inputData, setInputData] = useState(props.initialData || {})
    const [showAdd, setShowAdd] = useState(false)
    // populate form 
    const [patientList, setPatientList] = useState([])
    const [doctorList, setDoctorList] = useState([])
    const [patientTypeList, setPatientTypeList] = useState([])
    const [locationList, setLocationList] = useState([])
    const [equipmentList, setEquipmentList] = useState([])
    const [roomList, setRoomList] = useState([])
    const [serviceTypeList, setServiceTypeList] = useState([])
    const [statusList, setStatusList] = useState([])
    const [location, setLocation] = useState()

    const [isLoader, setIsLoader] = useState(false)
    const [isLoader_Patients, setIsLoader_Patients] = useState(false)
    const [isLoader_PatientType, setIsLoader_PatientType] = useState(false)
    const [isLoader_ServiceType, setIsLoader_ServiceType] = useState(false)
    const [isLoader_Status, setIsLoader_Status] = useState(false)
    const [isLoader_Provider, setIsLoader_Provider] = useState(false)
    const [isLoader_Equipment, setIsLoader_Equipment] = useState(false)
    const [isLoader_Room, setIsLoader_Room] = useState(false)
    const [errors, setErrors] = useState({})

    const required = [
        "patientId",
        "practicePatientTypeId",
        "doctorId",
        "practiceServiceTypeId",
        "practiceAppointmentStatusCodeId",
        "fromDate",
        "duration",
        "toDate",
        "patientEmail",
        "patientPhone",
    ];


    const getFormErrors = () => {
        const newErrors = {};
        if (
            !inputData['patientId']
        ) {
            newErrors['patientId'] = 'Patient is required'
        }
        if (
            !inputData['practicePatientTypeId']
        ) {
            newErrors['practicePatientTypeId'] = 'Patient Type is required'
        }
        if (
            !inputData['doctorId']
        ) {
            newErrors['doctorId'] = 'Provider is required'
        }
        if (
            !inputData['practiceServiceTypeId']
        ) {
            newErrors['practiceServiceTypeId'] = 'Service Type is required'
        }
        if (
            !inputData['practiceAppointmentStatusCodeId']
        ) {
            newErrors['practiceAppointmentStatusCodeId'] = 'Status is required'
        }
        if (
            !inputData['patientPhone']
        ) {
            newErrors['patientPhone'] = 'Phone is required'
        }
        if (
            !inputData['patientEmail']
        ) {
            newErrors['patientEmail'] = 'Email is required'
        }

        if (
            !inputData['fromDate']
        ) {
            newErrors['fromDate'] = 'Start Date is required'
        }

        if (
            !inputData['toDate']
        ) {
            newErrors['toDate'] = 'End Date is required'
        }
        if (
            !inputData['duration']
        ) {
            newErrors['duration'] = 'Duration is required'
        }
        return newErrors;
    }

    const submitHandlerCatch = (data) => {
        // const newErrors = getFormErrors();
        // if (!!Object.keys(newErrors).length) {
        //     toast.error("Please make sure the form is complete");
        //     setErrors(newErrors);
        // }
        if (!FormValidatorService.checkForm(errors, data, required)) {
            toast.error("Please make sure the form is complete")
        }
        else {
            props.submitHandler(data)
        }
    }

    useEffect(() => {
        setInputData(props.initialData)
    }, [props.initialData])

    const filterConfig = {
        ignoreCase: true,
        ignoreAccents: true,
        trim: true,
        matchFrom: 'any'
    };
    const doctorLookUp = () => {
        setIsLoader_Provider(true)
        if (props.initialData.doctorId) {
            DoctorService.getById(props.initialData.doctorId)
                .then(res => {
                    setDoctorList([res])
                    return inputChange({ target: { value: res.id, name: 'doctorId' } })
                })
        }
        else {
            if (state?.practiceLocationId) {
                const reqObj = { isRegistered: true, isActive: true, PracticeLocationId: state.practiceLocationId };
                DoctorService.findWithServices(reqObj)
                    .then(
                        (response) => {
                            console.log(response)
                            setDoctorList(response)
                            setIsLoader_Provider(false)
                        })
                    .catch((error) => {
                        setIsLoader_Provider(false)
                        console.log(error);
                    })
            }
            else {
                setIsLoader_Provider(false)
            }
        }

    }


    const patientLookup = () => {
        setIsLoader_Patients(true)
        if (props.initialData.patientId) {
            PatientService.getPatientById(props.initialData.patientId)
                .then(res => {
                    setPatientList([res.data])
                    setIsLoader_Patients(false)
                })
        }
        else {
            let reqObj = { SearchTerm: '', isActive: true, isRegistered: true, SortField: 'firstName' }
            CommonService.patientLookup(reqObj)
                .then(res => {
                    if (res) {
                        setPatientList(res.data)
                        setIsLoader_Patients(false)
                    }
                }
                )
                .catch(err => {
                    console.log(err)
                    setIsLoader_Patients(false)
                })
        }
    }

    const practicePatientTypeLookup = () => {
        setIsLoader_PatientType(true)
        AppointmentService.practicePatientTypeLookup()
            .then(
                (response) => {
                    console.log(response)
                    setPatientTypeList(response)
                    setIsLoader_PatientType(false)
                })
            .catch((error) => {
                setIsLoader_PatientType(false)
            }
            );
    }

    const getPracticeServiceTypeForLocation = (locationId) => {
        setIsLoader_ServiceType(true)

        AppointmentService.getPracticeServiceTypeForLocation(locationId)
            // PracticeServiceTypeService.practiceServiceTypeLookup()
            .then(
                (response) => {
                    console.log(response)
                    setServiceTypeList(response)
                    setIsLoader_ServiceType(false)
                })
            .catch((error) => {
                setIsLoader_ServiceType(false)
                //   this.checkException(error);
            }
            );
    }

    const statusLookup = () => {
        setIsLoader_Status(true)
        AppointmentService.statusLookup()
            .then(
                (response) => {
                    // console.log(response)
                    setStatusList(response)
                    setIsLoader_Status(false)
                })
            .catch(
                (error) => {
                    setIsLoader_Status(false)
                    // this.checkException(error);
                }
            );
    }

    const equipmentLookup = (id) => {
        setIsLoader_Equipment(true)
        AppointmentService.equipmentLookup(id)
            .then((response) => {
                // console.log(response)
                setEquipmentList(response)
                setIsLoader_Equipment(false)
            })
            .catch((error) => {
                setEquipmentList([])
                console.log(error)
                setIsLoader_Equipment(false)
            }
            )
    }
    const patientLoad = (inputText, callBack) => {
        if (inputText?.length < 3 && !props.initialData.patientId) return;
        let reqObj = { SearchTerm: inputText, isActive: true, isRegistered: true, SortField: 'firstName', Asc: true }
        if (props.initialData.patientId) {
            reqObj.PatientIds = props.initialData.patientId
        }
        CommonService.patientLookup(reqObj)
            .then(res => {
                if (res) {
                    callBack(res.data)
                }
            }
            )
            .catch(err => console.log(err))
    }
    const rePatientLoad = useCallback(debounce(patientLoad, 500), [])

    const practiceLocationRoomLookup = (id) => {
        setIsLoader_Room(true)
        AppointmentService.practiceLocationRoomLookup(id)
            .then((response) => {
                setRoomList(response)
                setIsLoader_Room(false)
            })
            .catch((error) => {
                setIsLoader_Room(false)
                setRoomList([])
                // this.checkException(error);
            }
            )
    }


    const onPatientSelect = () => {
        let patient = patientList.find(obj => obj.id === inputData.patientId)
        let newStateObject = { ...inputData };
        console.log(patient)
        if (patient) {
            if (patient.mobile) { newStateObject.patientPhone = patient.mobile }
            if (patient.email) { newStateObject.patientEmail = patient.email }
            if (patient.patientTypeId) { newStateObject.practicePatientTypeId = patient.patientTypeId }
            // console.log(newStateObject)
            return setInputData(newStateObject);
        }
    }

    useEffect(() => {
        if (patientList) {
            onPatientSelect()
        }
    }, [patientList, inputData.patientId])

    useEffect(()=>{
        if(inputData?.startDate && inputData?.duration){

        }
    },[inputData?.startDate])
    // formula for input change
    const inputChange = (e) => {
        let newStateObject = { ...inputData };
        newStateObject[e.target.name] = e.target.value
        setInputData(newStateObject)
        // setTimeout(() => {
        //     const newErrors = getFormErrors();
        //     setErrors(newErrors);
        // }, 4000);
        setErrors(FormValidatorService.setErrors(e, errors, AppointmentFormConfig.config))
        return console.log(inputData)
    };

    // const updatePatientTypeId = (id) => {
    //     console.log(id)
    //     let newStateObject = { ...inputData };
    //     newStateObject['patientTypeId'] = id
    //     setInputData(newStateObject);
    //     return console.log(inputData)

    // }


    useEffect(() => {
        if (state?.practiceLocationId) {
            console.log(state?.practiceLocationId)
            getPracticeServiceTypeForLocation(state.practiceLocationId)
            equipmentLookup(state.practiceLocationId)
            practiceLocationRoomLookup(state.practiceLocationId)
            patientLookup()
            doctorLookUp()
            practicePatientTypeLookup()
            statusLookup()
        }
    }, [state?.practiceLocationId])

    useEffect(() => {
        if (props.initialData.startDate && props.initialData.endDate) {
            inputChange({
                target: {
                    name: 'duration', value: moment(props.initialData.startDate).diff(moment(props.initialData.fromDate), "minutes")
                }
            })

        }
        if (props.initialData.startDate && !props.initialData.endDate && props.initialData.duration) {
            inputChange({
                target: {
                    name: 'endDate', value: moment(props.initialData.startDate).add(props.initialData.duration, "minutes")
                }
            })
        }
        if (props.initialData.duration) {
            inputChange({
                target: {
                    name: 'duration', value: props.initialData.duration
                }
            })
        }
    }, [])
    return (
        <div className=" fields p-3">
            <div className="row">
                {/* <button type="button" className="accordion-header">Patient Details</button> */}
                <div className="required field col-12">
                    {/* {inputData.patientId} */}
                    <label><i className="icon user outline" /> Choose Patient</label>
                    <div className='col-12 input-group'>
                        {/* <Select
                            options={patientList && patientList}
                            name="patientId"
                            // menuIsOpen={true}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder={props.initialData.patientId ? 'Patient Information Loading' : 'Search Patients'}
                            isDisabled={props.initialData.patientId || isLoader_Patients}
                            isLoading={isLoader_Patients}
                            loadingMessage="Patients Loading"
                            value={patientList && patientList.find(obj => obj.id === inputData.patientId)}
                            isSearchable

                            filterOption={createFilter(filterConfig)}
                            onChange={e => {
                                if (e?.id) {
                                    inputChange({
                                        target:
                                            { value: e.id, name: 'patientId' }

                                    });
                                }
                                else {
                                    inputChange({
                                        target:
                                            { value: e.patientId, name: 'patientId' }

                                    });
                                }
                            }}
                            getOptionLabel={(option) => {
                                return (
                                    // <div className="d-flex row">
                                    //     <span className="col">{option.firstName} {option.lastName}</span>
                                    //     <span className='col text-center'><i className='icon birthday cake' />{moment(option.dob).format("M/D/YYYY").toString()}</span>
                                    //     <span className='col text-end'><i className='icon mobile alternate' />{option.mobile && Utilities.toPhoneNumber(option.mobile) || option.patientPhone && Utilities.toPhoneNumber(option.patientPhone)}</span>
                                    // </div>
                                    option.firstName + ' ' + option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY") + ' | ' + Utilities.toPhoneNumber(option.mobile) || Utilities.toPhoneNumber(option.patientPhone)
                                )
                            }
                            }
                            getOptionValue={(option) => option.id}
                            // styles={{option:(styles)=>{
                            //     return({
                            //         ...styles,
                            //         justifyContent: 'space-between'
                            //     })
                            // }}}
                            noOptionsMessage={(e) => { return <button className='btn btn-primary form-control'>Add Patient</button> }}
                        />
                        {!props.initialData.patientId && <button className='btn btn-primary' title="Add Patient" onClick={e => { e.preventDefault(); setShowAdd(true) }}><i className='icon plus' /></button>} */}
                        <AsyncSelect
                            classNamePrefix="react-select"
                            className="react-select-container"
                            value={patientList && patientList.find(obj => obj.id === inputData.patientId)}
                            name="patientId"
                            loadOptions={rePatientLoad}
                            placeholder="Search Patient"
                            onChange={e => {
                                if (e?.id) {
                                    inputChange({
                                        target:
                                            { value: e.id, name: 'patientId' }

                                    });
                                }
                                else if (e?.patientId) {
                                    inputChange({
                                        target:
                                            { value: e.patientId, name: 'patientId' }

                                    });
                                }
                                else {
                                    inputChange({
                                        target: {
                                            value: null, name: 'patientId'
                                        }
                                    })
                                }
                            }}
                            getOptionLabel={(option) => {
                                return (
                                    option.firstName + ' ' + option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY") + ' | ' + Utilities.toPhoneNumber(option.mobile) || Utilities.toPhoneNumber(option.patientPhone)
                                )
                            }
                            }
                            getOptionValue={(option) => option.id}
                            noOptionsMessage={(e) =>
                                <button className='btn btn-primary form-control' onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add Patient</button>}
                        />
                    </div>
                    <span className="error-message">{errors.patientId}</span>
                </div>
                <div className="required field col-md-6 col-12">
                    <label>Patient Type</label>
                    {patientTypeList !== [] && <Select
                        options={patientTypeList}
                        name="patientType"
                        className="react-select-container"
                        classNamePrefix="react-select"
                        isLoading={isLoader_PatientType}
                        value={patientTypeList && patientTypeList.find(obj => obj.practicePatientTypeId === inputData.practicePatientTypeId)}
                        onChange={e => {
                            inputChange({
                                target:
                                    { value: e.practicePatientTypeId, name: 'practicePatientTypeId' }
                            })
                        }}
                        getOptionLabel={(option) => option.patientType}
                        getOptionValue={(option) => option.patientTypeId}
                    />}
                    <span className="error-message">{errors.practicePatientTypeId}</span>
                </div>
                <div className="required field col-md-6 col-12">
                    <label>Location</label>
                    <PracticeLocationSelector />
                    {/* {state.practiceLocationId && state.practiceLocationId} */}
                </div>
                <div className="required field col-12">
                    <label>Search Provider</label>
                    <Select
                        className="react-select-container"
                        classNamePrefix="react-select"
                        options={doctorList}
                        isDisabled={!doctorList}
                        name="doctorId"
                        isLoading={isLoader_Provider}
                        value={doctorList && doctorList.find(obj => obj.doctorId === inputData.doctorId || props.initialData.doctorId)}
                        onChange={e => {
                            if (e?.doctorId) {
                                inputChange({
                                    target:
                                        { value: e.doctorId, name: 'doctorId' }
                                })
                            }
                            else {
                                inputChange({
                                    target:
                                        { value: null, name: 'doctorId' }
                                })
                            }
                        }}
                        getOptionLabel={(option) => option.firstName + ' ' + option.lastName}
                        getOptionValue={(option) => option.doctorId}
                    />
                    <span className="error-message">{errors.doctorId ? 'Provider is a required field' : null}</span>
                </div>
                <div className="required field col-md-6 col-12">
                    <label>Service Type</label>
                    <Select
                        className="react-select-container"
                        classNamePrefix="react-select"
                        isLoading={isLoader_ServiceType}
                        options={serviceTypeList && serviceTypeList}
                        name="practiceServiceTypeId"
                        isDisabled={state && !state.practiceLocationId || !props.edit ? false : true || inputData.doctorId}
                        value={serviceTypeList && serviceTypeList.find(obj => obj.practiceServiceTypeId === inputData.practiceServiceTypeId)}
                        onChange={e => {
                            inputChange({
                                target:
                                    { value: e.practiceServiceTypeId, name: 'practiceServiceTypeId' }
                            })
                            setServiceType(e)
                        }}
                        getOptionLabel={(option) => option.practiceServiceType}
                        getOptionValue={(option) => option.practiceServiceTypeId}
                    />
                    <span className="error-message">{errors.practiceServiceTypeId}</span>
                </div>
                <div className="required field col-md-6 col-12">
                    <label>Status</label>
                    <Select
                        options={statusList}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        name="status"
                        isLoading={isLoader_Status}
                        value={inputData.practiceAppointmentStatusCodeId}
                        value={statusList && inputData.practiceAppointmentStatusCodeId ? statusList.find(obj => obj.practiceAppointmentStatusCodeId === inputData.practiceAppointmentStatusCodeId):statusList[0]}
                        onChange={e => {
                            inputChange({
                                target:
                                    { value: e.practiceAppointmentStatusCodeId, name: 'practiceAppointmentStatusCodeId' }
                            })
                        }}
                        getOptionLabel={(option) => option.appointmentStatusLabel}
                        getOptionValue={(option) => option.practiceAppointmentStatusCodeId}
                    />
                    <span className="error-message">{errors.practiceAppointmentStatusCodeId}</span>
                </div>
                <div className="field col-lg-6 col-12">
                    <label>Phone</label>
                    <InputMask
                        placeholder="Phone"
                        type="text"
                        name="phone"
                        mask="(999) 999-9999"
                        unmask={true}
                        value={inputData.patientPhone}
                        onChange={(e) => {
                            e.preventDefault();
                            inputChange(e);
                        }}
                        editable
                    />
                    <span className="error-message">{errors.phone}</span>
                </div>
                {/* {inputData.patientPhone} */}
                <div className="field required col-lg-6 col-12">
                    <label>Email</label>
                    <input type="text"
                        value={inputData.patientEmail}
                        onChange={e => { e.preventDefault(); inputChange(e) }}
                        name="patientEmail"
                        placeholder="Email" />
                    <span className="error-message">{errors.patientEmail}</span>
                </div>
                <div className="field required col-lg-5 col-12">
                    <label>Start Date</label>
                    <input type="datetime-local"
                        className="form-control"
                        // step={15}
                        value={inputData.fromDate && moment(inputData.fromDate).format('YYYY-MM-DDTHH:mm')}
                        min={Utilities.toDateTimeLocale((new Date()))}
                        // max={Utilities.toDateTimeLocale((moment().endOf('Y')))}
                        onChange={e => { e.preventDefault(); inputChange(e); }}
                        name="fromDate"
                        onBlur={e => {
                            inputChange({
                                target: {
                                    value: moment(e.target.value).add(inputData.duration, "m"), name: 'toDate'
                                }
                            })
                        }}
                    />
                    <span className="error-message">{errors.fromDate}</span>
                </div>
                <div className="field required col-lg-2 col-md-4 col-12">
                    <label>Duration</label>
                    <input type="number"
                        value={inputData.duration}
                        onChange={e => {
                            e.preventDefault();
                            inputChange(e);
                        }}
                        onBlur={e => {
                            inputChange({
                                target: {
                                    value: moment(inputData.fromDate).add(e.target.value, "m"), name: 'toDate'
                                }
                            })
                        }}
                        name="duration"
                        min={30}
                        step={15} />
                    <span className="error-message">{errors.duration}</span>
                </div>
                <div className="field required col-lg-5 col-12">
                    <label>End Date</label>
                    <input type="datetime-local"
                        className="form-control"
                        value={inputData.toDate && moment(inputData.toDate).format('YYYY-MM-DDTHH:mm')}
                        onChange={e => {
                            e.preventDefault(); inputChange(e);
                        }}
                        onBlur={e => {
                            e.preventDefault();
                            inputChange({
                                target: {
                                    value: moment(e.target.value).diff(moment(inputData.fromDate), "minutes"), name: 'duration'
                                }
                            })
                        }}
                        name="toDate"

                    // disabled
                    />
                    <span className="error-message">{errors.toDate}</span>
                </div>

                <div className="field col-md-6 col-12">
                    <label>Room</label>
                    <Select
                        options={roomList}
                        isLoading={isLoader_Room}
                        classNamePrefix="react-select"
                        className="react-select-container"
                        name="practiceLocationRoomId"
                        value={roomList && roomList.find(obj => obj.practiceLocationRoomId === inputData.practiceLocationRoomId)}
                        onChange={e => {
                            inputChange({
                                target:
                                    { value: e.practiceLocationRoomId, name: 'practiceLocationRoomId' }
                            })
                        }}
                        getOptionLabel={(option) => option.room}
                        getOptionValue={(option) => option.practiceLocationRoomId}
                    />
                </div>
                <div className="field col-md-6 col-12">
                    <label>Equipment</label>
                    {equipmentList && <Select
                        options={equipmentList}
                        isLoading={isLoader_Equipment}
                        classNamePrefix="react-select"
                        className="react-select-container"
                        name="equipmentId"
                        value={equipmentList && equipmentList.find(obj => obj.equipmentId === inputData.equipmentId)}
                        onChange={e => {
                            inputChange({
                                target:
                                    { value: e.equipmentId, name: 'equipmentId' }
                            })
                        }}
                        getOptionLabel={(option) => option.description}
                        getOptionValue={(option) => option.equipmentId}
                    />}
                    {/* {inputData.equipmentId && inputData.equipmentId} */}
                </div>
                <div className="field col-12">
                    <label>Memo</label>
                    <textarea placeholder="Memo"
                        className="form-control"
                        value={inputData.memo}
                        onChange={e => { e.preventDefault(); inputChange(e) }}
                        name="memo"
                        rows={2}
                    ></textarea>
                </div>
                <div className="mt-3 d-flex justify-content-between">
                    <div className='col-auto'>
                        {props.onClose && <button className="btn btn-secondary float-right" onClick={e => { e.preventDefault(); props.onClose() }}>Close</button>}
                    </div>
                    <div className='col-auto'>
                        <button className="btn btn-primary" onClick={e => { e.preventDefault(); submitHandlerCatch({ ...inputData, ...serviceType }) }}>{props.submitLabel || 'Update'}</button>
                        {props.additionalButton}

                    </div >
                </div >
            </div>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }}>
                <AddPatient isModal onClose={() => { setShowAdd(false) }} />
            </ModalBox>
        </div >
    )
}

export default AppointmentForm