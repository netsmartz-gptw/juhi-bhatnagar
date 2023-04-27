import React, { useState } from "react";
import label from "../../../../../../assets/i18n/en.json";
import PatientService from "../../../../../services/api/patient.service";
import PatientForm from "../patient-form/PatientForm";
import moment from 'moment'
import APIResponse from '../../../../templates/components/APIResponse';

var moment2 = require("moment-timezone")
const AddPatient = (props) => {
  const { embed, patients } = props;
  const [formData, setFormData] = useState({ isOptIn: true, checkEligibility: false, isInsured: false, address: {}, dob: null });
  const [errors, setErrors] = useState();
  const [reloader, setReloader] = useState(false);
  const [apiResponse, setApiResponse] = useState()

  const convertPhoneNum = (str) => {
    let convertToArray = str.split('');
    for (let i in convertToArray) {
      if (convertToArray[i] === " " || convertToArray[i] === "(" || convertToArray[i] === ")" || convertToArray[i] === "-") {
        convertToArray[i] = ""
      }
    }
    return convertToArray.join('');
  }

  const onSuccess = (message) => {
    if (props.refresh) {
        props.refresh()
    }
    if (props.onClose) {
        props.onClose()
    }
    if (props.exitHandler) {
        props.exitHandler()
    }
  }

  const clearTemplate =
  {
    "firstName": '',
    "lastName":'',
    "mrn": '',
    "ssn": '',
    "dob":'',
    "phone":'',
    "isOptIn": false,
    "isOptInChanged": false,
    "email":  '',
    "patientTypeId": '',
    "timeZone": '',
    "address": {
      "addressLine1": '',
      "addressLine2":  '',
      "city": '',
      "state":  '',
      "country":'',
      "postalCode": ''
    },
    "isInsured": false,
    "checkEligibility": false,
    "doctorId": "",
  }
  const submitHandler = (data) => {
    return PatientService.addPatient(
      {
        "firstName": data.firstName || '',
        "lastName": data.lastName || '',
        "mrn": data.mrn || '',
        "ssn": data.ssn || '',
        "dob": moment(data.dob).format("YYYY-MM-DD") || '',
        "phone": data?.phone?.includes("(")? data.phone.replace("(","").replace(")","").replace("-","").replace(" ","") : data.phone,
        "isOptIn": data.isOptIn || false,
        "isOptInChanged": data.isOptInChanged || false,
        "email": data.email || '',
        "patientTypeId": data.patientTypeId || '',
        "timeZone": moment2.tz.guess() || '',
        "address": {
          "addressLine1": data.address.addressLine1 || '',
          "addressLine2": data.address.addressLine2 || '',
          "city": data.address.city || '',
          "state": data.address.state || '',
          "country": data.address.country || '',
          "postalCode": data.address.postalCode || ''
        },
        "isInsured": data.isInsured,
        "checkEligibility": false,
        "doctorId": "",
      }
    )
    .then((res) => { 
      setApiResponse(res);
      setFormData(clearTemplate)
    })
    .catch((err) => { 
      setApiResponse(err);
      console.log(err) 
    });

  };

  const handleSetReloader = () => {
    setReloader(true)
  }

  return (
    <div>
      <PatientForm
        submitHandler={submitHandler}
        submitLabel="Submit"
        initialData={formData}
        errors={errors}
        reloader={handleSetReloader}
        isModal={props.isModal}
        onClose={() => props.onClose()}
      />
      {/* {errors && errors.map(err=>{return <span className="form-alert">Missing {err.field}</span>})} */}
      <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
    </div>
  );
};

export default AddPatient;