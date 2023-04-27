import React, { useState, useEffect } from 'react'
import AppointmentService from '../../../../../services/api/appointment.service'
import AppointmentForm from '../appointment-form/AppointmentForm'
import moment from 'moment'
import APIResponse from '../../../../templates/components/APIResponse';
import toast from 'react-hot-toast';

const AddAppointmentForm = (props) => {
    const [apiResponse, setApiResponse] = useState()
    const [inputData, setInputData] = useState(props.initialData || {})

    const onSuccess = (message) => {
        if (props.refresh) {
            props.refresh()
        }
        if (props.onClose) {
            props.onClose()
        }
        if (props.exitHandler) {
            props.exitHandler()
        }
      }
    
    const submitHandler = (data) => {

        console.log('data',{data});

        let array={
        "aptTotalCount": data.aptTotalCount,
        "checkEligibility": data.checkEligibility,
        "day": moment(data.fromDate).day(),
        "doctorId": data.doctorId,
        "duration": data.duration,
        "email": data.patientEmail,
        "equipmentId": data.equipmentId,
        "fromDate": new Date(data?.fromDate).toISOString(),
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
        "toDate": new Date(data.toDate).toISOString()}
        
        const clearTemplate = {
            "aptTotalCount": "",
            "checkEligibility": "",
            "day": "",
            "doctorId": "",
            "duration": "",
            "email": "",
            "equipmentId": "",
            "fromDate": "",
            "memo": "",
            "patientId": "",
            "patientInsuranceId": "",
            "phone": "",
            "practiceAppointmentStatusCodeId": "",
            "practiceLocationId": "",
            "practiceLocationRoomId": "",
            "practicePatientTypeId": "",
            "practiceServiceTypeId": "",
            "reasonForVisit": "",
            "repeatOn": "",
            "timeZone": "",
            "toDate":"",
        }
        return AppointmentService.addAppointment(array)
        .then((res) => { 
            setApiResponse(res);
            // setInputData(clearTemplate)
        })
        .catch((err) => { 
            setApiResponse(err);
            console.log(err) 
        });
            // .then(res => console.log(res))
            // .catch(err => console.log(err))
    }
    return (
        <div>
            <AppointmentForm submitHandler={submitHandler} onClose={props.onClose} isModal={props.isModal} initialData={inputData} submitLabel="Submit" additionalButton={props.additionalButton} />
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
    )
}

export default AddAppointmentForm