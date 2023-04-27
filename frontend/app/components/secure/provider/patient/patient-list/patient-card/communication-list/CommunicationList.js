import moment from "moment";
import React, { useState, useEffect } from "react";
import NotificationService from "../../../../../../../services/api/notification.service";
import ModalBox from "../../../../../../templates/components/ModalBox";
import Table from "../../../../../../templates/components/Table";
import AppointmentPreview from '../appointment-list/AppointmentPreview'
const CommunicationList = (props) => {
  const [communicationList, setCommunicationList] = useState()
  const [isLoader, setIsLoader] = useState(false)
  const [view, setView] = useState(false)
  const [viewData, setViewData] = useState()
  const [appointment, setAppointment] = useState()
  const [viewAppt, setViewAppt] = useState(false)
  const columns = [
    {
      key: "createdOn",
      text: "Sent On",
      align: "left",
      sortable: true,
      cell: (cell) => moment(cell.createdOn).format("M-D-YYYY H:mm A")
    },
    {
      key: "templateName",
      text: "Template",
      align: "left",
      sortable: true,
    },
    {
      key: "notificationMethod",
      text: "Method",
      align: "left",
      sortable: true,
    },
    {
      key: "description",
      text: "Description",
      align: "left",
      sortable: true,
    },
    {
      key: "action",
      text: "Actions",
      align: "left",
      sortable: true,
      cell: (cell) =>{
        // console.log(cell);
        return (<span className="w-100 d-flex justify-content-center">
          <div className="col-auto btn-group">
            <button title="View Notification" className="btn btn-primary" onClick={e => { e.preventDefault(); setViewData(cell); return setView(true) }}><i className="icon eye" /></button>
            {cell.description.includes("Appointment") && <button title="View Associated Appointment" className="btn btn-primary" onClick={e => { e.preventDefault(); setAppointment(cell.appointmentId); return setViewAppt(true) }}><i className="icon calendar alternate outline" /></button>}
          </div>
        </span>)}
    },
  ]

  const config = {
    page_size: 10,
    length_menu: [10, 20, 50],
    show_filter: true,
    show_pagination: true,
    pagination: 'advance',
    filename: "Communication Report",
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


  useEffect(() => {
    if (props.autoPull) {
      pullCommunications();
    } else if (props.pull) {
      pullCommunications();
    }
  }, [props.autoPull, props.pull, props.keyword]);

  const pullCommunications = () => {
    setIsLoader(true)
    let reqObj = { PatientId: props.patientId }
    NotificationService.communicationsLookup(reqObj)
      .then((res) => {
        console.log(res.data);
        setCommunicationList(res.data)
        setIsLoader(false)
      })
      .catch((err) => {
        console.log(err);
        setIsLoader(false)
      });
  };

  return (
    <div>
      <Table records={communicationList} loading={isLoader} columns={columns} config={config} />
      <ModalBox open={view} onClose={() => { setView(false) }} title={viewData?.description}>
        <div dangerouslySetInnerHTML={{ __html: viewData?.message }} />
      </ModalBox>
      <ModalBox open={viewAppt} onClose={() => { setViewAppt(false) }} title="Appointment Preview">
        {viewAppt && appointment? <AppointmentPreview id={appointment}/> : null}
      </ModalBox>
    </div>
  );
};

export default CommunicationList;
