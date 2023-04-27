import moment from 'moment'
import React, { useState, useEffect } from 'react'
import AppointmentService from '../../../../../../../services/api/appointment.service'
import DoctorService from '../../../../../../../services/api/doctor.service'
import Utilities from '../../../../../../../services/commonservice/utilities'
import DimLoader from '../../../../../../templates/components/DimLoader'

const AppointmentPreview = (props) => {

    const [appointment, setAppointment] = useState()
    const [isLoader, setIsLoader] = useState()

    useEffect(() => {
        setIsLoader(true)
        AppointmentService.getAppointmentById(props.id)
            .then(res => {
                console.log(res)
                if (res) {
                    setAppointment(res)
                }
                setIsLoader(false)
            })
            .catch(err => {
                console.log(err)
                setIsLoader(false)
            })
    }, [props.id])

    return (
        <div className='p-3'>
            {isLoader && <DimLoader loadMessage="Appointment Information Loading" />}
            {appointment ?
                <div className='row d-flex g-5'>
                    {/* <div className="primary-header row d-flex p-3 m-0"> */}
                    <div className='col-6'><strong className='w-150px'>Service</strong>{appointment.practiceServiceType} with {appointment.providerFirstName} {appointment.providerLastName}</div>
                    <div className='col-6'><strong className='w-150px'>Time</strong>{moment(appointment.fromDate).format("dddd, MMM DD, YYYY h:mmA")}</div>
                    {/* // </div> */}
                    <div className='col-6'><strong className='w-150px'>Patient</strong>{appointment.firstName} {appointment.lastName}</div>
                    <div className='col-6'><strong className='w-150px'>Patient Type</strong>{appointment.patientType}</div>
                    <div className='col-6'><strong className='w-150px'>Patient Phone</strong>{Utilities.toPhoneNumber(appointment.patientPhone)}</div>
                    <div className='col-6'><strong className='w-150px'>Patient Email</strong>{appointment.patientEmail}</div>
                    <div className='col-6'><strong className='w-150px'>Service</strong>{appointment.practiceServiceType}</div>
                    <div className='col-6'><strong className='w-150px'>Practice Location</strong>{appointment.practiceLocation}</div>
                    <div className='col-6'><strong className='w-150px'>Room</strong>{appointment.room}</div>
                    <div className='col-6'><strong className='w-150px'>Equipment</strong>{appointment.equipmentDescription}</div>
                    {appointment.memo && <div className='col-12'><strong className='w-150px'>Memo</strong>{appointment.memo}</div>}
                </div>:
                <div className='warning text-center' style={{width: '100%'}}>Appointment No Longer Available</div>
            }
        </div>
    )
}

export default AppointmentPreview