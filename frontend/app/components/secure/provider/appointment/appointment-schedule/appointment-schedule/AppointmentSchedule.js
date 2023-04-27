import React, { useEffect, useState, useContext } from 'react'

// Npm packages
import moment from 'moment'
import Select from 'react-select'

import { store } from '../../../../../../context/StateProvider'

// Templates 
import Module from '../../../../../templates/components/Module';
import ModalBox from '../../../../../templates/components/ModalBox';
import AppointmentForm from '../../appointment-form/AppointmentForm';
import List from '../../../../../templates/components/List';
import Toaster from '../../../../../templates/components/Toaster';
import PageTitle from '../../../../../templates/components/PageTitle';

// Calendar Components 
import { Calendar as RBCal, momentLocalizer } from "react-big-calendar";
import Calendar from 'react-calendar'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import EventTile from '../../event-tile/EventTile';

import { useNavigate } from 'react-router-dom';
// Constants 
import label from '../../../../../../../assets/i18n/en.json'

// Services 
import AppointmentService from '../../../../../../services/api/appointment.service';
import DoctorService from '../../../../../../services/api/doctor.service'
import CommonService from '../../../../../../services/api/common.service';
import PracticeLocationSelector from '../../../../../templates/components/PracticeLocationSelector';
import DimLoader from '../../../../../templates/components/DimLoader';
import Table from '../../../../../templates/components/Table';
import Utilities from '../../../../../../services/commonservice/utilities';
import PracticeServiceTypeService from '../../../../../../services/api/practice-service-type.service';
import toast from 'react-hot-toast';
import PracticePatientService from '../../../../../../services/api/patient-type.service';

