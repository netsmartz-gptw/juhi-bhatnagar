import React, { useState, useEffect, Fragment } from 'react'
import AppointmentService from '../../../../../services/api/appointment.service'
import AppointmentForm from '../appointment-form/AppointmentForm'
import moment from 'moment'
import Toaster from '../../../../templates/components/Toaster'
import APIResponse from '../../../../templates/components/APIResponse';

const EditAppointmentForm = (props) => {
    const [formData, setFormData] = useState()
    const [loader, setLoader] = useState(true)
    const [toasterMessage, setToasterMessage] = useState()
    const [apiResponse, setApiResponse] = useState()

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
        AppointmentService.editAppointment(
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
                // "timeZone": data.timeZone,
                "checkEligibility": data.checkEligibility,
                "patientInsuranceId": data.patientInsuranceId,
                "practicePatientTypeId": data.practicePatientTypeId,
                "practiceLocationId": data.practiceLocationId,
                "practiceServiceTypeId": data.practiceServiceTypeId,
                "practiceServiceType": data.practiceServiceType,
                "practiceAppointmentStatusCodeId": data.practiceAppointmentStatusCodeId,
                "practiceLocationRoomId": data.practiceLocationRoomId,
                "equipmentId": data.equipmentId,
                "reasonForVisit": data.memo,
                "visitStatus": null,
                "id": data.id
            })
            .then((res) => { 
                setApiResponse(res);
            })
            .catch((err) => { 
                setApiResponse(err);
                console.log(err) 
            });            
            // .then(res => {
            //     console.log(res); if (props.refresh()) {
            //         props.refresh()
            //     };
            //     return props.onClose()
            // })
            // .catch(err => { console.log(err); setToasterMessage(err.message); return props.onClose() })
    }
    useEffect(() => {
        if (props.id) {
            AppointmentService.getAppointmentById(props.id)
                .then(res => {
                    console.log(res);
                    let arr = res
                    arr.fromDate = new Date(arr.fromDate).toISOString()
                    arr.toDate = new Date(arr.toDate).toISOString()
                    arr.mobile = arr.patientPhone
                    arr.email = arr.patientEmail
                    setFormData(arr)
                    return setLoader(false)
                })
                .catch(err => {
                    console.log(err)
                    return setLoader(false)
                })
        }
    }, [props.id])
    return (
        <Fragment>
            {toasterMessage && <Toaster message={toasterMessage} show={toasterMessage} autoClose onClose={() => { setToasterMessage() }} />}
            {!loader && <AppointmentForm onClose={props.onClose} isModal={props.isModal} submitHandler={submitHandler} initialData={formData} additionalButton={props.additionalButton || null} submitLabel="Update" isEdit onClose={() => { props.onClose() }} />}
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </Fragment>

    )
}

export default EditAppointmentForm