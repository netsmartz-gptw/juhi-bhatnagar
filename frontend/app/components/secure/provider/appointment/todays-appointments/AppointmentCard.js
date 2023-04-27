import React, { useState, useEffect } from 'react'
import moment from 'moment'
import ModalBox from '../../../../templates/components/ModalBox'
import AddInvoice from '../../invoices/add-invoice/AddInvoice'
import PatientService from '../../../../../services/api/patient.service'
import AppointmentPreview from '../../patient/patient-list/patient-card/appointment-list/AppointmentPreview'
import DoctorService from '../../../../../services/api/doctor.service'
import toast from 'react-hot-toast'


const AppointmentCard = (props) => {
    let startTime = moment(props.appointment.fromDate).format('h:mm')
    let endTime = moment(props.appointment.toDate).format('h:mm A')
    // console.log(props.appointment)
    const [open, setOpen] = useState(false)
    const [showPayment, setShowPayment] = useState(false)
    const [view, setView] = useState(false)
    const [provider, setProvider] = useState()
    const [checkInView, setCheckInView] = useState(false)
    const [checkOutView, setCheckOutView] = useState(false)
    const [providerInView, setProviderInView] = useState(false)
    const [checkOutInvoice, setCheckOutInvoice] = useState(false)


    const checkIn = () => {
        let reqObj = {
            checkInDate: moment().format("YYYY-MM-DDThh:mm:ss.sssZ"),
            doctorId: props.appointment.doctorId,
            patientName: props.appointment.firstName,
            visitStatus: 1,
            appointmentId: props.appointment.id,
        }
        PatientService.addVisits(reqObj, props.appointment.patientId)
            .then(res => {
                setCheckInView(false)
                toast.success("Patient Checked In")
                if (props.refresh) {
                    props.refresh()
                }
            })
    }

    const checkOut = () => {
        let reqObj = {
            id: props.appointment.patientVisitId,
            visitStatus: 3,
            checkOutDate: new Date(),
            items: [],
        }
        PatientService.updateVisits(reqObj, props.appointment.patientId, props.appointment.patientVisitId)
            .then(res => {
                setCheckOutView(false)
                toast.success("Patient Checked Out")
                setCheckOutInvoice(true)
                if(props.refresh){
                    props.refresh()
                }
            })
    }

    const doctorCheckIn = () => {
        let reqObj = {
            id: props.appointment.patientVisitId,
            visitStatus: 2,
            doctorCheckInDate: new Date(),
            doctorId: props.appointment.doctorId,
        }
        PatientService.updateVisits(reqObj, props.appointment.patientId, props.appointment.patientVisitId)
            .then(res => {
                setProviderInView(false)
                toast.success("Patient is with Provider")
                if (props.refresh) {
                    props.refresh()
                }
            })
    }

    return (
        <div>
            <div className="row-fluid px-4 ui segment">
                <div className='btn p-0 col-12 d-flex justify-content-between align-items-center'>
                    <div className='col-12 row d-flex align-items-center'>
                        <span className="col-lg-3 col-md-6 col-12 text-start">{props.appointment.firstName} {props.appointment.lastName}</span>
                        <span className="col-lg-3 col-md-6 col-12 text-start">{props.appointment.practiceServiceType}</span>
                        <span className="col-lg-3 col-md-6 col-12 text-start">{startTime}-{endTime}</span>
                        <div className='col-lg-3 col-md-6 col-12 btn-group'>
                            {props.appointment.visitStatus === 0 || !props.appointment.visitStatus ?
                                <button className="btn btn-primary" onClick={e => { e.preventDefault(); setCheckInView(true) }}><i className="ui icon text-white calendar check outline" title="Check In" /></button>
                                : null}

                            {props.appointment.visitStatus === 1 &&
                                <button className="btn btn-primary" onClick={e => { e.preventDefault(); setProviderInView(true) }} ><i className="ui icon text-white stethoscope" title="With Provider" /></button>}

                            {props.appointment.visitStatus === 2 && <button className="btn btn-primary" onClick={e => { e.preventDefault(); setCheckOutView(true) }}><i className="ui icon text-white calendar times outline" title="Check Out" /></button>}
                            <button className='btn btn-primary' onClick={e => { e.preventDefault(); setShowPayment(true) }} title="Collect Payment">
                                <i className='icon dollar' />
                            </button>
                            <button className='btn btn-primary' onClick={e => { e.preventDefault(); setView(true) }} title="View Details">
                                <i className='icon eye' />
                            </button>
                        </div>
                    </div>
                </div>
                {open && <div className='col-12 d-flex justify-content-between align-items-center mt-3'>
                </div>}
            </div>
            <ModalBox open={showPayment} onClose={() => { setShowPayment(false) }} size="fullscreen">
                <AddInvoice initialData={props.appointment} onClose={() => { setShowPayment(false) }} />
            </ModalBox>
            <ModalBox open={view} onClose={() => { setView(false); }} title='Appointment Preview' size="small">
                <AppointmentPreview id={props.appointment.id} onClose={() => { setView(false); }} />
            </ModalBox>
            <ModalBox open={checkOutInvoice} onClose={() => { setCheckOutInvoice(false) }} size="fullscreen">
                <AddInvoice initialData={props.appointment} onClose={() => { setCheckOutInvoice(false); }} />
            </ModalBox>
            <ModalBox open={checkInView} requireConfirm onClose={() => { setCheckInView(false); }} onCloseSuccess={() => { checkIn(); }} confirmButton="Check In" cancelButton="Cancel">
                <span>Are you sure you want to Check In?</span>
            </ModalBox>
            <ModalBox open={providerInView} requireConfirm onClose={() => { setProviderInView(false) }} onCloseSuccess={() => { doctorCheckIn() }} confirmButton="With Provider" cancelButton="Cancel">
                <span> Is the patient with a provider?</span>
            </ModalBox>
            <ModalBox open={checkOutView} requireConfirm onClose={() => { setCheckOutView(false) }} onCloseSuccess={() => { checkOut() }} confirmButton="Check Out" cancelButton="Cancel">
                <span>Are you sure you want to Check Out?</span>
            </ModalBox>
        </div>
    )
}

export default AppointmentCard