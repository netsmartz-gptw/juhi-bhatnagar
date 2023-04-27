import React, { useState, useEffect } from "react";
import AppointmentService from "../../../../../../../services/api/appointment.service";
import PatientService from "../../../../../../../services/api/patient.service";
import DimLoader from "../../../../../../templates/components/DimLoader";
import ModalBox from "../../../../../../templates/components/ModalBox";
import AddAppointmentForm from "../../../../appointment/add-appointment-form/AddAppointmentForm";
import AppointmentListCard from "./AppointmentListCard";


const AppointmentList = (props) => {
  const [appointmentList, setAppointmentList] = useState();
  const [showAdd, setShowAdd] = useState(false)
  const [isLoader, setIsLoader] = useState(false)

  useEffect(() => {
    if (props.autoPull) {
      pullAppointmentList();
    } else if (props.pull) {
      pullAppointmentList();
    }
  }, [props.autoPull, props.pull, props.keyword]);

  const pullAppointmentList = () => {
    setIsLoader(true)
    return AppointmentService.findAppointment({PatientIds:props.patientId})
      .then((res) => {
        if(res?.length>0){
        setAppointmentList(res.sort((a, b) => b.fromDate.localeCompare(a.fromDate)));
        }
        else setAppointmentList()
        return setIsLoader(false)
      })
      .catch((err) => {
        console.log(err);
        setIsLoader(false)
      });
  };
  return (
    <div>
      {isLoader && <DimLoader loadMessage="Appointments Loading" />}
{appointmentList != null ?
        <div className="row d-flex g-4 justify-content-between p-3">
        {appointmentList.map((appointment, idx) => (
          <AppointmentListCard appointment={appointment} />
        ))}
      </div> :
      <div className="ui warning message mt-3 segment p-3 shadow-sm">
        <span>
          There are currently no appointments for this user.{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowAdd(true);
            }}
          >
            Add Appointments
          </a>
        </span>
      </div>}
      <ModalBox open={showAdd} onClose={() => setShowAdd(false)}>
        <AddAppointmentForm initialData={{ patientId: props.patientId }} onClose={() => { setShowAdd(false) }} />
      </ModalBox>
    </div>
  );
};

export default AppointmentList;