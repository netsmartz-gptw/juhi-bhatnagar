import moment from 'moment'
import React, { useEffect, useState } from 'react'
import DoctorService from '../../../../../../../services/api/doctor.service'
import Utilities from '../../../../../../../services/commonservice/utilities'
import ModalBox from '../../../../../../templates/components/ModalBox'
import Module from '../../../../../../templates/components/Module'
import EditAppointmentForm from '../../../../appointment/edit-appointment-form/EditAppointmentForm'
import AppointmentPreview from './AppointmentPreview'

const AppointmentListCard = (props) => {
  const [editAppt, setEditAppt] = useState(false)
  const [viewAppt, setViewAppt] = useState(false)

  // console.log(props.appointment)
  return (
    <div className="col-lg-6 col-12">
      {props.appointment && <Module title={moment(props.appointment.fromDate).format("dddd, MMM DD, YYYY h:mmA")}>

        <div className="row d-flex g-3">
          <span> <strong className="w-150px">Provider Name:</strong> {props.appointment.drFirstName} {props.appointment.drLastName}</span>
          <span><strong className="w-150px">Service:</strong> {props.appointment.practiceServiceType}</span>
        </div>
        <div className="row">
          <div className="col-12 text-end">
            <div className="btn-group col-auto">
              <button className="btn btn-primary">
                <i className="icon pencil sign" title="Edit Appointment" onClick={e => { e.preventDefault(); setEditAppt(true) }} />
              </button>
              <button className="btn btn-primary" title="View Appointment" onClick={e => { e.preventDefault(); setViewAppt(true) }}>
                <i className="icon eye"></i>
              </button>
              {props.appointment.fromDate < new Date() && <button className="btn btn-primary">
                <i className="icon bell" />
              </button>
              }
            </div>
          </div>
        </div>
      </Module>}
      <ModalBox open={editAppt} onClose={() => { setEditAppt(false) }}>
        <EditAppointmentForm id={props.appointment.id} onClose={() => { setEditAppt(false); if (props.refresh) { props.refresh() } }} />
      </ModalBox>
      <ModalBox open={viewAppt} onClose={() => { setViewAppt(false) }} title={`${props.appointment.practiceServiceType} with ${props.appointment.drFirstName} ${props.appointment.drLastName} ${props.appointment.providerLastName !== undefined ? props.appointment.providerLastName : ''} | ${moment(props.appointment.fromDate).format("dddd, MMM DD, YYYY h:mmA")}`} size="small">
        <AppointmentPreview id={props.appointment.id} onClose={() => { setViewAppt(false) }} />
      </ModalBox>
    </div>
  )
}

export default AppointmentListCard