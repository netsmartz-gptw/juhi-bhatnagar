import React, { useState, useEffect } from 'react'
import PatientService from '../../../../../services/api/patient.service';
import PatientForm from '../patient-form/PatientForm';
import moment from 'moment'
import toast, { ToastBar } from 'react-hot-toast';
import APIResponse from '../../../../templates/components/APIResponse';

var moment2 = require("moment-timezone")
const EditPatient = (props) => {
    const { id } = props;
    const [formData, setFormData] = useState()
    const [errors, setErrors] = useState({})
    const [apiResponse, setApiResponse] = useState()
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
    const submitHandler = (data) => {
        let reqObj = data
        delete reqObj.authorizeMode
        reqObj.phone = data.phone.includes("(")? data.phone.replace("(","").replace(")","").replace("-","").replace(" ","") : data.phone
        reqObj.id = props.id
        reqObj.isInsured = false
        reqObj.isOptIn = true
        reqObj.dob = moment(reqObj.dob).startOf("D").format("YYYY-MM-DD")
        reqObj.checkEligibility = data.checkEligibility || false
        delete reqObj.insuranceDetails
        delete reqObj.dateOfService
        delete reqObj.mobile

        PatientService.editPatient(reqObj, props.id)
        .then((res) => { 
            setApiResponse(res);
          })
          .catch((err) => { 
            setApiResponse(err);
            console.log(err) 
          });


    }
    useEffect(() => {
        PatientService.getPatientById(props.id)
            .then(res => {
                console.log(res);
                setFormData(res.data)
            })
    }, [props.id])

    console.log(props.initialData)
    const handleSetReloader = () => {
        setReloader(true)
    }

    return (
        <div>
            {formData && <PatientForm isModal={props.isModal} onClose={() => { props.onClose() }} initialData={{ ...formData, phone: formData.mobile, dob: new Date(moment.utc(formData.dob)) }} submitLabel="Update" submitHandler={submitHandler} />}
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
    )
}

export default EditPatient

// import React, { useState, useEffect } from 'react'
// import label from '../../../../../../assets/i18n/en.json'
// import PatientService from '../../../../../services/api/patient.service';
// import PatientForm from '../patient-form/PatientForm';
// import moment from 'moment'
// var faker = require('faker');

// var moment2 = require("moment-timezone")
// const EditPatient = (props) => {
//     const { id } = props;
//     const [formData, setFormData] = useState()
//     const [errors, setErrors] = useState({})

//     const convertPhoneNum = (str) => {
//         let convertToArray = str.split('');
//         for (let i in convertToArray) {
//             if (convertToArray[i] === " " || convertToArray[i] === "(" || convertToArray[i] === ")" || convertToArray[i] === "-") {
//                 convertToArray[i] = ""
//             }
//         }
//         return convertToArray.join('');
//     }

//     const submitHandler = (data) => {
//         let reqObj = data
//         delete reqObj.authorizeMode
//         reqObj.phone = reqObj.phone.replace("(","").replace(")","").replace(" ","").replace("-","")
//         reqObj.id = props.id
//         reqObj.isInsured = false
//         reqObj.isOptIn = true
//         reqObj.checkEligibility = false
//         reqObj.dob = moment(data.dob).format("YYYY-MM-DD")
//         delete reqObj.insuranceDetails
//         delete reqObj.dateOfService
//         PatientService.editPatient(reqObj, props.id)
//         return props.onClose()
//     }
//     useEffect(() => {
//         PatientService.getPatientById(props.id)
//             .then(res => {
//                 console.log(res);
//                 let arr = res
//                 arr.firstName = faker.name.firstName(),
//                     arr.lastName = faker.name.lastName(),
//                     arr.mrn = res.mrn || "",
//                     arr.ssn = res.ssn || "",
//                     arr.dob = moment(faker.date.between(moment().subtract(65,"Y"),moment().subtract(15,"Y"))).format("YYYY-MM-DD"),
//                     arr.mobile = faker.phone.phoneNumberFormat(1),
//                     arr.phone = faker.phone.phoneNumberFormat(1),
//                     arr.email = faker.internet.email(),
//                     arr.isOptInChanged = res.isOptInChanged || "",
//                     arr.timeZone = res.timeZone || "",
//                     arr.address = {
//                         addressLine1: faker.address.streetAddress(),
//                         addressLine2: '',
//                         city: faker.address.city(),
//                         state: faker.address.stateAbbr(),
//                         country: "USA",
//                         postalCode: faker.address.zipCode().substring(0,5)
//                     },
//                     arr.inInsured = res.isInsured || "",
//                     arr.checkEligibility = res.checkEligibility || "",
//                     arr.doctorI = res.doctorId || "",
//                     arr.dateOfService = res.dateOfService || "",
//                     setFormData(arr)

//             })
//             .catch(err => {
//                 console.log(err)
//             })

//     }, [props.id])

//     console.log(props.initialData)

//     return (
//         <div>
//             {props.patientId}
//             {/* <EditPatientForm submitHandler={submitHandler} submitLabel="Update" initialData={formData} errors={errors} /> */}
//             {formData && <PatientForm initialData={{ ...formData, phone: formData.mobile }} onClose={()=>{props.onClose()}} submitLabel="Update" submitHandler={submitHandler} />}
//         </div>
//     )
// }

// export default EditPatient



