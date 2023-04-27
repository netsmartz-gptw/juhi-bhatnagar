import React, { useState } from "react";
import PlFormsService from "../../../../../services/api/plforms.service";
import AddFormsPatient from "../add-forms-patient/AddFormsPatient";
import toast from "react-hot-toast";
const AddForms = (props) => {
  
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [reloader, setReloader] = useState(false);

  // // if forms array is empty, use add on submit PlFormsService.createMapFormsWithPatient(???)

// // if forms array contains forms, check appropriate boxes, use edit submit PlFormsService.editMapFormsWithPatient(???)

  const submitHandler = (data, mappingId) => {
    if(mappingId===undefined || !mappingId || mappingId===""){
      PlFormsService.createMapFormsWithPatient({formIds: data, patientId:props.patientId})
      .then(res=>{toast.success("Forms Sent");props.onClose()})
    }
    else{
    PlFormsService.editMapFormsWithPatient({formIds: data, patientId:props.patientId}, mappingId)
    .then(res=>{toast.success("Forms Updated");props.onClose()})
      .catch((err) => { console.log(err) });
    }
  };

  const handleSetReloader = () => {
    setReloader(true)
  }

  return (
    <div>
      <AddFormsPatient
        submitHandler={submitHandler}
        submitLabel="Submit"
        initialData={formData}
        errors={errors}
        reloader={handleSetReloader}
        isModal={props.isModal}
        onClose={()=>props.onClose()}
        patientId={props.patientId}
      />
    </div>
  );
};

export default AddForms;