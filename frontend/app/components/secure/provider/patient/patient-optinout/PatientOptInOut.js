import React, { Fragment, useState } from 'react'
import AppointmentService from '../../../../../services/api/appointment.service';
import APIResponse from '../../../../templates/components/APIResponse';
import label from '../../../../../../assets/i18n/en.json'
import PatientService from '../../../../../services/api/patient.service'


const PatientOptInOut = (props) => {
    const {onClose, patient} = props;
    const [apiResponse, setApiResponse] = useState()
    const [isLoader, setIsLoader] = useState(false)

    const onSuccess = (message) => {
        if (props.onClose) {
            props.onClose()
        }
      }

    

    const optInOut = (authorizeMode) => {
        setIsLoader(true)
        let reqObj = {
            authorizeMode: authorizeMode,
            isOptOut: patient.isOptIn,
            patientId: patient.id
        }
        PatientService.optInOptOutPatient(reqObj)
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
console.log(props.patient)

    return (
        <Fragment>

            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader">{label.common.processing}</div>
                </div>
            </div>}

            <div className="d-flex row justify-content-between">
                <div className="col-12">Patient has {props.patient.isOptIn === 1 ? 'Opted In to':'Opted Out from'} mobile notifications. Is this patient authorizing to {props.patient.isOptIn === 1 ? 'Opt Out of': 'Opt In to'} text message communication via in person or over the phone?</div>
                <div className="col-auto mt-3">
                    <button className='btn btn-secondary' onClick={e => { e.preventDefault(); onClose() }}>Close</button>
                </div>
                <div className="col-auto mt-3">
                    <button className='btn btn-primary' onClick={e => { e.preventDefault(); return optInOut(1) }}>In Person</button>
                    <button className='ms-3 btn btn-primary' onClick={e => { e.preventDefault(); return optInOut(2) }}>Over Phone</button>
                </div>
            </div>

            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </Fragment>

    )
}

export default PatientOptInOut
