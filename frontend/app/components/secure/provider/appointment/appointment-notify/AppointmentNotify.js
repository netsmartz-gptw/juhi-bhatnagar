import React, { Fragment, useState } from 'react'
import AppointmentService from '../../../../../services/api/appointment.service';
import APIResponse from '../../../../templates/components/APIResponse';
import label from '../../../../../../assets/i18n/en.json'



const AppointmentNotify = (props) => {
    const {onClose} = props;
    const [apiResponse, setApiResponse] = useState()
    const [isLoader, setIsLoader] = useState(false)

    const onSuccess = (message) => {
        if (props.onClose) {
            props.onClose()
        }
      }

    
    const notify = (notificationMethod) => {
        setIsLoader(true)
        let reqObj = {
            "patientId": props.event.patientId,
            "fromDate": props.event.fromDate,
            "toDate": props.event.toDate,
            "id": props.appointmentId,
            "sendNotificationMode": notificationMethod
        }
        if (notificationMethod === 1) {
            reqObj.patientEmail = props.event.patientEmail
            reqObj.email = props.event.patientEmail
        }
        return AppointmentService.sendAptNotification(reqObj)
            .then((res) => { 
                setIsLoader(false)
                setApiResponse(res);
            })
            .catch((err) => { 
                setIsLoader(false)
                setApiResponse(err);
                console.log(err) 
            });   

    }



    return (
        <Fragment>

            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader">{label.common.processing}</div>
                </div>
            </div>}

            <div className="d-flex row justify-content-between">
                <div className="col-12">How would you like to notify the patient?</div>
                <div className="col-auto mt-3">
                    <button className='btn btn-secondary' onClick={(e) => { e.preventDefault(); onClose(true) }}> Close </button>
                </div>
                <div className="col-auto mt-3">
                    <button className='btn btn-primary' onClick={(e) => { e.preventDefault(); notify(1) }}> Email </button>
                    <button className='ms-3 btn btn-primary' onClick={(e) => { e.preventDefault(); notify(2) }}> Text </button>
                </div>
            </div>

            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </Fragment>

    )
}

export default AppointmentNotify