const AppointmentSchedule = (props) => {
    // context state and dispatch 
    const globalStateAndDispatch = useContext(store)
    const state = globalStateAndDispatch.state
    const dispatch = globalStateAndDispatch.dispatch

    const navigate = useNavigate()
    const [toasterMessage, setToasterMessage] = useState()
    // filter lists
    const [doctorList, setDoctorList] = useState([])

    const [formObjective, setFormObjective] = useState()

    // filter states 
    const [selectedDoctorList, setSelectedDoctorList] = useState()
    const [selectedLocation, setSelectedLocation] = useState([]) //Only one

    // event update data 
    const [initialData, setInitialData] = useState(props.initialData || {})
    const [patientTypes, setPatientTypes] = useState()

    // Appointment Edits modal control 
    const [showAdd, setShowAdd] = useState(false)
    const [showEdit, setShowEdit] = useState(false)

    // calendar data
    const [events, setEvents] = useState([])
    const [fromDate, setFromDate] = useState(new Date(moment().startOf('d')))
    const [fromDate2, setFromDate2] = useState(new Date(moment().add(1, "M").startOf('d')))
    const [toDate, setToDate] = useState(new Date(moment().add(1, 'd').startOf('d')))
    const [date, setDate] = useState(new Date())
    const [view, setView] = useState("day")
    const localizer = momentLocalizer(moment);
    const DnDCalendar = withDragAndDrop(RBCal)


    // controls for resource views
    const [isLoader_Equipment, setIsLoader_Equipment] = useState(false)
    const [isLoader_Room, setIsLoader_Room] = useState(false)
    const [isLoader_Availability, setIsLoader_Availability] = useState(false)

    // Calendar resource constants 
    const [selectedResource, setSelectedResource] = useState(props.resource)
    const [equipmentList, setEquipmentList] = useState([])
    const [roomList, setRoomList] = useState([])
    const [selectedEquipmentList, setSelectedEquipmentList] = useState()
    const [selectedRoomList, setSelectedRoomList] = useState()
    const [patientList, setPatientList] = useState()
    const [selectedPatient, setSelectedPatient] = useState()
    const [serviceList, setServiceList] = useState()
    const [selectedService, setSelectedService] = useState()
    const [unavailable, setUnavailable] = useState()
    const [availableList, setAvailableList] = useState()

    const columns = [
        // ["Name", "Equipment Type", "Room", "Actions"]
        // "Date", "Duration", "Provider", "Services", "Book"
        {
            key: "date",
            text: "Date",
            align: "left",
            sortable: true,
            cell: (slot) => moment.utc(slot.startDate).format("dddd, MMMM D") + ' at ' + moment.utc(slot.startDate.slice(0, 10) + "T" + slot.startTime).format("h:mm a")
        },
        {
            key: "duration",
            text: "Duration",
            align: "left",
            sortable: true,
            cell: (slot) => `${slot.duration} mins`
        },
        {
            key: "drName",
            text: "Provider",
            align: "left",
            sortable: true,
        },
        {
            key: "doctorId",
            text: "Services",
            align: "left",
            sortable: true,
            cell: (slot) => {
                let length = doctorList.find(ob => ob.id === slot.doctorId)?.services?.length
                return (
                    selectedService ? <span>{selectedService.practiceServiceType}</span> : doctorList.find(ob => ob.id === slot.doctorId)?.services?.slice(0, 3).map((service, i) => {
                        if (2 === i && length > 3) {
                            return <span>{i !== 0 && ','} {service.practiceServiceType} and {length - 3} more</span>
                        }
                        else {
                            return <span>{i !== 0 && ','} {service.practiceServiceType}</span>
                        }
                    }
                    )
                )
            }
        },
        {
            key: "actions",
            text: "Book",
            align: "center",
            sortable: false,
            cell: (slot) => <div className='w-100 d-flex justify-content-center'><button className='btn btn-transparent p-0' onClick={e => { e.preventDefault(); toggleAppointment({ start: moment(slot.startDate.slice(0, 10) + "T" + slot.startTime.slice(0, 5)).toISOString(), duration: 30, doctorId: slot.doctorId }) }}><i className="icon plus text-primary" /></button></div>
        },
    ]
    const config = {
        page_size: 20,
        length_menu: [20, 50],
        show_filter: false,
        show_pagination: true,
        pagination: 'advance',
        filename: "Appointment Schedule",
        button: {
            excel: true,
            print: true,
            csv: true,
            extra: true
        },
        language: {
            loading_text: "Please be patient while data loads..."
        }
    }

    const practicePatientLookup = () => {
        PracticePatientService.practicePatientLookup(state.practiceLocationId)
            .then((response) => {
                console.log(response)
                setPatientTypes(response.data.selectResponse);
            })
            .catch(error => {
                console.log(error)
                // setCheckException(error);
            })
    }


    useEffect(() => {
        setSelectedResource(props.resource)
    }, [props.resource])

    const refresh = () => {
        setView("day")
        setSelectedDoctorList(false)
        navigateCalendar({ action: 'onChange', value: new Date() })
        return navigate('/provider/schedule')
    }

    const patientLookup = () => {
        let reqObj = { SearchTerm: '', isActive: true, isRegistered: true, SortField: 'firstName' }
        CommonService.patientLookup(reqObj)
            .then(res => {
                if (res) {
                    console.log(res.data)
                    return setPatientList(res.data)
                }
            }
            )
            .catch(err => console.log(err))
    }

    const callCheckAvailability = () => {
        setIsLoader_Availability(true)
        let reqObj = {
            calendarDate: moment(date).format("YYYY-MM-DD"),
            doctorIds: selectedDoctorList ? selectedDoctorList.map(doctor => { return doctor.id }).toString() : '',
            equipmentTypeId: selectedEquipmentList ? selectedEquipmentList.map(equipment => { return equipment.id }).toString() : '',
            practiceLocationId: state.practiceLocationId || '',
            serviceTypeId: selectedService ? selectedService.practiceServiceTypeId : ''
        }
        if (selectedDoctorList) {
            console.log(selectedDoctorList)
        }
        AppointmentService
            .checkAvailability(reqObj)
            .then(
                (appointmentResponse) => {
                    setAvailableList(appointmentResponse)
                    console.log(appointmentResponse)
                    setIsLoader_Availability(false)
                    //   this.isLoader_EventList = true;
                })
            .catch(
                (error) => {
                    setIsLoader_Availability(true)
                    //   this.isLoader_EventList = true;
                    console.log(error);
                }
            );
    }

    const practiceLocationRoomLookup = () => {
        setIsLoader_Room(true)
        AppointmentService.practiceLocationRoomLookup(state.practiceLocationId)
            .then((response) => {
                setRoomList(response)
                setIsLoader_Room(false)
            })
            .catch((error) => {
                setIsLoader_Room(false)
                setRoomList([])
                setSelectedRoomList()
                console.log(error)
                // this.checkException(error);
            }
            )
    }
    const equipmentLookup = () => {
        setIsLoader_Equipment(true)
        // AppointmentService.getAvailableEquipmentsForLocationAndService(searchParams)
        AppointmentService.equipmentLookup(state.practiceLocationId)
            .then((response) => {
                // console.log(response)
                setEquipmentList(response)
                // setSelectedEquipmentList(response)
                setIsLoader_Equipment(false)
            })
            .catch((error) => {
                setEquipmentList([])
                setSelectedEquipmentList()
                console.log(error)
                setIsLoader_Equipment(false)
            }
            )
    }

    // form Data 
    const [searchParams, setSearchParams] = useState(
        {
            FromDate: fromDate.toISOString(),
            ToDate: toDate.toISOString(),
            Location: state?.practiceLocationId
        })

    const [noResultsMessage, setNoResultsMessage] = useState(undefined)

    // loaders
    const [isLoader, setIsLoader] = useState(true)
    const [isLoader_findAppointment, setIsLoader_findAppointment] = useState(true)

    // Form formulas 
    const doctorChange = (e) => {
        if (e.length !== 0) { setSelectedDoctorList(e); }
        else { setSelectedDoctorList(); setView("day") }
    };
    const equipmentChange = (e) => {
        console.log(e)
        if (e.length !== 0) { setSelectedEquipmentList(e); }
        else { setSelectedEquipmentList() }
    };
    const roomChange = (e) => {
        if (e.length !== 0) { setSelectedRoomList(e); }
        else { setSelectedRoomList() }
    };

    //API pulls
    const doctorLookUp = () => {
        setIsLoader(true)
        const reqObj = { isRegistered: true, isActive: true, PracticeLocationId: state.practiceLocationId };
        DoctorService.findWithServices(reqObj)
            .then(
                (response) => {
                    console.log(response)
                    setDoctorList(response)
                    setIsLoader(false)
                })
            .catch((error) => {
                setIsLoader(false)
                console.log(error);
            })
    }


    const setParams = () => {
        console.log("set params from Date:", fromDate, "to date", toDate)
        let doctorIds = []
        if (selectedDoctorList) {
            selectedDoctorList.map(element => {
                return doctorIds.push(element.id)
            })
        }
        else {
            doctorIds = ""
        }
        let location = state.practiceLocationId
        return {
            DoctorIds: doctorIds.toString(), Location: location, FromDate: new Date(fromDate).toISOString(), ToDate: new Date(toDate).toISOString()
        }
    }

    // calendar change formulas 
    const navigateCalendar = (data) => {
        if (data.action === 'next') {
            // if (view === "week") {
            setDate(new Date(moment(date).add(1, "w")))
            setFromDate(new Date(moment(date).add(1, "w").startOf("w")))
            setToDate(new Date(moment(date).add(1, "w").endOf("w")))
            // }
            // if (view === "day") {
            //     setDate(new Date(moment(date).add(1, "d")))
            //     setFromDate(new Date(moment(date).add(1, "d").startOf("d")))
            //     setToDate(new Date(moment(date).add(1, "d").endOf("d")))
            // }
        }
        else if (data.action === 'next2') {
            // if (view === "week") {
            setDate(new Date(moment(date).add(1, "M")))
            setFromDate(new Date(moment(date).add(1, "M").startOf("w")))
            setToDate(new Date(moment(date).add(1, "M").endOf("w")))
            // }
            // if (view === "day") {
            //     setDate(new Date(moment(date).add(1, "w")))
            //     setFromDate(new Date(moment(date).add(1, "w").startOf("d")))
            //     setToDate(new Date(moment(date).add(1, "w").endOf("d")))
            // }
        }
        else if (data.action === 'prev') {
            // if (view === "week") {
            setDate(new Date(moment(date).subtract(1, "w")))
            setFromDate(new Date(moment(date).subtract(1, "w").startOf("w")))
            setToDate(new Date(moment(date).subtract(1, "w").endOf("w")))
            // }
            // if (view === "day") {
            //     setDate(new Date(moment(date).subtract(1, "d")))
            //     setFromDate(new Date(moment(date).subtract(1, "d").startOf("d")))
            //     setToDate(new Date(moment(date).startOf("d")))
            // }
        }
        else if (data.action === 'prev2') {
            // if (view === "week") {
            setDate(new Date(moment(date).subtract(1, "M")))
            setFromDate(new Date(moment(date).subtract(1, "M").startOf("w")))
            setToDate(new Date(moment(date).subtract(1, "M").startOf("w")))
            // }
            // if (view === "day") {
            //     setDate(new Date(moment(date).subtract(1, "w")))
            //     setFromDate(new Date(moment(date).subtract(1, "w").startOf("d")))
            //     setToDate(new Date(moment(date).subtract(1, "w").startOf("d")))
            // }
        }
        else if (data.action === 'date') {
            if (data.view === "week") {
                // setView("week")
                setFromDate(new Date(moment(date).startOf("w")))
                setToDate(new Date(moment(date).endOf("w")))
            }
            else if (data.view === "day") {
                // setView("day")
                setFromDate(new Date(moment(date).startOf("d")))
                setToDate(new Date(moment(date).add(1, "d").startOf("d")))
            }
            else if (data.view === "month") {
                // setView("day")
                setFromDate(new Date(moment(date).startOf("M")))
                setToDate(new Date(moment(date).add(1, "M").startOf("d")))
            }
            else {
                setFromDate(new Date(moment(date).startOf(view[0])))
                setToDate(new Date(moment(date).add(1, view[0]).startOf(view[0])))
            }
        }
        else if (data.action === 'onChange') {
            // alert("onChange")
            setDate(data.value)
            setFromDate(new Date(moment(data.value).startOf(view[0])))
            setToDate(new Date(moment(data.value).add(1, view[0]).startOf(view[0])))
        }
        else if (data.action === 'view') {
            if (data.view === "week") {
                setDate(new Date(moment(data.value).startOf(view[0])))
                setFromDate(new Date(moment(date).startOf("w")))
                setToDate(new Date(moment(date).endOf("w")))
            }
            else if (data.view === "day") {
                setDate(new Date(moment(data.value).startOf(view[0])))
                setFromDate(new Date(moment(date).startOf("d")))
                setToDate(new Date(moment(date).add(1, "d").startOf("d")))
            }
            else if (data.view === "month") {
                setFromDate(new Date(moment(date).startOf("M")))
                setToDate(new Date(moment(date).add(1, "M").startOf("d")))
            }
        }
    }

    const getPracticeServiceTypeForLocation = () => {
        PracticeServiceTypeService.practiceServiceTypeLookup()
            .then(
                (response) => {
                    console.log(response.data)
                    setServiceList(response.data)
                })
            .catch((error) => {
            }
            );
    }

    useEffect(() => {
        if(state?.practiceLocationId){
            equipmentLookup()
            practiceLocationRoomLookup()
            getPracticeServiceTypeForLocation()
            doctorLookUp()
            practicePatientLookup()
            return setSearchParams(setParams())
        }
    }, [state?.practiceLocationId])

    useEffect(() => {
        if (selectedResource === "availability") {
            return callCheckAvailability()
        }
        else {
            navigateCalendar({ action: 'onChange', value: date })
            console.log("date change:", date)
            return setSearchParams(setParams())
        }
    }, [date])

    useEffect(() => {
        fetchAppointment()
    }, [searchParams])

    useEffect(() => {
        if (selectedResource === "availability") {
            patientLookup()
            callCheckAvailability()
        }
    }, [selectedResource])

    useEffect(() => {
        if (selectedResource === "availability") {
            callCheckAvailability()
        }
    }, [selectedDoctorList, selectedService])

    // Appointment API pull 
    const fetchAppointment = () => {
        setIsLoader_findAppointment(true);
        // setEvents([])
        console.log("fetch appointment")
        AppointmentService.findAppointment(searchParams)
            .then((findAppointmentResponse) => {
                if (findAppointmentResponse === []) {
                    setNoResultsMessage("No results found")
                    setEvents([])
                } else {
                    let appointmentList = findAppointmentResponse
                    let tempEvents = []
                    const appointmentLister = () => {
                        appointmentList.forEach((element) => {
                            let fullName = "";
                            let toolTipTimeStart = "";
                            let toolTipTimeEnd = "";
                            fullName =
                                element.firstName != null
                                    ? `${fullName} ${element.firstName}`
                                    : `${fullName}`;
                            fullName =
                                element.lastName != null
                                    ? `${fullName} ${element.lastName}`
                                    : `${fullName}`;
                            element.fullName = fullName;
                            let indexDoctor = doctorList.findIndex(
                                (x) => x.id === element.doctorId
                            );
                            toolTipTimeStart = moment(element.fromDate).format('h:mm A')
                            toolTipTimeEnd = moment(element.toDate).format('h:mm A')
                            let start = new Date(element.fromDate)
                            let end = new Date(element.toDate)
                            tempEvents.push({
                                ...element,
                                isPopupOpen: false,
                                start: start,
                                end: end,
                                title: element.firstName + ' ' + element.lastName[0] + '.',
                                draggable: true,
                                // resourceId: element.doctorId,
                                doctorId: element.doctorId,
                                toolTip: toolTipTimeStart + "-" + toolTipTimeEnd,
                                fillColour:
                                    element.patientTypeBorderColour !== null
                                        ? element.patientTypeBorderColour
                                        : "black",
                                borderColour:
                                    element.serviceTypeFillColour !== null
                                        ? element.serviceTypeFillColour
                                        : "darkGrey",
                                popupText:
                                    +element.repeatOn > 0
                                        ? "@" +
                                        RecurringAppointmentEnum[element.repeatOn] +
                                        " " +
                                        element.aptTotalCount +
                                        " times"
                                        : "",
                                resizable: {
                                    beforeStart: true,
                                    afterEnd: true,
                                },
                                doctor: doctorList[indexDoctor],
                            })
                        })
                        return tempEvents
                    }
                    setEvents(appointmentLister())
                }
                return setIsLoader_findAppointment(false)
            })
            .catch((error) => {
                console.log(error);
                return setIsLoader_findAppointment(false)
            }
            );

    }

    const toggleAppointment = (e) => {
        if (e.start < moment()) {
            toast.error("Appointment start time must be in the future")
        }
        else {
            setFormObjective("add")
            let newInitialData = {
                fromDate: moment(new Date(e.start)),
                toDate: e.duration? moment(new Date(e.start)).add(e.duration,"m") : e.end ? moment(new Date(e.end)) : moment(new Date(e.start)).add(60, "m"),
                practiceLocationId: state.practiceLocationId,
                duration: e.duration? e.duration : e.end ? moment(new Date(e.end)).diff(moment(new Date(e.start)), "minutes") : ''
            }
            if (selectedResource === "provider") {
                newInitialData.doctorId = e.resourceId
            }
            if (selectedResource === "equipment") {
                newInitialData.equipmentId = e.resourceId
            }
            if (selectedResource === "room") {
                newInitialData.practiceLocationRoomId = e.resourceId
            }
            if (selectedResource === "availability") {
                newInitialData.doctorId = e.doctorId
                if (selectedPatient) {
                    newInitialData.patientId = selectedPatient.id
                }
                if (Array.isArray(selectedEquipmentList) === false) {
                    newInitialData.equipmentId = selectedEquipmentList?.equipmentId
                }
                if (selectedService) {
                    newInitialData.practiceServiceTypeId = selectedService.practiceServiceTypeId
                }
            }
            setInitialData(newInitialData)
            return setShowAdd(true)
        }
    }

    const submitHandler = (data) => {
        if (formObjective === "add") {
            return AppointmentService.addAppointment({
                "aptTotalCount": data.aptTotalCount,
                "checkEligibility": data.checkEligibility,
                "day": moment(data.fromDate).day(),
                "doctorId": data.doctorId,
                "duration": data.duration,
                "email": data.patientEmail,
                "equipmentId": data.equipmentId,
                "fromDate": new Date(data.fromDate).toISOString(),
                "memo": data.memo,
                "patientId": data.patientId,
                "patientInsuranceId": data.patientInsuranceId,
                "phone": data.patientPhone,
                "practiceAppointmentStatusCodeId": data.practiceAppointmentStatusCodeId,
                "practiceLocationId": data.practiceLocationId,
                "practiceLocationRoomId": data.practiceLocationRoomId,
                "practicePatientTypeId": data.practicePatientTypeId,
                "practiceServiceTypeId": data.practiceServiceTypeId,
                "reasonForVisit": data.memo,
                "repeatOn": data.repeatOn,
                "timeZone": data.timeZon,
                "toDate": new Date(data.toDate).toISOString(),
            })
                .then(res => { console.log(res); fetchAppointment(); return setShowAdd(false) })
                .catch(err => { console.log(err); return setToasterMessage(err.message) })
        }
        else {
            return AppointmentService.editAppointment(
                {
                    "doctorId": data.doctorId,
                    "fromDate": new Date(data.fromDate).toISOString(),
                    "toDate": new Date(data.toDate).toISOString(),
                    "day": moment(data.fromDate).day(),
                    "duration": data.duration,
                    "repeatOn": data.repeatOn,
                    "aptTotalCount": data.aptTotalCount,
                    "memo": data.memo,
                    "phone": data.patientPhone,
                    "email": data.patientEmail,
                    "timeZone": data.timeZone,
                    "checkEligibility": data.checkEligibility,
                    "patientInsuranceId": data.patientInsuranceId,
                    "practicePatientTypeId": data.practicePatientTypeId,
                    "practiceLocationId": data.practiceLocationId,
                    "practiceServiceTypeId": data.practiceServiceTypeId,
                    "practiceAppointmentStatusCodeId": data.practiceAppointmentStatusCodeId,
                    "practiceLocationRoomId": data.practiceLocationRoomId,
                    "equipmentId": data.equipmentId,
                    "reasonForVisit": data.memo,
                    "id": data.id
                }
            )
                .then(res => { console.log(res); fetchAppointment(); return setShowAdd(false) })
                .catch(err => { console.log(err); return setToasterMessage(err.message) })
        }
    }

    const onDrop = (e) => {
        setFormObjective("edit")
        console.log(e)
        let tempData = e.event
        if (e.start < moment()) {
            toast.error("Appointment start time must be in the future")
        }
        else {
            if (selectedResource === "provider") {
                tempData.doctorId = e.resourceId
            }
            if (selectedResource === "equipment") {
                tempData.equipmentId = e.resourceId
            }
            if (selectedResource === "room") {
                tempData.practiceLocationRoomId = e.resourceId
            }
            tempData.fromDate = new Date(e.start)
            tempData.toDate = new Date(e.end)
            tempData.visitStatus = 0
            console.log(tempData)
            setInitialData(tempData)
            return setShowAdd(true)
        }
    }

    const onEventResize = (e) => {
        setFormObjective("edit")
        let tempData = e.event
        if (selectedResource === "provider") {
            tempData.doctorId = e.resourceId
        }
        if (selectedResource === "equipment") {
            tempData.equipmentId = e.resourceId
        }
        if (selectedResource === "room") {
            tempData.practiceLocationRoomId = e.resourceId
        }
        tempData.fromDate = new Date(e.start)
        tempData.toDate = new Date(e.end)
        delete tempData.duration
        console.log(tempData)
        setInitialData(tempData)
        return setShowAdd(true)
    }

    const toggleAdd = () => {
        if (showAdd) {
            setShowAdd(false)
        }
        else {
            setShowAdd(true)
        }
    }

    // useEffect(() => {
    //     if (unavailable) {
    //         setEvents([...events, ...unavailable])
    //     }
    // }, [unavailable])
    // DND Toolbar
    const Toolbar = (props) => {
        let today = new Date().toLocaleDateString();
        let currentDate = new Date(props.date).toLocaleDateString();
        return (
            <div className="rbc-toolbar row justify-content-between">
                <span className="rbc-btn-group col-md-auto col-12 d-flex justify-content-center">
                    <button type="button" onClick={e => { e.preventDefault(); if (view === "day") { navigateCalendar({ action: "onChange", value: new Date(moment(date).subtract(1, "d")) }) } else { navigateCalendar({ action: 'prev' }) } }}>Prev</button>
                    <button type="button" onClick={e => { e.preventDefault(); if(view==='day'){setDate(new Date()); setFromDate(new Date(moment().startOf("D"))); setToDate(new Date(moment().endOf("D")))}else{setDate(new Date()); setFromDate(new Date(moment().startOf("W"))); setToDate(new Date(moment().endOf("W")))} }} className={today === currentDate && 'rbc-active'}>Today</button>
                    <button type="button" onClick={e => { e.preventDefault(); if (view === "day") { navigateCalendar({ action: "onChange", value: new Date(moment(date).add(1, "d")) }) } else { navigateCalendar({ action: 'next' }) } }}>Next</button>
                </span>
                <span className="rbc-toolbar-label col-auto">{props.label} | {selectedResource[0].toLocaleUpperCase()}{selectedResource.slice(1)} View</span>
                {/* <span className="rbc-btn-group col-auto">
                    <button type="button" onClick={e => { e.preventDefault(); setSelectedResource("provider"); console.log("set to doctor", selectedResource) }} className={selectedResource === 'doctor' && 'rbc-active'}>Provider</button>
                    <button type="button" onClick={e => { e.preventDefault(); setSelectedResource("equipment"); console.log("set to equipment", selectedResource) }} className={selectedResource === 'equipment' && 'rbc-active'}>Equipment</button>
                    <button type="button" onClick={e => { e.preventDefault(); setSelectedResource("room"); console.log("set to room", selectedResource) }} className={selectedResource === 'room' && 'rbc-active'}>Room</button>
                </span> */}
                <span className="rbc-btn-group col-md-auto col-12 d-flex justify-content-center">
                    {/* <button type="button" onClick={e => { e.preventDefault(); setView('month'); return navigateCalendar({ action: 'view', view: 'month' }) }} className={props.view === 'month' && 'rbc-active'}>Month</button> */}
                    <button type="button" onClick={e => { e.preventDefault(); setView('week'); return navigateCalendar({ action: 'view', view: 'week' }) }} className={props.view === 'week' && 'rbc-active'}>Week</button>
                    <button type="button" onClick={e => { e.preventDefault(); setView("day"); return navigateCalendar({ action: 'view', view: 'day' }) }} className={props.view === 'day' && 'rbc-active'}>Day</button>
                    {/* <button type="button" onClick={e => { e.preventDefault(); setView("day"); return navigateCalendar({ action: 'view', view: 'day' }) }} className={props.view === 'day' && 'rbc-active'}><i className='icon refresh'/></button> */}
                </span>
            </div>
        )
    }

    const EventTileTemplate = (props) => {
        return <EventTile {...props} resource={selectedResource} refresh={() => { fetchAppointment() }} />
    }

    const Legend = (props) => {
        return (
            <div className='container'>
                <div className="mt-3 hidden-lg-mobile scroll-box" >
                    <label>
                        Service Types:
                    </label>
                    <div className="card p-3">
                        {serviceList && serviceList.map(service => {
                            return (
                                <span style={{ display: 'block', fontSize: "12px" }}><i className="icon small square me-3" style={{ color: service.appointmentFillColor }} />{service.practiceServiceType}</span>
                            )
                        })}
                    </div>
                </div>
                <div className="mt-3 hidden-lg-mobile" >
                    <label>
                        Patient Types:
                    </label>
                    <div className="card p-3">
                        {patientTypes.map(type=>{
                            return(
                                <span style={{ display: 'block', fontSize: "12px" }}><i className="icon small square me-3" style={{ color: type.appointmentBorderColor}} />{type.patientType}</span>
                            )
                        })}                      
                    </div>
                </div>
            </div >)
    }
    return (
        <div className="row">
            <PageTitle title="Scheduling" />
            <div className="col-xl-3 col-lg-4 col-12 mb-3">
                <Module title="Filters">
                    <div className='field mb-3'>
                        <label>View Type</label>
                        <div className='justify-content-between d-flex'>
                            <span className="rbc-btn-group col-auto">
                                <button type="button" onClick={e => { e.preventDefault(); navigate('/provider/schedule') }} className={selectedResource === 'provider' ? 'btn btn-primary' : 'btn btn-secondary'} title="Provider">P</button>
                                <button type="button" onClick={e => { e.preventDefault(); navigate("/provider/schedule/availability") }} className={selectedResource === 'availability' ? 'btn btn-primary' : 'btn btn-secondary'} title="Availability">A</button>
                                <button type="button" onClick={e => { e.preventDefault(); navigate("/provider/schedule/room") }} className={selectedResource === 'room' ? 'btn btn-primary' : 'btn btn-secondary'} title="Room">R</button>
                                <button type="button" onClick={e => { e.preventDefault(); navigate("/provider/schedule/equipment"); }} className={selectedResource === 'equipment' ? 'btn btn-primary' : 'btn btn-secondary'} title="Equipment">E</button>
                            </span>
                            <button type="button" className='btn btn-primary' title="Refresh" onClick={e => { e.preventDefault(); refresh() }}><i className='icon refresh' /></button>
                        </div>
                    </div>
                    <div className="calendar picker mb-3 row" side="left" title='Filters'>
                        <div className="field col-lg-12 col-md-4 col-12 mb-3">
                            {selectedResource === "availability" &&
                                <div className="required field col-12">
                                    <label>Service Type</label><Select
                                        options={serviceList}
                                        classNamePrefix="react-select"
                                        className="react-select-container"
                                        name="practiceServiceTypeId"
                                        value={selectedService}
                                        isClearable={true}
                                        onChange={e => {
                                            setSelectedService(e)
                                        }}
                                        getOptionLabel={(option) => option.practiceServiceType}
                                        getOptionValue={(option) => option.practiceServiceTypeId}
                                    />
                                    <label>Select Patient</label>
                                    <Select
                                        options={patientList}
                                        name="patientId"
                                        classNamePrefix="react-select"
                                        className="react-select-container"
                                        isClearable={true}
                                        value={selectedPatient}
                                        onChange={e => {
                                            setSelectedPatient(e)
                                        }}
                                        getOptionLabel={(option) => {
                                            return (
                                                option.firstName + ' ' + option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY") + ' | ' + Utilities.toPhoneNumber(option.mobile) || Utilities.toPhoneNumber(option.patientPhone)
                                            )
                                        }}
                                    />
                                </div>
                            }
                            <label>Select Location</label>
                            <PracticeLocationSelector />
                        </div>
                        <div className="hidden-lg-mobile mb-3">
                            <Calendar
                                className="date-picker mt-3"
                                calendarType="US"
                                // showDoubleView={true}
                                activeStartDate={fromDate}
                                // onActiveStartDateChange={e=>{setDate(e); navigateCalendar(e); console.log(e)}}
                                value={date}
                                // showNavigation={false}
                                // onDrillUp={(a)=>console.log(a)}
                                // navigationLabel={DateLabel}
                                showNeighboringMonth={false}
                                // showFixedNumberOfWeeks={false}
                                onChange={e => { setDate(e); }}
                                minDetail="month"
                                maxDetail="month"
                                onActiveStartDateChange={e => { navigateCalendar(e) }}
                                formatShortWeekday={(locale, date) => { return moment(date).format('dd')[0] }}
                                tileClassName={(option) => {
                                    if (option.date > new Date(moment(fromDate).subtract(1, "d").startOf("d")) && option.date < new Date(toDate)) {
                                        return "tile-range"
                                    }
                                }}
                                tileDisabled={(data) => data.date < data.activeStartDate || data.date > moment(data.activeStartDate).endOf("M")}
                            />
                            {selectedResource !== "availability" && <div>
                                <div className="react-calendar__navigation bg-primary">
                                    <div aria-label="" className="react-calendar__navigation__label text-center" disabled="" type="button" style={{ flexGrow: 1 }}>
                                        <span className="react-calendar__navigation__label__labelText react-calendar__navigation__label__labelText--from">{moment(fromDate).add(1, "M").format("MMMM YYYY")}</span>
                                    </div>
                                </div>
                                <Calendar
                                    className="date-picker"
                                    calendarType="US"
                                    activeStartDate={new Date(moment(fromDate).add(1, "M"))}
                                    value={date}
                                    showNeighboringMonth={false}
                                    onClickDay={e => { setDate(e); }}
                                    showNavigation={false}
                                    minDetail="month"
                                    maxDetail="month"
                                    formatShortWeekday={(locale, date) => { return moment(date).format('dd')[0] }}
                                    onActiveStartDateChange={e => { console.log(e); navigateCalendar(e) }}
                                    tileDisabled={(data) => data.date < data.activeStartDate || data.date > moment(data.activeStartDate).endOf("M")}
                                />
                            </div>}
                        </div>
                        <div className="show-lg-mobile col-lg-12 col-md-4 col-12">
                            <label>Date Selector</label>
                            <input type="date" value={moment(new Date(date)).format('yyyy-MM-DD')} onChange={e => { e.preventDefault(); setDate(new Date(e.target.value)); console.log(e) }} />
                        </div>
                        {selectedResource === "equipment" || selectedResource === "availability" ? <div className="col-lg-12 col-md-4 col-12">
                            <label>Filter by Equipment</label>
                            <Select
                                options={equipmentList}
                                onChange={e => { equipmentChange(e) }}
                                value={selectedEquipmentList}
                                classNamePrefix="react-select"
                                className="react-select-container"
                                isClearable={true}
                                isMulti
                                placeholder="All Equipment"
                                getOptionLabel={(option) => option.description}
                                getOptionValue={(option) => option.equipmentId}

                            />
                        </div> : null}
                        {selectedResource === "room" || selectedResource === 'availability' ? <div className="col-lg-12 col-md-4 col-12">
                            <label>Filter by Room</label>
                            <Select
                                classNamePrefix="react-select"
                                className="react-select-container"
                                options={roomList}
                                onChange={e => { roomChange(e) }}
                                value={selectedRoomList}
                                isClearable={true}
                                isMulti
                                placeholder="All Rooms"
                                getOptionLabel={(option) => option.room}
                                getOptionValue={(option) => option.practiceLocationRoomId}

                            />
                        </div> : null}
                        <div className="col-lg-12 col-md-4 col-12">
                            <label>Filter by Provider</label>
                            <Select
                                options={doctorList}
                                className="react-select"
                                classNamePrefix="react-select"
                                onChange={e => { doctorChange(e) }}
                                value={selectedDoctorList && doctorList.find(obj => obj.id === selectedDoctorList.doctorId)}
                                isClearable={true}
                                isLoading={!doctorList}
                                isDisabled={!doctorList}
                                loadingMessage="Retrieving list of providers"
                                isMulti={true}
                                placeholder="All Providers"
                                getOptionLabel={(option) => option.firstName + ' ' + option.lastName}
                                getOptionValue={(option) => option.id}
                            />
                        </div>
                    </div>
                </Module>
            </div>
            <div className="col-xl-9 col-lg-8 col-12">
                {selectedResource !== "availability" &&
                    <Module title="Calendar"
                        helperIcon="question mark"
                        wide toolTip={Legend}
                        helper={serviceList}
                        toolTipSize="small"
                        toolTipPosition="bottom right"
                        helperMessage="Click for legend"
                    >
                        <div className="calendar" side="right" title="Calendar">
                            {isLoader_findAppointment || isLoader_Availability ?
                                <div className="ui active dimmer">
                                    <div className="ui indeterminate text loader">Schedule Loading...</div>
                                </div> : null}
                            <DnDCalendar
                                events={events}
                                localizer={localizer}
                                style={{ height: "80vh" }}
                                defaultDate={moment().toDate()}
                                view={view}
                                views={['week', 'day']}
                                components={{
                                    event: EventTileTemplate,
                                    toolbar: Toolbar,
                                    resourceHeader: (element) => {
                                        return <button
                                            className={`btn btn-transparent text-primary w-100`}
                                            onClick={e => {
                                                e.preventDefault();
                                                if (selectedResource === "provider") {
                                                    doctorChange([element.resource]);
                                                }
                                                else if (selectedResource === "equipment") {
                                                    equipmentChange([element.resource])
                                                }
                                                else if (selectedResource === "room") {
                                                    roomChange([element.resource])
                                                }
                                                setView("week");
                                                return navigateCalendar({ action: 'view', view: 'week' })
                                            }}
                                            title={`Week View for ${element.label}`}
                                        >
                                            {element.resource.firstName && element.resource?.firstName} &nbsp;
                                            {element.resource?.lastName ? element.resource?.lastName[0] : element.label}
                                        </button>
                                    },
                                    week: {
                                        header: (element) => { return <span>{element.label}</span> }
                                    }
                                }}
                                // "0rbd43b6"
                                date={date}
                                selectable='ignoreEvents'
                                scrollToTime={moment().subtract(9, "h")}
                                // step={15}
                                timeslots={1}
                                resizable

                                onSelectSlot={e => toggleAppointment(e)}
                                min={moment().hour(8).minutes(0)}
                                max={moment().hour(19).minutes(0)}
                                resources={selectedResource === "provider" ? selectedDoctorList || doctorList : selectedResource === "equipment" ? selectedEquipmentList || equipmentList : selectedRoomList || roomList}
                                resourceAccessor={selectedResource === "provider" ? 'doctorId' : selectedResource === "equipment" ? 'equipmentId' : 'practiceLocationRoomId'}
                                resourceIdAccessor={selectedResource === "provider" ? 'id' : selectedResource === "equipment" ? 'equipmentId' : 'practiceLocationRoomId'}
                                // resourceTitleAccessor={selectedResource === "provider" ? 'name' : selectedResource === "equipment" ? 'description' : 'room'}
                                resourceTitleAccessor={selectedResource === "provider" ? "name" : selectedResource === "equipment" ? 'description' : 'room'}
                                onEventDrop={(e) => { onDrop(e); console.log(e) }}
                                onEventResize={(e) => { onEventResize(e) }}
                                // onDoubleClickEvent={(e) => { console.log(e) }}
                                resizableAccessor="resizable"
                                eventPropGetter={
                                    (event, start, end, isSelected) => { if (event.practiceServiceType === "**unavailable**") { return { style: { backgroundColor: '#00000080', borderColor: 'black', color: 'black' } } } else { return { style: { backgroundColor: event.fillColour, borderColor: event.borderColour, color: 'black' } } } }}
                            />
                        </div>
                    </Module>}
                {selectedResource === "availability" &&
                    <Module title="Availability">
                        <Table config={config} records={availableList} loading={isLoader_Availability} columns={columns}
                            extraButtons={[
                                {
                                    className: view === 'week' ? 'btn btn-primary' : 'btn btn-secondary', children: 'Week', onClick: e => { e.preventDefault(); setView('week'); return navigateCalendar({ action: 'view', view: 'week' }) }
                                },
                                {
                                    className: view === 'day' ? 'btn btn-primary' : 'btn btn-secondary', children: 'Day', onClick: e => { e.preventDefault(); setView('day'); return navigateCalendar({ action: 'view', view: 'day' }) }
                                },
                            ]} />
                    </Module>
                }
            </div>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false); }} edit={formObjective === "edit" ? true : false}>
                {showAdd && <AppointmentForm initialData={{ ...initialData, practiceLocationRoomId: selectedRoomList ? selectedRoomList[0].practiceLocationRoomId : initialData.practiceLocationRoomId, equipmentId: selectedEquipmentList ? selectedEquipmentList[0].equipmentId : initialData.equipmentId }} submitLabel={formObjective === "add" ? 'Add' : 'Update'} submitHandler={submitHandler} onClose={() => { fetchAppointment(); return setShowAdd(false); }} />}
            </ModalBox>
        </div>
    )
}

export default AppointmentSchedule