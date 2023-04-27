import React, { useState, useEffect } from "react";
import List from "../../../../../../../templates/components/List"
import PlFormsService from "../../../../../../../../services/api/plforms.service";
import moment from 'moment'
import Module from "../../../../../../../templates/components/Module";
import ModalBox from "../../../../../../../templates/components/ModalBox";
import FormView from "./FormView";
import FormEdit from "./FormEdit";
import toast from 'react-hot-toast'

const FormsList = (props) => {
  const [formsList, setFormsList] = useState();
  const [showView, setShowView] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showSend, setShowSend] = useState(false)

  useEffect(() => {
    if (!props.forms) {
      if (props.autoPull) {
        pullForms();
      } else if (props.pull) {
        pullForms();
      }
    }
  }, [props.autoPull, props.pull]);
  useEffect(() => {
    if (Array.isArray(props.forms)) {
      setFormsList({ formIds: props.forms })
    }
  }, [props.forms])
  useEffect(() => {
    if (props.keyword) {
      pullForms()
    }
  }, [props.keyword])

  const sendForm = (idx) => {

    let formId = ""
    if (formsList.formIds[idx].formId) {
      formId = formsList.formIds[idx].formId;
    }
    else {
      formId = formsList.formIds[idx].id;
    }

    console.log(formId)
    PlFormsService.sendForm(formId, props.patientId, props.email)
      .then(res => {
        toast.success("Form Sent")
        setShowSend(false)
      })
      .catch(err=>{
        setshowSend(false)
      })
  }

  const pullForms = () => {
    return PlFormsService.getMapFormsWithPatient({ PatientIds: props.patientId })
      .then((res) => {
        if (res.data[0].formIds.length !== 0 && res.data[0].formIds !== []) {
          if (Array.isArray(res.data[0].formIds) === true) {
            setFormsList(res.data[0])
          }
          else {
            setFormsList([res.data[0]]);
          }
        }
        console.log(formsList)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="row d-flex g-4">
      {formsList ?
        formsList.formIds.map((form, idx) => {
          console.log(form)
          return (
            <div className="col-xl-4 col-lg-6 col-12">
              <Module title={form.formTitle}>
                <div className="row p-3">
                  {formsList.createdBy && <span className="mb-3 col-12"><strong className="w-150px">Created By</strong> {formsList.createdBy}</span>}
                  <span className="mb-3 col-12"><strong className="w-150px">Created On:</strong> {moment(formsList.createdAt).format("M-D-YYYY")}</span>
                  <span className="mb-3 col-12 d-flex align-items-center"><strong className="w-150px">Status:</strong> {form.status === 0 ? <span className="badge bg-danger text-white">Incomplete</span> : <span className="badge bg-success text-white">Completed</span>}</span>


                  <div className="row d-flex justify-content-around">
                    <div className="col-auto">
                      <div className="btn-group">
                        <button className="btn btn-primary p-1" title="View Form" onClick={e => { e.preventDefault(); setShowView(idx) }}> <i class="icon eye"></i></button>
                        {/* <button className="btn btn-primary p-1" disabled>    <i class="icon history"></i></button> */}
                        <button className="btn btn-primary p-1" title="Edit Form" onClick={e => { e.preventDefault(); setShowEdit(idx) }}> <i class="icon plus"></i></button>
                        <button className="btn btn-primary p-1" title="Send Form" onClick={e => { e.preventDefault(); setShowSend(true) }}>    <i class="icon paper plane"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              </Module>
              <ModalBox open={showView === idx} onClose={() => { setShowView(null) }} title={form.formTitle}>
                <FormView isModal formTitle={form.formTitle} patient={props.patient} form={form} patientId={props.patientId} onClose={() => { setShowView(null) }} />
              </ModalBox>
              <ModalBox open={showEdit === idx} onClose={() => { setShowEdit(null) }} title={form.formTitle}>
                <FormEdit isModal formTitle={form.formTitle} patient={props.patient} form={form} patientId={props.patientId} onClose={() => { setShowEdit(null); pullForms() }} />
              </ModalBox>
              <ModalBox open={showSend} onClose={()=>{setShowSend(false)}} title="Send Form">
                <div className="d-flex row justify-content-between">
                  <div className="col-12 mb-3">
                    Are you sure you want to resend this form to {props.patient.firstName} {props.patient.lastName} at {props.patient.email}
                  </div>
                  <div className="col-auto"><button className="btn btn-secondary" onClick={e=>{e.preventDefault(); setShowSend(false)}}>Cancel</button></div>
                  <div className="col-auto"><button className="btn btn-primary" onClick={e=>{e.preventDefault(); sendForm(idx)}}>Send</button></div>
                </div>
              </ModalBox>
            </div>
          )
        })
        :
        <div className="col-12">
          <List
            noResultsMessage={
              <span>
                There are currently no forms for this user.{" "}
                {props.openModal && <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    props.openModal();
                  }}
                >
                  Add Forms
                </a>}
              </span>
            }
          >{null}</List>
        </div>
      }
    </div>
  );
};

export default FormsList;
