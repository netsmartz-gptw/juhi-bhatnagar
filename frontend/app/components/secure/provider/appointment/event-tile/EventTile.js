import moment from 'moment-timezone';
import React, { useState, Fragment, useEffect } from 'react'
import { Popup, Modal } from 'semantic-ui-react';
import AppointmentService from '../../../../../services/api/appointment.service';
import NotificationService from '../../../../../services/api/notification.service';
import PatientService from '../../../../../services/api/patient.service';
import ModalBox from '../../../../templates/components/ModalBox';
import Toaster from '../../../../templates/components/Toaster';
import EditAppointmentForm from '../edit-appointment-form/EditAppointmentForm';
import Utilities from '../../../../../services/commonservice/utilities';
import toast from 'react-hot-toast';
import AddInvoice from '../../invoices/add-invoice/AddInvoice';
import AppointmentNotify from '../appointment-notify/AppointmentNotify';


const EventTile = (props) => {
    // console.log(props)
    const [toolTip, setToolTip] = useState(false)
    const [editForm, setEditForm] = useState(false)
    const [toasterMessage, setToasterMessage] = useState()
    const [status, setStatus] = useState(
        // props.event.checkOutDate ? 3 : props.event.doctorCheckInDate ? 2 : props.event.checkInDate ? 1 : 0
        props.event.visitStatus !== null && props.event.visitStatus
    )
    const [visitId, setVisitId] = useState(props.event.patientVisitId)
    const [currentVisit, setCurrentVisit] = useState()
    const [checkInView, setCheckInView] = useState(false)
    const [checkOutView, setCheckOutView] = useState(false)
    const [providerInView, setProviderInView] = useState(false)
    const [deleteView, setDeleteView] = useState(false)
    const [notifyView, setNotifyView] = useState(false)
    const [reason, setReason] = useState("")
    const [cancelType, setCancelType] = useState(1)
    const [notificationMethod, setNotificationMethod] = useState()
    const [checkOutInvoice, setCheckOutInvoice] = useState(false)

    const deleteEvent = () => {
        AppointmentService.deleteAppointment({
            id: props.event.id,
            providerId: props.event.providerId,
            reason: reason,
            cancelledTypeId: parseInt(cancelType) || 1
        })
            .then(res => {
                console.log(res)
                toast.success("Event Deleted")
                if(props.refresh){
                    props.refresh()
                }
                setDeleteView(false)
            })
    }
    // console.log(props.event)
    const checkIn = () => {
        let reqObj = {
            checkInDate: moment().format("YYYY-MM-DDThh:mm:ss.sssZ"),
            doctorId: props.event.doctorId,
            patientName: props.event.firstName,
            visitStatus: 1,
            appointmentId: props.event.id,
        }
        PatientService.addVisits(reqObj, props.event.patientId)
            .then(res => {
                // console.log(res)
                setVisitId(res?.id)
                setCurrentVisit(res)
                setCheckInView(false)
                toast.success("Patient Checked In")
                return setStatus(1)
            })
    }

    const checkOut = () => {
        let reqObj = {
            id: visitId,
            visitStatus: 3,
            checkOutDate: new Date(),
            items: [],
        }
        PatientService.updateVisits(reqObj, props.event.patientId, visitId)
            .then(res => {
                console.log(res)
                setCurrentVisit(res)
                setCheckOutView(false)
                toast.success("Patient Checked Out")
                setStatus(3)
                return setCheckOutInvoice(true)
            })
    }

    const doctorCheckIn = () => {
        let reqObj = {
            id: visitId,
            visitStatus: 2,
            doctorCheckInDate: new Date(),
            doctorId: props.event.doctorId,
        }
        PatientService.updateVisits(reqObj, props.event.patientId, visitId)
            .then(res => {
                console.log(res)
                setCurrentVisit(res)
                setProviderInView(false)
                toast.success("Patient is with Provider")
                return setStatus(2)
                // checkOut()
            })
    }
    

    const findVisit = () => {
        let reqObj = {
            appointmentId: props.event.id,
        }
        // console.log(props.event.patientId)
        PatientService.findVisits(reqObj, props.event.patientId)
            .then(res => {
                if (res.length) {
                    setStatus(res[0].visitStatus || 0);
                    setVisitId(res[0].id || null)
                    setCurrentVisit(res[0])
                }
            }
            )
    }

    useEffect(() => {
        // if (props.event.practiceServiceType !== "**unavailable**") { findVisit() }
    }, [status])

    const notify = () => {
        let reqObj = {
            "patientId": props.event.patientId,
            "fromDate": props.event.fromDate,
            "toDate": props.event.toDate,
            "id": props.event.id,
            "sendNotificationMode": notificationMethod || 1
        }
        if (notificationMethod === 1) {
            reqObj.patientEmail = props.event.patientEmail
            reqObj.email = props.event.patientEmail
        }
        return AppointmentService.sendAptNotification(reqObj)
            .then(res => { toast.success("Patient Notified"); setNotifyView(false) })
            .catch(err => { console.log(err); setNotifyView(false) })
    }

    const ToolTip = () => {
        return (
            <div className="event-tooltip">
                {props.event.firstName && <span>
                    {props.event.firstName} {props.event.lastName}
                </span>}
                {props.event.toolTip && <span>
                    {props.event.toolTip}
                </span>}
                {props.event.doctor && <span>
                    {props.event.doctor.name}
                </span>}
                {props.event.practiceServiceType && <span>
                    {props.event.practiceServiceType}
                </span>}
                {props.event.room && <span>
                    {props.event.room}
                </span>}
                {props.event.patientPhone && <span>
                    {Utilities.toPhoneNumber(props.event.patientPhone)}
                </span>}
                {props.event.equipmentDescription && <span>
                    {props.event.equipmentDescription}
                </span>}
                < div >
                    <hr className="my-2" />
                    <div className="row d-flex">
                        <div className="col mx-auto">
                            {props.event.start < moment().endOf("d") && <>
                                {status === 0 || !status && moment().subtract(1, "h") < props.event.start ? <i onClick={e => { e.preventDefault(); setToolTip(false); setCheckInView(true) }} className="ui icon calendar check outline btn p-0 mb-2" title="Check In" /> : null}
                                {status === 1 && <i onClick={e => { e.preventDefault(); setToolTip(false); setProviderInView(true) }} className="ui icon stethoscope btn p-0 mb-2" title="With Provider" />}
                                {status === 2 && <i onClick={e => { e.preventDefault(); setToolTip(false); setCheckOutView(true) }} className="ui icon calendar times outline btn p-0 mb-2" title="Check Out" />}
                            </>}
                            {new Date() < props.event.start && <i onClick={e => { e.preventDefault(); setToolTip(false); setNotifyView(true) }} className="ui icon bell btn p-0 mb-2" title="Notify" />}
                            <i onClick={e => { e.preventDefault(); setToolTip(false); deleteEvent() }} className="ui times circle outline btn p-0 mb-2" title="Delete Appointment" style={{ float: 'right' }} />
                            <i onClick={e => { e.preventDefault(); setToolTip(false); setDeleteView(true) }} className="ui icon trash btn p-0 mb-2" title="Cancel/No Show" style={{ float: 'right' }} />
                        </div>
                    </div>
                </div>
            </div >)
    }
    // console.log(props.event)
    return (
        <div className="" 
        onDoubleClick={e => { e.preventDefault(); setToolTip(false); setEditForm(true) }} 
        >
            {toasterMessage && <Toaster autoClose show={toasterMessage} message={toasterMessage} onClose={() => { setToasterMessage() }} />}
            {props.event.practiceServiceType !== "**unavailable**" && < Popup
                on="click"
                content={ToolTip}
                position="top center"
                open={toolTip}
                onClose={() => { setToolTip(false) }}
                onOpen={() => { setToolTip(true) }}
                trigger={
                    <div className="event">
                        {/* {status === 0 && <i className="ui icon calendar check outline btn m-0 p-0" style={{ float: 'right' }} />} */}
                        {status === 1 && <i className="ui icon calendar check outline btn m-0 p-0" style={{ float: 'right' }} title="Checked In" />}
                        {status === 2 && <i className="ui icon stethoscope btn m-0 p-0" style={{ float: 'right' }} title="With Provider" />}
                        {status === 3 && <i className="ui icon calendar times outline btn m-0 p-0" style={{ float: 'right' }} title="Checked Out" />}
                        {props.event.lastEmailSent !== null && <i className="ui icon bell btn m-0 p-0" style={{ float: 'right' }} title={`Emailed on ${moment(props.event.lastEmailSent).format("M/D/YYYY H:mm A")}`} />}
                        {props.event.reasonForVisit === "Unavailable" && <span>
                            Unavailable
                        </span>}
                        {/* <span>{props.event.patientEmail}</span> */}
                        {props.event.duration && <span>
                            {props.event.duration} minutes
                        </span>}
                        {props.resource !== "provider" ? <span>
                            {props.event.doctor && props.event.doctor.fullName}
                        </span> : null}
                        {props.event.practiceServiceType && <span>
                            {props.event.practiceServiceType}
                        </span>}
                        {props.event.firstName && <span>
                            {props.event.firstName} {props.event.lastName[0]}.
                        </span>}
                        {props.resource !== "room" && props.event.room ? <span>
                            {props.event.room}
                        </span> : null}
                        {props.resource !== "equipment" && props.event.equipmentDescription ? <span>
                            {props.event.equipmentDescription}
                        </span> : null}
                        {/* {props.event.patientPhone && <span>
                            {props.event.patientPhone}
                        </span>} */}
                    </div>
                }
            />}
            {props.event.practiceServiceType === "**unavailable**" && <span className='event'>
                Unavailable
            </span>}

            <ModalBox open={checkInView} requireConfirm onClose={() => { setCheckInView(false); }} onCloseSuccess={() => { checkIn(); }} confirmButton="Check In" cancelButton="Cancel">
                <span>Are you sure you want to Check In?</span>
            </ModalBox>
            <ModalBox open={providerInView} requireConfirm onClose={() => { setProviderInView(false) }} onCloseSuccess={() => { doctorCheckIn() }} confirmButton="With Provider" cancelButton="Cancel">
                <span> Is the patient with a provider?</span>
            </ModalBox>
            <ModalBox open={checkOutView} requireConfirm onClose={() => { setCheckOutView(false) }} onCloseSuccess={() => { checkOut() }} confirmButton="Check Out" cancelButton="Cancel">
                <span>Are you sure you want to Check Out?</span>
            </ModalBox>
            <ModalBox open={deleteView} onClose={() => { setDeleteView(false) }}>
                <span>Are you sure you want to Cancel this Appointment?</span>
                <div className='field required mt-4'>
                    <label>Type of Cancellation</label>
                    <select className='form-select' value={cancelType} onChange={e => { e.preventDefault(); setCancelType(e.target.value); }}>
                        <option selected value={1}>Cancelled</option>
                        <option value={2}>No Show</option>
                    </select>
                </div>
                <div className='field required'>
                    <label>Reasons</label>
                    <input type="text" value={reason} onChange={e => { e.preventDefault(); setReason(e.target.value); }} />
                </div>
                <div className='d-flex justify-content-between mt-3'>
                    <div className='col-auto'><button className="btn btn-secondary" onClick={e=>{e.preventDefault(); setDeleteView(false) }}>Close</button></div>
                    <div className='col-auto'><button className='btn btn-primary' onClick={e=>{e.preventDefault(); deleteEvent(); if (props.refresh()) { props.refresh() } }}>Confirm</button></div>
                </div>
            </ModalBox>
            
            
            <ModalBox open={notifyView} onClose={() => { setNotifyView(false) }} title="Notify">
                <AppointmentNotify onClose={() => { setNotifyView(false) }} event={props.event} appointmentId={props.event.id} />
            </ModalBox>


            <ModalBox open={editForm} onClose={() => { setEditForm(false) }} onOpen={() => { setToolTip(false); setEditForm(true) }}>
                <EditAppointmentForm id={props.event.id} onClose={() => { setEditForm(false); if (props.refresh()) { props.refresh() } }} buttonLabel="Update" />
            </ModalBox>
            <ModalBox open={checkOutInvoice} onClose={()=>{setCheckOutInvoice(false)}} size="fullscreen">
                <AddInvoice initialData={props.event} onClose={()=>{setCheckOutInvoice(false)}}/>
            </ModalBox>
        </div>

    )
}

export default EventTile